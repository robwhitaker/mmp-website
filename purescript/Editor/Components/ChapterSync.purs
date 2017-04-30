module Editor.Components.ChapterSync where

import Prelude
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Control.Alt (map, (<$>), (<|>))
import Control.Monad.Aff (Aff)
import Data.Array (length, mapWithIndex, replicate, updateAt, zipWith, (!!))
import Data.DateTime (DateTime(..))
import Data.Eq (class Eq)
import Data.Maybe (Maybe(..), fromJust, fromMaybe, maybe)
import Data.Monoid (class Monoid)
import Data.Newtype (over, unwrap)
import Data.Tuple (Tuple(..), fst, snd)
import Editor.Models.Chapter (Chapter(..))
import Editor.Models.Entry (Entry(..), empty)
import Editor.Utils.Parser (stripTags)
import Halogen (Action)

type State =
    { chapterOriginal :: Chapter
    , chapter :: Chapter
    }

-- TODO: Copied from ChapterList, should be moved into own module and reused
data Direction = Up | Down
derive instance eqDirection :: Eq Direction
fromDirection :: Direction -> Int
fromDirection Up = -1
fromDirection Down = 1

data Query a 
    = Continue a
    | Cancel a
    | MoveEntry Int Direction a

type Input = Unit

data Message 
    = EditChapter Chapter
    | BackToChapterList
    | OptionChange (Array (Tuple String (Action Query)))

type AppEffects eff = Aff
    ( 
    | eff
    )

chapterSync :: forall eff. Chapter -> Chapter -> H.Component HH.HTML Query Input Message (AppEffects eff)
chapterSync chapterOriginal chapter = 
    H.component
        { initialState: const initialState
        , render
        , eval
        , receiver: const Nothing
        }
  where
        initialState = { chapterOriginal, chapter }

        render :: State -> H.ComponentHTML Query
        render state =
            HH.div_
                [ HH.h1_ [ HH.text $ stripTags (unwrap state.chapter).title ]
                , HH.table_ $
                    zipWith (\old new ->
                        HH.tr_
                            [ HH.td_ [ HH.text $ show old ]
                            , HH.td_ 
                                [ HH.text $ show new                                    
                                ]
                            ]                    
                    ) (fst paddedEntries) (snd paddedEntries)
                ]
          where
                paddedEntries = normalizeArrays (unwrap state.chapterOriginal).entries (unwrap state.chapter).entries

        eval :: Query ~> H.ComponentDSL State Query Message (AppEffects eff)
        eval = case _ of
            Continue next -> do
                state <- H.get
                let newChapter = transferMetadata (unwrap state.chapterOriginal) (unwrap state.chapter)
                let entriesWithChapterId = map (\(Entry entry) -> 
                        entry { chapterId = fromMaybe (-1) newChapter.id }
                    ) newChapter.entries
                let paddedEntryArrays = normalizeArrays (map unwrap (unwrap state.chapter).entries) entriesWithChapterId
                let newEntries = zipWith (\old new -> maybe empty Entry $ (transferMetadata <$> old <*> new) <|> new) (fst paddedEntryArrays) (snd paddedEntryArrays)
                H.raise $ EditChapter $ Chapter newChapter { entries = newEntries }
                pure next

            Cancel next -> do
                H.raise BackToChapterList
                pure next

            MoveEntry baseIndex direction next -> do
                -- TODO: mostly copied from ChapterList, can this be abstracted?
                let swapIndex = baseIndex + fromDirection direction
                H.modify \(state@{ chapter }) -> fromMaybe state do
                    let entries = (unwrap chapter).entries
                    baseElem <- entries !! baseIndex
                    swapElem <- entries !! swapIndex
                    newEntries <- updateAt baseIndex swapElem entries 
                               >>= updateAt swapIndex baseElem
                               >>= pure <<< mapWithIndex (\i -> over Entry (_ { order = i }))
                    pure $ state { chapter = over Chapter (_ { entries = newEntries }) chapter }
                pure next
          
        transferMetadata :: forall r. Metadata r -> Metadata r -> Metadata r
        transferMetadata base new =
            new 
                { id = base.id
                , isInteractive = base.isInteractive
                , interactiveUrl = base.interactiveUrl
                , interactiveData = base.interactiveData
                , authorsNote = base.authorsNote
                , releaseDate = base.releaseDate
                }

        normalizeArrays :: forall a. Array a -> Array a -> Tuple (Array (Maybe a)) (Array (Maybe a))
        normalizeArrays arr1 arr2 =
            Tuple (a1 <> replicate (length a2 - length a1) Nothing)
                  (a2 <> replicate (length a1 - length a2) Nothing)
          where
                a1 = map Just arr1
                a2 = map Just arr2


-- TODO: this is almost the same as MetadataEditor's FormFields type, can it be shared?
type Metadata r = 
    { id :: Maybe Int
    , isInteractive :: Boolean
    , interactiveUrl :: String
    , interactiveData :: String
    , authorsNote :: String
    , releaseDate :: Maybe DateTime
    | r
    }
