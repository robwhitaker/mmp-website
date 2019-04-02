port module ReleaseCountdown exposing (main)

import Browser
import Browser.Navigation as Navigation
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Iso8601
import Json.Decode as Json
import Markdown
import Reader.Views.ShareButtons as ShareButtons
import Task
import Time exposing (Month(..), Posix)


main : Program () Model Msg
main =
    Browser.element
        { init = \_ -> init
        , update = update
        , subscriptions = \_ -> Time.every 1000 SetCurrentTime
        , view = view
        }



-- Init


init : ( Model, Cmd Msg )
init =
    let
        nextEntryRequestHandle =
            Result.mapError (always [])
                >> Result.andThen Iso8601.toTime
                >> Result.mapError (always "")
                >> SetNextReleaseDate

        nextEntryRequest =
            Http.get
                { url = "/api/next"
                , expect = Http.expectString nextEntryRequestHandle
                }

        timezoneCmd =
            Task.perform SetTimezone Time.here
    in
    ( empty, Cmd.batch [ nextEntryRequest, timezoneCmd ] )



-- Model


type alias Model =
    { nextReleaseDate : Result String Posix
    , currentTime : Posix
    , showShare : Bool
    , timezone : Time.Zone
    }


empty : Model
empty =
    { nextReleaseDate = Err "Loading..."
    , currentTime = Time.millisToPosix 0
    , showShare = False
    , timezone = Time.utc
    }



-- Update


type Msg
    = SetNextReleaseDate (Result String Posix)
    | SetCurrentTime Posix
    | SetTimezone Time.Zone
    | OpenSharePopup ShareButtons.Msg
    | ToggleShowShare


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SetTimezone zone ->
            ( { model | timezone = zone }
            , Cmd.none
            )

        SetNextReleaseDate timeResult ->
            ( { model | nextReleaseDate = timeResult }
            , Cmd.none
            )

        SetCurrentTime time ->
            ( { model | currentTime = time }
            , case model.nextReleaseDate of
                Err _ ->
                    Cmd.none

                Ok releaseDate ->
                    if Time.posixToMillis releaseDate - Time.posixToMillis time <= 0 then
                        Navigation.reloadAndSkipCache

                    else
                        Cmd.none
            )

        -- DUPLICATED FROM Reader.Update
        OpenSharePopup sharePopupSettings ->
            ( model
            , openSharePopup sharePopupSettings.data
            )

        ToggleShowShare ->
            ( { model | showShare = not model.showShare }
            , Cmd.none
            )



-- View


view : Model -> Html Msg
view model =
    div []
        [ section
            []
            [ div
                [ class "container" ]
                [ div
                    [ id "social-shelf", classList [ ( "expanded", model.showShare ) ] ]
                    [ shareButtons
                    , div
                        [ id "expand-share"
                        , onClick ToggleShowShare
                        ]
                        [ text "Share" ]
                    , follow
                    ]
                , a [ href "/", class "banner-img" ]
                    [ img [ src "/static/img/MMPLogoFinal.png" ] [] ]
                , timerView model
                , div
                    [ class "summary-blurb" ]
                    [ Markdown.toHtml [] summaryHeader
                    , div
                        [ class "tea-room-img" ]
                        [ img [ src "/static/img/tea-room.png" ] []
                        , span [] [ text "Art by Soupery" ]
                        ]
                    , Markdown.toHtml [ class "blurb" ] summaryBlurb
                    , div [ style "clear" "both" ] []
                    , -- div
                      -- [ class "preview-sub" ]
                      -- [
                      -- [ iframe
                      --     [ src "{{% countdown.video %}}"
                      --     , attribute "frameborder" "0"
                      --     , attribute "allowfullscreen" ""
                      --     ] []
                      -- ]
                      -- , div [ class "spacer" ] []
                      -- ,
                      div
                        [ class "subscribe" ]
                        [ mailchimpForm ]

                    --]
                    ]
                , testimonialsView
                , a
                    [ href "#mc_embed_signup", class "button" ]
                    [ text "Join the Party!" ]
                , footer
                    []
                    [ Markdown.toHtml
                        []
                        "{{% countdown.metadata.copy %}}"
                    ]
                ]
            ]
        ]


