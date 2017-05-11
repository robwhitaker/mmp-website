module Editor.Models.Chapter where
  
import Prelude
import Control.Monad.Eff (Eff)
import Data.Argonaut (class DecodeJson, class EncodeJson, fail, foldJsonNull, jsonEmptyObject, toObject, (.?), (:=), (~>))
import Data.Argonaut.Decode.Combinators ((.??))
import Data.DateTime.Locale (LocalDateTime)
import Data.Generic (class Generic, gEq, gShow)
import Data.JSDate (LOCALE)
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (class Newtype)
import Data.Traversable (traverse)
import Editor.Data.DateTime.Utils (applyLocale, removeLocale)
import Editor.Data.ISODateTime (ISODateTime, fromDateTime, toDateTime)
import Editor.Models.Entry (Entry, LocalEntry, ServerEntry, fromServerEntry, toServerEntry)

type LocalChapter = Chapter LocalDateTime LocalEntry
type LocalOptionalEntryChapter = Chapter LocalDateTime (Maybe LocalEntry)
type ServerChapter = Chapter ISODateTime ServerEntry

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

empty :: forall a b. Chapter a b
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

instance showChapter :: (Generic releaseDate, Generic entry) => Show (Chapter releaseDate entry) where show = gShow
instance eqChapter :: (Generic releaseDate, Generic entry) => Eq (Chapter releaseDate entry) where eq = gEq
instance ordChapter :: (Generic releaseDate, Generic entry) => Ord (Chapter releaseDate entry) where compare (Chapter ch1) (Chapter ch2) = compare ch1.order ch2.order

instance decodeJsonServerChapter :: DecodeJson (Chapter ISODateTime (Entry ISODateTime)) where
    decodeJson json = 
        case toObject json of
            Nothing -> fail "Invalid chapter JSON."
            Just jobj -> do
                id' <- jobj .?? "id"
                docId <- jobj .? "docId"
                order <- jobj .? "order"
                isInteractive <- jobj .? "isInteractive"
                interactiveUrl <- jobj .? "interactiveUrl"
                interactiveData <- jobj .? "interactiveData"
                stylesheet <- jobj .? "stylesheet"
                title <- jobj .? "title"
                content <- jobj .? "content"
                releaseDate <- jobj .?? "releaseDate" >>= maybe (pure Nothing) (foldJsonNull (jobj .?? "releaseDate") (const $ pure Nothing))
                authorsNote <- jobj .? "authorsNote"
                entries <- jobj .? "entries"
                pure $ Chapter
                    { id : id'
                    , docId
                    , order
                    , isInteractive
                    , interactiveUrl
                    , interactiveData
                    , stylesheet
                    , title
                    , content
                    , releaseDate
                    , authorsNote
                    , entries
                    }

instance encodeJsonServerChapter :: EncodeJson (Chapter ISODateTime (Entry ISODateTime)) where
    encodeJson (Chapter chapter) = 
        "id" := chapter.id
        ~> "docId" := chapter.docId
        ~> "order" := chapter.order
        ~> "isInteractive" := chapter.isInteractive
        ~> "interactiveUrl" := chapter.interactiveUrl
        ~> "interactiveData" := chapter.interactiveData
        ~> "stylesheet" := chapter.stylesheet
        ~> "title" := chapter.title
        ~> "content" := chapter.content
        ~> "releaseDate" := chapter.releaseDate
        ~> "authorsNote" := chapter.authorsNote
        ~> "entries_attributes" := chapter.entries
        ~> jsonEmptyObject

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

