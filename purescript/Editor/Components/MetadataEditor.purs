module Editor.Components.MetadataEditor where

import Editor.Models.Chapter as Chapter
import Control.Monad.Aff (Aff)
import Data.Maybe (Maybe(..))
import Data.Newtype (over, unwrap)
import Editor.Models.Chapter (Chapter(..))

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
    | Cancel a
    | StupidSelfUpdate a
    | StupidParentUpdate a
    | NoOp a

data Message 
    = OptionChange (Array (Tuple String (H.Action Query)))
    | BackToChapterList

type Input = Chapter

type AppEffects eff = Aff eff

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
            HH.div_ [ HH.h1_ [ HH.text (unwrap state.chapter).title ], HH.text $ show (unwrap state.chapter).order ]

        eval :: Query ~> H.ComponentDSL State Query Message (AppEffects eff)
        eval =
            case _ of
                Initialize next -> do
                    H.raise $ OptionChange
                        [ Tuple "Save"   Cancel
                        , Tuple "Cancel" Cancel
                        , Tuple "StupidSelfUpdate" StupidSelfUpdate
                        , Tuple "StupidParentUpdate" StupidParentUpdate
                        ]
                    pure next

                LoadChapter chapter next -> do 
                    H.put { chapter : chapter, chapterOriginal : chapter }
                    pure next

                Cancel next -> do
                    H.raise BackToChapterList
                    pure next
                
                StupidSelfUpdate next -> do
                    H.modify \state -> state { chapter = over Chapter (_ { order = 100000 } ) state.chapter }
                    pure next

                StupidParentUpdate next -> do
                    H.raise $ OptionChange [ Tuple "Ehh" NoOp ]
                    pure next

                NoOp next -> pure next
