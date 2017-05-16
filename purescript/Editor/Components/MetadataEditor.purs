module Editor.Components.MetadataEditor where

import Prelude
import Editor.Models.Chapter as Chapter
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Control.Bind (join)
import Control.Comonad (extract)
import Control.Monad.Aff (Aff)
import Control.Monad.Aff.Console (CONSOLE, log)
import Control.Monad.Eff (Eff)
import Control.Plus ((<|>))
import Data.Array (length, mapWithIndex, modifyAt, range, sort, updateAt, (!!))
import Data.DateTime (DateTime(..), adjust)
import Data.Formatter.Internal (repeat)
import Data.JSDate (LOCALE, fromDateTime, getTimezoneOffset)
import Data.Maybe (Maybe(..), fromMaybe, isJust, isNothing, maybe)
import Data.Newtype (over, unwrap, wrap)
import Data.String (take)
import Data.Time.Duration (Days(..), Minutes(..))
import Data.Traversable (for, traverse)
import Data.Tuple (Tuple(..))
import Editor.Data.DateTime.Utils (dateTimeWithLocale, formatISO8601, formatReadable, localAdjust, parseISO8601, parseLocalDateTime, removeLocale)
import Editor.Models.Chapter (Chapter(..), LocalChapter, toServerChapter)
import Editor.Models.Entry (Entry(..), LocalEntry)
import Editor.Utils.ModelHelpers (CommonMetadata)
import Editor.Utils.Parser (stripTags)
import Editor.Utils.Requests (crupdate)
import Halogen (AttrName(..))
import Halogen.HTML.Events (onValueChange)
import Halogen.Query (liftEff)
import Network.HTTP.Affjax (AJAX)

type State =
    { chapter :: LocalChapter
    , chapterOriginal :: LocalChapter
    }

data Query a 
    = Initialize a
    | LoadChapter LocalChapter a
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

data Message 
    = OptionChange (Array (Tuple String (H.Action Query)))
    | GoToChapterList

type Input = LocalChapter

type AppEffects eff = Aff 
    ( locale :: LOCALE
    , console :: CONSOLE 
    , ajax :: AJAX
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
        initialState :: LocalChapter -> State
        initialState chapter = { chapter : chapter, chapterOriginal : chapter }

        render :: State -> H.ComponentHTML Query
        render state = 
            HH.div_ $
                [ HH.h1_ [ HH.text $ stripTags chapter.title ]
                , HH.div_ [ HH.text chapter.stylesheet ]
                , HH.div_ [ HH.text $ take 100 chapter.content ]
                , HH.button [ HE.onClick $ HE.input_ (PropagateReleaseDate Nothing)] [ HH.text "Propagate release date" ]
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
                        [ HP.value (maybe "" formatReadable chapter.releaseDate) 
                        , HE.onValueChange (HE.input $ UpdateChapter <<< ReleaseDate)
                        ]
                    , HH.text $ maybe "" formatReadable chapter.releaseDate 
                    ]
                , HH.hr_
                ] <> mapWithIndex entryToHtml chapter.entries
          where 
                chapter = unwrap state.chapter
                entryToHtml :: Int -> LocalEntry -> H.ComponentHTML Query
                entryToHtml index (Entry entry) = 
                    HH.div_ 
                        [ HH.h1_ [ HH.text $ repeat ">" entry.level <> stripTags entry.title, HH.text ", ", HH.text $ show entry.order ]
                        , HH.div_ [ HH.text $ take 100 entry.content ]
                        , HH.button [ HE.onClick $ HE.input_ (PropagateReleaseDate $ Just index)] [ HH.text "Propagate release date" ]
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
                                [ HP.value (maybe "" formatReadable entry.releaseDate) 
                                , HE.onValueChange (HE.input $ UpdateEntry index <<< ReleaseDate)
                                ]
                            , HH.text $ maybe "" formatReadable entry.releaseDate
                            ]
                        , HH.hr_    
                        ]

        eval :: Query ~> H.ComponentDSL State Query Message (AppEffects eff)
        eval =
            case _ of
                Initialize next -> do
                    H.raise $ OptionChange
                        [ Tuple "Cancel" Cancel
                        , Tuple "Save"   Save
                        ]
                    pure next

                LoadChapter chapter next -> do 
                    H.put { chapter : chapter, chapterOriginal : chapter }
                    pure next

                Save next -> do
                    state <- H.get
                    -- TODO: failed Aff needs handling here because otherwise it could duplicate the stripLocale
                    _ <- H.liftAff $ crupdate "" $ toServerChapter state.chapter
                    H.raise GoToChapterList
                    pure next

                Cancel next -> do
                    H.raise GoToChapterList
                    pure next

                PropagateReleaseDate maybeIndex next -> do
                    let index = fromMaybe (-1) maybeIndex
                    numEntries <- H.get >>= pure <<< length <<< _.entries <<< unwrap <<< _.chapter
                    _ <- for (range (index+1) (numEntries-1)) \i ->
                        H.modify \state -> fromMaybe state do
                            let entries = _.entries $ unwrap $ state.chapter
                                lastEntryData = case entries !! (i-1) of
                                    Just (Entry entry) -> 
                                        { releaseDate : entry.releaseDate
                                        , level : entry.level 
                                        }
                                    Nothing -> 
                                        { releaseDate : (unwrap state.chapter).releaseDate
                                        , level : 0 
                                        }
                            newEntries <- modifyAt i (\(Entry entry) ->
                                    if entry.level > lastEntryData.level 
                                        then Entry $ entry { releaseDate = lastEntryData.releaseDate }
                                        else fromMaybe (Entry entry) do
                                            newReleaseDate <- map (localAdjust (Days 7.0)) lastEntryData.releaseDate
                                            pure $ Entry $ entry { releaseDate = newReleaseDate }
                                ) entries
                            pure $ state { chapter = over Chapter (_ { entries = newEntries }) state.chapter }
                    pure next

                UpdateChapter formField next -> do
                    state <- H.get
                    newChapter <- H.liftEff $ updateField formField $ unwrap state.chapter
                    H.modify _ { chapter = Chapter newChapter }
                    pure next

                UpdateEntry index formField next -> do
                    state <- H.get
                    let entries = (unwrap state.chapter).entries
                    let maybeEntry = entries !! index
                    case maybeEntry of
                        Nothing -> pure next
                        Just e@(Entry entry) -> do
                            newEntry <- H.liftEff $ updateField formField entry
                            H.modify \s -> fromMaybe s do
                                newEntries <- updateAt index (Entry newEntry) entries
                                pure $ s { chapter = over Chapter (_ { entries = newEntries}) state.chapter }
                            pure next

          where
                updateField :: forall r e. FormField -> CommonMetadata r -> Eff (locale :: LOCALE | e) (CommonMetadata r)
                updateField fieldData state = 
                    case fieldData of
                        IsInteractive isInteractive -> pure $ state { isInteractive = isInteractive }
                        InteractiveUrl interactiveUrl -> pure $ state { interactiveUrl = interactiveUrl }
                        InteractiveData interactiveData -> pure $ state { interactiveData = interactiveData }
                        AuthorsNote authorsNote -> pure $ state { authorsNote = authorsNote }
                        ReleaseDate releaseDate -> do
                            rd <- parseLocalDateTime releaseDate
                            pure $ state { releaseDate = rd <|> state.releaseDate  }
                
                