timerView : Model -> Html Msg
timerView { nextReleaseDate, currentTime, timezone } =
    let
        second =
            1000

        minute =
            second * 60

        hour =
            minute * 60

        day =
            hour * 24

        showTimer time =
            Tuple.second <|
                List.foldl
                    (\( unit, label ) ( t, htmlOutList ) ->
                        let
                            timeInUnit =
                                t // unit

                            pluralizedLabel =
                                if timeInUnit == 1 then
                                    label

                                else
                                    label ++ "s"

                            timeString =
                                if String.length (String.fromInt timeInUnit) == 1 then
                                    "0" ++ String.fromInt timeInUnit

                                else
                                    String.fromInt timeInUnit

                            outHtml =
                                div [ class "timer-field" ]
                                    [ div [] [ text timeString ]
                                    , div [] [ text pluralizedLabel ]
                                    ]

                            newT =
                                t - (timeInUnit * unit)
                        in
                        ( newT, htmlOutList ++ [ outHtml ] )
                    )
                    ( time, [] )
                    [ ( day, "day" ), ( hour, "hour" ), ( minute, "minute" ), ( second, "second" ) ]

        formatDate time =
            let
                releaseYear =
                    String.fromInt (Time.toYear timezone time)

                releaseMonth =
                    case Time.toMonth timezone time of
                        Jan ->
                            "01"

                        Feb ->
                            "02"

                        Mar ->
                            "03"

                        Apr ->
                            "04"

                        May ->
                            "05"

                        Jun ->
                            "06"

                        Jul ->
                            "07"

                        Aug ->
                            "08"

                        Sep ->
                            "09"

                        Oct ->
                            "10"

                        Nov ->
                            "11"

                        Dec ->
                            "12"

                releaseDay =
                    String.right 2 ("0" ++ String.fromInt (Time.toDay timezone time))
            in
            releaseMonth ++ "/" ++ releaseDay ++ "/" ++ releaseYear
    in
    case nextReleaseDate of
        Err str ->
            if str == "Loading..." then
                div [ id "countdown-timer" ]
                    [ h1 [] [ text str ] ]

            else
                div [ id "countdown-timer" ]
                    [ h1 [] [ text "Coming October 2019" ] ]

        Ok releaseDate ->
            div [ id "countdown-timer" ]
                [ h1
                    []
                    [ text "{{% countdown.preDateText %}} "
                    , span
                        [ class "highlight-color" ]
                        [ text <| formatDate releaseDate ]
                    ]
                , div
                    [ class "timer" ]
                    (showTimer <| Time.posixToMillis releaseDate - Time.posixToMillis currentTime)
                ]


mailchimpForm : Html Msg
mailchimpForm =
    div [ id "mc_embed_signup" ]
        [ Html.form [ action "//{{% mailchimp.subdomain %}}.us11.list-manage.com/subscribe/post?u={{% mailchimp.u %}}&id={{% mailchimp.listId.initialRelease %}}", class "validate", id "mc-embedded-subscribe-form", method "post", name "mc-embedded-subscribe-form", attribute "novalidate" "", target "_blank" ]
            [ div [ id "mc_embed_signup_scroll" ]
                [ h2 []
                    [ text "{{% countdown.formAcceptText1 %}} "
                    , span [ class "mmp-title" ] [ text "Midnight Murder Party" ]
                    , text " {{% countdown.formAcceptText2 %}}"
                    ]
                , div [ class "mc-field-group" ]
                    [ label [ for "mce-EMAIL", class "header-label" ]
                        [ text "Email Address  "
                        , span [ class "asterisk" ]
                            [ text "*" ]
                        ]
                    , input [ class "required email", id "mce-EMAIL", name "EMAIL", type_ "email", value "" ]
                        []
                    ]
                , div [ class "mc-field-group input-group" ]
                    [ ul []
                        [ li []
                            [ input [ id "mce-group[16105]-16105-0", name "group[16105][1]", type_ "checkbox", value "1" ]
                                []
                            , label [ for "mce-group[16105]-16105-0" ]
                                [ text "{{% countdown.notifyReleaseText %}}" ]
                            ]
                        ]
                    ]
                , div [ class "clear", id "mce-responses" ]
                    [ div [ class "response", id "mce-error-response", attribute "style" "display:none" ]
                        []
                    , div [ class "response", id "mce-success-response", attribute "style" "display:none" ]
                        []
                    ]
                , div [ attribute "aria-hidden" "true", attribute "style" "position: absolute; left: -5000px;" ]
                    [ input [ name "b_{{% mailchimp.u %}}_{{% mailchimp.listId.initialRelease %}}", attribute "tabindex" "-1", type_ "text", value "" ]
                        []
                    ]
                , div [ class "clear" ]
                    [ input [ class "button", id "mc-embedded-subscribe", name "subscribe", type_ "submit", value "Join the Party!" ]
                        []
                    ]
                ]
            ]
        ]



