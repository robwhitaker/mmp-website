module Editor.Data.ForeignDateTime where

import Editor.Data.DateTime.Utils

import Prelude
import Data.Array (replicate)
import Data.Date (canonicalDate)
import Data.DateTime (DateTime(..), date, minute, second, time, day, month, year)
import Data.Either (Either(..), either)
import Data.Enum (class BoundedEnum, fromEnum, toEnum)
import Data.Foreign (ForeignError(..), fail, readString, toForeign)
import Data.Foreign.Class (class AsForeign, class IsForeign)
import Data.Int (fromString)
import Data.Maybe (Maybe(..), maybe)
import Data.String (joinWith, length, take)
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
      
instance foreignDateTimeAsForeign :: AsForeign ForeignDateTime where
    write (ForeignDateTime datetime) = toForeign $ formatISO8601 datetime

toDateTime :: ForeignDateTime -> DateTime
toDateTime (ForeignDateTime datetime) = datetime

fromDateTime :: DateTime -> ForeignDateTime
fromDateTime = ForeignDateTime

