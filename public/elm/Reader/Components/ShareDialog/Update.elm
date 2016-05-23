module Reader.Components.ShareDialog.Update exposing (update)

import Reader.Components.ShareDialog.Model exposing (Model)
import Reader.Components.ShareDialog.Messages exposing (Msg(..))
import Reader.Ports exposing (openSharePopup)
import Reader.Utils.Cmd exposing (after)

import Task
import Process

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        ShowWith id sectionTitle ->
            { model | shareId = id, sectionTitle = sectionTitle, visible = True, shareFromHeading = True, fading = False }
                ! []

        ToggleShareFromHeading val ->
            { model | shareFromHeading = val }
                ! []

        OpenSharePopup popupSettings ->
            model
                ! [ openSharePopup popupSettings ]

        FadeOutFor milli ->
            { model | fading = True }
                ! [ Hide `after` milli ]

        Hide ->
            { model | visible = False, fading = False }
                ! []

        NoOp ->
            model ! []
