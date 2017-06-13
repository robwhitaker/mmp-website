port module ReleaseCountdown exposing (main)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Markdown

import Date
import Date.Format as Date
import Time exposing (Time)
import Json.Decode as Json
import Http

import Navigation

import Reader.Utils.Analytics as Analytics exposing (..)
import Reader.Views.ShareButtons as ShareButtons


main = Html.program
    { init = init
    , update = update
    , subscriptions = \_ -> Time.every Time.second SetCurrentTime
    , view = view
    }

-- Init

init : (Model, Cmd Msg)
init =
    let nextEntryRequest = Http.get "/api/next" Json.string
        nextEntryRequestHandle =
            Result.mapError toString --to make the type signature of andThen match
                >> Result.andThen (Date.fromString)
                >> Result.map Date.toTime
                >> SetNextReleaseDate
        requestCmd = Http.send nextEntryRequestHandle nextEntryRequest
    in (empty, requestCmd)

-- Model

type alias Model =
    { nextReleaseDate : Result String Time
    , currentTime     : Time
    , showShare       : Bool
    }

empty : Model
empty =
    { nextReleaseDate = Err "Loading..."
    , currentTime     = 0
    , showShare       = False
    }

-- Update

type Msg
    = SetNextReleaseDate (Result String Time)
    | SetCurrentTime Time
    | OpenSharePopup ShareButtons.Msg
    | ToggleShowShare

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        SetNextReleaseDate timeResult ->
            { model | nextReleaseDate = timeResult }
                ! []

        SetCurrentTime time ->
            { model | currentTime = time }
                ! [ case model.nextReleaseDate of
                        Err _ -> Cmd.none
                        Ok releaseDate ->
                            if releaseDate - time <= 0
                            then Navigation.reloadAndSkipCache
                            else Cmd.none
                  ]

        -- DUPLICATED FROM Reader.Update
        OpenSharePopup sharePopupSettings ->
            model
                ! [ openSharePopup sharePopupSettings.data ]

        ToggleShowShare ->
            { model | showShare = not model.showShare }
                ! []

-- View

view : Model -> Html Msg
view model =
    div []
        [ section
            []
            [ div
                [ class "container" ]
                [ div
                    [ id "social-shelf", classList [("expanded", model.showShare)] ]
                    [ shareButtons
                    , div
                        [ id "expand-share"
                        , onClick ToggleShowShare
                        ] [ text "Share" ]
                    , follow
                    ]
                , div
                    [ class "banner" ]
                    [ a [ href "/" ] [ div [ class "banner-logo" ] [] ] ]
                , timerView model
                , Markdown.toHtml [ class "summary-blurb" ] summaryBlurb
                , div
                    [ class "preview-sub" ]
                    [ div
                        [ class "preview" ]
                        [ iframe
                            [ src "{{% countdown.video %}}"
                            , attribute "frameborder" "0"
                            , attribute "allowfullscreen" ""
                            ] []
                        ]
                    , div [ class "spacer" ] []
                    , div
                        [ class "subscribe" ]
                        [ mailchimpForm ]
                    ]
                , testimonialsView
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
timerView { nextReleaseDate, currentTime } =
    let day = Time.hour * 24
        showTimer time = Tuple.second <|
            List.foldl (\(unit,label) (t,htmlOutList) ->
                let timeInUnit = floor (t / unit)
                    pluralizedLabel = if timeInUnit == 1 then label else label ++ "s"
                    timeString = if String.length (toString timeInUnit) == 1
                                 then "0" ++ toString timeInUnit
                                 else toString timeInUnit
                    outHtml =
                        div [ class "timer-field" ]
                            [ div [] [ text timeString ]
                            , div [] [ text pluralizedLabel ]
                            ]
                    newT = t - (toFloat timeInUnit * unit)
                in (newT,htmlOutList++[outHtml])
            ) (time,[]) [(day,"day"),(Time.hour,"hour"),(Time.minute,"minute"),(Time.second,"second")]
    in
        case nextReleaseDate of
            Err str -> 
                if str == "Loading..." then
                    div [ id "countdown-timer" ]
                        [ h1 [] [ text str ] ] 
                else
                    div [] []
            Ok releaseDate ->
                div [ id "countdown-timer" ]
                    [ h1
                        []
                        [ text "{{% countdown.preDateText %}} "
                        , span
                            [ class "highlight-color" ]
                            [ text <| Date.format "%m/%d/%y" (Date.fromTime releaseDate) ]
                        ]
                    , div
                        [ class "timer" ]
                        (showTimer <| releaseDate - currentTime)
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
                        [ input [ class "button", id "mc-embedded-subscribe", name "subscribe", type_ "submit", value "Subscribe" ]
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
    let mkIcon (iconUrl, dest) =
            a [ href dest, target "_BLANK" ]
              [ img [ src <| "/static/img/" ++ iconUrl ] [] ]

        icons =
            [ ("facebook-icon.png", "https://www.facebook.com/{{% social.facebook %}}/")
            , ("twitter-icon.png", "https://twitter.com/{{% social.twitter %}}")
            , ("ello-icon.jpg", "https://ello.co/{{% social.ello %}}")
            , ("rss-icon.png", "/rss")
            ]
    in div [ class "social-follow" ] <| List.map mkIcon icons


testimonialsView : Html Msg
testimonialsView =
    let testimonialsHtml =
            List.indexedMap (\i (dialogue,char) ->
                div [ class <| if i % 2 == 0 then "left-align" else "right-align" ]
                    [ Markdown.toHtml [] <| String.concat ["\"", dialogue, "\""]
                    , div [ class "attribution" ] [ text <| "— " ++ char ]
                    ]
            ) testimonials
    in
        div [ class "testimonials" ] <|
            h2 [] [ text "{{% countdown.testimonials.intro %}} " ] ::
            testimonialsHtml ++
            [ Markdown.toHtml
                [ class "center-align" ]
                "\"_**{{% countdown.testimonials.final %}}**_\""
            ]


-- Wiring

port openSharePopup       : ShareButtons.Data -> Cmd msg

-- Static data that should be elsewhere

summaryBlurb : String
summaryBlurb = """
### _Midnight Murder Party_ {{% countdown.summaryBlurb.headline %}}

{{% countdown.summaryBlurb.description %}}
"""

testimonials : List (String, String)
testimonials = List.map2 (,)
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
