module Editor.Models.Entry where

import Prelude
import Control.Alternative (class Plus)
import Control.Monad.Eff (Eff)
import Control.Monad.Maybe.Trans (runMaybeT)
import Data.Argonaut (class DecodeJson, class EncodeJson, fail, foldJsonNull, jsonEmptyObject, toObject, (.?), (:=), (~>))
import Data.Argonaut.Decode.Class (decodeJson)
import Data.Argonaut.Decode.Combinators ((.??))
import Data.DateTime (DateTime)
import Data.DateTime.Locale (LocalDateTime, LocalValue(..), Locale(..))
import Data.Generic (class Generic, gEq, gShow)
import Data.JSDate (LOCALE, getTimezoneOffset)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (class Newtype, unwrap)
import Data.Time.Duration (Minutes(..))
import Editor.Data.DateTime.Utils (applyLocale, removeLocale)
import Editor.Data.ISODateTime (ISODateTime(..), fromDateTime, toDateTime)

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

derive instance genericLocalEntry :: Generic dateTime => Generic (Entry dateTime)
derive instance newtypeLocalEntry :: Newtype (Entry dateTime) _

instance showLocalEntry :: Show (Entry (LocalValue DateTime)) where show = gShow
instance eqLocalEntry :: Eq (Entry (LocalValue DateTime)) where eq = gEq
instance ordLocalEntry :: Ord (Entry (LocalValue DateTime)) where compare (Entry e1) (Entry e2) = compare e1.order e2.order

type ServerEntry = Entry ISODateTime

instance decodeJsonServerEntry :: DecodeJson (Entry ISODateTime) where
    decodeJson json = case toObject json of
        Nothing -> fail "Invalid entry JSON."
        Just jobj -> do
            id' <- jobj .?? "id"
            chapterId <- jobj .? "chapterId"
            level <- jobj .? "level"
            order <- jobj .? "order"
            isInteractive <- jobj .? "isInteractive"
            interactiveUrl <- jobj .? "interactiveUrl"
            interactiveData <- jobj .? "interactiveData"
            title <- jobj .? "title"
            content <- jobj .? "content"
            releaseDate <- jobj .?? "releaseDate" >>= maybe (pure Nothing) (foldJsonNull (jobj .?? "releaseDate") (const $ pure Nothing))
            authorsNote <- jobj .? "authorsNote"
            pure $ Entry
                { id : id'
                , chapterId
                , level
                , order
                , isInteractive
                , interactiveUrl
                , interactiveData
                , title
                , content
                , releaseDate
                , authorsNote
                } 

instance encodeJsonServerEntry :: EncodeJson (Entry ISODateTime) where
    encodeJson (Entry entry) = 
        "id" := entry.id
        ~> "chapterId" := entry.chapterId
        ~> "level" := entry.level
        ~> "order" := entry.order
        ~> "isInteractive" := entry.isInteractive
        ~> "interactiveUrl" := entry.interactiveUrl
        ~> "interactiveData" := entry.interactiveData
        ~> "title" := entry.title
        ~> "content" := entry.content
        ~> "releaseDate" := entry.releaseDate
        ~> "authorsNote" := entry.authorsNote
        ~> jsonEmptyObject
        

fromServerEntry :: forall eff. ServerEntry -> Eff (locale :: LOCALE | eff) LocalEntry
fromServerEntry (Entry entry) =
    case entry.releaseDate of
        Nothing -> pure (Entry entry { releaseDate = Nothing })
        Just releaseDate -> do
            localReleaseDate <- applyLocale $ toDateTime releaseDate
            pure $ Entry entry { releaseDate = Just localReleaseDate }

toServerEntry :: LocalEntry -> ServerEntry
toServerEntry (Entry entry) =
    Entry entry 
        { releaseDate = map (removeLocale >>> fromDateTime) entry.releaseDate }

