module Reader.Components.ContactModal exposing (Model,empty,Msg(..))

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json
import Markdown

import Reader.Components.Modal.Model as Modal exposing (modal)
import Reader.Components.Modal.ExportMessages as Modal

type alias Model =
    Modal.Model InnerModel Msg

type alias InnerModel =
    String

type Msg
    = Close
    | NoOp

empty : Model
empty =
    modal 400 "contact-modal"
        { model = ""
        , update = update
        , view = view
        , onShow = \model -> (model, Cmd.none)
        , onFade = \model -> (model, Cmd.none)
        , onHide = \model -> (model, Cmd.none)
        }

update : Msg -> InnerModel -> (InnerModel, Cmd Msg, Modal.ExpMsg)
update msg _ =
    case msg of
        Close ->
            ("", Cmd.none, Modal.TriggerFade)
        NoOp ->
            ("", Cmd.none, Modal.None)

view : InnerModel -> Html Msg
view _ =
    div [ class "contact-modal-container" ]
        [ div
            [ class "contact-modal-text"
            , onWithOptions "click" { stopPropagation = True, preventDefault = False } (Json.succeed NoOp)
            ]
            [ i [ class "fa fa-times fa-6 close-x", attribute "aria-hidden" "true", onClick Close ] []
            , h2 [ class "fancy-heading" ] [ text "Contact Me" ]
            , p [] [ text "Feel free to contact me at:" ]
            , p [ class "email" ]
                [ a [ href "mailto:author@midnightmurderparty.com", target "_blank" ]
                    [ text "author@midnightmurderparty.com" ]
                ]
            , p [] [ Markdown.toHtml [] "**If you are reporting a bug**, please include \"BUG REPORT\" in the email subject and attach any relevant screenshots. Thanks!" ]
            ]
        ]
