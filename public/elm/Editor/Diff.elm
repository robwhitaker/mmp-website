module Editor.Diff where

import Dict

import Json.Encode as Json

import Core.Models.Chapter as Chapter exposing (Chapter)
import Core.Models.Entry as Entry exposing (Entry)

type alias DiffRecord =
    { update : List Chapter
    , delete : List Int
    }

-- Diffs lists of chapters. Does not handle chapter creation.
chapterList : List Chapter -> List Chapter -> DiffRecord
chapterList oldChList newChList =
    let
        newChDict =
            Dict.fromList <| List.map (\chapter -> (Maybe.withDefault -1 chapter.id, chapter)) newChList
    in
        { update =
            oldChList
            |> List.filter (\old ->
                Dict.get (Maybe.withDefault -1 old.id) newChDict `Maybe.andThen`
                    (\new -> Just (old /= new))
                |> Maybe.withDefault False
            )
            |> List.filterMap (\{ id } ->
                let oldId = Maybe.withDefault -1 id
                in Dict.get oldId newChDict
            )
        , delete =
            List.filter (\old ->
                Dict.get (Maybe.withDefault -1 old.id) newChDict == Nothing
            ) oldChList
            |> List.map (.id >> Maybe.withDefault -1)
        }
