module Editor.Components.ChapterList where

import Data.Array (deleteAt)
import Data.Tuple (Tuple(..))
import Editor.Models.Chapter (Chapter(..))
import Editor.Utils.Requests (postChapters)
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
    { chapters :: Array Chapter
    , chaptersOriginal :: Array Chapter
    }

data Direction = Up | Down
derive instance eqDirection :: Eq Direction
fromDirection :: Direction -> Int
fromDirection Up = -1
fromDirection Down = 1

data Query a 
    = Initialize a
    | MoveChapter Int Direction a
    | SyncChapter Chapter a
    | EditChapterMetadata Chapter a
    | DeleteChapter Int a
    | Save a
    | Cancel a

type Input = Unit

data Message
    = EditChapter Chapter
    | OptionChange (Array (Tuple String (Action Query)))

type ChapterListAff eff = Aff (ajax :: AJAX | eff)
type ChapterListComponent eff = H.Component HH.HTML Query Input Message (ChapterListAff eff)

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
                    chapterToHtml chapterIndex ch@(Chapter chR@{title}) = 
                        HH.div_
                            [ HH.h2_ [HH.text title]
                            , HH.button [ HE.onClick $ HE.input_ (EditChapterMetadata ch)] [ HH.text "Edit" ]
                            , HH.button [ HE.onClick $ HE.input_ (MoveChapter chapterIndex Up)] [ HH.text "Move Up" ]
                            , HH.button [ HE.onClick $ HE.input_ (MoveChapter chapterIndex Down)] [ HH.text "Move Down" ]
                            , HH.button [ HE.onClick $ HE.input_ (DeleteChapter chapterIndex)] [ HH.text "X" ]
                            , HH.text $ show $ chR.order
                            ]

        eval :: Query ~> H.ComponentDSL State Query Message (ChapterListAff eff)
        eval = case _ of
            Initialize next -> do
                chs <- H.liftAff $ postChapters ""
                H.put $ either (const initialState) (\chapters ->
                    { chapters : mapWithIndex (\index -> over Chapter (_ { order = index })) $ sort chapters
                    , chaptersOriginal : chapters
                    }
                ) chs.response
                updateOptions
                pure next
            
            MoveChapter baseIndex direction next -> do
                let swapIndex = baseIndex + fromDirection direction
                H.modify \(state@{ chapters }) -> fromMaybe state do
                    baseElem <- chapters !! baseIndex
                    swapElem <- chapters !! swapIndex
                    newChapters <- updateAt baseIndex swapElem chapters 
                               >>= updateAt swapIndex baseElem
                    pure $ state { chapters = mapWithIndex (\index -> over Chapter (_ { order = index })) newChapters }
                updateOptions
                pure next

            SyncChapter chapter next -> do
                pure next

            EditChapterMetadata chapter next -> do
                H.raise $ EditChapter chapter
                pure next

            DeleteChapter index next -> do
                H.modify \(state@{ chapters }) -> state { chapters = 
                        mapWithIndex (\i -> over Chapter (_ { order = i })) $ fromMaybe chapters $ deleteAt index chapters 
                    }
                updateOptions
                pure next
            
            Save next -> do
                H.modify \(state@{ chapters, chaptersOriginal }) -> state { chaptersOriginal = chapters }
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
                                [ Tuple "New Chapter" Cancel ] --temp until NewChapter query exists
                    

