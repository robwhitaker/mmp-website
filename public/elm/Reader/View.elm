module Reader.View exposing (..)

import Core.Utils.SelectionList as SL

import Reader.Model exposing (..)
import Reader.Messages exposing (..)
import Reader.Ports exposing (..)
import Reader.Utils as Utils

import Reader.Views.Dropdown as Dropdown
import Reader.Views.ShareButtons as ShareButtons

import Reader.Components.ShareDialog.View as ShareDialog
import Reader.Components.CreditsRoll.View as CreditsRoll
import Reader.Components.CreditsRoll.Messages as CreditsRollM
import Reader.Components.Modal.View as Modal
import Reader.Components.Modal.Messages as Modal

import Html.App as Html
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

import Markdown
import String

view : Model -> Html Msg
view model =
    let isLastPage =
            --NOTE: Logic copied from Update.elm. Maybe make a helper function?
            model.pages.current + 1 >= model.pages.total &&
                SL.traverseFromSelectedUntil
                                    SL.next
                                    (\entry -> entry.body /= "" && entry.chapter /= model.toc.selected.chapter)
                                    model.toc == Nothing
    in div []
        [ section
            [ class "reader" ]
            [ div [ class "banner" ] [ a [ href "/" ] [ div [ class "banner-logo" ] [] ] ]
            , div
                [ class "book" ]
                [ div [ class "drop-shadow" ] []
                , div --COVER LAYER
                    [ classList
                        [ ("loader cover", True)
                        , ("isDisplayed", model.showCover)
                        ]
                    , onClick CoverClick
                    ]
                    [ div
                        [ class "glow" ]
                        [ div
                            [ class "cover-txt cover-btn" ]
                            [ text <|
                                case model.bookmark of
                                    HasBookmark     -> "Resume Reading"
                                    NoBookmark      -> "Start Reading"
                                    LoadingBookmark -> "..."
                            ]
                        ]
                    ]
                , div --LOADER LAYER
                    [ classList
                        [ ("loader", True)
                        , ("isDisplayed", not model.showCover && (model.state == Rendering || model.state == Loading))
                        ]
                    ]
                    [ case model.state of
                        Loading -> div [ class "loading-label" ] [ text "Loading..." ]
                        Rendering -> div [ class "loading-label" ] [ text "Rendering..." ]
                        _ -> text ""
                    , div [ class "loading-label" ] [ img [ src "static/assets/img/ajax-loader-2.gif" ] [] ]
                    ]
                , div [ class "book-back" ]
                    [ div
                        [ classList [("book-inner",True), ("hidden", model.state == Rendering || model.state == Loading)] ]
                        [ div
                            [ class "top-bar" ]
                            [ Html.map Dropdown <| Dropdown.view model.toc model.tocExpanded ]
                        , iframe [ id "book-text-frame", src "/renderer.html", seamless True ] []
                        , div
                            [ class "bottom-bar" ]
                            [ div
                                [ class "book-arrow back-btn", onClick (TurnPage Backward) ]
                                [
                                    i [ class "fa fa-angle-left" ] []
                                ]
                            , div [ class "page-num" ] [ text <| toString (model.pages.current + 1) ] --++ " / " ++ toString model.pages.total ]
                            , div
                                [ classList [("book-arrow forward-btn", True),("btn-disabled", isLastPage)], onClick (TurnPage Forward) ]
                                [ div [ class "last-page-txt" ] [ text "Check back on Sunday!" ]
                                , i [ class "fa fa-angle-right" ] []
                                ]
                            ]
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
        , Html.map CreditsRollMsg <| CreditsRoll.view model.creditsRoll
        , Html.map ContactModalMsg <| Modal.view model.contactModal
        ]

mkFooterSection : String -> Html Msg -> Html Msg
mkFooterSection heading content =
    div [ class "link-section" ]
        [ h2 [ class "fancy-heading" ] [ text heading ]
        , content
        ]

footerHeadings = [ "Follow", "Share", "Extras" ]

footerContent = [ follow, share, extras ]

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

extras =
    ul  [] <| List.map (li [] << flip (::) [])
        [ a [ href "/extras/halloween2015/play", target "_BLANK" ] [ text "Halloween Special 2015" ]
        , a [ onClick (ContactModalMsg Modal.ShowModal) ] [ text "Contact Me" ]
        , a [ onClick (CreditsRollMsg CreditsRollM.ShowCredits) ] [ text "Credits" ]
        ]
