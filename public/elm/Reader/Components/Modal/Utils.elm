module Reader.Components.Modal.Utils exposing (..)

import Reader.Components.Modal.Model exposing (Model)
import Html exposing (Attribute)
import Html.Events exposing (onWithOptions)
import Json.Decode as Json

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

preventCloseOnClickWith : msg -> Attribute msg
preventCloseOnClickWith msg =
    onWithOptions "click" { stopPropagation = True, preventDefault = False } (Json.succeed msg)
