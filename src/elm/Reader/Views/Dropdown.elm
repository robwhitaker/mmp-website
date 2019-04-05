module Reader.Views.Dropdown exposing (DropdownItem, DropdownList, Msg, renderDropdownList, view)

import Core.Utils.SelectionList as SL exposing (SelectionList)
import Core.Utils.String exposing (stripTags)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json
import Reader.Aliases exposing (RenderElementID)
import Reader.Utils exposing (..)
import String


type alias Msg =
    ( Maybe RenderElementID, Maybe Bool )


type alias DropdownList a =
    SelectionList (DropdownItem a)


type alias DropdownItem a =
    { a
        | heading : String
        , level : Int
        , isInteractive : Bool
        , releaseDate : String
        , id : String
        , isRead : Bool
    }


view : DropdownList a -> Bool -> Html Msg
view dropdownList expanded =
    div [ classList [ ( "drop-down-container", True ), ( "expanded", expanded ) ] ]
        [ div
            [ class "selected-label"
            , custom
                "click"
                (Json.succeed
                    { message = ( Nothing, Just (not expanded) )
                    , stopPropagation = True
                    , preventDefault = True
                    }
                )
            ]
            [ div [ class "label-text" ] [ text <| String.toUpper <| selectedTitleFromSL dropdownList ]
            , div [ class "arrow-down" ] []
            ]
        , ul [] (renderDropdownList dropdownList)
        ]


renderDropdownList : DropdownList a -> List (Html Msg)
renderDropdownList list =
    let
        selectedIndex =
            SL.selectedIndex list

        maxReleaseDate =
            maxReleaseDateAsTime list
    in
    List.indexedMap
        (\index item ->
            li
                [ classList
                    [ ( "selected", index == selectedIndex )
                    , ( "latest", dateStringToTime item.releaseDate == maxReleaseDate && not item.isRead )
                    , ( "unread", not item.isRead )
                    , ( "isInteractive", item.isInteractive )
                    ]
                , onClick ( Just item.id, Just False )
                ]
            <|
                List.repeat item.level (div [ class "drop-down-spacer" ] [])
                    ++ [ div [ class "li-label" ] [ text (stripTags item.heading) ]
                       , div [ class "interactive" ] [ i [ class "fa fa-gamepad", attribute "aria-hidden" "true" ] [] ]
                       , div [ class "alert" ] [ text "new!" ]
                       ]
        )
        (SL.toList list)
