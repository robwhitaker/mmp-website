module Reader.Components.ShareDialog.View exposing (view)

import Html exposing (..)
import Html.App as Html
import Html.Attributes exposing (..)
import Html.Events exposing (..)

import Reader.Views.ShareButtons as ShareButtons
import Reader.Components.ShareDialog.Messages exposing (Msg(..))
import Reader.Components.ShareDialog.Model exposing (Model)

view : Model -> Html Msg
view model =
    div
        [ classList [ ("share-dialog-container", True), ("no-display", not model.visible), ("fade-out", model.fading) ] ]
        [ div
            [ class "overlay", onClick (FadeOutFor 400) ]
            []
        , div
            [ class "share-dialog" ]
            [ i [ class "fa fa-times fa-6 close", attribute "aria-hidden" "true", onClick (FadeOutFor 400) ] []
            , h2 [ class "fancy-heading" ] [ text "Share" ]
            , div
                [ class "url-container" ]
                [ input [ value <| "localhost:4567" ++ if model.shareFromHeading then "/#!/" ++ model.shareId else "" ] [] ]
            , input
                [ type' "checkbox"
                , checked model.shareFromHeading
                , onCheck ToggleShareFromHeading
                ] []
            , span [] [ text <| "Share from current heading "]
            , span [ class "share-section-title" ] [ text <| "(" ++ model.sectionTitle ++ ")" ]
            , span [] [ text "?" ]
            , Html.map OpenSharePopup <| div
                [ class "social-media-buttons" ]
                [ ShareButtons.facebook
                , ShareButtons.twitter
                , ShareButtons.tumblr
                , ShareButtons.gplus
                , ShareButtons.reddit
                ]
            ]
        ]
