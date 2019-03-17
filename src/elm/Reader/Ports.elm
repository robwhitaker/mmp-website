port module Reader.Ports exposing (RenderData, RenderResult, beginReflow, chapterReflowed, chapterRendered, inlineLinkClicked, inlineShareClicked, keyPressedInReader, mouseClickedInReader, openSharePopup, ping, pingback, reflowRequest, renderChapter, rollCredits, setBookmarkInStorage, setPage, setReadInStorage, setScrollEnabled, setSelectedId, setTitle, switchDisqusThread)

--import Reader.Model exposing (..)
--import Reader.Messages exposing (..)

import Array exposing (Array)
import Reader.Aliases exposing (..)
import Reader.Views.ShareButtons as ShareButtons



---- INPUT TYPE ALIASES ----


type alias RenderResult =
    { currentPage : CurrentPage
    , idsByPage : IdsByPage
    }


type alias RenderData =
    { renderObj : RenderBlob
    , eId : RenderElementID
    , isPageTurnBack : Bool
    }



---- INBOUND ----


port keyPressedInReader : (KeyCode -> msg) -> Sub msg


port mouseClickedInReader : (Maybe Int -> msg) -> Sub msg


port chapterRendered : (RenderResult -> msg) -> Sub msg


port chapterReflowed : (RenderResult -> msg) -> Sub msg


port inlineLinkClicked : (RenderElementID -> msg) -> Sub msg


port inlineShareClicked : (RenderElementID -> msg) -> Sub msg


port ping : (String -> msg) -> Sub msg


port reflowRequest : (String -> msg) -> Sub msg



-- OUTBOUND ----


port setPage : PageNum -> Cmd msg


port renderChapter : RenderData -> Cmd msg


port switchDisqusThread : DisqusData -> Cmd msg


port setTitle : String -> Cmd msg


port setReadInStorage : RenderElementID -> Cmd msg


port setBookmarkInStorage : RenderElementID -> Cmd msg


port openSharePopup : ShareButtons.Data -> Cmd msg


port rollCredits : Int -> Cmd msg


port setScrollEnabled : Bool -> Cmd msg


port setSelectedId : RenderElementID -> Cmd msg


port pingback : Bool -> Cmd msg


port beginReflow : Bool -> Cmd msg
