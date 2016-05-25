module Reader.Components.ShareDialog.Update exposing (update)

import Reader.Components.ShareDialog.Model exposing (Model)
import Reader.Components.ShareDialog.Messages exposing (Msg(..))
import Reader.Ports exposing (openSharePopup)

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
                ! [ (Process.sleep milli `Task.andThen` \_ -> Task.succeed Hide) |> Task.perform (\_ -> NoOp) identity ]

        Hide ->
            { model | visible = False, fading = False }
                ! []

        NoOp ->
            model ! []
