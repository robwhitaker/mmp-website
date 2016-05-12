module Reader.View where

import Reader.Model exposing (..)
import Reader.Update exposing (Action(..))
import Reader.Components.Dropdown as Dropdown

import Reader.Utils as Utils

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

import Markdown

view : Signal.Address Action -> Model -> Html
view address model =
    div []
        [ section
            [ class "reader" ]
            [ div [ class "banner" ] [ a [ href "/" ] [ div [ class "banner-logo" ] [] ] ]
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
                , div [ class "authors-note-text" ] [ Markdown.toHtml model.toc.selected.authorsNote ]
                ]
            , div
                [ id "comments-box" ]
                [ h2 [ class "fancy-heading" ] [ text "Discussion for ", span [ class "highlight-color" ] [ text <| Utils.selectedTitleFromSL model.toc ] ]
                , div [ id "disqus_thread" ] []
                ]
            ]
        , footer []
            [ div [ class "footer-link-block" ] <| List.map2 mkFooterSection footerHeadings footerContent
            , div [ class "copy" ] [ text "© Midnight Murder Party 2015-2016" ]
            ]
        ]

mkFooterSection : String -> Html -> Html
mkFooterSection heading content =
    div [ class "link-section" ]
        [ h2 [ class "fancy-heading" ] [ text heading ]
        , content
        ]

footerHeadings = [ "Social", "Extras", "Thanks to..." ]

footerContent  = [ social, extras, thanksTo ]

social = mkLinks <| List.map (flip (,) "#") [ "Facebook", "Twitter", "Reddit", "Ello" ]
    --div []
    --    [ div [ class "mmp-on-social" ] []
    --    , div
    --        [ class "follow-share" ] <| List.map (\html -> div [ class "follow-share-item" ] [ html ])
    --            [ div [ class "fb-like", attribute "data-href" "https://www.facebook.com/MMPWebSeries", attribute "data-layout" "button_count", attribute "data-action" "like", attribute "data-show-faces" "false", attribute "data-share" "false" ] []
    --            , div [ class "fb-share-button", attribute "data-href" "http://www.midnightmurderparty.com", attribute "data-layout" "button_count", attribute "data-mobile-iframe" "true" ] []
    --            , a [ href "https://twitter.com/share", class "twitter-share-button", attribute "data-via" "MMPWebSeries" ] [ text "Tweet" ]
    --            , a [ href "https://twitter.com/MMPWebSeries", class "twitter-follow-button", attribute "data-show-count" "true", attribute "data-show-screen-name" "false" ] [ text "Follow @MMPWebSeries" ]
    --            ]
    --    ]

mkLinks links =
    ul [] <| List.map (\(txt, url) -> li [] [ a [ href url, target "_BLANK" ] [ text txt ] ]) links

extras = mkLinks
    [ ("MMP Halloween - 2015", "#") ]

thanksTo = mkLinks
    [ ("Christina Ramos - Art", "#")
    , ("JP Welsh - Beta Reading, Editing", "#")
    , ("Katie Craven - Beta Reading, Editing", "#")
    , ("Nicholas La Roux - Back-end, Beta Reading", "#")
    ]
