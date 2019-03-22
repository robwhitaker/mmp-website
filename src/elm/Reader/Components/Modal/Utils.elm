module Reader.Components.Modal.Utils exposing (mapInner, preventCloseOnClickWith)

import Html exposing (Attribute)
import Html.Events exposing (custom)
import Json.Decode as Json
import Reader.Components.Modal.Model exposing (Model)


mapInner : (model -> model) -> Model model msg -> Model model msg
mapInner f model =
    let
        innerComponent =
            model.innerComponent
    in
    { model
        | innerComponent =
            { innerComponent
                | model = f innerComponent.model
            }
    }


preventCloseOnClickWith : msg -> Attribute msg
preventCloseOnClickWith msg =
    custom
        "click"
        (Json.succeed
            { message = msg
            , stopPropagation = True
            , preventDefault = False
            }
        )
