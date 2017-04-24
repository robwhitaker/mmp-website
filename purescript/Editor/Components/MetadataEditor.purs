module Editor.Components.MetadataEditor where

import Editor.Models.Chapter as Chapter
import Control.Bind (join)
import Control.Monad.Aff (Aff)
import Control.Monad.Eff (Eff)
import Control.Plus ((<|>))
import Data.Array (mapWithIndex, modifyAt, sort, (!!))
import Data.DateTime (DateTime(..), adjust)
import Data.JSDate (LOCALE, fromDateTime, getTimezoneOffset)
import Data.Maybe (Maybe(..), fromMaybe, isJust, isNothing, maybe)
import Data.Newtype (over, unwrap)
import Data.Time.Duration (Minutes(..))
import Data.Traversable (for)
import Editor.Data.DateTime.Utils (parseISO8601, formatISO8601)
import Editor.Models.Chapter (Chapter(..))
import Editor.Models.Entry (Entry(..))
import Halogen (AttrName(..))
import Halogen.HTML.Events (onValueChange)
import Halogen.Query (liftEff)

import Prelude
import Data.Tuple (Tuple(..))
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP

type State =
    { chapter :: Chapter
    , chapterOriginal :: Chapter
    }

data Query a 
    = Initialize a
    | LoadChapter Chapter a
    | Save a
    | Cancel a
    | PropagateReleaseDate (Maybe Int) a
    | UpdateChapter FormField a
    | UpdateEntry Int FormField a

data FormField 
    = IsInteractive Boolean
    | InteractiveUrl String
    | InteractiveData String
    | AuthorsNote String
    | ReleaseDate String

type CommonFormField r = 
    { isInteractive :: Boolean
    , interactiveUrl :: String
    , interactiveData :: String
    , authorsNote :: String
    , releaseDate :: Maybe DateTime
    | r
    }

data Message 
    = OptionChange (Array (Tuple String (H.Action Query)))
    | BackToChapterList

type Input = Chapter

type AppEffects eff = Aff 
    ( locale :: LOCALE 
    | eff 
    )

