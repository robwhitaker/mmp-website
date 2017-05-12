module Editor.Data.DateTime.Utils where

import Prelude
import Data.DateTime
import Data.JSDate as JSDate
import Control.Comonad (extract)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Class (liftEff)
import Control.Monad.Eff.Console (log)
import Control.Monad.Eff.Unsafe (unsafePerformEff)
import Control.Monad.Maybe.Trans (MaybeT(..), runMaybeT)
import Control.MonadPlus (empty)
import Control.MonadZero (guard)
import Data.Array (replicate, (!!))
import Data.DateTime.Locale (LocalValue(..), Locale(..), LocalDateTime)
import Data.Either (Either(..), either)
import Data.Enum (class BoundedEnum, fromEnum, toEnum)
import Data.Int (fromString)
import Data.JSDate (LOCALE, getTimezoneOffset, isValid, parse, toDateTime)
import Data.Maybe (Maybe(Nothing, Just))
import Data.String (joinWith, length, take)
import Data.String.Regex (parseFlags, regex, split)
import Data.Time.Duration (class Duration, Minutes(..))
import Data.Traversable (traverse)

datetime :: Int -> Int -> Int -> Int -> Int -> Int -> Int -> Maybe DateTime
datetime year month day hour minute second milli = 
    DateTime <$> 
        (canonicalDate <$> toEnum year <*> toEnum month <*> toEnum day) <*> 
        (Time <$> toEnum hour <*> toEnum minute <*> toEnum second <*> toEnum milli)

parseISO8601 :: String -> Maybe DateTime
parseISO8601 dateStr = either (const Nothing) id do
    let str = take (length dateStr - 1) dateStr
    rx <- regex "[-:\\.T]" (parseFlags "gi")
    case traverse fromString $ split rx str of
        Just [year, month, day, hour, minute, second, milli] ->
            Right $ datetime year month day hour minute second milli
        _ -> Left ""

formatISO8601 :: DateTime -> String
formatISO8601 dt = 
    (format 4 $ year d) <> "-" <>
    (format 2 $ month d) <> "-" <>
    (format 2 $ day d) <> "T" <>
    (format 2 $ hour t) <> ":" <>
    (format 2 $ minute t) <> ":" <>
    (format 2 $ second t) <> "." <>
    (format 3 $ millisecond t) <> "Z"
  where
        d = date dt
        t = time dt

        pad :: Int -> String -> String
        pad n str = joinWith "" (replicate (n - length str) "0") <> str

        format :: forall a. (BoundedEnum a) => Int -> a -> String
        format n = pad n <<< show <<< fromEnum

applyLocale :: forall eff. DateTime -> Eff (locale :: LOCALE | eff) LocalDateTime
applyLocale dt = do
    timezoneOffset <- getTimezoneOffset (JSDate.fromDateTime dt)
    pure $ LocalValue (Locale Nothing (Minutes (-timezoneOffset))) dt

localAdjust :: forall d. Duration d => d -> LocalDateTime -> Maybe LocalDateTime
localAdjust d (LocalValue timezoneOffset dt) = 
    LocalValue <$> pure timezoneOffset <*> adjust d dt

removeLocale :: LocalDateTime -> DateTime
removeLocale = extract

dateTimeWithLocale :: LocalDateTime -> Maybe DateTime
dateTimeWithLocale (LocalValue (Locale _ timezoneOffset) dt) =
    adjust timezoneOffset dt

parseLocalDateTime :: forall eff. String -> Eff (locale :: LOCALE | eff) (Maybe LocalDateTime)
parseLocalDateTime dtStr = do
    parsedJSDate <- parse dtStr
    timezoneOffset <- getTimezoneOffset parsedJSDate
    pure $ toDateTime parsedJSDate >>= Just <<< LocalValue (Locale Nothing (Minutes (-timezoneOffset)))


