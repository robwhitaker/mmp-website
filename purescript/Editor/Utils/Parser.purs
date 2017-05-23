module Editor.Utils.Parser where

import Prelude
import Editor.Models.Chapter as Chapter
import Editor.Models.Entry as Entry
import Control.Bind (join)
import Control.Monad.Except (Except, except, runExcept, withExcept)
import Control.Monad.Except.Trans (throwError)
import Control.MonadPlus (guard)
import Control.Plus ((<|>))
import Data.Array (all, head, length, range, tail, zip, (!!))
import Data.Either (Either(..), either)
import Data.Generic (class Generic, gEq, gShow)
import Data.Int (fromString)
import Data.List.Lazy.Types (NonEmptyList(..))
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Monoid (class Monoid, class Semigroup, mempty)
import Data.Newtype (unwrap)
import Data.String (joinWith)
import Data.String.Regex (Regex, match, regex, replace)
import Data.String.Regex.Flags (RegexFlags(..), global, ignoreCase, noFlags)
import Data.String.Regex.Unsafe (unsafeRegex)
import Data.Traversable (for, sequence)
import Data.Tuple (Tuple(..))
import Editor.Models.Chapter (Chapter(..), LocalChapter)
import Editor.Models.Entry (Entry(..), LocalEntry)

type ChapterParser = Except (Array ChapterParseError)

parseChapter :: String -> ChapterParser LocalChapter
parseChapter srcStr = do
    stylesheet <- getTagContents "style" srcStr <|> pure ""
    headingGroups <- getHeadingGroups srcStr
    chapterData <- onError NoHeadingGroups $ head headingGroups
    entryDataArray <- onError NoHeadingGroups $ tail headingGroups
    withExcept (const $ pure BadChapterHeadingLevel) $ guard (runExcept (getHeadingLevel chapterData.heading) == Right 0) :: ChapterParser Unit
    entries <- for (zip entryDataArray $ range 0 (length entryDataArray)) \(Tuple { heading, content } i) -> do
        level <- getHeadingLevel heading
        withExcept (const $ pure BadEntryHeadingLevel) $ guard (level > 0) :: ChapterParser Unit
        pure $ Entry $ (unwrap (Entry.empty :: LocalEntry)) 
            { level = level
            , order = i
            , title = heading
            , content = content
            }
    pure $ Chapter $ (unwrap (Chapter.empty :: LocalChapter))
        { stylesheet = stylesheet
        , title = chapterData.heading
        , content = chapterData.content
        , entries = entries
        }

stripTags :: String -> String
stripTags = replace tagRegex "" >>> replace spaceRegex " "
  where
    tagRegex = unsafeRegex "<.*?>|</.*?>" (global <> ignoreCase)
    spaceRegex = unsafeRegex "&[a-zA-Z0-9]*?;" (global <> ignoreCase)

getTagContents :: String -> String -> ChapterParser String
getTagContents tagName srcStr = do
    reg <- withExcept (pure <<< RegexError) $ except eitherRegex
    onError (FailedTagMatch tagName) do
        matches <- match reg srcStr
        join $ matches !! 1
  where
    eitherRegex = regex (joinWith "" ["<", tagName, ".*?>((.|\\n)*?)</", tagName, ">"]) ignoreCase

getHeadingGroups :: String -> ChapterParser (Array { heading :: String, content :: String })
getHeadingGroups srcStr = do
    matches <- onError FailedToMatchHeadingGroups $ join $ map sequence $ match headingBlockRegex srcStr
    for matches \headingBlock -> onError BadHeadingGroupSplit do
        innerMatches <- match splitContentRegex headingBlock
        heading <- join $ innerMatches !! 1
        content <- join (innerMatches !! 2) <|> pure ""
        pure { heading : heading, content : content }
  where
    headingBlockRegex = unsafeRegex "<h[1-6].*?>.*?<\\/h[1-6]>(.|\\n)*?(?=<h[1-6].*?>|<\\/body>)" (global <> ignoreCase)
    splitContentRegex = unsafeRegex "(<h[1-6].*?>.*?<\\/h[1-6]>)((.|\\n)*)" ignoreCase

getHeadingLevel :: String -> ChapterParser Int
getHeadingLevel srcStr = onError FailedHeadingLevelMatch do
    headingMatch <- join $ map sequence $ match headingRegex srcStr
    headingNum <- headingMatch !! 1
    n <- fromString headingNum
    pure $ n - 1
  where
    headingRegex = unsafeRegex "<h([1-6]).*?>" ignoreCase

onError :: forall a. ChapterParseError -> Maybe a -> ChapterParser a
onError err = maybe (throwError $ pure err) pure

data ChapterParseError
    = BadEntryHeadingLevel
    | BadChapterHeadingLevel
    | NoHeadingGroups
    | FailedTagMatch String
    | FailedToMatchHeadingGroups
    | BadHeadingGroupSplit
    | FailedHeadingLevelMatch
    | RegexError String
    | Nil

derive instance genericChapterParseError :: Generic ChapterParseError
derive instance eqChapterParseError :: Eq ChapterParseError
instance showChapterParseError :: Show ChapterParseError where
    show = gShow

