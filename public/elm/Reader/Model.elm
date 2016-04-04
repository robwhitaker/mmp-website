module Reader.Model where

import Dict exposing (Dict)

import Core.Utils.SelectionList as SL exposing (SelectionList)
import Core.Utils.Either exposing (..)

import Core.Models.Chapter exposing (Chapter)
import Core.Models.Entry exposing (Entry)

---- MODELS ----

type alias ChapterID  = Int
type alias RenderElementID = String
type alias Stylesheet = String
type alias TOC = SelectionList RenderElement

type Direction = Forward | Backward
type LastNavAction = PageTurn Direction | PageJump RenderElementID | PageReflow | Render
type State = Ready | Loading | Reflowing | Rendering

type alias Model =
    { toc              : TOC
    , stylesheets      : Dict ChapterID Stylesheet
    , pages            : { current : Int, total : Int }
    , headingIDsOnPage : List String
    , lastNavAction    : LastNavAction
    , state            : State
    }

type alias RenderElement =
    { id : RenderElementID
    , disqusId : String
    , heading : String
    , body : String
    , authorsNote : String
    , chapter : ChapterID
    , level : Int
    }

type alias RenderBlob =
    { stylesheet : Stylesheet
    , renderElements : List RenderElement
    }

---- EMPTY MODELS ----

empty : Model
empty =
    { toc = SL.fromList emptyRenderElement []
    , stylesheets = Dict.empty
    , pages = { current = 0, total = 0 }
    , headingIDsOnPage = []
    , lastNavAction = Render
    , state = Loading
    }

emptyRenderElement : RenderElement
emptyRenderElement =
    { id = ""
    , disqusId = ""
    , heading = ""
    , body = ""
    , authorsNote = ""
    , chapter = -1
    , level = -1
    }

---- HELPERS ----

toRenderElement : Either Chapter Entry -> RenderElement
toRenderElement item =
    let
        idToString : String -> Maybe Int -> String
        idToString pre maybeId = pre ++ toString (Maybe.withDefault -1 maybeId)
    in
        case item of
            Left chapter ->
                { id = idToString "c" chapter.id
                , disqusId = "disqus" ++ idToString "c" chapter.id
                , heading = chapter.title
                , body = chapter.content
                , authorsNote = chapter.authorsNote
                , chapter = Maybe.withDefault -1 chapter.id
                , level = 0
                }
            Right entry ->
                { id = idToString "e" entry.id
                , disqusId = "disqus" ++ idToString "e" entry.id
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
