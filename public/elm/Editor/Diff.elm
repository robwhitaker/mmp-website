module Editor.Diff where

import Dict

import Json.Encode as Json

import Core.Models.Chapter as Chapter exposing (Chapter)
import Core.Models.Entry as Entry exposing (Entry)

type Diff a = Create a | Update a | Delete a

type alias DiffRecord =
    { chapter :
        { update : List Chapter
        , delete : List Chapter
        }
    , entry :
        { update : List Entry
        , create : List Entry
        , delete : List Entry
        }
    }

unwrap : Diff a -> a
unwrap diff =
    case diff of
        Create val -> val
        Update val -> val
        Delete val -> val

isUpdate : Diff a -> Bool
isUpdate diff =
    case diff of
        Update _ -> True
        _ -> False

isCreate : Diff a -> Bool
isCreate diff =
    case diff of
        Create _ -> True
        _ -> False

isDelete : Diff a -> Bool
isDelete diff =
    case diff of
        Delete _ -> True
        _ -> False

-- Diffs chapters. Does not handle incorrect chapter ids.
chapter : Chapter -> Maybe Chapter -> (List (Diff Chapter), List (Diff Entry))
chapter old maybeNew =
    case maybeNew of
        Nothing -> ([Delete old], [])
        Just new ->
            let (newlyCreatedEntries, preexistingEntries) =
                    List.partition (.id >> (==) Nothing) new.entries_

                init =
                    if { old | entries_ = [] } == { new | entries_ = [] }
                    then ([], List.map Create newlyCreatedEntries)
                    else ([Update new], List.map Create newlyCreatedEntries)

                newEntries =
                    Dict.fromList <| List.map (\entry -> (Maybe.withDefault -1 entry.id, entry)) preexistingEntries
            in
                List.foldl
                    (\oldEntry (cDiff, eDiff) ->
                        case Dict.get (Maybe.withDefault -1 oldEntry.id) newEntries of
                            Nothing ->
                                (cDiff, Delete oldEntry :: eDiff)

                            Just newEntry ->
                                (cDiff, if oldEntry == newEntry then eDiff else Update newEntry :: eDiff)
                    )
                    init
                    old.entries_

-- Diffs lists of chapters. Does not handle chapter creation.
chapterList : List Chapter -> List Chapter -> (List (Diff Chapter), List (Diff Entry))
chapterList oldChList newChList =
    let
        newChDict =
            Dict.fromList <| List.map (\chapter -> (Maybe.withDefault -1 chapter.id, chapter)) newChList
    in
        oldChList
        |> List.map
            (\old -> chapter old <| Dict.get (Maybe.withDefault -1 old.id) newChDict)
        |> List.foldl
            (\(cDiff, eDiff) (cDiffAcc, eDiffAcc) -> (cDiffAcc ++ cDiff, eDiffAcc ++ eDiff) )
            ([],[])

-- Convert previous output to a diff record
toDiffRecord : (List (Diff Chapter), List (Diff Entry)) -> DiffRecord
toDiffRecord (cDiff, eDiff) =
    { chapter =
        { update = List.map (unwrap >> (\c -> { c | entries_ = [] })) <| List.filter isUpdate cDiff
        , delete = List.map (unwrap >> (\c -> { c | entries_ = [] })) <| List.filter isDelete cDiff
        }
    , entry =
        { update = List.map unwrap <| List.filter isUpdate eDiff
        , create = List.map unwrap <| List.filter isCreate eDiff
        , delete = List.map unwrap <| List.filter isDelete eDiff
        }
    }

-- JSON Encoder
encode : DiffRecord -> Json.Value
encode diff =
    let
        chUpdates = List.map Chapter.encode diff.chapter.update
        chDeletes = List.map Chapter.encode diff.chapter.delete

        eUpdates = List.map Entry.encode diff.entry.update
        eCreates = List.map Entry.encode diff.entry.create
        eDeletes = List.map Entry.encode diff.entry.delete

        chapterVal =
            Json.object [("update", Json.list chUpdates), ("delete", Json.list chDeletes)]

        entryVal =
            Json.object [("update", Json.list eUpdates), ("delete", Json.list eDeletes), ("create", Json.list eCreates)]
    in
        Json.object [("chapters", chapterVal), ("entries", entryVal)]

c = Chapter.empty
e = Entry.empty

e1 = { e | id = Just 1, content = "dingle dongle doodly" }
e2 = { e | id = Just 2, content = "whatever" }
e3 = { e | id = Just 3 }
e4 = { e3 | content = "actual content" }

c1 = { c | id = Just 1, content = "test", entries_ = [e1, e3] }

c2 = { c1 | content ="change", entries_ = [ e, e2, e4 ] }

c3 = { c | id = Just 10 }

c4 = { c3 | content = "updated content" }
