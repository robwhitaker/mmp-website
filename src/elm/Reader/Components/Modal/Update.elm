module Reader.Components.Modal.Update exposing (update)

import Process
import Reader.Components.Modal.ExportMessages exposing (..)
import Reader.Components.Modal.Messages exposing (..)
import Reader.Components.Modal.Model exposing (..)
import Reader.Ports exposing (setScrollEnabled)
import Task


update : Msg msg -> Model model msg -> ( Model model msg, Cmd (Msg msg) )
update msg model =
    case msg of
        ShowModal ->
            let
                innerComponent =
                    model.innerComponent

                ( newComponentModel, cmds ) =
                    innerComponent.onShow innerComponent.model
            in
            ( { model
                | isVisible = True
                , isFading = False
                , innerComponent = { innerComponent | model = newComponentModel }
              }
            , Cmd.batch [ setScrollEnabled False, Cmd.map PassMsgToComponent cmds ]
            )

        HideModal ->
            let
                innerComponent =
                    model.innerComponent

                ( newComponentModel, cmds ) =
                    innerComponent.onHide innerComponent.model
            in
            ( { model
                | isVisible = False
                , isFading = False
                , innerComponent = { innerComponent | model = newComponentModel }
              }
            , Cmd.batch [ setScrollEnabled True, Cmd.map PassMsgToComponent cmds ]
            )

        FadeModal ->
            let
                innerComponent =
                    model.innerComponent

                ( newComponentModel, cmds ) =
                    innerComponent.onFade innerComponent.model
            in
            if not model.isFading then
                ( { model
                    | isFading = True
                    , innerComponent = { innerComponent | model = newComponentModel }
                  }
                , Cmd.batch
                    [ (Process.sleep model.fadeOutDuration |> Task.andThen (\_ -> Task.succeed HideModal)) |> Task.perform identity
                    , Cmd.map PassMsgToComponent cmds
                    ]
                )

            else
                ( model
                , Cmd.none
                )

        PassMsgToComponent innerMsg ->
            let
                innerComponent =
                    model.innerComponent

                ( newComponentModel, cmds, exports ) =
                    innerComponent.update innerMsg innerComponent.model

                newModel =
                    { model | innerComponent = { innerComponent | model = newComponentModel } }

                newCmds =
                    Cmd.map PassMsgToComponent cmds

                action =
                    case exports of
                        TriggerFade ->
                            FadeModal

                        TriggerHide ->
                            HideModal

                        None ->
                            NoOp

                ( newModel_, newCmds_ ) =
                    update action newModel
            in
            ( newModel_
            , Cmd.batch [ newCmds, newCmds_ ]
            )

        NoOp ->
            ( model
            , Cmd.none
            )
