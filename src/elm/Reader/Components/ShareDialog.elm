module Reader.Components.ShareDialog exposing (Model, Msg(..), empty, initInnerModel)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json
import Reader.Aliases exposing (..)
import Reader.Components.Modal.ExportMessages as Modal
import Reader.Components.Modal.Model as Modal exposing (modal)
import Reader.Components.Modal.Utils as Modal
import Reader.Ports exposing (openSharePopup)
import Reader.Views.ShareButtons as ShareButtons


type alias Model =
    Modal.Model InnerModel Msg


type alias InnerModel =
    { shareId : RenderElementID
    , locationHost : LocationHost
    , sectionTitle : String
    , shareFromHeading : Bool
    }


type Msg
    = ToggleShareFromHeading Bool
    | OpenSharePopup ShareButtons.Msg
    | Close
    | NoOp


empty : Model
empty =
    modal 400
        "share-dialog-container"
        { model = emptyInner
        , update = update
        , view = view
        , onShow = \model -> ( { model | shareFromHeading = True }, Cmd.none )
        , onFade = \model -> ( model, Cmd.none )
        , onHide = \model -> ( model, Cmd.none )
        }


emptyInner : InnerModel
emptyInner =
    { shareId = ""
    , locationHost = ""
    , sectionTitle = ""
    , shareFromHeading = True
    }


initInnerModel : RenderElementID -> LocationHost -> String -> Model -> Model
initInnerModel shareId locationHost sectionTitle model =
    Modal.mapInner
        (\innerModel ->
            { innerModel
                | shareId = shareId
                , locationHost = locationHost
                , sectionTitle = sectionTitle
            }
        )
        model


update : Msg -> InnerModel -> ( InnerModel, Cmd Msg, Modal.ExpMsg )
update msg model =
    case msg of
        ToggleShareFromHeading val ->
            ( { model | shareFromHeading = val }, Cmd.none, Modal.None )

        OpenSharePopup popupSettings ->
            ( model, Cmd.batch [ openSharePopup popupSettings.data ], Modal.None )

        Close ->
            ( model, Cmd.none, Modal.TriggerFade )

        NoOp ->
            ( model, Cmd.none, Modal.None )


view : InnerModel -> Html Msg
view model =
    div
        [ class "share-dialog", Modal.preventCloseOnClickWith NoOp ]
        [ i [ class "fa fa-times fa-6 close", attribute "aria-hidden" "true", onClick Close ] []
        , h2 [ class "fancy-heading" ] [ text "Share" ]
        , div
            [ class "url-container" ]
            [ input
                [ value <|
                    model.locationHost
                        ++ (if model.shareFromHeading then
                                "/#!/" ++ model.shareId

                            else
                                ""
                           )
                ]
                []
            ]
        , input
            [ type_ "checkbox"
            , checked model.shareFromHeading
            , onCheck ToggleShareFromHeading
            ]
            []
        , span [] [ text <| "Share from current heading " ]
        , span [ class "share-section-title" ] [ text <| "(" ++ model.sectionTitle ++ ")" ]
        , span [] [ text "?" ]
        , Html.map OpenSharePopup <|
            div
                [ class "social-media-buttons" ]
                [ ShareButtons.facebook
                , ShareButtons.twitter
                , ShareButtons.tumblr
                , ShareButtons.gplus
                , ShareButtons.reddit
                ]
        ]
