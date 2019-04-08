module Reader.Main exposing (main)

import Browser
import Browser.Dom as Dom
import Browser.Events as Events
import Browser.Navigation as Navigation
import Core.Models.Chapter as Chapter
import Core.Utils.MaybeExtra exposing (..)
import Core.Utils.SelectionList as SL
import Dict
import Html exposing (Html)
import Http
import Iso8601
import Json.Decode as Json
import Keyboard
import Reader.Aliases exposing (..)
import Reader.Messages exposing (..)
import Reader.Model exposing (..)
import Reader.Ports exposing (..)
import Reader.Update exposing (update)
import Reader.Utils exposing (..)
import Reader.Utils.Disqus exposing (..)
import Reader.View exposing (view)
import Regex
import String
import Task exposing (Task)
import Time
import Url exposing (Url)


init : Flags -> Url -> Navigation.Key -> ( Model, Cmd Msg )
init { localStorage } url navigationKey =
    let
        dataRequest =
            Http.task
                { method = "get"
                , headers = []
                , url = "/api/chapters"
                , body = Http.emptyBody
                , resolver =
                    Http.stringResolver
                        (\response ->
                            case response of
                                Http.GoodStatus_ _ body ->
                                    Json.decodeString (Json.list Chapter.decoder) body
                                        |> Result.mapError (always "Failed to decode response.")

                                _ ->
                                    Err "Bad response."
                        )
                , timeout = Nothing
                }

        setup =
            \chapters userTimezone ->
                Load chapters localStorage url userTimezone

        setupTask =
            Task.map2 setup dataRequest Time.here

        setupCmd =
            Task.attempt (Result.withDefault NoOp) setupTask

        nextEntryRequestCmd =
            Http.get
                { url = "/api/next"
                , expect =
                    Http.expectJson
                        (\result ->
                            let
                                parsedTime =
                                    result
                                        |> Result.mapError (always [])
                                        |> Result.andThen Iso8601.toTime
                            in
                            case parsedTime of
                                Ok posix ->
                                    SetNextReleaseDate posix

                                Err _ ->
                                    NoOp
                        )
                        Json.string
                }

        viewportCmd =
            Task.perform UpdateWindowSize Dom.getViewport
    in
    ( Reader.Model.empty navigationKey
    , Cmd.batch
        [ nextEntryRequestCmd
        , setupCmd
        , viewportCmd
        ]
    )



---- WIRING ----


main : Program Flags Model Msg
main =
    Browser.application
        { init = init
        , update = update
        , view =
            \model ->
                { title =
                    if model.showCover then
                        "Midnight Murder Party"

                    else
                        selectedTitleFromSL model.toc ++ " | Midnight Murder Party"
                , body = [ view model ]
                }
        , onUrlChange = \_ -> NoOp
        , onUrlRequest = HandleUrlRequest
        , subscriptions =
            \model ->
                Sub.batch
                    [ chapterRendered (renderResultToMsg False)
                    , chapterReflowed (renderResultToMsg True)

                    --, headingsUpdated UpdateHeadingsOnPage
                    --, pageSet (TurnPage << PageNum)
                    , inlineLinkClicked ChangeSelectedHeading
                    , inlineShareClicked ShowShareDialog
                    , keyPressedInReader (keyToMsg model)
                    , Keyboard.downs (rawToCode >> keyToMsg model)
                    , mouseClickedInReader (\_ -> Dropdown ( Nothing, Just False ))
                    , Events.onClick <| Json.succeed (Dropdown ( Nothing, Just False ))
                    , reflowRequest (\_ -> StartReflow)
                    , Events.onResize (\_ _ -> WindowResized)
                    , ping (always Ping)
                    ]
        }



---- INPUT TRANSFORMERS ----


any_ =
    List.any identity


none_ =
    not << any_


rawToCode : Keyboard.RawKey -> KeyCode
rawToCode rawKey =
    case Keyboard.navigationKey rawKey of
        Just Keyboard.ArrowLeft ->
            37

        Just Keyboard.ArrowRight ->
            39

        _ ->
            -1


keyToMsg : Model -> KeyCode -> Msg
keyToMsg model key =
    if
        any_
            [ model.showCover
            , model.shareDialog.isVisible
            , model.creditsRoll.isVisible
            , model.contactModal.isVisible
            , model.state == Rendering
            , model.state == Reflowing
            ]
    then
        if key == 39 && none_ [ model.shareDialog.isVisible, model.creditsRoll.isVisible, model.contactModal.isVisible ] then
            CoverOpen

        else
            NoOp

    else
        case key of
            37 ->
                TurnPage Backward

            39 ->
                TurnPage Forward

            _ ->
                NoOp


renderResultToMsg : Bool -> RenderResult -> Msg
renderResultToMsg isReflow { currentPage, idsByPage } =
    if isReflow then
        ChapterHasReflowed currentPage idsByPage

    else
        ChapterHasRendered currentPage idsByPage
