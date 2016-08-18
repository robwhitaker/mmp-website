module Reader.Components.ContactModal exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

import Reader.Components.Modal.Model as Modal exposing (modal)

import Reader.Aliases exposing (ErrorMsg)

type alias Model =
    Modal.Model InnerModel Msg

type alias InnerModel =
    List ErrorMsg

type alias Msg =
    ErrorMsg

empty : Model
empty =
    modal 400 "contact-modal"
        { model = []
        , update = \errMsg model -> (model ++ [ errMsg ], Cmd.none)
        , view = view
        , onShow = \model -> (model, Cmd.none)
        , onFade = \model -> (model, Cmd.none)
        , onHide = \model -> (model, Cmd.none)
        }

view : InnerModel -> Html Msg
view model =
    div [] [ text "THIS IS THE VIEW!" ]
