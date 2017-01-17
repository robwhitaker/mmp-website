module Reader.Messages exposing (..)

import Reader.Model exposing (..)
import Reader.Aliases exposing (..)
import Reader.Utils.Analytics as Analytics
import Core.Models.Chapter exposing (Chapter)
import Reader.Views.Dropdown as Dropdown
import Reader.Views.ShareButtons as ShareButtons
import Reader.Components.Modal.Messages as Modal
import Reader.Components.ShareDialog as ShareDialog
import Reader.Components.CreditsRoll as CreditsRoll
import Reader.Components.ContactModal as ContactModal
import Navigation exposing (Location)

import Time exposing (Time)
import Debug

---- Messages ----

type Msg
    = TurnPage Direction
    | CoverClick
    | SendCoverOpenAnalytic Time
    | SendFollowAnalytic Analytics.LabelFollowMethod
    | OpenSharePopup ShareButtons.Msg
    | ShowShareDialog RenderElementID
    | ShareDialogMsg (Modal.Msg ShareDialog.Msg)
    | CreditsRollMsg (Modal.Msg CreditsRoll.Msg)
    | ContactModalMsg (Modal.Msg ContactModal.Msg)
    | Load (List Chapter) LocalStorageData Time Location
    | ChapterHasRendered CurrentPage IdsByPage
    | ChapterHasReflowed CurrentPage IdsByPage
    --| UpdateHeadingsOnPage HeadingUpdate
    | ChangeSelectedHeading RenderElementID
    | Dropdown Dropdown.Msg
    | Dump String
    | Ping
    | StartReflow
    | NoOp

debugLog : String -> Msg -> Msg
debugLog label msg =
    let log = Debug.log label <| case msg of
        Load _ _ _ _ -> "Load"
        _ -> toString msg
    in
        msg
