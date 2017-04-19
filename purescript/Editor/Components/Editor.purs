module Editor.Components.Editor where

import Editor.Components.ChapterList as ChapterList
import Data.Tuple (Tuple(..))
import Halogen (Action)

import Prelude
import Data.Maybe (Maybe(..))
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP

data ActiveComponent 
    = ChapterList (Array (Tuple String (Action ChapterList.Query)))

type State = 
    { activeComponent :: ActiveComponent }

data Query a 
    = HandleChapterList ChapterList.Message a
    | SendChapterListAction (Action ChapterList.Query) a

type Input = Unit

type Message = Void

data Slot = ChapterListSlot
derive instance eqButtonSlot :: Eq Slot
derive instance ordButtonSlot :: Ord Slot

editor :: forall eff. H.Component HH.HTML Query Input Message (ChapterList.ChapterListAff eff)
editor =
    H.parentComponent
      { initialState: const initialState
      , render
      , eval
      , receiver: const Nothing
      }
  where
        initialState :: State
        initialState = { activeComponent : ChapterList [] }

        render :: State -> H.ParentHTML Query ChapterList.Query Slot (ChapterList.ChapterListAff eff)
        render state =
            HH.div_
                [ topBar 
                , HH.slot ChapterListSlot ChapterList.chapterList unit (HE.input HandleChapterList)
                , HH.p_
                    [ HH.text ("Button has been toggled " <> "!!!wow!!!" <> " time(s)") ]
                ]
          where
                topBar :: H.ParentHTML Query ChapterList.Query Slot (ChapterList.ChapterListAff eff)
                topBar = 
                    HH.div_ $ 
                        [ HH.h1_ [ HH.text "Chapter List Editor" ] ] <>
                        case state.activeComponent of
                            ChapterList options ->
                                map (optionBtn SendChapterListAction) options
                
                optionBtn toQuery (Tuple label action) = 
                    HH.button
                        [ HE.onClick (HE.input_ $ toQuery action) ]
                        [ HH.text label ]

        eval :: Query ~> H.ParentDSL State Query ChapterList.Query Slot Void (ChapterList.ChapterListAff eff)
        eval = case _ of
            HandleChapterList (ChapterList.OptionChange options) next -> do
                H.modify \state -> state { activeComponent = ChapterList options }
                pure next
            HandleChapterList _ next -> pure next

            SendChapterListAction action next -> do
                H.query ChapterListSlot $ H.action action
                pure next

