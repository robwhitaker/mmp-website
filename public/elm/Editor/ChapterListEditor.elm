module Editor.ChapterListEditor where

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

import Core.Models.Chapter as Chapter exposing (Chapter)
import Editor.Chapter.Reorderable as ChapterReorderable
import Editor.ReorderableList as RL

type alias Model =
    { chapters     : RL.ReorderableList Chapter
    , lastChapters : RL.ReorderableList Chapter
    , commitAddr   : Signal.Address (List Chapter)
    , editAddr     : Signal.Address Chapter
    , cancelAddr   : Signal.Address ()
    }

init : Signal.Address (List Chapter) -> Signal.Address Chapter -> Signal.Address () -> (List Chapter) -> Model
init commitAddr editAddr cancelAddr chapters =
    let chs = List.sortBy .order chapters
    in
        { chapters = RL.fromListWith (ChapterReorderable.make editAddr) chs
        , lastChapters = RL.fromListWith (ChapterReorderable.make editAddr) chs
        , commitAddr = commitAddr
        , cancelAddr = cancelAddr
        , editAddr = editAddr
        }

type Action = Reorder RL.Action

update : Action -> Model -> Model
update action model =
    case action of
        Reorder subAction ->
            { model | chapters = RL.update subAction model.chapters }

renderBody : Signal.Address Action -> Model -> Html
renderBody address model =
    div [ class "chapter-list-editor" ]
        [ div
            [ class "chapter-list-container" ]
            [ RL.render (Signal.forwardTo address Reorder) True model.chapters ]
        ]

renderHeading : Signal.Address Action -> Model -> Html
renderHeading address model =
    h2 [] [ text "Chapter List" ]

renderControls : Signal.Address Action -> Model -> Html
renderControls address model =
    div []
        [ if RL.toList model.chapters /= RL.toList model.lastChapters then span [] [] else
            button [ onClick model.editAddr Chapter.empty ] [ text "New Chapter" ]
        , if RL.toList model.chapters == RL.toList model.lastChapters then span [] [] else
            button [ onClick model.commitAddr (RL.toList model.chapters) ] [ text "Save" ]
        , if RL.toList model.chapters == RL.toList model.lastChapters then span [] [] else
            button [ onClick model.cancelAddr () ] [ text "Cancel" ]
        ]
