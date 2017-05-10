module Editor.Utils.Requests where

import Prelude
import Control.Monad.Except (runExcept, withExcept)
import Data.Argonaut.Core (Json)
import Data.Either (Either)
import Data.Foreign (unsafeFromForeign)
import Data.Foreign.Class (class Decode, class Encode, decode, encode)
import Data.Foreign.Generic (defaultOptions, genericEncode)
import Data.Foreign.NullOrUndefined (NullOrUndefined(..))
import Data.Generic.Rep (class Generic)
import Data.Maybe (Maybe(..), maybe)
import Data.String (joinWith)
import Editor.Models.Chapter (ServerChapter)
import Network.HTTP.Affjax (Affjax, URL, get, post)

---- REQUESTS ----

getChapters :: forall e. Affjax e (Either String (Array ServerChapter))
getChapters = getRequest chaptersEndpoint

postChapters :: forall e. String -> Affjax e (Either String (Array ServerChapter))
postChapters secretKey = postRequest chaptersEndpoint secretKey (Nothing :: Maybe String)

crupdate :: forall e. String -> ServerChapter -> Affjax e (Either String Int)
crupdate secretKey chapter = postRequest chapterUpdateEndpoint secretKey (Just chapter)

deleteChapter :: forall e. String -> Int -> Affjax e (Either String Int)
deleteChapter secretKey chapterId = postRequest chapterDeleteEndpoint secretKey (Just chapterId)

getChapterHtmlFromGDocs :: forall e. String -> String -> Affjax e String
getChapterHtmlFromGDocs accessToken fileId = do 
    get $ joinWith "" ["https://www.googleapis.com/drive/v3/files/", fileId, "/export?access_token=", accessToken, "&mimeType=text/html"]

---- REQUEST HELPERS ----

getRequest :: forall e r. Decode r => URL -> Affjax e (Either String r)
getRequest endpoint = do
    affjaxResponse <- get endpoint
    pure $ affjaxResponse { response = runExcept $ withExcept show $ decode affjaxResponse.response }

postRequest :: forall a e r. Encode a => Decode r => URL -> String -> Maybe a -> Affjax e (Either String r)
postRequest endpoint secretKey postData = do
    affjaxResponse <- post endpoint (unsafeFromForeign (encode payload) :: Json)
    pure $ affjaxResponse { response = runExcept $ withExcept show $ decode affjaxResponse.response }
  where 
    payload = PostData
        { secretKey : secretKey
        , "data" : NullOrUndefined postData
        }

---- ENDPOINTS ----

apiBase :: String
apiBase = "/api"

-- supports GET and POST
chaptersEndpoint :: String
chaptersEndpoint = apiBase <> "/chapters"

-- supports POST
chapterUpdateEndpoint :: String
chapterUpdateEndpoint = chaptersEndpoint <> "/crupdate"

-- supports POST
chapterDeleteEndpoint :: String
chapterDeleteEndpoint = chaptersEndpoint <> "/delete"

-- supports GET
singleChapterEndpoint :: Int -> String
singleChapterEndpoint cId = chaptersEndpoint <> "/" <> show cId

-- supports GET
nextReleaseEndpoint :: String
nextReleaseEndpoint = apiBase <> "/next"

-- post data

newtype PostData a = PostData
    { secretKey :: String
    , data :: a        
    }

derive instance genericPostData :: Generic (PostData a) _
instance encodePostData :: Encode a => Encode (PostData a) where
    encode = genericEncode defaultOptions

