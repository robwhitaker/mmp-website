module ReleaseCountdown exposing (main)

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

import Core.HTTP.Requests as Requests


main = Html.program
    { init = init
    , update = update
    , subscriptions = \_ -> Time.every Time.second SetCurrentTime
    , view = view
    }

-- Init

init : (Model, Cmd Msg)
init =
    let nextEntryRequest = Requests.mkRequest Nothing Requests.Get (Json.string) "/next"
        nextEntryRequestHandle =
            Result.mapError (always "") --to make the type signature of andThen match
                >> Result.andThen (Date.fromString)
                >> Result.map (SetNextReleaseDate << Date.toTime)
                >> Result.withDefault (SetNextReleaseDate 0)
        requestCmd = Http.send nextEntryRequestHandle nextEntryRequest
    in (empty, requestCmd)

-- Model

type alias Model =
    { nextReleaseDate : Time
    , currentTime     : Time
    }

empty : Model
empty =
    { nextReleaseDate = 0
    , currentTime     = 0
    }

-- Update

type Msg = SetNextReleaseDate Time | SetCurrentTime Time

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        SetNextReleaseDate time ->
            { model | nextReleaseDate = time }
                ! []

        SetCurrentTime time ->
            { model | currentTime = time }
                ! [ if model.nextReleaseDate - time <= 0
                    then Navigation.reloadAndSkipCache
                    else Cmd.none
                  ]

-- View

view : Model -> Html Msg
view model =
    div []
        [ section
            []
            [ div
                [ class "container" ]
                [ div
                    [ class "banner" ]
                    [ a [ href "/" ] [ div [ class "banner-logo" ] [] ] ]
                , timerView model
                , Markdown.toHtml [ class "summary-blurb" ] summaryBlurb
                , div
                    [ class "preview-sub" ]
                    [ div
                        [ class "preview" ]
                        [ iframe
                            [ src "https://www.youtube.com/embed/6ttgY6ygHqk"
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
        div [ id "countdown-timer" ]
            [ h1
                []
                [ text "The party begins on "
                , span
                    [ class "highlight-color" ]
                    [ text <| Date.format "%m/%d/%y" (Date.fromTime nextReleaseDate) ]
                ]
            , div
                [ class "timer" ]
                (showTimer <| nextReleaseDate - currentTime)
            ]

mailchimpForm : Html Msg
mailchimpForm =
    div [ id "mc_embed_signup" ]
        [ Html.form [ action "//midnightmurderparty.us11.list-manage.com/subscribe/post?u=7d09d2d3e4c3251078a03ce5d&id=c64c3b7e69", class "validate", id "mc-embedded-subscribe-form", method "post", name "mc-embedded-subscribe-form", attribute "novalidate" "", target "_blank" ]
            [ div [ id "mc_embed_signup_scroll" ]
                [ h2 []
                    [ text "I'm in! Let me know when "
                    , span [ class "mmp-title" ] [ text "Midnight Murder Party" ]
                    , text " comes out!"
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
                                [ text "Also notify me whenever there is a new release" ]
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
                        [ input [ name "b_7d09d2d3e4c3251078a03ce5d_c64c3b7e69", attribute "tabindex" "-1", type_ "text", value "" ]
                            []
                        ]
                    , div [ class "clear" ]
                        [ input [ class "button", id "mc-embedded-subscribe", name "subscribe", type_ "submit", value "Subscribe" ]
                            []
                        ]
                    ]
                ]
            ]

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
            h2 [] [ text "Testimonials from the partygoers: " ] ::
            testimonialsHtml ++
            [ Markdown.toHtml
                [ class "center-align" ]
                "\"_**Come on over and join the Party, Reader!**_\""
            ]

summaryBlurb : String
summaryBlurb = """
### _Midnight Murder Party_ is a lighthearted, gore-filled murder-fest, and you're invited!

You hold in your hands a gold-trimmed invitation to the Midnight Murder Party, a serial novel that combines comedy and horror. Prepare to enter a world where resurrection is the norm, killing each other is a game, and being dismembered over the last cookie is expected. The hostess of the Party, Arlene, eagerly awaits your response. What do you say, Reader?
"""

testimonials : List (String, String)
testimonials =
    [ (,) "My Parties are always a _bloody_  good time!" "Arlene"
    , (,) "Wanna see me kill Marc, like, a lot?" "Marissa"
    , (,) "A ‘bloody good time?’ Really, Arlene?" "Marc"
    , (,) "..." "Aidan"
    , (,) "Marc, tell your creepy brother to stop staring at me." "Marissa"
    , (,) "Aidan, stop staring at Marissa." "Marc"
    , (,) "Excuse me. Have you finished the testimonials? The tea is ready." "April"
    , (,) "Who cares about stupid tea? Where are the _cookies_?" "Marissa"
    , (,) "Those will be out in a moment." "April"
    , (,) "_Heck yeah!_" "Marissa"
    , (,) "Oh, goodness. It seems we've gotten off topic. Well then, everyone, all together now..." "Arlene"
    ]
