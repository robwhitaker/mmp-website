module Editor.Data.ForeignDateTime where

import Prelude
import Data.Date (canonicalDate)
import Data.DateTime (DateTime(..), date, minute, second, time, day, month, year)
import Data.Either (Either(..), either)
import Data.Enum (fromEnum, toEnum)
import Data.Foreign (ForeignError(..), fail, readString, toForeign)
import Data.Foreign.Class (class AsForeign, class IsForeign)
import Data.Int (fromString)
import Data.Maybe (Maybe(..), maybe)
import Data.String (length, take)
import Data.String.Regex (parseFlags, regex, split)
import Data.Time (Time(..), hour, millisecond)
import Data.Traversable (traverse)

newtype ForeignDateTime = ForeignDateTime DateTime

instance foreignDateTimeIsForeign :: IsForeign ForeignDateTime where
    read value = do
        strVal <- readString value
        maybe 
            (fail (ErrorAtProperty "releaseDate" $ ForeignError ""))
            (pure <<< ForeignDateTime)
            (parseISO8601 strVal)
      where
            parseISO8601 :: String -> Maybe DateTime
            parseISO8601 dateStr = either (const Nothing) id do
                let str = take (length dateStr - 1) dateStr
                rx <- regex "[-:\\.T]" (parseFlags "gi")
                case traverse fromString $ split rx str of
                    Just [year, month, day, hour, minute, second, milli] ->
                        Right $ datetime year month day hour minute second milli
                    _ -> Left ""

            datetime :: Int -> Int -> Int -> Int -> Int -> Int -> Int -> Maybe DateTime
            datetime year month day hour minute second milli = 
                DateTime <$> 
                    (canonicalDate <$> toEnum year <*> toEnum month <*> toEnum day) <*> 
                    (Time <$> toEnum hour <*> toEnum minute <*> toEnum second <*> toEnum milli)

instance foreignDateTimeAsForeign :: AsForeign ForeignDateTime where
    write (ForeignDateTime datetime) =
        let d = date datetime
            t = time datetime
        in toForeign $ 
            (show $ fromEnum $ year d) <> "-" <>
            (show $ fromEnum $ month d) <> "-" <>
            (show $ fromEnum $ day d) <> "T" <>
            (show $ fromEnum $ hour t) <> ":" <>
            (show $ fromEnum $ minute t) <> ":" <>
            (show $ fromEnum $ second t) <> "." <>
            (show $ fromEnum $ millisecond t) <> "Z"

toDateTime :: ForeignDateTime -> DateTime
toDateTime (ForeignDateTime datetime) = datetime

fromDateTime :: DateTime -> ForeignDateTime
fromDateTime = ForeignDateTime

