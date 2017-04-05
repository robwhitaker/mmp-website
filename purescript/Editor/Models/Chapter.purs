module Editor.Models.Chapter where
  
import Editor.Data.ReleaseDate
import Editor.Models.Entry (Entry)

import Prelude
import Data.Maybe (Maybe(..))
import Data.Traversable (traverse)
import Data.Generic (class Generic, gShow, gEq)
import Data.Foreign (readArray)
import Data.Foreign.Class(class IsForeign, readProp, read)
import Data.Foreign.Index (prop)
import Data.Foreign.NullOrUndefined(unNullOrUndefined, readNullOrUndefined)

newtype Chapter = Chapter
    { id                :: Maybe Int
    , order             :: Int
    , isInteractive     :: Boolean
    , interactiveUrl    :: String
    , interactiveData   :: String
    , stylesheet        :: String
    , title             :: String
    , content           :: String
    , releaseDate       :: Maybe ReleaseDate
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

instance chapterIsForeign :: IsForeign Chapter where
    read value = do
        id' <- readNullOrUndefined (readProp "id") value
        order <- readProp "order" value
        isInteractive <- readProp "isInteractive" value
        interactiveUrl <- readProp "interactiveUrl" value
        interactiveData <- readProp "interactiveData" value
        stylesheet <- readProp "stylesheet" value
        title <- readProp "title" value
        content <- readProp "content" value
        releaseDate <- readNullOrUndefined (\v -> prop "releaseDate" v >>= read) value
        authorsNote <- readProp "authorsNote" value
        entries <- readProp "entries" value >>= readArray >>= traverse read
        pure $ Chapter 
            { id : unNullOrUndefined id'
            , order : order
            , isInteractive : isInteractive
            , interactiveUrl : interactiveUrl
            , interactiveData : interactiveData
            , stylesheet : stylesheet
            , title : title
            , content : content
            , releaseDate : unNullOrUndefined releaseDate
            , authorsNote : authorsNote
            , entries : entries
            }