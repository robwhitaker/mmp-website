module Reader.Messages exposing (..)

import Reader.Model exposing (..)
import Reader.Aliases exposing (..)
import Core.Models.Chapter exposing (Chapter)
import Reader.Views.Dropdown as Dropdown
import Reader.Views.ShareButtons as ShareButtons
import Reader.Components.ShareDialog.Messages as ShareDialog

import Debug

---- Messages ----

type Msg
    = TurnPage Direction
    | CoverClick
    | OpenSharePopup ShareButtons.Msg
    | ShowShareDialog RenderElementID
    | ShareDialogMsg ShareDialog.Msg
    | Load (List Chapter) (List (RenderElementID, Bool)) LocationHash
    | ChapterHasRendered CurrentPage NumPages HeadingIDsOnPage
    | ChapterHasReflowed CurrentPage NumPages (Maybe FocusedElementID) HeadingIDsOnPage
    | UpdateHeadingsOnPage HeadingUpdate
    | ChangeSelectedHeading RenderElementID
    | Dropdown Dropdown.Msg
    | Dump String
    | NoOp


type alias HeadingUpdate = { headingsOnPage : List RenderElementID, headingAtTop : Bool }

debugLog : String -> Msg -> Msg
debugLog label msg =
    let log = Debug.log label <| case msg of
        Load _ _ _ -> "Load"
        _ -> toString msg
    in
        msg
