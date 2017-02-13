module ReleaseCountdown exposing (main)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

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
                    , div
                        [ class "subscribe" ]
                        [ h1 [] [ text "Tell me when Midnight Murder Party comes out!" ]
                        , div
                            [ id "mc_embed_signup" ]
                            [ Html.form
                                [ action "//{{% mailchimp.subdomain %}}.us11.list-manage.com/subscribe/post?u={{% mailchimp.u %}}&amp;id={{% mailchimp.id %}}"
                                , class "validate"
                                , id "mc-embedded-subscribe-form"
                                , method "post"
                                , name "mc-embedded-subscribe-form"
                                , novalidate True
                                , target "_blank"
                                ]
                                [ div [ id "mc_embed_signup_scroll" ]
                                    [ input [ class "email", id "mce-EMAIL", name "EMAIL", placeholder "email address", required True, type_ "email", value "" ] []
                                    , div
                                        [ attribute "aria-hidden" "true", attribute "style" "position: absolute; left: -5000px;" ]
                                        [ input [ name "b_{{% mailchimp.u %}}_{{% mailchimp.id %}}", tabindex -1, type_ "text", value "" ] [] ]
                                    , button
                                        [ class "button", id "mc-embedded-subscribe", name "subscribe", type_ "submit" ]
                                        [ i [ class "fa fa-envelope-o", attribute "aria-hidden" "true" ] []
                                        , text " Subscribe"
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        , footer [] []
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
            [ h1  [] [ text <| "The party begins on " ++ Date.format "%m/%d/%y" (Date.fromTime nextReleaseDate) ]
            , div [ class "timer" ] (showTimer <| nextReleaseDate - currentTime)
            ]
