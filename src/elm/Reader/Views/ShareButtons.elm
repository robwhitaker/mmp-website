module Reader.Views.ShareButtons exposing (Data, Msg, ShareButton, ShareLinkType(..), basicPopupSize, facebook, gplus, mkShareLink, reddit, tumblr, twitter)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import String
import Tuple exposing (first, second)
import Url.Builder as Url



---- TYPE ALIASES ----


type alias Msg =
    { data : Data }


type alias Data =
    { srcBtnClass : String
    , width : Int
    , height : Int
    , endpoint : String
    }


type ShareLinkType
    = Txt String String
    | Img String


type alias ShareButton =
    { popupDimensions : ( Int, Int )
    , linkType : ShareLinkType
    , endpoint : String
    , cssClass : String
    }



---- DEFAULTS ----


basicPopupSize : ( Int, Int )
basicPopupSize =
    ( 565, 386 )



---- BUTTON TO HTML ----


mkShareLink : ShareButton -> Html Msg
mkShareLink shareButton =
    let
        iconSrc iconUrl =
            if String.left 4 iconUrl == "http" || String.left 2 iconUrl == "//" then
                iconUrl

            else
                "/static/img/" ++ iconUrl

        btnContents =
            case shareButton.linkType of
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
    div
        [ class <| "share-btn " ++ shareButton.cssClass
        , onClick
            { data =
                { srcBtnClass = shareButton.cssClass
                , width = first shareButton.popupDimensions
                , height = second shareButton.popupDimensions
                , endpoint = shareButton.endpoint
                }
            }
        ]
        btnContents



---- BUTTONS ----


facebook : Html Msg
facebook =
    mkShareLink
        { popupDimensions = basicPopupSize
        , linkType = Txt "facebook-icon.png" "Share"
        , endpoint =
            Url.crossOrigin
                "https://www.facebook.com"
                [ "sharer", "sharer.php" ]
                [ Url.string "u" "{{% reader.metadata.ogurl %}}" ]
        , cssClass = "facebook-share-btn"
        }


twitter : Html Msg
twitter =
    mkShareLink
        { popupDimensions = basicPopupSize
        , linkType = Txt "twitter-icon.png" "Tweet"
        , endpoint =
            Url.crossOrigin
                "https://twitter.com"
                [ "intent", "tweet" ]
                [ Url.string "text" "{{% social.share.twitterText %}}"
                , Url.string "tw_p" "tweetbutton"
                , Url.string "url" "{{% reader.metadata.ogurl %}}"
                , Url.string "via" "{{% social.twitter %}}"
                ]
        , cssClass = "twitter-share-btn"
        }


tumblr : Html Msg
tumblr =
    mkShareLink
        { popupDimensions = basicPopupSize
        , linkType = Txt "tumblr-icon.png" "Post"
        , endpoint =
            Url.crossOrigin
                "https://www.tumblr.com"
                [ "widgets", "share", "tool" ]
                [ Url.string "posttype" "link"
                , Url.string "title" "{{% reader.metadata.title %}}"
                , Url.string "content" "{{% reader.metadata.ogurl %}}"
                , Url.string "canonicalUrl" "{{% reader.metadata.ogurl %}}"
                ]
        , cssClass = "tumblr-share-btn"
        }


gplus : Html Msg
gplus =
    mkShareLink
        { popupDimensions = basicPopupSize
        , linkType = Txt "google-plus-icon.png" "Share"
        , endpoint =
            Url.crossOrigin
                "//plus.google.com"
                [ "share" ]
                [ Url.string "url" "{{% reader.metadata.ogurl %}}" ]
        , cssClass = "gplus-share-btn"
        }


reddit : Html Msg
reddit =
    mkShareLink
        { popupDimensions = ( 875, 750 )
        , linkType = Img "reddit.gif"
        , endpoint =
            Url.crossOrigin
                "http://www.reddit.com"
                [ "submit" ]
                [ Url.string "url" "{{% reader.metadata.ogurl %}}" ]
        , cssClass = "reddit-share-btn"
        }
