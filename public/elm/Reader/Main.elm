module Reader.Main exposing (main)

import Dict
import Regex
import String
import Keyboard exposing (KeyCode)
import Mouse

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

import Core.HTTP.Requests as Requests
import Json.Decode as Json
import Core.Models.Chapter as Chapter

--TODO: remove these when done
import Debug

init : Flags -> (Model, Cmd Msg)
init { localStorage, hash, host, progStartTime } =
    let request = Requests.mkRequest Nothing Requests.Get (Json.list Chapter.decoder) "/chapters"
        requestHandle =
            Result.map (\chapters -> Load chapters localStorage hash host progStartTime)
            >> Result.withDefault NoOp
    in
        (,)
            Reader.Model.empty
            (Http.send requestHandle request)

---- WIRING ----

main : Program Flags Model Msg
main =
    Html.programWithFlags
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
                , ping (always Ping)
                ]
        }

---- INPUT TRANSFORMERS ----

keyToMsg : Model -> KeyCode -> Msg
keyToMsg model key =
    if  model.showCover ||
        model.shareDialog.isVisible ||
        model.creditsRoll.isVisible ||
        model.contactModal.isVisible ||
        model.state == Rendering ||
        model.state == Reflowing then
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

