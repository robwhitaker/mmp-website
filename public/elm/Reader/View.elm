module Reader.View where

import Reader.Model exposing (..)
import Reader.Update exposing (Action(..))
import Reader.Components.Dropdown as Dropdown

import Reader.Utils as Utils

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

bookSize = (650,759)

view : Signal.Address Action -> Model -> Html
view address model =
    div []
        [ section
            [ class "reader" ]
            [ div [ class "banner" ] [ div [ class "banner-logo" ] [] ]
            , div
                [ class "book" ]
                [ div
                    [ classList
                        [ ("loader cover", True)
                        , ("isDisplayed", model.showCover)
                        ]
                    , onClick address CoverClick
                    ] [ div [] [ text "Updates every Sunday!" ] ]
                , div
                    [ classList
                        [ ("loader", True)
                        , ("isDisplayed", model.state == Rendering || model.state == Loading)
                        ]
                    ]
                    [ case model.state of
                        Loading -> div [ class "loading-label" ] [ text "Loading..." ]
                        Rendering -> div [ class "loading-label" ] [ text "Rendering..." ]
                        _ -> text ""
                    , div [ class "loading-label" ] [ img [ src "static/assets/img/ajax-loader-2.gif" ] [] ]
                    ]
                , div
                    [ class "book-inner" ]
                    [ div
                        [ class "top-bar" ]
                        [ Dropdown.view (Signal.forwardTo address Dropdown) model.toc model.tocExpanded ]
                    , iframe [ id "book-text-frame", src "/renderer.html" ] []
                    , div
                        [ class "bottom-bar" ]
                        [ button [ class "back-btn", onClick address (TurnPage Backward) ] [ text "Backward" ]
                        , div [ class "page-num" ] [ text <| toString (model.pages.current + 1) ++ " / " ++ toString model.pages.total ]
                        , button [ class "forward-btn", onClick address (TurnPage Forward) ] [ text "Forward" ]
                        ]
                    ]
                ]
            ]
        , section
            [ classList [("comments", True), ("no-display", model.showCover)] ]
            [ div
                [ id "authors-note", classList [("no-display", model.toc.selected.authorsNote == "")] ]
                [ h2  [ class "fancy-heading no-bottom-margin" ]     [ text "Author's Note" ]
                , div [ class "byline" ]            [ span [ class "highlight-color" ] [ text <| Utils.selectedTitleFromSL model.toc ] ]
                , div [ class "authors-note-text" ] [ text model.toc.selected.authorsNote ]
                ]
            , div
                [ id "comments-box" ]
                [ h2 [ class "fancy-heading" ] [ text "Discussion for ", span [ class "highlight-color" ] [ text <| Utils.selectedTitleFromSL model.toc ] ]
                , div [ id "disqus_thread" ] []
                ]
            ]
        , footer
            []
            []
        ]
