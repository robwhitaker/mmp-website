module Editor.Utils.ModelHelpers where
  
import Prelude (($))
import Data.DateTime (DateTime())
import Data.Maybe (Maybe)

type CommonMetadata r = 
    { id :: Maybe Int
    , isInteractive :: Boolean
    , interactiveUrl :: String
    , interactiveData :: String
    , authorsNote :: String
    , releaseDate :: Maybe DateTime
    | r
    }

copyCommonMetadata :: forall r. CommonMetadata r -> CommonMetadata r -> CommonMetadata r
copyCommonMetadata base new =
    new 
        { id = base.id
        , isInteractive = base.isInteractive
        , interactiveUrl = base.interactiveUrl
        , interactiveData = base.interactiveData
        , authorsNote = base.authorsNote
        , releaseDate = base.releaseDate
        }

type EntryMetadata r = CommonMetadata (chapterId :: Int | r)

copyEntryMetadata :: forall r. EntryMetadata r -> EntryMetadata r -> EntryMetadata r
copyEntryMetadata base new = 
    copyCommonMetadata base $ new { chapterId = base.chapterId }