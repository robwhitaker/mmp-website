module Reader.Components.Dropdown where

import Reader.Model exposing (RenderElementID)
import Reader.Utils exposing (selectedTitleFromSL)
import Editor.Parser exposing (stripTags)
import Time exposing (Time)
import String
import Date

import Markdown

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

import Core.Utils.SelectionList as SL exposing (SelectionList)

type alias Expanded = Bool

type alias Action = (Maybe RenderElementID, Maybe Expanded)

type alias ExportAddress = Signal.Address Action

type alias DropdownList a = SelectionList (DropdownItem a)

type alias DropdownItem a =
    { a
        | heading : String
        , level : Int
        , releaseDate : String
        , id : String
        , isRead : Bool
    }

view : ExportAddress -> DropdownList a -> Bool -> Html
view exportAddress dropdownList expanded =
    div [ classList [ ("drop-down-container", True), ("expanded", expanded)] ]
        [ div [ class "selected-label"
              , onClick exportAddress (Nothing, Just (not expanded))
              ]
              [ div [ class "label-text" ] [ text <| String.toUpper <| selectedTitleFromSL dropdownList ]
              , div [ class "arrow-down" ] []
              ]
        , ul  [] (mkDropdownList exportAddress dropdownList)
        ]

mkDropdownList : ExportAddress -> DropdownList a -> List Html
mkDropdownList exportAddress list =
    let
        parseReleaseDate dateStr =
            case Date.fromString dateStr of
                Ok date -> Date.toTime date
                Err _   -> 0

        maxReleaseDate =
            List.foldl (\{ releaseDate } maxRD ->
                Basics.max maxRD (parseReleaseDate releaseDate)
            ) 0 (SL.toList list)

        selectedIndex = SL.selectedIndex list
    in
        List.indexedMap (\index item ->
            li [ classList
                    [ ("selected", index == selectedIndex)
                    , ("latest", parseReleaseDate item.releaseDate == maxReleaseDate)
                    , ("unread", not item.isRead)
                    ]
                , onClick exportAddress (Just item.id, Just False)
                ]
                [ div [ class "li-label" ] [ Markdown.toHtml <| String.repeat item.level "<div class=\"drop-down-spacer\"></div>" ++ stripTags item.heading ]
                , div [ class "alert" ] [ text "(new!)" ]
                ]
        ) (SL.toList list)


