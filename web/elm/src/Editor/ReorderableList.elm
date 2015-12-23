module Editor.ReorderableList where

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

import Array exposing (Array)
import Editor.Array.Extra as ArrayE

type alias ReorderableList entry = Array (ReorderableElement entry)

type alias ReorderableElement entry =
    Maybe
        { model    : entry
        , render   : entry -> Html
        , setOrder : Int -> entry -> entry
        }

empty : ReorderableList entry
empty = Array.empty

length : ReorderableList entry -> Int
length = Array.length

pad : Int -> ReorderableList entry -> ReorderableList entry
pad num rList = Array.append rList <| Array.repeat num Nothing

toList : ReorderableList entry -> List entry
toList =
    Array.toList
    >> List.filterMap identity
    >> List.indexedMap (\index entry -> entry.setOrder index entry.model)

fromListWith : (entry -> ReorderableElement entry) -> List entry -> ReorderableList entry
fromListWith convertFn entries =
    entries
    |> List.map convertFn
    |> Array.fromList

mergeWith :  (entry -> entry -> entry) -> ReorderableList entry -> ReorderableList entry -> ReorderableList entry
mergeWith mergeFn entries1 entries2 =
    List.map2
        (\first second ->
            case (first, second) of
                (Just f, Just s)   -> Just { s | model = mergeFn f.model s.model }
                (Just f, Nothing)  -> Just f
                (Nothing, Just s)  -> Just s
                (Nothing, Nothing) -> Nothing
        ) (Array.toList entries1) (Array.toList entries2)
    |> Array.fromList


type Action = MoveUp Int | MoveDown Int | Delete Int

update : Action -> ReorderableList entry -> ReorderableList entry
update action model =
    case action of
        MoveUp index ->
            ArrayE.swap index (index-1) model

        MoveDown index ->
            ArrayE.swap index (index+1) model

        Delete index ->
            Array.set index Nothing model

render : Signal.Address Action -> Bool -> ReorderableList entry -> Html
render address enabled rList =
    div [] <|
        (Array.indexedMap
            (\index maybeEntry ->
                div [ class "reorderable-entry" ]
                    [ case maybeEntry of
                        Just entry -> div [ class "entry-container" ] [ entry.render entry.model ]
                        Nothing    -> div [ class "entry-container empty" ] [ text "---BLANK---" ]
                    , if not enabled
                      then div [] []
                      else div [ class "reorderable-controls" ]
                        [ i
                            [ class "fa fa-arrow-up"
                            , onClick address (MoveUp index)
                            ] []
                        , i
                            [ class "fa fa-times"
                            , onClick address (Delete index)
                            ] []
                        , i
                            [ class "fa fa-arrow-down"
                            , onClick address (MoveDown index)
                            ] []
                        ]
                    ]
            )
            rList
        |> Array.toList)



