module Reader.Model.Helpers where

import Dict exposing (Dict)

import Reader.Model exposing (..)
import Reader.Components.Disqus exposing (toDisqusId)

import Core.Utils.Either exposing (..)
import Core.Utils.SelectionList as SL exposing (SelectionList)

import Core.Models.Chapter exposing (Chapter)
import Core.Models.Entry exposing (Entry)

toRenderElement : Either Chapter Entry -> RenderElement
toRenderElement item =
    let
        idToString : String -> Maybe Int -> String
        idToString pre maybeId = pre ++ toString (Maybe.withDefault -1 maybeId)
    in
        case item of
            Left chapter ->
                { id = idToString "c" chapter.id
                , disqusId = toDisqusId (idToString "c" chapter.id)
                , heading = chapter.title
                , body = chapter.content
                , authorsNote = chapter.authorsNote
                , chapter = Maybe.withDefault -1 chapter.id
                , level = 0
                }
            Right entry ->
                { id = idToString "e" entry.id
                , disqusId = toDisqusId (idToString "e" entry.id)
                , heading = entry.title
                , body = entry.content
                , authorsNote = entry.authorsNote
                , chapter = entry.chapter
                , level = entry.level
                }

fromChapterList : List Chapter -> Model
fromChapterList chapters =
    let
        getID = .id >> Maybe.withDefault -1

        (elementList, stylesheetDict) =
            List.foldl (\ch (elems, styles) ->
                let newStyles = Dict.insert (getID ch) ch.stylesheet styles
                    newElems  = toRenderElement (Left ch) :: List.map (Right >> toRenderElement) ch.entries_
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
