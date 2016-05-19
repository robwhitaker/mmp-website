module Reader.View exposing (..)

import Reader.Model exposing (..)
import Reader.Messages exposing (..)
import Reader.Ports exposing (..)
import Reader.Utils as Utils

import Reader.Views.Dropdown as Dropdown
import Reader.Views.ShareButtons as ShareButtons

import Reader.Components.ShareDialog.View as ShareDialog

import Html.App as Html
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

import Markdown
import String

view : Model -> Html Msg
view model =
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
                    , onClick CoverClick
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
                        [ Html.map Dropdown <| Dropdown.view model.toc model.tocExpanded ]
                    , iframe [ id "book-text-frame", src "/renderer.html", seamless True ] []
                    , div
                        [ class "bottom-bar" ]
                        [ button [ class "back-btn", onClick (TurnPage Backward) ] [ text "Backward" ]
                        , div [ class "page-num" ] [ text <| toString (model.pages.current + 1) ++ " / " ++ toString model.pages.total ]
                        , button [ class "forward-btn", onClick (TurnPage Forward) ] [ text "Forward" ]
                        ]
                    ]
                ]
            , Html.map ShareDialogMsg <| ShareDialog.view model.shareDialog
            ]
        , section
            [ classList [("comments", True), ("no-display", model.showCover)] ]
            [ div
                [ id "authors-note", classList [("no-display", model.toc.selected.authorsNote == "")] ]
                [ h2  [ class "fancy-heading no-bottom-margin" ] [ text "Author's Note" ]
                , div [ class "byline" ] [ span [ class "highlight-color" ] [ text <| Utils.selectedTitleFromSL model.toc ] ]
                , div [ class "authors-note-text" ] [ Markdown.toHtml [] model.toc.selected.authorsNote ]
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

mkFooterSection : String -> Html Msg -> Html Msg
mkFooterSection heading content =
    div [ class "link-section" ]
        [ h2 [ class "fancy-heading" ] [ text heading ]
        , content
        ]

footerHeadings = [ "Follow", "Share", "Extras", "Thanks to..." ]

footerContent = [ follow, share, extras, thanksTo ]

follow =
    let mkIcon (iconUrl, dest) =
            a [ href dest, target "_BLANK" ] [ img [ src <| "/static/assets/img/" ++ iconUrl ] [] ]

        icons =
            [ ("facebook-icon.png", "https://www.facebook.com/MMPWebSeries/")
            , ("twitter-icon.png", "https://twitter.com/MMPWebSeries")
            , ("ello-icon.jpg", "https://ello.co/midnightmurderparty")
            , ("rss-icon.png", "#")
            ]

        prependIcons =
            (++) (List.map mkIcon icons)
    in
        div [] <| prependIcons
            [ div
                [ id "mc_embed_signup" ]
                [ Html.form
                    [ action "//midnightmurderparty.us11.list-manage.com/subscribe/post?u=7d09d2d3e4c3251078a03ce5d&amp;id=747f75b19c"
                    , class "validate"
                    , id "mc-embedded-subscribe-form"
                    , method "post"
                    , name "mc-embedded-subscribe-form"
                    , novalidate True
                    , target "_blank"
                    ]
                    [ div [ id "mc_embed_signup_scroll" ]
                        [ input [ class "email", id "mce-EMAIL", name "EMAIL", placeholder "email address", required True, type' "email", value "" ] []
                        , div
                            [ attribute "aria-hidden" "true", attribute "style" "position: absolute; left: -5000px;" ]
                            [ input [ name "b_7d09d2d3e4c3251078a03ce5d_747f75b19c", tabindex -1, type' "text", value "" ] [] ]
                        , div
                            [ class "clear" ]
                            [ input [ class "button", id "mc-embedded-subscribe", name "subscribe", type' "submit", value "Subscribe" ] [] ]
                        ]
                    ]
                ]
            ]

share =
    Html.map OpenSharePopup
    <| div
        []
        [ ShareButtons.facebook
        , ShareButtons.twitter
        , ShareButtons.tumblr
        , ShareButtons.gplus
        , ShareButtons.reddit
        ]

extras = mkLinks
    [ ("MMP Halloween - 2015", "/interactive/HalloweenSpecial2015/") ]

thanksTo = mkLinks
    [ ("Christina Ramos - Art", "")
    , ("JP Welsh - Beta Reading, Editing", "")
    , ("Katie Craven - Beta Reading, Editing", "")
    , ("Nicholas La Roux - Back-end, Beta Reading", "")
    ]

mkLinks links =
    ul [] <| List.map (\(txt, url) ->
            let
                attribs =
                    if url == "" then
                        []
                    else
                        [ href url, target "_BLANK" ]
            in
                li [] [ a attribs [ text txt ] ]
        ) links
