module Editor.Models.Chapter where
  
import Editor.Data.DateTime.Utils
import Prelude
import Control.Monad.Eff (Eff)
import Data.DateTime (DateTime)
import Data.DateTime.Locale (LocalDateTime, LocalValue(..))
import Data.Foreign (fail, readArray, toForeign)
import Data.Foreign.Class (class Decode, class Encode)
import Data.Foreign.Generic (defaultOptions, genericDecode, genericEncode)
import Data.Foreign.Generic.Class (encodeFields)
import Data.Foreign.NullOrUndefined (NullOrUndefined(..), readNullOrUndefined, unNullOrUndefined, undefined)
import Data.Generic.Rep (class Generic)
import Data.Generic.Rep.Eq (genericEq)
import Data.Generic.Rep.Show (genericShow)
import Data.JSDate (LOCALE)
import Data.Maybe (Maybe(..))
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (class Newtype)
import Data.StrMap (alter, insert, pop)
import Data.Traversable (traverse)
import Data.Tuple (Tuple(..))
import Editor.Data.ForeignDateTime (ForeignDateTime(..), fromDateTime, toDateTime)
import Editor.Models.Entry (Entry, LocalEntry, ServerEntry, fromServerEntry, toServerEntry, Entry)

newtype Chapter f dateTime entry = Chapter
    { id                :: f Int
    , docId             :: String
    , order             :: Int
    , isInteractive     :: Boolean
    , interactiveUrl    :: String
    , interactiveData   :: String
    , stylesheet        :: String
    , title             :: String
    , content           :: String
    , releaseDate       :: f dateTime
    , authorsNote       :: String
    , entries           :: Array entry
    }

empty :: LocalChapter
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

type LocalChapter = Chapter Maybe LocalDateTime LocalEntry
type LocalOptionalEntryChapter = Chapter Maybe LocalDateTime (Maybe LocalEntry)
type ServerChapter = Chapter NullOrUndefined ForeignDateTime ServerEntry

derive instance genericChapter :: Generic (Chapter f releaseDate entry) _
derive instance newtypeChapter :: Newtype (Chapter f releaseDate entry) _

instance showLocalChapter :: Show (Chapter Maybe (LocalValue DateTime) (Entry Maybe (LocalValue DateTime))) where
    show = genericShow

instance eqChapter :: Eq (Chapter Maybe (LocalValue DateTime) (Entry Maybe (LocalValue DateTime))) where
    eq = genericEq

instance ordChapter :: Ord (Chapter Maybe (LocalValue DateTime) (Entry Maybe (LocalValue DateTime))) where
    compare (Chapter ch1) (Chapter ch2) = compare ch1.order ch2.order


instance chapterDecode :: Decode (Chapter NullOrUndefined ForeignDateTime (Entry NullOrUndefined ForeignDateTime)) where
    decode = genericDecode defaultOptions

instance chapterEncode :: Encode (Chapter NullOrUndefined ForeignDateTime (Entry NullOrUndefined ForeignDateTime)) where
    encode = genericEncode defaultOptions

fromServerChapter :: forall eff. ServerChapter -> Eff (locale :: LOCALE | eff) LocalChapter
fromServerChapter (Chapter chapter) = do
    localReleaseDate <- case unNullOrUndefined chapter.releaseDate of
        Nothing -> pure Nothing
        Just releaseDate -> map Just $ applyLocale $ toDateTime releaseDate
    localEntries <- traverse fromServerEntry chapter.entries
    pure $ Chapter chapter { releaseDate = localReleaseDate, entries = localEntries, id = unNullOrUndefined chapter.id }
            

toServerChapter :: LocalChapter -> ServerChapter
toServerChapter (Chapter chapter) =
    Chapter chapter 
        { releaseDate = NullOrUndefined $ map (removeLocale >>> fromDateTime) chapter.releaseDate
        , id = NullOrUndefined chapter.id
        , entries = map toServerEntry chapter.entries 
        }

