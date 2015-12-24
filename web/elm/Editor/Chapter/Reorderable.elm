module Editor.Chapter.Reorderable where

import Html exposing (Html, div, button, text)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)

import Core.Models.Chapter as Chapter exposing (Chapter)
import Editor.ReorderableList exposing (ReorderableElement)
import Editor.Parser as Parser

make : Signal.Address (Maybe Int) -> Chapter -> ReorderableElement Chapter
make address chapter =
    Just
        { model     = chapter
        , render    = render address
        , setOrder  = \newOrder ch -> { ch | order = newOrder }
        }

render : Signal.Address (Maybe Int) -> Chapter -> Html
render address chapter =
    div [ class "chapter-container" ]
        [ div [ class "id" ] [ text <| Maybe.withDefault "" <| Maybe.map (toString >> (++) "#") chapter.id ]
        , div [ class "title" ] [ text <| Parser.stripTags <| chapter.title ]
        , button
            [ onClick address chapter.id ]
            [ text "Edit" ]
        , div [ class "clear" ] []
        , div [ class "date" ] [ text <| (\dateString -> if dateString /= "" then "(Release Date: " ++ dateString ++ ")" else "(Release Date: N/A)") <| chapter.releaseDate ]
        ]
