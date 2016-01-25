module Core.HTTP.Requests where

import Http
import Json.Encode as Json
import Json.Decode exposing (Decoder)
import Task exposing (Task)
import Effects exposing (Effects)

type RequestType = Post Json.Value | Get

apiRoute : String
apiRoute = "/api"

send : Maybe String -> RequestType -> Decoder value -> String -> Task Http.Error value
send secretKey reqType decoder endpoint =
    let route = apiRoute ++ endpoint
        secretKeyValue =
            secretKey |> Maybe.map Json.string |> Maybe.withDefault Json.null
    in
        case reqType of
            Post payload ->
                Http.post
                    decoder
                    route
                    (Http.string <| Json.encode 0 <| Json.object [("data", payload), ("secretKey", secretKeyValue)])

            Get ->
                Http.get decoder route

toEffect : (success -> action) -> (error -> action) -> Task error success -> Effects action
toEffect onSuccess onError task =
    task
    |> Task.toResult
    |> Task.map (\result ->
        case result of
            Ok val -> onSuccess val
            Err val -> onError val
        )
    |> Effects.task
