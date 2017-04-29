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
import Data.Int (fromString)
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Newtype (unwrap)
import Data.String (joinWith)
import Data.String.Regex (Regex, match, regex, replace)
import Data.String.Regex.Flags (RegexFlags(..), global, ignoreCase, noFlags)
import Data.String.Regex.Unsafe (unsafeRegex)
import Data.Traversable (for, sequence)
import Data.Tuple (Tuple(..))
import Editor.Models.Chapter (Chapter(..))
import Editor.Models.Entry (Entry(..))

parseChapter :: String -> Except String Chapter
parseChapter srcStr = do
    stylesheet <- getTagContents "style" srcStr <|> pure ""
    headingGroups <- getHeadingGroups srcStr
    chapterData <- maybe (throwError "parseChapter: headingGroups list empty") pure $ head headingGroups
    entryDataArray <- maybe (throwError "parseChapter: headingGroups list empty") pure $ tail headingGroups
    withExcept (const "parseChapter: bad chapter heading level") $ guard (runExcept (getHeadingLevel chapterData.heading) == Right 0) :: Except String Unit
    entries <- for (zip entryDataArray $ range 0 (length entryDataArray)) \(Tuple { heading, content } i) -> do
        level <- getHeadingLevel heading
        withExcept (const $ "parseChapter: bad entry heading level on entry " <> show i) $ guard (level > 0) :: Except String Unit
        pure $ Entry $ (unwrap Entry.empty) 
            { level = level
            , order = i
            , title = heading
            , content = content
            }
    pure $ Chapter $ (unwrap Chapter.empty)
        { stylesheet = stylesheet
        , title = chapterData.heading
        , content = chapterData.content
        , entries = entries
        }

gi :: RegexFlags
gi = global <> ignoreCase

stripTags :: String -> String
stripTags = replace tagRegex ""
  where
    tagRegex = unsafeRegex "<.*?>|</.*?>" gi

getTagContents :: String -> String -> Except String String
getTagContents tagName srcStr = do
    reg <- except eitherRegex
    maybe (throwError $ "getTagContents: failed match for " <> tagName) pure do
        matches <- match reg srcStr
        join $ matches !! 1
  where
    eitherRegex = regex (joinWith "" ["<", tagName, ".*?>((.|\\n)*?)</", tagName, ">"]) ignoreCase

getHeadingGroups :: String -> Except String (Array { heading :: String, content :: String })
getHeadingGroups srcStr = do
    matches <- maybe (throwError "getHeadingGroups: failed to match heading blocks") pure $ 
                     join $ map sequence $ match headingBlockRegex srcStr
    for matches \headingBlock -> maybe (throwError "getHeadingGroups: bad split") pure do
        innerMatches <- match splitContentRegex headingBlock
        heading <- join $ innerMatches !! 1
        content <- join (innerMatches !! 2) <|> pure ""
        pure { heading : heading, content : content }
  where
    headingBlockRegex = unsafeRegex "<h[1-6].*?>.*?<\\/h[1-6]>(.|\\n)*?(?=<h[1-6].*?>|<\\/body>)" gi
    splitContentRegex = unsafeRegex "(<h[1-6].*?>.*?<\\/h[1-6]>)((.|\\n)*)" ignoreCase

getHeadingLevel :: String -> Except String Int
getHeadingLevel srcStr = maybe (throwError "getHeadingLevel: failed to match valid heading tag") pure do
    headingMatch <- join $ map sequence $ match headingRegex srcStr
    headingNum <- headingMatch !! 1
    n <- fromString headingNum
    pure $ n - 1
  where
    headingRegex = unsafeRegex "<h([1-6]).*?>" ignoreCase
