module Reader.Model.Helpers exposing (fromChapterList, toRenderElement)

import Browser.Navigation as Navigation
import Core.Models.Chapter exposing (Chapter)
import Core.Models.Entry exposing (Entry)
import Core.Utils.Either exposing (..)
import Core.Utils.SelectionList as SL exposing (SelectionList)
import Dict exposing (Dict)
import Reader.Aliases exposing (..)
import Reader.Model exposing (..)
import Reader.Utils.Disqus exposing (toDisqusId)


toRenderElement : Either Chapter Entry -> Dict RenderElementID Bool -> RenderElement
toRenderElement item readEntries =
    let
        idToString : String -> Maybe Int -> String
        idToString pre maybeId =
            pre ++ String.fromInt (Maybe.withDefault -1 maybeId)
    in
    case item of
        Left chapter ->
            { emptyRenderElement
                | id = idToString "c" chapter.id
                , disqusId = toDisqusId (idToString "c" chapter.id)
                , heading = chapter.title
                , body = chapter.content
                , isInteractive = chapter.isInteractive
                , interactiveUrl = chapter.interactiveUrl
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
                , isInteractive = entry.isInteractive
                , interactiveUrl = entry.interactiveUrl
                , authorsNote = entry.authorsNote
                , chapter = entry.chapter
                , level = entry.level
                , releaseDate = entry.releaseDate
                , isRead = Maybe.withDefault False (Dict.get (idToString "e" entry.id) readEntries)
            }


fromChapterList : List Chapter -> Dict RenderElementID Bool -> (Navigation.Key -> Model)
fromChapterList chapters readEntries =
    let
        getID =
            .id >> Maybe.withDefault -1

        ( elementList, stylesheetDict ) =
            List.foldl
                (\ch ( elems, styles ) ->
                    let
                        newStyles =
                            Dict.insert (getID ch) ch.stylesheet styles

                        newElems =
                            toRenderElement (Left ch) readEntries :: List.map (Right >> (\a -> toRenderElement a readEntries)) ch.entries_
                    in
                    ( elems ++ newElems, newStyles )
                )
                ( [], Dict.empty )
                chapters

        firstElem =
            Maybe.withDefault emptyRenderElement <| List.head elementList

        tailElems =
            Maybe.withDefault [] <| List.tail elementList
    in
    \navigationKey ->
        let
            emptyModel =
                empty navigationKey
        in
        { emptyModel
            | toc = SL.fromList firstElem tailElems
            , stylesheets = stylesheetDict
        }
