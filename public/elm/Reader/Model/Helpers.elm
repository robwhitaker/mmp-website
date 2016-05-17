module Reader.Model.Helpers exposing (..)

import Dict exposing (Dict)

import Reader.Model exposing (..)
import Reader.Aliases exposing (..)
import Reader.Utils.Disqus exposing (toDisqusId)

import Core.Utils.Either exposing (..)
import Core.Utils.SelectionList as SL exposing (SelectionList)

import Core.Models.Chapter exposing (Chapter)
import Core.Models.Entry exposing (Entry)

toRenderElement : Either Chapter Entry -> Dict RenderElementID Bool -> RenderElement
toRenderElement item readEntries =
    let
        idToString : String -> Maybe Int -> String
        idToString pre maybeId = pre ++ toString (Maybe.withDefault -1 maybeId)
    in
        case item of
            Left chapter ->
                { emptyRenderElement
                | id = idToString "c" chapter.id
                , disqusId = toDisqusId (idToString "c" chapter.id)
                , heading = chapter.title
                , body = chapter.content
                , authorsNote = chapter.authorsNote
                , chapter = Maybe.withDefault -1 chapter.id
                , level = 0
                , releaseDate = chapter.releaseDate
                , isRead = Maybe.withDefault False (Dict.get (idToString "c" chapter.id) readEntries)
                }
            Right entry ->
                { emptyRenderElement
                | id = idToString "e" entry.id
                , disqusId = toDisqusId (idToString "e" entry.id)
                , heading = entry.title
                , body = entry.content
                , authorsNote = entry.authorsNote
                , chapter = entry.chapter
                , level = entry.level
                , releaseDate = entry.releaseDate
                , isRead = Maybe.withDefault False (Dict.get (idToString "e" entry.id) readEntries)
                }

fromChapterList : List Chapter -> Dict RenderElementID Bool -> Model
fromChapterList chapters readEntries =
    let
        getID = .id >> Maybe.withDefault -1

        (elementList, stylesheetDict) =
            List.foldl (\ch (elems, styles) ->
                let newStyles = Dict.insert (getID ch) ch.stylesheet styles
                    newElems  = toRenderElement (Left ch) readEntries :: List.map (Right >> flip toRenderElement readEntries) ch.entries_
                in
                    (elems ++ newElems, newStyles)
            ) ([], Dict.empty) chapters

        firstElem = Maybe.withDefault emptyRenderElement <| List.head elementList
        tailElems  = Maybe.withDefault [] <| List.tail elementList
    in
        { empty
            | toc              = SL.fromList firstElem tailElems
            , stylesheets      = stylesheetDict
        }
