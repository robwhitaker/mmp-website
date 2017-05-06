module Editor.Models.Chapter where
  
import Control.Monad.Eff (Eff)
import Data.DateTime.Locale (LocalDateTime, LocalValue(..))
import Data.JSDate (LOCALE)
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Editor.Data.ForeignDateTime (ForeignDateTime(..), fromDateTime, toDateTime)
import Editor.Models.Entry (Entry, LocalEntry, ServerEntry, fromServerEntry, toServerEntry, Entry)
import Editor.Data.DateTime.Utils

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

newtype Chapter dateTime entry = Chapter
    { id                :: Maybe Int
    , docId             :: String
    , order             :: Int
    , isInteractive     :: Boolean
    , interactiveUrl    :: String
    , interactiveData   :: String
    , stylesheet        :: String
    , title             :: String
    , content           :: String
    , releaseDate       :: Maybe dateTime
    , authorsNote       :: String
    , entries           :: Array entry
    }

empty :: forall dateTime entry. Chapter dateTime entry
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

derive instance genericChapter :: (Generic releaseDate, Generic entry) => Generic (Chapter releaseDate entry)
derive instance newtypeChapter :: Newtype (Chapter releaseDate entry) _

instance showChapter :: (Generic releaseDate, Generic entry) => Show (Chapter releaseDate entry) where
    show = gShow

instance eqChapter :: (Generic releaseDate, Generic entry) => Eq (Chapter releaseDate entry) where
    eq = gEq

instance ordChapter :: (Generic releaseDate, Generic entry) => Ord (Chapter releaseDate entry) where
    compare (Chapter ch1) (Chapter ch2) = compare ch1.order ch2.order

type LocalChapter = Chapter LocalDateTime LocalEntry
type LocalOptionalEntryChapter = Chapter LocalDateTime (Maybe LocalEntry)
type ServerChapter = Chapter ForeignDateTime ServerEntry

instance chapterIsForeign :: IsForeign (Chapter ForeignDateTime (Entry ForeignDateTime)) where
    read value = do
        id' <- readProp "id" value
        docId <- readProp "docId" value
        order <- readProp "order" value
        isInteractive <- readProp "isInteractive" value
        interactiveUrl <- readProp "interactiveUrl" value
        interactiveData <- readProp "interactiveData" value
        stylesheet <- readProp "stylesheet" value
        title <- readProp "title" value
        content <- readProp "content" value
        releaseDate <- prop "releaseDate" value >>= readNullOrUndefined read
        authorsNote <- readProp "authorsNote" value
        entries <- readProp "entries" value >>= readArray >>= traverse read
        pure $ Chapter 
            { id : Just id'
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

instance chapterAsForeign :: AsForeign (Chapter ForeignDateTime (Entry ForeignDateTime)) where
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
            , "releaseDate" .= maybe writeNull write chapter.releaseDate
            , "authorsNote" .= chapter.authorsNote
            , "entries_attributes" .= chapter.entries
            ]

fromServerChapter :: forall eff. ServerChapter -> Eff (locale :: LOCALE | eff) LocalChapter
fromServerChapter (Chapter chapter) = do
    localReleaseDate <- case chapter.releaseDate of
        Nothing -> pure Nothing
        Just releaseDate -> map Just $ applyLocale $ toDateTime releaseDate
    localEntries <- traverse fromServerEntry chapter.entries
    pure $ Chapter chapter { releaseDate = localReleaseDate, entries = localEntries }
            

toServerChapter :: LocalChapter -> ServerChapter
toServerChapter (Chapter chapter) =
    Chapter chapter 
        { releaseDate = map (removeLocale >>> fromDateTime) chapter.releaseDate
        , entries = map toServerEntry chapter.entries 
        }

