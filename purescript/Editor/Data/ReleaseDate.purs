module Editor.Data.ReleaseDate where

import Prelude
import Data.Array (concat)
import Data.Date (canonicalDate)
import Data.DateTime (DateTime(..))
import Data.Enum (toEnum)
import Data.Foreign (ForeignError(..), fail, readString)
import Data.Foreign.Class (class IsForeign)
import Data.Generic (class Generic)
import Data.Int (fromString)
import Data.Either (Either(..), either)
import Data.Maybe (Maybe(..), maybe)
import Data.String (length, take)
import Data.String.Regex (parseFlags, regex, split)
import Data.Time (Time(..))
import Data.Traversable (traverse)

newtype ReleaseDate = ReleaseDate DateTime

derive instance genericReleaseDate :: Generic ReleaseDate

instance showReleaseDate :: Show ReleaseDate where
    show (ReleaseDate a) = show a

instance eqReleaseDate :: Eq ReleaseDate where
    eq (ReleaseDate a) (ReleaseDate b) = eq a b

instance ordReleaseDate :: Ord ReleaseDate where
    compare (ReleaseDate a) (ReleaseDate b) = compare a b

instance releaseDateIsForeign :: IsForeign ReleaseDate where
    read value = do
        strVal <- readString value
        maybe 
            (fail (ErrorAtProperty "releaseDate" $ ForeignError ""))
            (pure <<< ReleaseDate)
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
