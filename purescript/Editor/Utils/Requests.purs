module Editor.Utils.Requests where
  
import Editor.Models.Chapter (Chapter)
import Editor.Models.Entry (Entry)
import Network.HTTP.Affjax.Response (class Respondable)

import Prelude
import Control.Monad.Aff (Aff)
import Data.Either (Either, either)
import Data.Argonaut.Core (Json)
import Data.Argonaut.Encode(class EncodeJson)
import Data.Argonaut.Encode.Combinators ((:=),(~>))
import Data.Argonaut.Generic.Aeson (decodeJson)
import Network.HTTP.Affjax (AJAX, Affjax, AffjaxResponse, get, post)

getChapters :: forall e. Aff (ajax :: AJAX | e) (AffjaxResponse (Either String (Array Chapter)))
getChapters = do 
    affjaxResponse <- get chaptersEndpoint
    pure $ affjaxResponse { response = decodeJson affjaxResponse.response }

---- REQUEST HELPERS ----

postRequest :: forall a e r. (EncodeJson a, Respondable r) => String -> String -> a -> Affjax e r
postRequest endpoint secretKey postData = post endpoint payload
  where 
    payload = 
        "secretKey" := secretKey
        ~> "data" := postData

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

