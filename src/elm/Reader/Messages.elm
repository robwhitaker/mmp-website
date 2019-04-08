module Reader.Messages exposing (Msg(..))

import Browser
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
    | WindowResized
    | OpenSharePopup ShareButtons.Msg
    | ShowShareDialog RenderElementID
    | ShareDialogMsg (Modal.Msg ShareDialog.Msg)
    | CreditsRollMsg (Modal.Msg CreditsRoll.Msg)
    | ContactModalMsg (Modal.Msg ContactModal.Msg)
    | Load (List Chapter) LocalStorageData Url Time.Zone
    | ChapterHasRendered CurrentPage IdsByPage
    | ChapterHasReflowed CurrentPage IdsByPage
    | SetNextReleaseDate Posix
    | HandleUrlRequest Browser.UrlRequest
    | ChangeSelectedHeading RenderElementID
    | Dropdown Dropdown.Msg
    | Ping
    | StartReflow
    | NoOp
