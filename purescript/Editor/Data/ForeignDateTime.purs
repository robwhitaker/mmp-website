module Editor.Data.ForeignDateTime where

import Editor.Data.DateTime.Utils
import Data.Generic.Rep (class Generic)

import Prelude
import Data.Array (replicate)

import Data.DateTime (DateTime(..), date, minute, second, time, day, month, year)
import Data.Either (Either(..), either)
import Data.Enum (class BoundedEnum, fromEnum, toEnum)
import Data.Foreign (ForeignError(..), fail, readString, toForeign)
import Data.Foreign.Class (class Encode, class Decode)
import Data.Int (fromString)
import Data.Maybe (Maybe(..), maybe)
import Data.String (joinWith, length, take)
import Data.String.Regex (parseFlags, regex, split)
import Data.Time (Time(..), hour, millisecond)
import Data.Traversable (traverse)

newtype ForeignDateTime = ForeignDateTime DateTime

derive instance genericForeignDateTime :: Generic ForeignDateTime _

instance foreignDateTimeDecode :: Decode ForeignDateTime where
    decode value = do
        strVal <- readString value
        maybe 
            (fail (ErrorAtProperty "releaseDate" $ ForeignError ""))
            (pure <<< ForeignDateTime)
            (parseISO8601 strVal)
      
instance foreignDateTimeEncode :: Encode ForeignDateTime where
    encode (ForeignDateTime datetime) = toForeign $ formatISO8601 datetime

toDateTime :: ForeignDateTime -> DateTime
toDateTime (ForeignDateTime datetime) = datetime

fromDateTime :: DateTime -> ForeignDateTime
fromDateTime = ForeignDateTime

