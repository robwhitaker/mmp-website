module Reader.Views.ShareButtons exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

import String
import Tuple exposing (first,second)

---- TYPE ALIASES ----

type alias Msg =
    { srcBtnClass : String
    , width       : Int
    , height      : Int
    , endpoint    : String
    }

type ShareLinkType = Txt String String | Img String

type alias ShareButton =
    { popupDimensions : (Int, Int)
    , linkType        : ShareLinkType
    , endpoint        : String
    , cssClass        : String
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
                "/static/assets/img/" ++ iconUrl

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
                { srcBtnClass = shareButton.cssClass
                , width = first shareButton.popupDimensions
                , height = second shareButton.popupDimensions
                , endpoint = shareButton.endpoint
                }
            ] btnContents

---- BUTTONS ----

facebook : Html Msg
facebook = mkShareLink
    { popupDimensions = basicPopupSize
    , linkType = Txt "facebook-icon.png" "Share"
    , endpoint = "https://www.facebook.com/sharer/sharer.php?u=http%3A//midnightmurderparty.com"
    , cssClass = "facebook-share-btn"
    }

twitter : Html Msg
twitter = mkShareLink
    { popupDimensions = basicPopupSize
    , linkType = Txt "twitter-icon.png" "Tweet"
    , endpoint = "https://twitter.com/intent/tweet?text=Join%20in%20on%20a%20night%20of%20silly%20shenanigans%2C%20spooky%20stories%2C%20and%20murder%20at%20the%20Midnight%20Murder%20Party!&tw_p=tweetbutton&url=http%3A%2F%2Fmidnightmurderparty.com&via=MMPWebSeries"
    , cssClass = "twitter-share-btn"
    }

tumblr : Html Msg
tumblr = mkShareLink
    { popupDimensions = basicPopupSize
    , linkType = Txt "tumblr-icon.png" "Post"
    , endpoint = "https://www.tumblr.com/widgets/share/tool?posttype=link&title=Midnight%20Murder%20Party&content=http%3A%2F%2Fwww.midnightmurderparty.com&tags=novel%2C%20web%20comic%2C%20midnight%20murder%20party%2C%20MMP%2C%20episodic%2C%20horror&canonicalUrl=http%3A%2F%2Fwww.midnightmurderparty.com"
    , cssClass = "tumblr-share-btn"
    }

gplus : Html Msg
gplus = mkShareLink
    { popupDimensions = basicPopupSize
    , linkType = Txt "//www.gstatic.com/images/icons/gplus-32.png" "Share"
    , endpoint = "//plus.google.com/share?url=http%3A%2F%2Fwww.midnightmurderparty.com"
    , cssClass = "gplus-share-btn"
    }

reddit : Html Msg
reddit = mkShareLink
    { popupDimensions = (875,750)
    , linkType = Img "//www.redditstatic.com/spreddit8.gif"
    , endpoint = "http://www.reddit.com/submit?url=http%3A%2F%2Fwww.midnightmurderparty.com"
    , cssClass = "reddit-share-btn"
    }
