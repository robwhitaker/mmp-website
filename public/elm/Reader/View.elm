module Reader.View where

import Reader.Model exposing (..)
import Reader.Update exposing (Action(..))

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

import Graphics.Element exposing (..)

bookSize = (650,759)

view : Signal.Address Action -> Model -> Html
view address model =
    div []
        [ div
            [ class "book" ]
            [ div [ classList [("loader", True), ("isDisplayed", model.state == Rendering || model.state == Loading)] ]
                  [ fromElement <| container (fst bookSize) (snd bookSize) middle <|
                        flow down
                            [ case model.state of
                                Loading -> div [class "loading-label"] [text "Loading..."] |> toElement (fst bookSize) 50
                                Rendering -> div [class "loading-label"] [text "Rendering..."] |> toElement (fst bookSize) 50
                                _ -> show ""
                            , div [class "loading-label"] [img [src "static/assets/img/ajax-loader-2.gif"] []] |> toElement (fst bookSize) 100
                            ]
                  ]
            , div
                [ class "top-bar"]
                [ (text << toString) (model.pages.current + 1)
                , text " / "
                , (text << toString) model.pages.total
                , text ", "
                , (text << toString) model.headingIDsOnPage
                ]
            , div [ class "book-text" ]
                [ iframe
                    [ id "book-text-frame", src "/renderer.html"]
                    [ ]
                ]
            , div
                [ class "book-controls"]
                [ button [onClick address (TurnPage Backward)] [ text "Backward" ]
                , button [onClick address (TurnPage Forward)] [ text "Forward" ]
                ]
            , div [] [ text <| toString model.toc.selected.id, text " | ", text <| toString model.lastNavAction ]
            ]
        , div [ id "disqus_thread" ] []
        ]
