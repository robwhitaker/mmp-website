module Editor.Models.Chapter where
  
import Editor.Models.Entry (Entry)

import Prelude
import Data.Maybe (Maybe(..))
import Data.DateTime (DateTime)
import Data.Generic (class Generic, gShow, gEq)

newtype Chapter = Chapter
    { id                :: Maybe Int
    , order             :: Int
    , isInteractive     :: Boolean
    , interactiveUrl    :: String
    , interactiveData   :: String
    , stylesheet        :: String
    , title             :: String
    , content           :: String
    , releaseDate       :: Maybe DateTime
    , authorsNote       :: String
    , entries           :: Array Entry
    }

empty :: Chapter
empty = Chapter
    { id : Nothing
    , order : -1
    , isInteractive : false
    , interactiveUrl : ""
    , interactiveData : ""
    , stylesheet : ""
    , title : ""
    , content : ""
    , releaseDate : Nothing 
    , authorsNote : ""
    , entries : []      
    }

derive instance genericChapter :: Generic Chapter

instance showChapter :: Show Chapter where
    show = gShow

instance eqChapter :: Eq Chapter where
    eq = gEq

