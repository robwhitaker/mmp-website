module Editor.Models.Entry where

import Prelude
import Control.Alternative (class Plus)
import Control.Monad.Eff (Eff)
import Control.Monad.Maybe.Trans (runMaybeT)
import Data.DateTime (DateTime)
import Data.DateTime.Locale (LocalDateTime, LocalValue(..), Locale(..))
import Data.Foreign.Class (class Decode, class Encode, decode)
import Data.Foreign.Generic (defaultOptions, genericDecode, genericDecodeJSON, genericEncode)
import Data.Foreign.Index (readProp, (!))
import Data.Foreign.NullOrUndefined (NullOrUndefined(..), readNullOrUndefined, unNullOrUndefined)
import Data.Generic.Rep (class Generic)
import Data.Generic.Rep.Eq (genericEq)
import Data.Generic.Rep.Show (genericShow)
import Data.JSDate (LOCALE, getTimezoneOffset)
import Data.Maybe (fromMaybe)
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (class Newtype, unwrap)
import Data.Time.Duration (Minutes(..))
import Editor.Data.DateTime.Utils (applyLocale, removeLocale)
import Editor.Data.ForeignDateTime (ForeignDateTime(..), fromDateTime, toDateTime)
import Halogen.HTML.Properties.ARIA (level)

newtype Entry f dateTime = Entry
    { id                :: f Int
    , chapterId         :: Int
    , level             :: Int
    , order             :: Int
    , isInteractive     :: Boolean
    , interactiveUrl    :: String
    , interactiveData   :: String
    , title             :: String
    , content           :: String
    , releaseDate       :: f dateTime
    , authorsNote       :: String
    }

empty :: LocalEntry
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

type LocalEntry = Entry Maybe LocalDateTime

derive instance genericLocalEntry :: Generic (Entry f dateTime) _
derive instance newtypeLocalEntry :: Newtype (Entry f dateTime) _

instance showLocalEntry :: Show (Entry Maybe (LocalValue DateTime)) where
    show = genericShow

instance eqLocalEntry :: Eq (Entry Maybe (LocalValue DateTime)) where
    eq = genericEq

instance ordLocalEntry :: Ord (Entry Maybe (LocalValue DateTime)) where
    compare (Entry e1) (Entry e2) = compare e1.order e2.order

type ServerEntry = Entry NullOrUndefined ForeignDateTime

instance serverEntryDecode :: Decode (Entry NullOrUndefined ForeignDateTime) where
    decode = genericDecode defaultOptions

instance serverEntryEncode :: Encode (Entry NullOrUndefined ForeignDateTime) where
    encode = genericEncode defaultOptions

fromServerEntry :: forall eff. ServerEntry -> Eff (locale :: LOCALE | eff) LocalEntry
fromServerEntry (Entry entry) =
    case unNullOrUndefined entry.releaseDate of
        Nothing -> pure (Entry entry { releaseDate = Nothing, id = unNullOrUndefined entry.id })
        Just releaseDate -> do
            localReleaseDate <- applyLocale $ toDateTime releaseDate
            pure $ Entry entry { releaseDate = Just localReleaseDate, id = unNullOrUndefined entry.id }

toServerEntry :: LocalEntry -> ServerEntry
toServerEntry (Entry entry) =
    Entry entry 
        { releaseDate = NullOrUndefined $ map (removeLocale >>> fromDateTime) entry.releaseDate
        , id = NullOrUndefined entry.id 
        }

