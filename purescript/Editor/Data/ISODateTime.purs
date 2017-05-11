module Editor.Data.ISODateTime 
    ( ISODateTime
    , toDateTime
    , fromDateTime        
    ) where

import Prelude
import Data.Argonaut (class DecodeJson, class EncodeJson, fail, foldJsonString, fromString)
import Data.DateTime (DateTime)
import Data.Generic (class Generic)
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (class Newtype, unwrap, wrap)
import Editor.Data.DateTime.Utils (formatISO8601, parseISO8601)

newtype ISODateTime = ISODateTime DateTime

derive instance genericISODateTime :: Generic ISODateTime
derive instance newtypeISODateTime :: Newtype ISODateTime _

instance decodeJsonISODateTime :: DecodeJson ISODateTime where
    decodeJson value = do
        maybe 
            (fail $ "Failed to parse ISODateTime: " <> show value)
            (pure <<< ISODateTime)
            (foldJsonString Nothing parseISO8601 value)
      
instance encodeJsonISODateTime :: EncodeJson ISODateTime where
    encodeJson (ISODateTime datetime) = fromString $ formatISO8601 datetime

toDateTime :: ISODateTime -> DateTime
toDateTime = unwrap

fromDateTime :: DateTime -> ISODateTime
fromDateTime = wrap

