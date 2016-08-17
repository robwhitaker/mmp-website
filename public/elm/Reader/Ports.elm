port module Reader.Ports exposing (..)

import Reader.Model exposing (..)
import Reader.Aliases exposing (..)
import Reader.Utils.Disqus exposing (DisqusData)
import Keyboard exposing (KeyCode)
import Reader.Messages exposing (..)
import Reader.Views.ShareButtons as ShareButtons

---- INPUT TYPE ALIASES ----

type alias RenderResult =
    { currentPage    : CurrentPage
    , numPages       : NumPages
    , focusedHeading : Maybe RenderElementID
    , headingsOnPage : List RenderElementID
    }

type alias RenderData =
    { renderObj      : RenderBlob
    , eId            : RenderElementID
    , isPageTurnBack : Bool
    }

---- INBOUND ----

port keyPressedInReader   : (KeyCode -> msg) -> Sub msg

port mouseClickedInReader : (Maybe Int -> msg) -> Sub msg

port chapterRendered      : (RenderResult -> msg) -> Sub msg

port chapterReflowed      : (RenderResult -> msg) -> Sub msg

port headingsUpdated      : (HeadingUpdate -> msg) -> Sub msg

port pageSet              : (PageNum -> msg) -> Sub msg

port inlineLinkClicked    : (RenderElementID -> msg) -> Sub msg

port inlineShareClicked   : (RenderElementID -> msg) -> Sub msg

-- OUTBOUND ----

port setPage              : PageNum -> Cmd msg

port renderChapter        : RenderData -> Cmd msg

port switchDisqusThread   : DisqusData -> Cmd msg

port setTitle             : String -> Cmd msg

port setReadInStorage     : RenderElementID -> Cmd msg

port setBookmarkInStorage : RenderElementID -> Cmd msg

port jumpToEntry          : RenderElementID -> Cmd msg

port openSharePopup       : ShareButtons.Msg -> Cmd msg

port rollCredits          : Int -> Cmd msg

port setScrollEnabled     : Bool -> Cmd msg
