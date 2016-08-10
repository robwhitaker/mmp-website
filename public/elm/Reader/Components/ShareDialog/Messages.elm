module Reader.Components.ShareDialog.Messages exposing (Msg(..))

import Reader.Aliases exposing (..)
import Reader.Views.ShareButtons as ShareButtons

import Time exposing (Time)

type Msg
    = ShowWith RenderElementID LocationHost String
    | ToggleShareFromHeading Bool
    | OpenSharePopup ShareButtons.Msg
    | FadeOutFor Time
    | Hide
    | NoOp
