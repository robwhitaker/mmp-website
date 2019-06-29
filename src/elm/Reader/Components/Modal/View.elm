module Reader.Components.Modal.View exposing (view)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Reader.Components.Modal.Messages exposing (Msg(..))
import Reader.Components.Modal.Model exposing (Model)


view : Model model msg -> Html (Msg msg)
view model =
    div
        [ classList
            [ ( "modal", True )
            , ( model.containerClass, True )
            , ( "no-display", not model.isVisible )
            , ( "fading", model.isFading )
            ]
        , onClick FadeModal
        ]
        [ Html.map PassMsgToComponent <| model.innerComponent.view model.innerComponent.model ]
