module Reader.View where

import Reader.Model exposing (..)
import Reader.Update exposing (Action(..))
import Reader.Components.Dropdown as Dropdown

import Reader.Utils as Utils

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

import Markdown
import String

view : Signal.Address { id : String, width: Int, height: Int } -> Signal.Address Action -> Model -> Html
view shareBtnAddress address model =
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
            , div
                [ classList [ ("share-dialog-container", True), ("no-display", not model.showShareDialog), ("fade-out", model.fadingShareDialog) ] ]
                [ div
                    [ class "overlay", onClick address <| HideShareDialogIn 400 ]
                    []
                , div
                    [ class "share-dialog" ]
                    [ i [ class "fa fa-times fa-6 close", attribute "aria-hidden" "true", onClick address <| HideShareDialogIn 400 ] []
                    , h2 [ class "fancy-heading" ] [ text "Share" ]
                    , div
                        [ class "url-container" ]
                        [ input [ disabled True, value <| "localhost:4567" ++ if model.shareFromHeading then "/#!/" ++ model.toc.selected.id else "" ] [] ]
                    , input
                        [ type' "checkbox"
                        , checked model.shareFromHeading
                        , on "change" targetChecked <| Signal.message address << ShareFromHeading
                        ] []
                    , span [] [ text <| "Share from current heading "]
                    , span [ class "share-section-title" ] [ text <| "(" ++ Utils.selectedTitleFromSL model.toc ++ ")" ]
                    , span [] [ text "?" ]
                    , div
                        [ class "social-media-buttons" ]
                        [ fbShareLink      shareBtnAddress "fb-inline-share"      ""
                        , twitterShareLink shareBtnAddress "twitter-inline-share" ""
                        , tumblrShareLink  shareBtnAddress "tumblr-inline-share"  ""
                        , gplusShareLink   shareBtnAddress "gplus-inline-share"   ""
                        , redditShareLink  shareBtnAddress "reddit-inline-share"  ""
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
            [ div [ class "footer-link-block" ] <| List.map2 mkFooterSection footerHeadings <| footerContent shareBtnAddress
            , div [ class "copy" ] [ text "© Midnight Murder Party 2015-2016" ]
            ]
        ]

mkFooterSection : String -> Html -> Html
mkFooterSection heading content =
    div [ class "link-section" ]
        [ h2 [ class "fancy-heading" ] [ text heading ]
        , content
        ]

footerHeadings = [ "Follow", "Share", "Extras", "Thanks to..." ]

footerContent addr = [ follow, share addr, extras, thanksTo ]

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

share addr =
    div []
        [ fbShareLink      addr "fb-footer-share"      ""
        , twitterShareLink addr "twitter-footer-share" ""
        , tumblrShareLink  addr "tumblr-footer-share"  ""
        , gplusShareLink   addr "gplus-footer-share"   ""
        , redditShareLink  addr "reddit-footer-share"  ""
        ]

basicPopupSize = (565,386)

fbShareLink addr domId hId =
    mkShareLink
        addr
        basicPopupSize
        domId
        (Txt "facebook-icon.png" "Share")
        ("https://www.facebook.com/sharer/sharer.php?u=http%3A//midnightmurderparty.com" ++ if hId /= "" then "%2F%23!%2F" ++ hId else "")
        "facebook-share-btn"

twitterShareLink addr domId hId =
    mkShareLink
        addr
        basicPopupSize
        domId
        (Txt "twitter-icon.png" "Tweet")
        ("https://twitter.com/intent/tweet?text=Join%20in%20on%20a%20night%20of%20silly%20shenanigans%2C%20spooky%20stories%2C%20and%20murder%20at%20the%20Midnight%20Murder%20Party!&tw_p=tweetbutton&url=http%3A%2F%2Fmidnightmurderparty.com" ++ if hId /= "" then "%2F%23!%2F" ++ hId else "" ++ "&via=MMPWebSeries")
        "twitter-share-btn"

tumblrShareLink addr domId hId =
    mkShareLink
        addr
        basicPopupSize
        domId
        (Txt "tumblr-icon.png" "Post")
        ("https://www.tumblr.com/widgets/share/tool?posttype=link&title=Midnight%20Murder%20Party&content=http%3A%2F%2Fwww.midnightmurderparty.com" ++ if hId /= "" then "%2F%23!%2F" ++ hId else "" ++ "&tags=novel%2C%20web%20comic%2C%20midnight%20murder%20party%2C%20MMP%2C%20episodic%2C%20horror&canonicalUrl=http%3A%2F%2Fwww.midnightmurderparty.com")
        "tumblr-share-btn"

gplusShareLink addr domId hId =
    mkShareLink
        addr
        basicPopupSize
        domId
        (Txt "//www.gstatic.com/images/icons/gplus-32.png" "Share")
        ("//plus.google.com/share?url=http%3A%2F%2Fwww.midnightmurderparty.com" ++ if hId /= "" then "%2F%23!%2F" ++ hId else "")
        "gplus-share-btn"

redditShareLink addr domId hId =
    mkShareLink
        addr
        (875,750)
        domId
        (Img "//www.redditstatic.com/spreddit8.gif")
        ("http://www.reddit.com/submit?url=http%3A%2F%2Fwww.midnightmurderparty.com" ++ if hId /= "" then "%2F%23!%2F" ++ hId else "")
        "reddit-share-btn"

extras = mkLinks
    [ ("MMP Halloween - 2015", "/interactive/HalloweenSpecial2015/") ]

thanksTo = mkLinks
    [ ("Christina Ramos - Art", "")
    , ("JP Welsh - Beta Reading, Editing", "")
    , ("Katie Craven - Beta Reading, Editing", "")
    , ("Nicholas La Roux - Back-end, Beta Reading", "")
    ]

type ShareLinkType = Txt String String | Img String

mkShareLink : Signal.Address { id : String, width: Int, height: Int } -> (Int, Int) -> String -> ShareLinkType -> String -> String -> Html
mkShareLink outputAddress (width, height) btnId linkType endpoint cssClass =
    let
        iconSrc iconUrl =
            if String.left 4 iconUrl == "http" || String.left 2 iconUrl == "//" then
                iconUrl
            else "/static/assets/img/" ++ iconUrl

        btnContents =
            case linkType of
                Txt iconUrl label ->
                    [ img [ src <| iconSrc iconUrl ] []
                    , span [] [ text label ]
                    , div [ class "hover-overlay" ] []
                    ]

                Img iconUrl ->
                    [ img [ src <| iconSrc iconUrl ] []
                    , div [ class "hover-overlay" ] []
                    ]
    in
        div [ class <| "share-btn " ++ cssClass
            , attribute "data-endpoint" endpoint
            , id btnId
            , onClick outputAddress { id = btnId, width = width, height = height }
            ] btnContents


