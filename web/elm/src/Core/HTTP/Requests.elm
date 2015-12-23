module Core.HTTP.Requests where

import Http
import Json.Decode as Json
import Task exposing (Task)
import Core.Models.Chapter as Chapter exposing (Chapter)

domain : String
domain = "http://example.com"

postEditChapter : Maybe Int -> Task Http.Error Chapter
postEditChapter maybeId =
    let route =
        maybeId
        |> Maybe.map toString
        |> Maybe.withDefault "new"
        |> (++) "/"
    in
        Http.post (Chapter.decoder) (domain ++ "/chapter" ++ route) Http.empty
