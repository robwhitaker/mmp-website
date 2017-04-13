module Editor.Components.ChapterList where

import Editor.Models.Chapter
import Control.Monad.Aff (Aff)
import Data.Array (elemIndex, sort, updateAt, (!!))
import Data.Either (either)
import Data.Eq (class Eq)
import Data.Maybe (maybe)
import Data.Newtype (unwrap, wrap)
import Editor.Utils.Requests (postChapters)
import Network.HTTP.Affjax (AJAX)

import Prelude
import Data.Maybe (Maybe(..))
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP

type State = Array Chapter

data Direction = Up | Down
derive instance eqDirection :: Eq Direction

data Query a 
    = Initialize a
    | MoveChapter Chapter Direction a
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
            HH.div_ $ map chapterToHtml state
                where
                    chapterToHtml ch@(Chapter chR@{title}) = 
                        HH.div_
                            [ HH.h2_ [HH.text title]
                            , HH.button [ HE.onClick $ HE.input_ (MoveChapter ch Up)] [ HH.text "Move Up" ]
                            , HH.button [ HE.onClick $ HE.input_ (MoveChapter ch Down)] [ HH.text "Move Down" ]
                            , HH.text $ show $ chR.order
                            ]

        eval :: Query ~> H.ComponentDSL State Query Message (Aff (ajax :: AJAX | eff))
        eval = case _ of
            Initialize next -> do
                chs <- H.liftAff $ postChapters ""
                H.put $ sort $ either (const []) id chs.response
                pure next
            
            MoveChapter chapter direction next -> do
                let swapOffset = if direction == Up then -1 else 1
                H.modify \chs -> maybe chs id do
                    i <- elemIndex chapter chs
                    let j = i + swapOffset
                    baseElem <- map unwrap $ chs !! i
                    swapElem <- map unwrap $ chs !! j
                    newChs <- updateAt i (wrap $ swapElem { order = baseElem.order }) chs
                                >>= updateAt j (wrap $ baseElem { order = swapElem.order })
                    pure newChs
                pure next

            SyncChapter chater next -> do
                pure next

            EditChapterMetadata chapter next -> do
                pure next

            DeleteChapter chapter next -> do
                pure next
