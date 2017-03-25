module Editor.Models.Entry where

import Editor.Utils.Json (customAesonOptions, allowMissingFields)

import Prelude
import Data.DateTime (DateTime)
import Data.Generic (class Generic, gShow, gEq)
import Data.Maybe (Maybe(..))
import Data.Argonaut (class EncodeJson, class DecodeJson)
import Data.Argonaut.Generic.Decode (genericDecodeJson)
import Data.Argonaut.Generic.Aeson (encodeJson)

newtype Entry = Entry
    { id                :: Maybe Int
    , chapterId         :: Int
    , order             :: Int
    , isInteractive     :: Boolean
    , interactiveUrl    :: String
    , interactiveData   :: String
    , title             :: String
    , content           :: String
    , releaseDate       :: Maybe DateTime
    , authorsNote       :: String
    }

empty :: Entry
empty = Entry
    { id : Nothing
    , chapterId : -1
    , order : -1
    , isInteractive : false
    , interactiveUrl : ""
    , interactiveData : ""
    , title : ""
    , content : ""
    , releaseDate : Nothing 
    , authorsNote : ""
    }

derive instance genericEntry :: Generic Entry

instance showEntry :: Show Entry where
    show = gShow

instance eqEntry :: Eq Entry where
    eq = gEq

instance decodeJsonEntry :: DecodeJson Entry where
   decodeJson = genericDecodeJson (customAesonOptions allowMissingFields)

instance encodeJsonEntry :: EncodeJson Entry where
   encodeJson = encodeJson