module Editor.Components.ChapterList where

import Editor.Models.Chapter (Chapter(..))
import Editor.Utils.Requests (postChapters)

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

type State = Array Chapter

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
    | DeleteChapter Chapter a

type Input = Unit

type Message = Void

chapterList :: forall eff. H.Component HH.HTML Query Input Message (Aff (ajax :: AJAX | eff))
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
        initialState = []

        render :: State -> H.ComponentHTML Query
        render state = 
            HH.div_ $ mapWithIndex chapterToHtml state
                where
                    chapterToHtml chapterIndex ch@(Chapter chR@{title}) = 
                        HH.div_
                            [ HH.h2_ [HH.text title]
                            , HH.button [ HE.onClick $ HE.input_ (MoveChapter chapterIndex Up)] [ HH.text "Move Up" ]
                            , HH.button [ HE.onClick $ HE.input_ (MoveChapter chapterIndex Down)] [ HH.text "Move Down" ]
                            , HH.text $ show $ chR.order
                            ]

        eval :: Query ~> H.ComponentDSL State Query Message (Aff (ajax :: AJAX | eff))
        eval = case _ of
            Initialize next -> do
                chs <- H.liftAff $ postChapters ""
                H.put $ sort $ either (const []) id chs.response
                pure next
            
            MoveChapter baseIndex direction next -> do
                let swapIndex = baseIndex + fromDirection direction
                H.modify \chapters -> fromMaybe chapters do
                    baseElem <- chapters !! baseIndex
                    swapElem <- chapters !! swapIndex
                    newChapters <- updateAt baseIndex swapElem chapters 
                               >>= updateAt swapIndex baseElem
                    pure $ mapWithIndex (\index -> over Chapter (_ { order = index })) newChapters
                pure next

            SyncChapter chater next -> do
                pure next

            EditChapterMetadata chapter next -> do
                pure next

            DeleteChapter chapter next -> do
                pure next
