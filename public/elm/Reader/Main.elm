module Reader.Main exposing (main)

import Dict
import Regex
import String
import Keyboard exposing (KeyCode)
import Mouse

import Reader.Ports

import Task exposing (Task)

import Html exposing (Html)
import Html.App

import Core.Utils.SelectionList as SL
import Core.Utils.MaybeExtra exposing (..)

import Reader.Model exposing (..)
import Reader.Aliases exposing (..)
import Reader.Update exposing (update)
import Reader.View exposing (view)
import Reader.Messages exposing (..)
import Reader.Utils exposing (..)
import Reader.Ports exposing (..)

import Reader.Utils.Disqus exposing (..)

import Core.HTTP.Requests as Requests
import Json.Decode as Json
import Core.Models.Chapter as Chapter

--TODO: remove these when done
import Debug

type alias Flags =
    { readEntries : List (RenderElementID, Bool)
    , location : String
    }

init : Flags -> (Model, Cmd Msg)
init { readEntries, location }=
    (,)
        Reader.Model.empty
        (Requests.send Nothing Requests.Get (Json.list Chapter.decoder) "/chapters"
            |> Task.perform
                (\_ -> NoOp)
                (\chapters -> Load chapters readEntries location)
        )

---- WIRING ----

main : Program Flags
main =
    Html.App.programWithFlags
        { init = init
        , update = update
        , view = view
        , subscriptions =
            \model -> Sub.batch
                [ chapterRendered (renderResultToMsg False)
                , chapterReflowed (renderResultToMsg True)
                , headingsUpdated UpdateHeadingsOnPage
                , pageSet (TurnPage << PageNum)
                , inlineLinkClicked ChangeSelectedHeading
                , inlineShareClicked ShowShareDialog
                , keyPressedInReader (keyToMsg model)
                , Keyboard.downs (keyToMsg model)
                , mouseClickedInReader (\_ -> Dropdown (Nothing, Just False))
                , Mouse.clicks (\_ -> Dropdown (Nothing, Just False))
                ]
        }

---- INPUT TRANSFORMERS ----

keyToMsg : Model -> KeyCode -> Msg
keyToMsg model key =
    if model.showCover || model.shareDialog.visible || model.state == Rendering || model.state == TurningPage then
        NoOp
    else
        case key of
            37 -> TurnPage Backward
            39 -> TurnPage Forward
            _  -> NoOp

renderResultToMsg : Bool -> RenderResult -> Msg
renderResultToMsg isReflow { currentPage, numPages, focusedHeading, headingsOnPage } =
    if isReflow then
        ChapterHasReflowed currentPage numPages focusedHeading headingsOnPage
    else
        ChapterHasRendered currentPage numPages headingsOnPage

