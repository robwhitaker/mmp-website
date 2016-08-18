module Reader.Components.Modal.Model exposing (Model,modal)

import Html exposing (Html)
import Reader.Components.Modal.Messages exposing (Msg)

type alias Model model msg =
    { isFading          : Bool
    , isVisible         : Bool
    , fadeOutDuration   : Float
    , containerClass    : String
    , innerComponent    : NestedComponent model msg
    }

type alias NestedComponent model msg =
    { model   : model
    , update  : msg -> model -> (model, Cmd msg)
    , view    : model -> Html msg
    , onShow  : ModalEventHandler model msg
    , onFade  : ModalEventHandler model msg
    , onHide : ModalEventHandler model msg
    }

type alias ModalEventHandler model msg =
    model -> (model, Cmd msg)

modal : Float -> String -> NestedComponent model msg -> Model model msg
modal fadeOutDuration containerClass innerComponent =
    { isFading          = False
    , isVisible         = False
    , fadeOutDuration   = fadeOutDuration
    , containerClass    = containerClass
    , innerComponent    = innerComponent
    }
