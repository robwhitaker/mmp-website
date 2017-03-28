module Editor.Utils.Requests where
  
import Prelude
import Network.HTTP.Affjax (AJAX, Affjax, get)

newtype Endpoint = Endpoint String

pathJoin :: Endpoint -> Endpoint -> Endpoint
pathJoin (Endpoint a) (Endpoint b) = Endpoint $ a <> "/" <> b

infixr 5 pathJoin as </>

apiBase :: Endpoint
apiBase = Endpoint "/api"

chaptersEndpoint :: Endpoint
chaptersEndpoint = apiBase </> Endpoint "chapters"

updateChapterEndpoint :: Endpoint
updateChapterEndpoint = apiBase </> chaptersEndpoint </> Endpoint "crupdate"

deleteChapterEndpoint :: Endpoint
deleteChapterEndpoint = apiBase </> chaptersEndpoint </> Endpoint "delete"

nextEndpoint :: Endpoint
nextEndpoint = apiBase </> Endpoint "next"

getChapters :: forall e. Affjax e String
getChapters = (\(Endpoint chEndpoint) -> get chEndpoint) chaptersEndpoint

