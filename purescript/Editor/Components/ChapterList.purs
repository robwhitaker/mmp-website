module Editor.Components.ChapterList where

import Control.Monad.Aff (attempt)
import Control.Monad.Aff.Console (CONSOLE, log)
import Control.Monad.Eff.Exception (error)
import Control.Monad.Error.Class (throwError)
import Control.Monad.Except (runExcept)
import Control.Monad.Reader (ReaderT(..), ask)
import Data.Array (catMaybes, concat, deleteAt, length)
import Data.JSDate (LOCALE)
import Data.List (find)
import Data.Maybe (Maybe(..))
import Data.Newtype (unwrap)
import Data.Traversable (for, sequence, traverse)
import Data.Tuple (Tuple(..))
import Editor.Models.Chapter as Chapter
import Editor.Models.Chapter (Chapter(..), LocalChapter, ServerChapter, fromServerChapter, toServerChapter)
import Editor.Utils.Array (swap)
import Editor.Utils.GoogleAuth (GAPI, GoogleServices, showPicker)
import Editor.Utils.Parser (getHeadingGroups, getTagContents, parseChapter, stripTags)
import Editor.Utils.Requests (crupdate, deleteChapter, getChapterHtmlFromGDocs, postChapters)
import Halogen.HTML.Properties (class_, id_)
import Halogen.Query (Action)

import Prelude
import Data.Newtype (over)
import Data.Either (either)
import Data.Array (mapWithIndex, sort, updateAt, (!!))
import Data.Maybe (Maybe(..), fromMaybe)
import Control.Monad.Aff (Aff)
import Network.HTTP.Affjax (AJAX)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP

type State = 
    { chapters :: Array LocalChapter
    , chaptersOriginal :: Array LocalChapter
    }

data Query a 
    = Initialize a
    | MoveChapter Int Int a
    | SyncChapter LocalChapter a
    | EditChapterMetadata LocalChapter a
    | ChangeChapterSource LocalChapter a
    | NewChapter a
    | DeleteChapter Int a
    | Save a
    | Cancel a

type Input = Unit

data Message
    = GoToMetadataEditor LocalChapter
    | OptionChange (Array (Tuple String (Action Query)))
    | GoToChapterSync LocalChapter LocalChapter

type AppEffects eff = ReaderT GoogleServices (Aff 
    ( ajax :: AJAX 
    , gapi :: GAPI
    , console :: CONSOLE
    , locale :: LOCALE
    | eff
    ))



type ChapterListComponent eff = H.Component HH.HTML Query Input Message (AppEffects eff)

