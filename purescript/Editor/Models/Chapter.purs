module Editor.Models.Chapter where
  
import Data.Newtype (class Newtype)
import Editor.Data.ForeignDateTime (fromDateTime, toDateTime)
import Editor.Models.Entry (Entry)

import Prelude
import Data.Maybe (Maybe(..), maybe)
import Data.DateTime (DateTime)
import Data.Traversable (traverse)
import Data.Generic (class Generic, gShow, gEq)
import Data.Foreign (readArray, toForeign, writeObject)
import Data.Foreign.Class(class IsForeign, class AsForeign, (.=), readProp, read, write)
import Data.Foreign.Index (prop)
import Data.Foreign.Null (writeNull)
import Data.Foreign.NullOrUndefined(unNullOrUndefined, readNullOrUndefined)

newtype Chapter = Chapter
    { id                :: Maybe Int
    , docId             :: String
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
    , docId : ""
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

derive instance newtypeChapter :: Newtype Chapter _

instance showChapter :: Show Chapter where
    show = gShow

instance eqChapter :: Eq Chapter where
    eq = gEq

instance ordChapter :: Ord Chapter where
    compare (Chapter ch1) (Chapter ch2) = compare ch1.order ch2.order

instance chapterIsForeign :: IsForeign Chapter where
    read value = do
        id' <- readNullOrUndefined (readProp "id") value
        docId <- readProp "docId" value
        order <- readProp "order" value
        isInteractive <- readProp "isInteractive" value
        interactiveUrl <- readProp "interactiveUrl" value
        interactiveData <- readProp "interactiveData" value
        stylesheet <- readProp "stylesheet" value
        title <- readProp "title" value
        content <- readProp "content" value
        releaseDate <- readNullOrUndefined (\v -> prop "releaseDate" v >>= read >>= pure <<< toDateTime) value
        authorsNote <- readProp "authorsNote" value
        entries <- readProp "entries" value >>= readArray >>= traverse read
        pure $ Chapter 
            { id : unNullOrUndefined id'
            , docId : docId
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

instance chapterAsForeign :: AsForeign Chapter where
    write (Chapter chapter) = 
        writeObject
            [ "id" .= maybe writeNull toForeign chapter.id
            , "docId" .= chapter.docId
            , "order" .= chapter.order
            , "isInteractive" .= chapter.isInteractive
            , "interactiveUrl" .= chapter.interactiveUrl
            , "interactiveData" .= chapter.interactiveData
            , "stylesheet" .= chapter.stylesheet
            , "title" .= chapter.title
            , "content" .= chapter.content
            , "releaseDate" .= maybe writeNull (write <<< fromDateTime) chapter.releaseDate
            , "authorsNote" .= chapter.authorsNote
            , "entries_attributes" .= chapter.entries
            ]

