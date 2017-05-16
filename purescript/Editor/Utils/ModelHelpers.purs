module Editor.Utils.ModelHelpers where

import Prelude
import Data.String as Str
import Control.Plus ((<|>))
import Data.Array (filter, foldl, last, null, snoc, (!!), (:))
import Data.DateTime.Locale (LocalDateTime)
import Data.Functor.Product.Nested (T4)
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (class Newtype, unwrap)
import Data.String (joinWith, trim)
import Data.String.Regex (match)
import Data.String.Regex.Flags (noFlags)
import Data.String.Regex.Unsafe (unsafeRegex)
import Data.Tuple (Tuple(..))
import Data.Tuple.Nested (get3, tuple3, (/\))
import Editor.Models.Chapter (Chapter(..), LocalChapter)
import Editor.Models.Entry (Entry(..), LocalEntry)
import Editor.Utils.Parser (stripTags)
import Prelude (($))

type CommonMetadata r = 
    { id :: Maybe Int
    , isInteractive :: Boolean
    , interactiveUrl :: String
    , interactiveData :: String
    , authorsNote :: String
    , releaseDate :: Maybe LocalDateTime
    | r
    }

copyCommonMetadata :: forall r. CommonMetadata r -> CommonMetadata r -> CommonMetadata r
copyCommonMetadata base new =
    new 
        { id = base.id
        , isInteractive = base.isInteractive
        , interactiveUrl = base.interactiveUrl
        , interactiveData = base.interactiveData
        , authorsNote = base.authorsNote
        , releaseDate = base.releaseDate
        }

type EntryMetadata r = CommonMetadata (chapterId :: Int | r)

copyEntryMetadata :: forall r. EntryMetadata r -> EntryMetadata r -> EntryMetadata r
copyEntryMetadata base new = 
    copyCommonMetadata base $ new { chapterId = base.chapterId }

type ReleaseGroup = { chapter :: LocalChapter, entries :: Array LocalEntry }

makeReleaseGroups :: LocalChapter -> Array ReleaseGroup
makeReleaseGroups chapter@(Chapter { entries }) =
    foldl (\(lastLevel /\ currentGroup /\ acc /\ unit) entry@(Entry { level }) -> 
        if lastLevel < level then
            let newAcc = case last currentGroup of
                    Nothing -> acc
                    Just lastEntry -> 
                        if isOwnRelease (unwrap lastEntry) 
                        then acc `snoc` { chapter : chapter, entries : currentGroup }
                        else acc
            in tuple3 level (currentGroup `snoc` entry) newAcc
        else
            tuple3 level 
                   (filter (\(Entry e) -> e.level < level) currentGroup `snoc` entry) 
                   (acc `snoc` { chapter : chapter, entries : currentGroup })
    ) startAcc entries
    # \(lastLevel /\ currentGroup /\ acc /\ unit) ->
        if null currentGroup then acc else acc `snoc` { chapter : chapter, entries : currentGroup }
  where
    startAcc = tuple3 0 [] $ if isOwnRelease (unwrap chapter) then [ { chapter : chapter, entries : [] } ] else []
    
    isOwnRelease :: forall r. { content :: String, isInteractive :: Boolean | r } -> Boolean
    isOwnRelease item = (not $ Str.null item.content) || item.isInteractive

-- TODO: make fancier, like the Elm version
makeReleaseGroupTitle :: ReleaseGroup -> String
makeReleaseGroupTitle { chapter, entries } =
    foldl (\acc@(Tuple seg txt) title -> maybe acc id do
        matches <- match h1Reg title <|> match h2Reg title <|> match h3Reg title
        segMatch <- join $ matches !! 1
        let segMatch' = if Str.null seg then segMatch else seg <> "-" <> segMatch
        let txtMatch = join $ matches !! 2
        case txtMatch of 
            Nothing -> pure $ Tuple segMatch' txt
            Just txtMatch' -> pure $ Tuple segMatch' (if Str.null txtMatch' then txt else txtMatch')
    ) (Tuple "" "") titles
    # \(Tuple seg txt) -> seg <> (if Str.null txt then "" else " - " <> txt)
  where
    titles = map trim $ stripTags (unwrap chapter).title : map (\(Entry { title }) -> stripTags title) entries 
    h1Reg = unsafeRegex "(\\w+\\s+#?\\d+)(?:\\.\\s*)?(.*)" noFlags
    h2Reg = unsafeRegex "(\\d+\\w+)(?:\\.\\s*)(.*)" noFlags
    h3Reg = unsafeRegex "(\\d+(?:\\.\\d)?)(?:\\s*\\-\\s*)?(.*)" noFlags

