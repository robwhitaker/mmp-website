module Editor.Utils.Requests where

import Prelude
import Data.Argonaut (class DecodeJson, class EncodeJson, decodeJson, encodeJson, jsonEmptyObject, jsonSingletonObject, (:=), (~>))
import Data.Either (Either, either)
import Data.Maybe (Maybe(..))
import Data.String (joinWith)
import Editor.Models.Chapter (ServerChapter)
import Editor.Utils.GoogleServices (AccessToken, DriveReadOnlyScope, EmailScope, IdToken, ProfileScope, fromAccessToken, fromIdToken)
import Network.HTTP.Affjax (Affjax, URL, get, post)

---- REQUESTS ----

getChapters :: forall e. Affjax e (Either String (Array ServerChapter))
getChapters = getRequest chaptersEndpoint

postChapters :: forall e. Affjax e (Either String (Array ServerChapter))
postChapters = postRequest chaptersEndpoint (Nothing :: Maybe String)

crupdate :: forall e. ServerChapter -> Affjax e (Either String Int)
crupdate chapter = postRequest chapterUpdateEndpoint (Just chapter)

deleteChapter :: forall e. Int -> Affjax e (Either String Int)
deleteChapter chapterId = postRequest chapterDeleteEndpoint (Just chapterId)

authorize :: forall scopes e. IdToken (profile :: ProfileScope, email :: EmailScope | scopes) -> Affjax e Int
authorize idToken = do
    affjaxResponse <- post authorizeEndpoint (fromIdToken idToken)
    pure $ affjaxResponse { response = either (const 0) id (decodeJson affjaxResponse.response) }

getChapterHtmlFromGDocs :: forall scopes e. AccessToken (driveReadOnly :: DriveReadOnlyScope | scopes) -> String -> Affjax e String
getChapterHtmlFromGDocs accessToken fileId = do 
    get $ joinWith "" ["https://www.googleapis.com/drive/v3/files/", fileId, "/export?access_token=", fromAccessToken accessToken, "&mimeType=text/html"]

---- REQUEST HELPERS ----

getRequest :: forall e r. DecodeJson r => URL -> Affjax e (Either String r)
getRequest endpoint = do
    affjaxResponse <- get endpoint
    pure $ affjaxResponse { response = decodeJson affjaxResponse.response }

postRequest :: forall a e r. EncodeJson a => DecodeJson r => URL -> Maybe a -> Affjax e (Either String r)
postRequest endpoint postData = do
    affjaxResponse <- post endpoint (jsonSingletonObject "data" $ encodeJson postData)
    pure $ affjaxResponse { response = decodeJson affjaxResponse.response }

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

-- supports POST
authorizeEndpoint :: String
authorizeEndpoint = apiBase <> "/auth"

