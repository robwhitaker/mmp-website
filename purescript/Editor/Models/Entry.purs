module Editor.Models.Entry where

import Editor.Data.ForeignDateTime (fromDateTime, toDateTime)

import Prelude
import Data.Generic (class Generic, gShow, gEq)
import Data.Maybe (Maybe(..), maybe)
import Data.DateTime (DateTime)
import Data.Foreign (toForeign, writeObject)
import Data.Foreign.Class(class IsForeign, class AsForeign, (.=), readProp, read, write)
import Data.Foreign.Index (prop)
import Data.Foreign.Null (writeNull)
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
        releaseDate <- readNullOrUndefined (\v -> prop "releaseDate" v >>= read >>= pure <<< toDateTime) value
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

instance entryAsForeign :: AsForeign Entry where
    write (Entry entry) = 
        writeObject
            [ "id" .= maybe writeNull toForeign entry.id
            , "chapterId" .= entry.chapterId
            , "order" .= entry.order
            , "isInteractive" .= entry.isInteractive
            , "interactiveUrl" .= entry.interactiveUrl
            , "interactiveData" .= entry.interactiveData
            , "title" .= entry.title
            , "content" .= entry.content
            , "releaseDate" .= maybe writeNull (write <<< fromDateTime) entry.releaseDate
            , "authorsNote" .= entry.authorsNote
            ]
