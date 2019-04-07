module Reader.Messages exposing (Msg(..), debugLog)

import Browser.Dom exposing (Viewport)
import Browser.Navigation as Navigation
import Core.Models.Chapter exposing (Chapter)
import Debug
import Reader.Aliases exposing (..)
import Reader.Components.ContactModal as ContactModal
import Reader.Components.CreditsRoll as CreditsRoll
import Reader.Components.Modal.Messages as Modal
import Reader.Components.ShareDialog as ShareDialog
import Reader.Model exposing (..)
import Reader.Views.Dropdown as Dropdown
import Reader.Views.ShareButtons as ShareButtons
import Time exposing (Posix)
import Url exposing (Url)



---- Messages ----


type Msg
    = TurnPage Direction
    | CoverOpen
    | UpdateWindowSize Viewport
    | OpenSharePopup ShareButtons.Msg
    | ShowShareDialog RenderElementID
    | ShareDialogMsg (Modal.Msg ShareDialog.Msg)
    | CreditsRollMsg (Modal.Msg CreditsRoll.Msg)
    | ContactModalMsg (Modal.Msg ContactModal.Msg)
    | Load (List Chapter) LocalStorageData Posix Url Navigation.Key Time.Zone
    | ChapterHasRendered CurrentPage IdsByPage
    | ChapterHasReflowed CurrentPage IdsByPage
    | SetNextReleaseDate Posix
    | ChangeSelectedHeading RenderElementID
    | Dropdown Dropdown.Msg
    | Dump String
    | Ping
    | StartReflow
    | NoOp


debugLog : String -> Msg -> Msg
debugLog label msg =
    let
        log =
            Debug.log label <|
                case msg of
                    Load _ _ _ _ _ _ ->
                        "Load"

                    _ ->
                        Debug.toString msg
    in
    msg
