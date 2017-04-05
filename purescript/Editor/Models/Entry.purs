module Editor.Models.Entry where

import Editor.Data.ReleaseDate

import Prelude
import Data.Generic (class Generic, gShow, gEq)
import Data.Maybe (Maybe(..))
import Data.Foreign.Class(class IsForeign, readProp, read)
import Data.Foreign.Index (prop)
import Data.Foreign.NullOrUndefined(unNullOrUndefined, readNullOrUndefined)

newtype Entry = Entry
    { id                :: Maybe Int
    , chapterId         :: Int
    , order             :: Int
    , isInteractive     :: Boolean
    , interactiveUrl    :: String
    , interactiveData   :: String
    , title             :: String
    , content           :: String
    , releaseDate       :: Maybe ReleaseDate
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

instance entryIsForeign :: IsForeign Entry where
    read value = do
        id' <- readNullOrUndefined (readProp "id") value
        chapterId <- readProp "chapterId" value
        order <- readProp "order" value
        isInteractive <- readProp "isInteractive" value
        interactiveUrl <- readProp "interactiveUrl" value
        interactiveData <- readProp "interactiveData" value
        title <- readProp "title" value
        content <- readProp "content" value
        releaseDate <- readNullOrUndefined (\v -> prop "releaseDate" v >>= read) value
        authorsNote <- readProp "authorsNote" value
        pure $ Entry
            { id : unNullOrUndefined id'
            , chapterId : chapterId
            , order : order
            , isInteractive : isInteractive
            , interactiveUrl : interactiveUrl
            , interactiveData : interactiveData
            , title : title
            , content : content
            , releaseDate : unNullOrUndefined releaseDate
            , authorsNote : authorsNote
            }