module Reader.Views.ShareButtons exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

import String
import Tuple exposing (first,second)
import Http exposing (encodeUri)

import Reader.Utils.Analytics exposing (LabelShareMethod(..))

---- TYPE ALIASES ----

type alias Msg =
    { data : Data
    , analyticsLabel : LabelShareMethod
    }

type alias Data =
    { srcBtnClass   : String
    , width         : Int
    , height        : Int
    , endpoint      : String
    }
type ShareLinkType = Txt String String | Img String

type alias ShareButton =
    { popupDimensions : (Int, Int)
    , linkType        : ShareLinkType
    , endpoint        : String
    , cssClass        : String
    , analyticsType   : LabelShareMethod
    }

---- DEFAULTS ----

basicPopupSize : (Int, Int)
basicPopupSize = (565,386)

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
        div [ class <| "share-btn " ++ shareButton.cssClass
            , onClick
                { data =
                    { srcBtnClass = shareButton.cssClass
                    , width = first shareButton.popupDimensions
                    , height = second shareButton.popupDimensions
                    , endpoint = shareButton.endpoint
                    }
                , analyticsLabel = shareButton.analyticsType
                }
            ] btnContents

---- BUTTONS ----

facebook : Html Msg
facebook = mkShareLink
    { popupDimensions = basicPopupSize
    , linkType = Txt "facebook-icon.png" "Share"
    , endpoint = "https://www.facebook.com/sharer/sharer.php?u=" ++ encodeUri "{{% reader.metadata.ogurl %}}"
    , cssClass = "facebook-share-btn"
    , analyticsType = ShareFacebook
    }

twitter : Html Msg
twitter = mkShareLink
    { popupDimensions = basicPopupSize
    , linkType = Txt "twitter-icon.png" "Tweet"
    , endpoint = "https://twitter.com/intent/tweet?text=" ++ encodeUri "{{% social.share.twitterText %}}" ++ "&tw_p=tweetbutton&url=" ++ encodeUri "{{% reader.metadata.ogurl %}}" ++ "&via={{% social.twitter %}}"
    , cssClass = "twitter-share-btn"
    , analyticsType = ShareTwitter
    }

tumblr : Html Msg
tumblr = mkShareLink
    { popupDimensions = basicPopupSize
    , linkType = Txt "tumblr-icon.png" "Post"
    , endpoint = "https://www.tumblr.com/widgets/share/tool?posttype=link&title=" ++ encodeUri "{{% reader.metadata.title %}}" ++ "&content=" ++ encodeUri "{{% reader.metadata.ogurl %}}" ++ "&canonicalUrl=" ++ encodeUri "{{% reader.metadata.ogurl %}}"
    , cssClass = "tumblr-share-btn"
    , analyticsType = ShareTumblr
    }

gplus : Html Msg
gplus = mkShareLink
    { popupDimensions = basicPopupSize
    , linkType = Txt "google-plus-icon.png" "Share"
    , endpoint = "//plus.google.com/share?url=" ++ encodeUri "{{% reader.metadata.ogurl %}}"
    , cssClass = "gplus-share-btn"
    , analyticsType = ShareGooglePlus
    }

reddit : Html Msg
reddit = mkShareLink
    { popupDimensions = (875,750)
    , linkType = Img "reddit.gif"
    , endpoint = "http://www.reddit.com/submit?url=" ++ encodeUri "{{% reader.metadata.ogurl %}}"
    , cssClass = "reddit-share-btn"
    , analyticsType = ShareReddit
    }
