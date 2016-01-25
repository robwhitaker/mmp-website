module Editor.Entry.Reorderable where

import Html exposing (..)
import Html.Attributes exposing (..)

import Markdown

import Core.Models.Entry exposing (Entry)
import Editor.ReorderableList exposing (ReorderableElement)
import Editor.Parser as Parser

make : Entry -> ReorderableElement Entry
make entry =
    Just
        { model     = entry
        , render    = render
        , setOrder  = \newOrder ch -> { ch | order = newOrder }
        }

render : Entry -> Html
render entry =
    div [ class "sub-entry-container" ]
        [ div [ class "id" ] [ text <| Maybe.withDefault "" <| Maybe.map (toString >> (++) "#") entry.id ]
        , div [ class "title" ] [ text <| Parser.stripTags <| entry.title ]
        , div [ class "preview" ] [ Markdown.toHtml entry.content ]
        ]
