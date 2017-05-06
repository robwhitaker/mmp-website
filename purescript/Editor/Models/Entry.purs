module Editor.Models.Entry where

import Control.Monad.Eff (Eff)
import Control.Monad.Maybe.Trans (runMaybeT)
import Data.DateTime.Locale (LocalDateTime, LocalValue(..), Locale(..))
import Data.JSDate (LOCALE, getTimezoneOffset)
import Data.Maybe (fromMaybe)
import Data.Newtype (class Newtype, unwrap)
import Data.Time.Duration (Minutes(..))
import Editor.Data.ForeignDateTime (ForeignDateTime(..), fromDateTime, toDateTime)
import Editor.Data.DateTime.Utils (applyLocale, removeLocale)
import Halogen.HTML.Properties.ARIA (level)

import Prelude
import Data.Generic (class Generic, gShow, gEq)
import Data.Maybe (Maybe(..), maybe)
import Data.DateTime (DateTime)
import Data.Foreign (toForeign, writeObject)
import Data.Foreign.Class(class IsForeign, class AsForeign, (.=), readProp, read, write)
import Data.Foreign.Index (prop)
import Data.Foreign.Null (writeNull)
import Data.Foreign.NullOrUndefined(unNullOrUndefined, readNullOrUndefined)

newtype Entry dateTime = Entry
    { id                :: Maybe Int
    , chapterId         :: Int
    , level             :: Int
    , order             :: Int
    , isInteractive     :: Boolean
    , interactiveUrl    :: String
    , interactiveData   :: String
    , title             :: String
    , content           :: String
    , releaseDate       :: Maybe dateTime
    , authorsNote       :: String
    }


empty :: forall a. Entry a
empty = Entry
    { id : Nothing
    , chapterId : -1
    , level : -1
    , order : -1
    , isInteractive : false
    , interactiveUrl : ""
    , interactiveData : ""
    , title : ""
    , content : ""
    , releaseDate : Nothing 
    , authorsNote : ""
    }

type LocalEntry = Entry LocalDateTime

derive instance genericLocalEntry :: Generic (Entry (LocalValue DateTime))
derive instance newtypeLocalEntry :: Newtype (Entry (LocalValue DateTime)) _

instance showLocalEntry :: Show (Entry (LocalValue DateTime)) where
    show = gShow

instance eqLocalEntry :: Eq (Entry (LocalValue DateTime)) where
    eq = gEq

instance ordLocalEntry :: Ord (Entry (LocalValue DateTime)) where
    compare (Entry e1) (Entry e2) = compare e1.order e2.order

type ServerEntry = Entry ForeignDateTime

instance serverEntryIsForeign :: IsForeign (Entry ForeignDateTime) where
    read value = do
        id' <- readProp "id" value
        chapterId <- readProp "chapterId" value
        level <- readProp "level" value
        order <- readProp "order" value
        isInteractive <- readProp "isInteractive" value
        interactiveUrl <- readProp "interactiveUrl" value
        interactiveData <- readProp "interactiveData" value
        title <- readProp "title" value
        content <- readProp "content" value
        releaseDate <- prop "releaseDate" value >>= readNullOrUndefined read
        authorsNote <- readProp "authorsNote" value
        pure $ Entry
            { id : Just id'
            , chapterId : chapterId
            , level : level
            , order : order
            , isInteractive : isInteractive
            , interactiveUrl : interactiveUrl
            , interactiveData : interactiveData
            , title : title
            , content : content
            , releaseDate : unNullOrUndefined releaseDate
            , authorsNote : authorsNote
            }

instance serverEntryAsForeign :: AsForeign (Entry ForeignDateTime) where
    write (Entry entry) = 
        writeObject
            [ "id" .= maybe writeNull toForeign entry.id
            , "chapterId" .= entry.chapterId
            , "level" .= entry.level
            , "order" .= entry.order
            , "isInteractive" .= entry.isInteractive
            , "interactiveUrl" .= entry.interactiveUrl
            , "interactiveData" .= entry.interactiveData
            , "title" .= entry.title
            , "content" .= entry.content
            , "releaseDate" .= maybe writeNull write entry.releaseDate
            , "authorsNote" .= entry.authorsNote
            ]

fromServerEntry :: forall eff. ServerEntry -> Eff (locale :: LOCALE | eff) LocalEntry
fromServerEntry (Entry entry) =
    case entry.releaseDate of
        Nothing -> pure (Entry entry { releaseDate = Nothing })
        Just releaseDate -> do
            localReleaseDate <- applyLocale $ toDateTime releaseDate
            pure $ Entry entry { releaseDate = Just localReleaseDate }

toServerEntry :: LocalEntry -> ServerEntry
toServerEntry (Entry entry) =
    Entry entry { releaseDate = map (removeLocale >>> fromDateTime) entry.releaseDate }