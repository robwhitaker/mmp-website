module Core.HTTP.Requests exposing (mkRequest, RequestType(..))

import Http
import Json.Encode as Json
import Json.Decode exposing (Decoder)
import Task exposing (Task)

type RequestType = Post Json.Value | Get

apiRoute : String
apiRoute = "/api"

mkRequest : Maybe String -> RequestType -> Decoder value -> String -> Http.Request value
mkRequest secretKey reqType decoder endpoint =
    let route = apiRoute ++ endpoint
        secretKeyValue =
            secretKey |> Maybe.map Json.string |> Maybe.withDefault Json.null
    in
        case reqType of
            Post payload ->
                Http.post
                    route
                    (Http.stringBody "application/json" <| Json.encode 0 <| Json.object [("data", payload), ("secretKey", secretKeyValue)])
                    decoder

            Get ->
                Http.get route decoder
