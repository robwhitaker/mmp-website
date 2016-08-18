module Reader.Components.Modal.Update exposing (update)

import Reader.Components.Modal.Model exposing (..)
import Reader.Components.Modal.Messages exposing (..)
import Reader.Components.Modal.ExportMessages exposing (..)

import Reader.Ports exposing (setScrollEnabled)

import Process
import Task

update : Msg msg -> Model model msg -> (Model model msg, Cmd (Msg msg))
update  msg model =
    case msg of
        ShowModal ->
            let innerComponent = model.innerComponent
                (newComponentModel, cmds) = innerComponent.onShow innerComponent.model
            in
                { model
                    | isVisible = True
                    , isFading = False
                    , innerComponent = { innerComponent | model = newComponentModel }
                }
                    ! [ setScrollEnabled False, Cmd.map PassMsgToComponent cmds ]

        HideModal ->
            let innerComponent = model.innerComponent
                (newComponentModel, cmds) = innerComponent.onHide innerComponent.model
            in
                { model
                    | isVisible = False
                    , isFading = False
                    , innerComponent = { innerComponent | model = newComponentModel }
                }
                    ! [ setScrollEnabled True, Cmd.map PassMsgToComponent cmds ]

        FadeModal ->
            let innerComponent = model.innerComponent
                (newComponentModel, cmds) = innerComponent.onFade innerComponent.model
            in
                if not model.isFading then
                    { model
                        | isFading = True
                        , innerComponent = { innerComponent | model = newComponentModel }
                    }
                        ! [ (Process.sleep model.fadeOutDuration `Task.andThen` \_ -> Task.succeed HideModal) |> Task.perform (\_ -> NoOp) identity
                          , Cmd.map PassMsgToComponent cmds
                          ]
                else
                    model
                        ! []

        PassMsgToComponent msg ->
            let innerComponent = model.innerComponent
                (newComponentModel, cmds, exports) = innerComponent.update msg innerComponent.model
                newModel = { model | innerComponent = { innerComponent | model = newComponentModel } }
                newCmds = Cmd.map PassMsgToComponent cmds
                action =
                    case exports of
                        TriggerFade -> FadeModal
                        TriggerHide -> HideModal
                        None        -> NoOp
                (newModel', newCmds') = update action newModel
            in
                newModel'
                    ! [ newCmds, newCmds']


        NoOp ->
            model
                ! []

mapInner : (model -> model) -> Model model msg -> Model model msg
mapInner f model =
    let innerComponent = model.innerComponent
    in
        { model
            | innerComponent =
                { innerComponent
                    | model = f innerComponent.model
                }
        }