-- COPIED FROM Reader.View


shareButtons =
    Html.map OpenSharePopup <|
        div
            [ class "share-buttons" ]
            [ ShareButtons.facebook
            , ShareButtons.twitter
            , ShareButtons.tumblr
            , ShareButtons.gplus
            , ShareButtons.reddit
            ]


follow =
    let
        mkIcon ( iconUrl, dest ) =
            a [ href dest, target "_BLANK" ]
                [ img [ src <| "/static/img/" ++ iconUrl ] [] ]

        icons =
            [ ( "facebook-icon.png", "https://www.facebook.com/{{% social.facebook %}}/" )
            , ( "twitter-icon.png", "https://twitter.com/{{% social.twitter %}}" )
            , ( "ello-icon.jpg", "https://ello.co/{{% social.ello %}}" )
            , ( "rss-icon.png", "/rss" )
            ]
    in
    div [ class "social-follow" ] <| List.map mkIcon icons


testimonialsView : Html Msg
testimonialsView =
    let
        testimonialsHtml =
            List.indexedMap
                (\i ( dialogue, char ) ->
                    div
                        [ class <|
                            if modBy 2 i == 0 then
                                "left-align"

                            else
                                "right-align"
                        ]
                        [ Markdown.toHtml [] <| String.concat [ "\"", dialogue, "\"" ]
                        , div [ class "attribution" ] [ text <| "— " ++ char ]
                        ]
                )
                testimonials
    in
    div [ class "testimonials" ] <|
        h2 [] [ text "{{% countdown.testimonials.intro %}} " ]
            :: testimonialsHtml
            ++ [ Markdown.toHtml
                    [ class "center-align" ]
                    "\"_**{{% countdown.testimonials.final %}}**_\""
               ]



-- Wiring


port openSharePopup : ShareButtons.Data -> Cmd msg



-- Static data that should be elsewhere


summaryHeader : String
summaryHeader =
    """### _Midnight Murder Party_ {{% countdown.summaryBlurb.headline %}}"""


summaryBlurb : String
summaryBlurb =
    """{{% countdown.summaryBlurb.description %}}"""


testimonials : List ( String, String )
testimonials =
    List.map2 (\a b -> ( a, b ))
        [ "{{% countdown.testimonials.content.0.text %}}"
        , "{{% countdown.testimonials.content.1.text %}}"
        , "{{% countdown.testimonials.content.2.text %}}"
        , "{{% countdown.testimonials.content.3.text %}}"
        , "{{% countdown.testimonials.content.4.text %}}"
        , "{{% countdown.testimonials.content.5.text %}}"
        , "{{% countdown.testimonials.content.6.text %}}"
        , "{{% countdown.testimonials.content.7.text %}}"
        , "{{% countdown.testimonials.content.8.text %}}"
        , "{{% countdown.testimonials.content.9.text %}}"
        , "{{% countdown.testimonials.content.10.text %}}"
        ]
        [ "{{% countdown.testimonials.content.0.by %}}"
        , "{{% countdown.testimonials.content.1.by %}}"
        , "{{% countdown.testimonials.content.2.by %}}"
        , "{{% countdown.testimonials.content.3.by %}}"
        , "{{% countdown.testimonials.content.4.by %}}"
        , "{{% countdown.testimonials.content.5.by %}}"
        , "{{% countdown.testimonials.content.6.by %}}"
        , "{{% countdown.testimonials.content.7.by %}}"
        , "{{% countdown.testimonials.content.8.by %}}"
        , "{{% countdown.testimonials.content.9.by %}}"
        , "{{% countdown.testimonials.content.10.by %}}"
        ]
