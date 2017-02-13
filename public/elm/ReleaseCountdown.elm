module ReleaseCountdown exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

import Date.Format as Date
import Date
import Time exposing (Time)

view : Time -> Time -> Html ()
view nextReleaseDate currentTime =
    let day = Time.hour * 24
        showTimer time = Tuple.second <|
            List.foldl (\(unit,label) (t,htmlOutList) ->
                let timeInUnit = floor (t / unit)
                    pluralizedLabel = if timeInUnit == 1 then label else label ++ "s"
                    outHtml =
                        div [ class "timer-field" ]
                            [ div [] [ text (toString timeInUnit) ]
                            , div [] [ text pluralizedLabel ]
                            ]
                    newT = t - (toFloat timeInUnit * unit)
                in (newT,htmlOutList++[outHtml])
            ) (time,[]) [(day,"day"),(Time.hour,"hour"),(Time.minute,"minute"),(Time.second,"second")]
    in
        div [ id "countdown-timer" ]
            [ h1  [] [ text <| "The party begins on " ++ Date.format "%m/%d/%y" (Date.fromTime nextReleaseDate) ]
            , div [ class "timer" ] (showTimer <| nextReleaseDate - currentTime)
            , div [] [ text "GET NOTIFIED MATE" ]
            ]
