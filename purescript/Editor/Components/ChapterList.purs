module Editor.Components.ChapterList where

import Control.Monad.Aff (attempt)
import Control.Monad.Aff.Console (CONSOLE, log)
import Control.Monad.Eff.Exception (error)
import Control.Monad.Error.Class (throwError)
import Control.Monad.Except (runExcept)
import Control.Monad.Reader (ReaderT(..), ask)
import Data.Array (catMaybes, deleteAt, length)
import Data.List (find)
import Data.Maybe (Maybe(..))
import Data.Newtype (unwrap)
import Data.Traversable (for, sequence)
import Data.Tuple (Tuple(..))
import Editor.Models.Chapter (Chapter(..))
import Editor.Utils.GoogleAuth (GAPI, GoogleServices, showPicker)
import Editor.Utils.Parser (getHeadingGroups, getTagContents, parseChapter, stripTags)
import Editor.Utils.Requests (crupdate, deleteChapter, getChapterHtmlFromGDocs, postChapters)
import Halogen.Query (Action)
import Editor.Utils.Array (swap)

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
    { chapters :: Array Chapter
    , chaptersOriginal :: Array Chapter
    }

data Query a 
    = Initialize a
    | MoveChapter Int Int a
    | SyncChapter Chapter a
    | EditChapterMetadata Chapter a
    | ChangeChapterSource Chapter a
    | NewChapter a
    | DeleteChapter Int a
    | Save a
    | Cancel a

type Input = Unit

data Message
    = GoToMetadataEditor Chapter
    | OptionChange (Array (Tuple String (Action Query)))
    | GoToChapterSync Chapter Chapter

type AppEffects eff = ReaderT GoogleServices (Aff 
    ( ajax :: AJAX 
    , gapi :: GAPI
    , console :: CONSOLE
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
            HH.div_ $ mapWithIndex chapterToHtml state.chapters
                    <> [ HH.br_, HH.text $ if state.chapters == state.chaptersOriginal then "Saved." else "Unsaved.", HH.br_ ]
                where
                    chapterToHtml chapterIndex ch@(Chapter chR@{id,title}) = 
                        HH.div_
                            [ HH.h2_ [HH.text $ stripTags title <> show id] 
                            , HH.button [ HE.onClick $ HE.input_ (EditChapterMetadata ch)] [ HH.text "Edit" ]
                            , HH.button [ HE.onClick $ HE.input_ (SyncChapter ch)] [ HH.text "Sync" ]
                            , HH.button [ HE.onClick $ HE.input_ (ChangeChapterSource ch)] [ HH.text "Change Source" ]
                            , HH.button [ HE.onClick $ HE.input_ (MoveChapter chapterIndex (chapterIndex - 1))] [ HH.text "Move Up" ]
                            , HH.button [ HE.onClick $ HE.input_ (MoveChapter chapterIndex (chapterIndex + 1))] [ HH.text "Move Down" ]
                            , HH.button [ HE.onClick $ HE.input_ (DeleteChapter chapterIndex)] [ HH.text "X" ]
                            , HH.text $ show $ chR.order
                            ]

        eval :: Query ~> H.ComponentDSL State Query Message (AppEffects eff)
        eval = case _ of
            Initialize next -> do
                chs <- H.liftAff $ postChapters ""
                H.put $ either (const initialState) (\chapters ->
                    { chapters : chapters
                    , chaptersOriginal : chapters
                    }
                ) chs.response
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
                H.liftAff $ sequence $ catMaybes $ flip map state.chaptersOriginal \(Chapter oldChapter) -> do
                    case find (unwrap >>> _.id >>> (==) oldChapter.id) state.chapters of
                        Nothing -> Just $ deleteChapter "" (fromMaybe (-1) oldChapter.id)
                        Just newChapter -> 
                            if Chapter oldChapter == newChapter then
                                Nothing
                            else
                                Just $ crupdate "" newChapter
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
                                [ Tuple "Save"   Save
                                , Tuple "Cancel" Cancel
                                ]
                        else
                            H.raise $ OptionChange
                                [ Tuple "New Chapter" NewChapter ] 

                retrieveChapter :: forall e. String -> String -> Int -> Aff (ajax :: AJAX | e) Chapter
                retrieveChapter accessToken docId order = do
                    chapterResponse <- getChapterHtmlFromGDocs accessToken docId
                    either 
                        (\err -> throwError $ error $ "Failed to parse chapter: " <> show err) 
                        (pure <<< over Chapter (_ { order = order, docId = docId })) 
                        (runExcept $ parseChapter chapterResponse.response)

                