metadataEditor :: forall eff. H.Component HH.HTML Query Input Message (AppEffects eff)
metadataEditor =
    H.lifecycleComponent
      { initialState: initialState
      , render
      , eval
      , receiver: const Nothing
      , initializer: Just (H.action Initialize)
      , finalizer: Nothing
      }
  where
        initialState :: Chapter -> State
        initialState chapter = { chapter : chapter, chapterOriginal : chapter }

        render :: State -> H.ComponentHTML Query
        render state = 
            HH.div_ $
                [ HH.h1_ [ HH.text chapter.title ]
                , HH.div_ [ HH.text chapter.stylesheet ]
                , HH.div_ [ HH.text chapter.content ]
                , HH.div_ 
                    [ HH.input
                        [ HP.type_ HP.InputCheckbox
                        , HP.title "WOW!"
                        , HP.checked chapter.isInteractive
                        , HE.onChecked (HE.input $ UpdateChapter <<< IsInteractive)
                        ]
                    ]
                , HH.div 
                    (if not chapter.isInteractive then
                        [ HP.attr (AttrName "style") "display:none;" ]
                     else
                        []
                    )
                    [ HH.input
                        [ HP.placeholder "Interactive URL..."
                        , HP.value chapter.interactiveUrl
                        , HE.onValueChange (HE.input $ UpdateChapter <<< InteractiveUrl)
                        ]
                    , HH.input
                        [ HP.placeholder "Interactive Data..."
                        , HP.value chapter.interactiveData
                        , HE.onValueChange (HE.input $ UpdateChapter <<< InteractiveData)
                        ] 
                    ]
                , HH.div_ 
                    [ HH.input 
                        [ HP.placeholder "Author's note..."
                        , HP.value chapter.authorsNote
                        , HE.onValueChange (HE.input $ UpdateChapter <<< AuthorsNote)
                        ]
                    , HH.br_ 
                    , HH.text chapter.authorsNote
                    ]
                , HH.div_
                    [ HH.input 
                        [ HP.value (maybe "" formatISO8601 chapter.releaseDate) 
                        , HE.onValueChange (HE.input $ UpdateChapter <<< ReleaseDate)
                        ]
                    , HH.text $ maybe "" formatISO8601 chapter.releaseDate 
                    ]
                , HH.hr_
                ] <> mapWithIndex entryToHtml chapter.entries
          where 
                chapter = unwrap state.chapter
                entryToHtml :: Int -> Entry -> H.ComponentHTML Query
                entryToHtml index (Entry entry) = 
                    HH.div_ 
                        [ HH.h1_ [ HH.text entry.title ]
                        , HH.div_ [ HH.text entry.content ]
                        , HH.div_ 
                            [ HH.input
                                [ HP.type_ HP.InputCheckbox
                                , HP.title "WOW!"
                                , HP.checked entry.isInteractive
                                , HE.onChecked (HE.input $ UpdateEntry index <<< IsInteractive)
                                ]
                            ]
                        , HH.div 
                            (if not entry.isInteractive then
                                [ HP.attr (AttrName "style") "display:none;" ]
                            else
                                []
                            )
                            [ HH.input
                                [ HP.placeholder "Interactive URL..."
                                , HP.value entry.interactiveUrl
                                , HE.onValueChange (HE.input $ UpdateEntry index <<< InteractiveUrl)
                                ]
                            , HH.input
                                [ HP.placeholder "Interactive Data..."
                                , HP.value entry.interactiveData
                                , HE.onValueChange (HE.input $ UpdateEntry index <<< InteractiveData)
                                ] 
                            ]
                        , HH.div_ 
                            [ HH.input 
                                [ HP.placeholder "Author's note..."
                                , HP.value entry.authorsNote
                                , HE.onValueChange (HE.input $ UpdateEntry index <<< AuthorsNote)
                                ]
                            , HH.br_ 
                            , HH.text entry.authorsNote
                            ]
                        , HH.div_
                            [ HH.input 
                                [ HP.value (maybe "" formatISO8601 entry.releaseDate) 
                                , HE.onValueChange (HE.input $ UpdateEntry index <<< ReleaseDate)
                                ]
                            , HH.text $ maybe "" formatISO8601 entry.releaseDate
                            ]
                        , HH.hr_    
                        ]

        eval :: Query ~> H.ComponentDSL State Query Message (AppEffects eff)
        eval =
            case _ of
                Initialize next -> do
                    localizeState applyLocale
                    H.raise $ OptionChange
                        [ Tuple "Save"   Save
                        , Tuple "Cancel" Cancel
                        ]
                    pure next

                LoadChapter chapter next -> do 
                    H.put { chapter : chapter, chapterOriginal : chapter }
                    pure next

                Save next -> do
                    localizeState stripLocale
                    pure next

                Cancel next -> do
                    H.raise BackToChapterList
                    pure next

                PropagateReleaseDate maybeIndex next -> do
                    chapter <- H.get >>= pure <<< unwrap <<< _.chapter
                    let maybeStartDate = maybe chapter.releaseDate (\i -> do
                            entry <- chapter.entries !! i
                            (unwrap entry).releaseDate
                        ) maybeIndex
                    case maybeStartDate of
                        Just startDate -> do
                            pure next
                        Nothing ->
                            pure next
                
                UpdateChapter formField next -> do
                    H.modify \state -> state { chapter = over Chapter (updateField formField) state.chapter }
                    pure next

                UpdateEntry index formField next -> do
                    H.modify \state -> fromMaybe state do
                        newEntries <- modifyAt index (over Entry (updateField formField)) (unwrap state.chapter).entries
                        pure $ state { chapter = over Chapter (_ { entries = newEntries}) state.chapter }
                    pure next

          where
                updateField :: forall r. FormField -> CommonFormField r -> CommonFormField r
                updateField fieldData state = 
                    case fieldData of
                        IsInteractive isInteractive -> state { isInteractive = isInteractive }
                        InteractiveUrl interactiveUrl -> state { interactiveUrl = interactiveUrl }
                        InteractiveData interactiveData -> state { interactiveData = interactiveData }
                        AuthorsNote authorsNote -> state { authorsNote = authorsNote }
                        ReleaseDate releaseDate -> state { releaseDate = parseISO8601 releaseDate <|> state.releaseDate  }
                
                applyLocale :: Maybe DateTime -> Eff (locale :: LOCALE | eff) (Maybe DateTime)
                applyLocale Nothing = pure Nothing
                applyLocale (Just dt) = do
                    offset <- getTimezoneOffset (fromDateTime dt)
                    pure $ adjust (Minutes offset) dt

                stripLocale :: Maybe DateTime -> Eff (locale :: LOCALE | eff) (Maybe DateTime)
                stripLocale Nothing = pure Nothing
                stripLocale (Just dt) = do
                    offset <- getTimezoneOffset (fromDateTime dt)
                    pure $ adjust (Minutes (-offset)) dt
                
                localizeState fn = do
                    chapter <- H.get >>= pure <<< (_.chapter >>> unwrap)
                    chapterLocaleDate <- liftEff $ fn chapter.releaseDate
                    entriesWithLocaleDates <- liftEff $ for chapter.entries \(Entry entry) -> do
                        newDate <- fn entry.releaseDate
                        pure $ Entry $ entry { releaseDate = newDate }
                    H.modify \state ->
                        state { chapter = Chapter $ chapter { releaseDate = chapterLocaleDate
                                                            , entries = entriesWithLocaleDates 
                                                            } 
                              }