chapterList :: forall eff. ChapterListComponent eff
chapterList =
    H.lifecycleComponent
      { initialState: const initialState
      , render
      , eval
      , receiver: const Nothing
      , initializer: Just (H.action Initialize)
      , finalizer: Nothing
      }
  where
        initialState :: State
        initialState = { chapters : [], chaptersOriginal : [] }

        render :: State -> H.ComponentHTML Query
        render state = 
            HH.div 
                [ HP.id_ "chapter-list" ] 
                [ HH.div [ HP.class_ (H.ClassName "left-col") ] $ mapWithIndex chapterToHtml state.chapters
                , HH.div 
                    [ HP.class_ (H.ClassName "right-col") ] 
                    [ HH.h2_ [ HH.text "Cool Sidebar" ] ] 
                ]
                
                    
                where
                    chapterToHtml chapterIndex ch@(Chapter chR@{id,title,docId}) = 
                        HH.div
                            [ HP.class_ $ H.ClassName "chapter-tile" ]
                            [ HH.h2_ 
                                [ HH.a 
                                    [ HP.href $ "https://docs.google.com/document/d/" <> docId <> "/edit"
                                    , HP.target "_blank" 
                                    ] 
                                    [ HH.text $ stripTags title ] 
                                ] 
                            , HH.div 
                                [ HP.class_ $ H.ClassName "chapter-controls" ]
                                [ HH.i [ HP.class_ (H.ClassName "fa fa-pencil-square-o")
                                       , HP.attr (H.AttrName "aria-hidden") "true"
                                       , HE.onClick $ HE.input_ (EditChapterMetadata ch)
                                       ] []
                                , HH.i [ HP.class_ (H.ClassName "fa fa-refresh")
                                       , HP.attr (H.AttrName "aria-hidden") "true"
                                       , HE.onClick $ HE.input_ (SyncChapter ch)
                                       ] []
                                , HH.i [ HP.class_ (H.ClassName "fa fa-download")
                                       , HP.attr (H.AttrName "aria-hidden") "true"
                                       , HE.onClick $ HE.input_ (ChangeChapterSource ch)
                                       ] []
                                , HH.i [ HP.class_ (H.ClassName "fa fa-arrow-up")
                                       , HP.attr (H.AttrName "aria-hidden") "true"
                                       , HE.onClick $ HE.input_ (MoveChapter chapterIndex (chapterIndex - 1))
                                       ] []
                                , HH.i [ HP.class_ (H.ClassName "fa fa-arrow-down")
                                       , HP.attr (H.AttrName "aria-hidden") "true"
                                       , HE.onClick $ HE.input_ (MoveChapter chapterIndex (chapterIndex + 1))
                                       ] []
                                , HH.i [ HP.class_ (H.ClassName "fa fa-trash")
                                       , HP.attr (H.AttrName "aria-hidden") "true"
                                       , HE.onClick $ HE.input_ (DeleteChapter chapterIndex)
                                       ] []
                                ]
                            , HH.div 
                                [ HP.class_ $ H.ClassName "chapter-data" ]
                                [ HH.text "Chapter data like release date and such goes here..." ]
                            ]

        eval :: Query ~> H.ComponentDSL State Query Message (AppEffects eff)
        eval = case _ of
            Initialize next -> do
                chs <- H.liftAff $ postChapters ""
                localChs <- H.liftEff $ 
                    either 
                        (const $ pure []) 
                        (traverse fromServerChapter >>> map sort >>> map (map \(Chapter chapter) -> Chapter chapter { entries = sort chapter.entries }))
                        chs.response    
                H.put { chapters : localChs, chaptersOriginal : localChs }
                updateOptions
                pure next
            
            MoveChapter baseIndex swapIndex next -> do
                H.modify \(state@{ chapters }) -> fromMaybe state do
                    newChapters <- swap baseIndex swapIndex chapters
                    pure $ state { chapters = mapWithIndex (\index -> over Chapter (_ { order = index })) newChapters }
                updateOptions
                pure next

            SyncChapter chapter next -> do
                googleServices <- ask
                newChapter <- H.liftAff $ retrieveChapter googleServices.accessToken (unwrap chapter).docId (unwrap chapter).order                    
                H.raise $ GoToChapterSync chapter newChapter
                pure next
            
            ChangeChapterSource chapter next -> do
                googleServices <- ask
                newChapter <- H.liftAff do
                    newChapterId <- map (fromMaybe "") $ showPicker googleServices.filePicker
                    retrieveChapter googleServices.accessToken newChapterId (unwrap chapter).order
                H.raise $ GoToChapterSync chapter newChapter
                pure next

            EditChapterMetadata chapter next -> do
                H.raise $ GoToMetadataEditor chapter
                pure next

            NewChapter next -> do
                state <- H.get
                googleServices <- ask
                newChapter <- H.liftAff do
                    chapterId <- map (fromMaybe "") $ showPicker googleServices.filePicker
                    retrieveChapter googleServices.accessToken chapterId (length state.chaptersOriginal)
                H.raise $ GoToMetadataEditor newChapter
                pure next


            DeleteChapter index next -> do
                H.modify \(state@{ chapters }) -> state { chapters = 
                        mapWithIndex (\i -> over Chapter (_ { order = i })) $ fromMaybe chapters $ deleteAt index chapters 
                    }
                updateOptions
                pure next
            
            Save next -> do
                state <- H.get
                _ <- H.liftAff $ sequence $ catMaybes $ flip map state.chaptersOriginal \(Chapter oldChapter) -> do
                    case find (unwrap >>> _.id >>> (==) oldChapter.id) state.chapters of
                        Nothing -> Just $ deleteChapter "" (fromMaybe (-1) oldChapter.id)
                        Just newChapter -> 
                            if Chapter oldChapter == newChapter then
                                Nothing
                            else
                                Just $ crupdate "" $ toServerChapter newChapter
                H.modify (_ { chaptersOriginal = state.chapters })
                updateOptions
                pure next
                
            
            Cancel next -> do
                H.modify \(state@{ chapters, chaptersOriginal }) -> state { chapters = chaptersOriginal }
                updateOptions
                pure next
          where
                updateOptions = do
                    state <- H.get
                    if state.chapters /= state.chaptersOriginal 
                        then 
                            H.raise $ OptionChange
                                [ Tuple "Cancel" Cancel
                                , Tuple "Save"   Save
                                ]
                        else
                            H.raise $ OptionChange
                                [ Tuple "New Chapter" NewChapter ] 

                retrieveChapter :: forall e. String -> String -> Int -> Aff (ajax :: AJAX | e) LocalChapter
                retrieveChapter accessToken docId order = do
                    chapterResponse <- getChapterHtmlFromGDocs accessToken docId
                    either 
                        (\err -> throwError $ error $ "Failed to parse chapter: " <> show err) 
                        (pure <<< over Chapter (_ { order = order, docId = docId }))
                        (runExcept $ parseChapter chapterResponse.response)

                


