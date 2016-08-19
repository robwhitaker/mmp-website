module Reader.Messages exposing (..)

import Reader.Model exposing (..)
import Reader.Aliases exposing (..)
import Core.Models.Chapter exposing (Chapter)
import Reader.Views.Dropdown as Dropdown
import Reader.Views.ShareButtons as ShareButtons
import Reader.Components.Modal.Messages as Modal
import Reader.Components.ShareDialog.Messages as ShareDialog
import Reader.Components.CreditsRoll as CreditsRoll
import Reader.Components.ContactModal as ContactModal

import Debug

---- Messages ----

type Msg
    = TurnPage Direction
    | CoverClick
    | OpenSharePopup ShareButtons.Msg
    | ShowShareDialog RenderElementID
    | ShareDialogMsg ShareDialog.Msg
    | CreditsRollMsg (Modal.Msg CreditsRoll.Msg)
    | ContactModalMsg (Modal.Msg ContactModal.Msg)
    | Load (List Chapter) LocalStorageData LocationHash LocationHost
    | ChapterHasRendered CurrentPage NumPages HeadingIDsOnPage
    | ChapterHasReflowed CurrentPage NumPages (Maybe FocusedElementID) HeadingIDsOnPage
    | UpdateHeadingsOnPage HeadingUpdate
    | ChangeSelectedHeading RenderElementID
    | Dropdown Dropdown.Msg
    | Dump String
    | NoOp

debugLog : String -> Msg -> Msg
debugLog label msg =
    let log = Debug.log label <| case msg of
        Load _ _ _ _ -> "Load"
        _ -> toString msg
    in
        msg
