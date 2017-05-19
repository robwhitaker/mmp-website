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
import Data.Array (catMaybes, length, mapWithIndex, modifyAt, range, sort, updateAt, (!!))
import Data.DateTime (DateTime(..), adjust)
import Data.Formatter.Internal (repeat)
import Data.JSDate (LOCALE, fromDateTime, getTimezoneOffset)
import Data.Maybe (Maybe(..), fromMaybe, isJust, isNothing, maybe)
import Data.Newtype (over, unwrap, wrap)
import Data.String (null, take)
import Data.Time.Duration (Days(..), Minutes(..))
import Data.Traversable (for, traverse)
import Data.Tuple (Tuple(..))
import Editor.Data.DateTime.Utils (dateTimeWithLocale, formatISO8601, formatReadable, localAdjust, parseISO8601, parseLocalDateTime, removeLocale)
import Editor.Models.Chapter (Chapter(..), LocalChapter, toServerChapter)
import Editor.Models.Entry (Entry(..), LocalEntry)
import Editor.Utils.ModelHelpers (CommonMetadata, AllCommonData)
import Editor.Utils.Parser (stripTags)
import Editor.Utils.Requests (crupdate)
import Halogen (AttrName(..))
import Halogen.HTML.Events (input_, onValueChange)
import Halogen.Query (Action, liftEff)
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
            HH.div [ HP.id_ "chapter-sync" ] $
                [ renderItem 0 chapter.stylesheet Nothing UpdateChapter chapter ] <>
                (mapWithIndex (\i (Entry e) -> renderItem e.level chapter.stylesheet (Just i) (UpdateEntry i) e) chapter.entries)
          where chapter = unwrap state.chapter

        renderItem :: forall r. Int -> String -> Maybe Int -> (FormField -> Action Query) -> AllCommonData r -> H.ComponentHTML Query
        renderItem level stylesheet maybeIndex router item = 
            HH.div 
                [ HP.class_ (H.ClassName $ "tile chapter-sync-chapter" <> " level-" <> show level) ] 
                [ HH.span_ [ HH.text $ maybe "(New!)" show item.id ]
                , HH.h1_ 
                    [ interactiveIcon item.isInteractive
                    , HH.text $ stripTags item.title 
                    ]
                , HH.p [ HP.class_ (H.ClassName "data-row") ] $
                    [ releaseDateIcon
                    , HH.input 
                        [ HP.value (maybe "Not scheduled" formatReadable item.releaseDate) 
                        , HP.class_ (H.ClassName "release-date-field")
                        , HE.onValueChange (HE.input $ router <<< ReleaseDate)
                        ]
                    , propagateIcon
                    ] <> if item.isInteractive 
                            then [ interactiveUrlIcon
                                    , HH.input
                                    [ HP.value item.interactiveUrl
                                    , HP.class_ (H.ClassName "interactive-url-field")
                                    , HE.onValueChange (HE.input $ router <<< InteractiveUrl)
                                    ]  
                                    ]
                            else []
                , HH.div
                    [ HP.class_ (H.ClassName "flex-container") ]  
                    [ HH.div
                        [ HP.class_ (H.ClassName "metadata-box-container wrap") ] $ catMaybes
                        [ Just $
                            HH.div_ 
                                    [ HH.h2 [ HP.class_ (H.ClassName "no-border") ] [ HH.text "Author's Note" ]
                                    , HH.textarea [ HE.onValueChange $ HE.input $ router <<< AuthorsNote
                                                    , HP.value item.authorsNote 
                                                    ]
                                    ]
                        , if not (item.isInteractive)
                        then Nothing
                        else Just $
                                HH.div_ 
                                    [ HH.h2 [ HP.class_ (H.ClassName "no-border") ] [ HH.text "Interactive Data" ]
                                    , HH.textarea [ HE.onValueChange $ HE.input $ router <<< InteractiveData
                                                    , HP.value item.interactiveData
                                                    ]
                                    ]
                        ] 
                    , HH.div
                        [ HP.class_ (H.ClassName "preview-container") ] 
                        [ HH.iframe [ HP.attr (H.AttrName "srcdoc") htmlContent ] ]    
                    ]
                ]
          where interactiveIcon isInteractive = 
                    HH.i [ HP.class_ (H.ClassName $ "fa fa-gamepad clickable" <> if isInteractive then "" else " disabled")
                         , HP.attr (H.AttrName "aria-hidden") "true" 
                         , HE.onClick (HE.input_ $ router (IsInteractive (not isInteractive)))
                         ] []
                releaseDateIcon = HH.i [ HP.class_ (H.ClassName "fa fa-calendar"), HP.attr (H.AttrName "aria-hidden") "true" ] []
                interactiveUrlIcon = HH.i [ HP.class_ (H.ClassName "fa fa-link"), HP.attr (H.AttrName "aria-hidden") "true" ] []
                propagateIcon = HH.i [ HP.class_ (H.ClassName $ "fa fa-level-down clickable no-left-margin")
                                     , HP.attr (H.AttrName "aria-hidden") "true" 
                                     , HE.onClick (HE.input_ $ PropagateReleaseDate maybeIndex)
                                     ] []
                htmlContent = "<style>" <> stylesheet <> "</style>" <> item.title <> item.content

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
                    -- TODO: possibly rewrite; it's slow and can be buggy
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
                            pure $ state { releaseDate = rd  }
                
                

