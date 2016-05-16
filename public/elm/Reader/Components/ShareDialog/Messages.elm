module Reader.Components.ShareDialog.Messages exposing (Msg(..))

import Reader.Views.ShareButtons as ShareButtons

import Time exposing (Time)

type alias RenderElementID = String

type Msg
    = ShowWith RenderElementID String
    | ToggleShareFromHeading Bool
    | OpenSharePopup ShareButtons.Msg
    | FadeOutFor Time
    | Hide
    | NoOp
