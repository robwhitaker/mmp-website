module Reader.Main exposing (main)

import Dict
import Regex
import String
import Keyboard exposing (KeyCode)
import Mouse
import Navigation exposing (Location)
import Date
import Window

import Reader.Ports

import Task exposing (Task)
import Html exposing (Html)
import Http

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
import Reader.Utils.Analytics as Analytics

import Core.HTTP.Requests as Requests
import Json.Decode as Json
import Core.Models.Chapter as Chapter

--TODO: remove these when done
import Debug

init : Flags -> Location -> (Model, Cmd Msg)
init { localStorage, progStartTime } location =
    let dataRequest = Requests.mkRequest Nothing Requests.Get (Json.list Chapter.decoder) "/chapters"
        dataRequestHandle =
            Result.map (\chapters -> Load chapters localStorage progStartTime location)
                >> Result.withDefault NoOp

        nextEntryRequest = Requests.mkRequest Nothing Requests.Get (Json.string) "/next"
        nextEntryRequestHandle =
            Result.mapError (always "") --to make the type signature of andThen match
                >> Result.andThen (Date.fromString)
                >> Result.map SetNextReleaseDate
                >> Result.withDefault NoOp
    in
        (,)
            Reader.Model.empty
            (Cmd.batch
                [ Http.send nextEntryRequestHandle nextEntryRequest
                , Http.send dataRequestHandle dataRequest
                , Window.size |> Task.perform UpdateWindowSize
                ]
            )

---- WIRING ----

main : Program Flags Model Msg
main =
    Navigation.programWithFlags
        (always NoOp)
        { init = init
        , update = update
        , view = view
        , subscriptions =
            \model -> Sub.batch
                [ chapterRendered (renderResultToMsg False)
                , chapterReflowed (renderResultToMsg True)
                --, headingsUpdated UpdateHeadingsOnPage
                --, pageSet (TurnPage << PageNum)
                , inlineLinkClicked ChangeSelectedHeading
                , inlineShareClicked ShowShareDialog
                , keyPressedInReader (keyToMsg model)
                , Keyboard.downs (keyToMsg model)
                , mouseClickedInReader (\_ -> Dropdown (Nothing, Just False))
                , Mouse.clicks (\_ -> Dropdown (Nothing, Just False))
                , reflowRequest (\_ -> StartReflow)
                , Window.resizes UpdateWindowSize
                , ping (always Ping)
                ]
        }

---- INPUT TRANSFORMERS ----

any_ = List.any identity
none_ = not << any_

keyToMsg : Model -> KeyCode -> Msg
keyToMsg model key =
    if any_
        [ model.showCover
        , model.shareDialog.isVisible
        , model.creditsRoll.isVisible
        , model.contactModal.isVisible
        , model.state == Rendering
        , model.state == Reflowing
        ] then
        if key == 39 && none_ [model.shareDialog.isVisible, model.creditsRoll.isVisible, model.contactModal.isVisible] then
            CoverOpen Analytics.OpenArrowForward
        else
            NoOp
    else
        case key of
            37 -> TurnPage Backward
            39 -> TurnPage Forward
            _  -> NoOp

renderResultToMsg : Bool -> RenderResult -> Msg
renderResultToMsg isReflow { currentPage, idsByPage } =
    if isReflow then
        ChapterHasReflowed currentPage idsByPage
    else
        ChapterHasRendered currentPage idsByPage

