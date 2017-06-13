module Reader.Components.CreditsRoll exposing (Model,empty,Msg(..))

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

import Json.Decode as Json

import Reader.Components.Modal.Model as Modal exposing (modal)
import Reader.Components.Modal.ExportMessages as Modal
import Reader.Components.Modal.Utils as Modal
import Reader.Ports exposing (rollCredits)

type alias Model =
    Modal.Model InnerModel Msg

type alias InnerModel =
    String

type Msg
    = Close
    | NoOp

empty : Model
empty =
    modal 400 "credits-overlay"
        { model = ""
        , update = update
        , view = view
        , onShow = \model -> (model, rollCredits 0)
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
    div [ class "credits-container"
        , Modal.preventCloseOnClickWith NoOp
        ] <|
        [ div [ class "end-credits-btn", onClick Close ] [ text "Exit Credits" ]
        , div [ class "full-spacer" ] []
        , div [ class "banner movie" ] [ div [ class "banner-logo" ] [] ]
        ]
        ++ (List.concatMap mkCreditGroup creditGroups) ++
        [ div
            [ class "end-block" ]
            [
                div [ class "banner movie" ] [ div [ class "banner-logo" ] [] ]
            ]
        ]

mkCreditGroup : (String, List String) -> List (Html Msg)
mkCreditGroup (job, names) =
    let
        nameDiv name =
            div [ class "name" ] [ text name ]
    in
        [
            div [ class "job" ] [ text job ]
        ] ++ (List.sort >> List.map nameDiv) names

creditGroups : List (String, List String)
creditGroups =
    [ (,)
        "Story / Writing"
        [rob]
    , (,)
        "Beta Reading"
        [katie,jp,nick]
    , (,)
        "Editing"
        [katie,jp,rob]
    , (,)
        "Website Design"
        [bromos,rob]
    , (,)
        "Art"
        [bromos]
    , (,)
        "Front-end Programming"
        [rob]
    , (,)
        "Back-end Programming"
        [nick]
    , (,)
        "Marketing"
        ["What's that?"]
    ]

rob = "Rob Whitaker"
katie = "Katie Craven"
jp = "JP Welsh"
nick = "Nicholas La Roux"
bromos = "Christina Ramos"
