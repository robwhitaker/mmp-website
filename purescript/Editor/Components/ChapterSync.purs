module Editor.Components.ChapterSync where

import Prelude
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Control.Alt (map, (<$>), (<|>))
import Control.Monad.Aff (Aff)
import Control.Monad.Aff.Console (CONSOLE, log)
import Control.MonadPlus (class Plus)
import Data.Array (catMaybes, length, mapWithIndex, replicate, updateAt, zipWith, (!!))
import Data.Bifunctor (lmap, rmap)
import Data.DateTime (DateTime(..))
import Data.Eq (class Eq)
import Data.Maybe (Maybe(..), fromJust, fromMaybe, isJust, maybe)
import Data.Monoid (class Monoid)
import Data.Newtype (over, unwrap)
import Data.Tuple (Tuple(..), fst, snd)
import Editor.Models.Chapter (Chapter(..))
import Editor.Models.Entry (Entry(..), empty)
import Editor.Utils.Array (normalizeArrays, swap)
import Editor.Utils.ModelHelpers (copyCommonMetadata)
import Editor.Utils.Parser (stripTags)
import Halogen (Action)

type State =
    { chapterOriginal :: Chapter
    , entriesOriginal :: Array (Maybe Entry)
    , chapter :: Chapter
    , entries :: Array (Maybe Entry)
    }

data Query a 
    = Initialize a
    | Continue a
    | Cancel a
    | MoveEntry Int Int a
    | DeleteEntry Int a

type Input = Unit

data Message 
    = GoToMetadataEditor Chapter
    | GoToChapterList
    | OptionChange (Array (Tuple String (Action Query)))

type AppEffects eff = Aff
    ( console :: CONSOLE
    | eff
    )

chapterSync :: forall eff. Chapter -> Chapter -> H.Component HH.HTML Query Input Message (AppEffects eff)
chapterSync chapterOriginal chapter = 
    H.lifecycleComponent
        { initialState: const initialState
        , render
        , eval
        , receiver: const Nothing
        , initializer: Just (H.action Initialize)
        , finalizer: Nothing
        }
  where
        initialState = 
            { chapterOriginal 
            , entriesOriginal: map Just (unwrap chapterOriginal).entries
            , chapter
            , entries: map Just (unwrap chapter).entries
            }

        render :: State -> H.ComponentHTML Query
        render state =
            HH.div_
                [ HH.h1_ [ HH.text $ stripTags (unwrap state.chapter).title ]
                , HH.table [ HP.attr (H.AttrName "style") "border: 1px solid black;" ] $ 
                    [ HH.tr [ HP.attr (H.AttrName "style") "border: 1px solid black;" ] [ HH.td [HP.attr (H.AttrName "style") "border: 1px solid black;"] [ HH.text "Old Chapter" ], HH.td [HP.attr (H.AttrName "style") "border: 1px solid black;"] [ HH.text "New Chapter" ] ] ] <>
                    (mapWithIndex (#) $ zipWith (\old new -> \i -> 
                        HH.tr [HP.attr (H.AttrName "style") "border: 1px solid black;"]
                            [ HH.td [HP.attr (H.AttrName "style") "border: 1px solid black;"] 
                                [ HH.text $ maybe "Nothing" (unwrap >>> _.title) old
                                , HH.button [ HE.onClick $ HE.input_ (MoveEntry i (i-1))] [ HH.text "Move Up" ]
                                , HH.button [ HE.onClick $ HE.input_ (MoveEntry i (i+1))] [ HH.text "Move Down" ]
                                , HH.button [ HE.onClick $ HE.input_ (DeleteEntry i)] [ HH.text "X" ] 
                                ]
                            , HH.td [HP.attr (H.AttrName "style") "border: 1px solid black;"] 
                                [ HH.text $ maybe "Nothing" (unwrap >>> _.title) new
                                ]
                            ]                    
                    ) (fst paddedEntries) (snd paddedEntries))
                ]
          where
                paddedEntries = normalizeArrays state.entriesOriginal state.entries

        eval :: Query ~> H.ComponentDSL State Query Message (AppEffects eff)
        eval = case _ of
            Initialize next -> do
                H.raise $ OptionChange
                    [ Tuple "Cancel" Cancel                       
                    , Tuple "Continue" Continue 
                    ]
                pure next

            Continue next -> do
                state <- H.get
                let newChapter = copyCommonMetadata (unwrap state.chapterOriginal) (unwrap state.chapter)
                let entriesWithChapterId = map (map \(Entry entry) -> 
                        entry { chapterId = fromMaybe (-1) newChapter.id }
                    ) state.entries
                let paddedEntryArrays = normalizeArrays (map (map unwrap) state.entriesOriginal) entriesWithChapterId
                let newEntries = catMaybes $ zipWith (\old new -> map Entry $ copyCommonMetadata <$> old <*> new <|> new) (fst paddedEntryArrays) (snd paddedEntryArrays)
                H.raise $ GoToMetadataEditor $ Chapter newChapter { entries = newEntries }
                pure next

            Cancel next -> do
                H.raise GoToChapterList
                pure next

            MoveEntry baseIndex swapIndex next -> do
                H.modify \(state@{ entriesOriginal }) -> fromMaybe state do
                    newEntries <- swap baseIndex swapIndex entriesOriginal
                    pure $ state { entriesOriginal = newEntries }
                pure next

            DeleteEntry index next -> do 
                H.modify \(state@{ entriesOriginal }) -> 
                    state 
                        { entriesOriginal = 
                            fromMaybe entriesOriginal $ updateAt index Nothing entriesOriginal 
                        }
                pure next
