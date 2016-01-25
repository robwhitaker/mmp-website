module Editor.Editor where

import Core.Models.Chapter as Chapter exposing (Chapter)
import Editor.ChapterListEditor as ChapterListEditor
import Editor.ChapterEditor as ChapterEditor

import Http
import StartApp
import Effects exposing (Effects, Never)
import Html exposing (..)
import Html.Attributes exposing (..)
import Debug
import Json.Decode as Json exposing ((:=))
import Json.Encode as Encode
import Task
import Core.Models.Entry as Entry
import Core.HTTP.Requests as Requests

import Editor.Diff as Diff exposing (DiffRecord)

import Task exposing (Task)

type alias Model =
    { viewMode          : ViewMode
    , chaptersAtSync    : List Chapter
    , chapterListEditor : ChapterListEditor.Model
    , chapterEditor     : ChapterEditor.Model
    }

type ViewMode = ChapterList | ChapterCreate | ChapterEdit | Loading

chapterListRequest : Task Http.Error (List Chapter)
chapterListRequest =
    Requests.send Nothing (Requests.Post Encode.null) (Json.list Chapter.decoder) "chapters"

batchRequest : DiffRecord -> Task Http.Error (List Chapter)
batchRequest diff =
    Requests.send Nothing (Requests.Post <| Diff.encode diff) (Json.list Chapter.decoder) "batch"

initListEditor : List Chapter -> ChapterListEditor.Model
initListEditor =
    ChapterListEditor.init
        (Signal.forwardTo actions.address RequestUpdateChapterList)
        (Signal.forwardTo actions.address GoToChapterEdit)
        (Signal.forwardTo actions.address <| always RequestChapterList)

initChapterEditor : Chapter -> ChapterEditor.Model
initChapterEditor =
    ChapterEditor.init
        (Signal.forwardTo actions.address RequestUpdateChapter)
        (Signal.forwardTo actions.address <| always RequestChapterList)

init : (Model, Effects Action)
init =
    (,)
        { viewMode = Loading
        , chaptersAtSync = []
        , chapterListEditor = initListEditor []
        , chapterEditor = initChapterEditor Chapter.empty
        }
        (Requests.toEffect GoToChapterList (\_ -> NoOp) chapterListRequest)

type Action
    = ChapterListEditorFwd ChapterListEditor.Action
    | ChapterEditorFwd ChapterEditor.Action
    | RequestChapterList
    | RequestUpdateChapterList (List Chapter)
    | RequestUpdateChapter Chapter
    | GoToChapterList (List Chapter)
    | GoToChapterEdit Chapter
    | NoOp

update : Action -> Model -> (Model, Effects Action)
update action model =
    case Debug.log "action: " action of
        ChapterListEditorFwd subAction ->
            ({ model | chapterListEditor = ChapterListEditor.update subAction model.chapterListEditor }, Effects.none)

        ChapterEditorFwd subAction ->
            ({ model | chapterEditor = ChapterEditor.update subAction model.chapterEditor }, Effects.none)

        RequestChapterList ->
            ({ model | viewMode = Loading }, (Requests.toEffect GoToChapterList (\_ -> NoOp) chapterListRequest))

        RequestUpdateChapterList chapters ->
            let
                chapterListUpdateRequest =
                    Diff.chapterList model.chaptersAtSync chapters
                    |> Diff.toDiffRecord
                    |> batchRequest
                    |> Requests.toEffect GoToChapterList (\_ -> NoOp)
            in (model, chapterListUpdateRequest)

        RequestUpdateChapter chapter ->
            let
                chapterUpdateRequest =
                    case List.head (List.filter (.id >> (==) chapter.id) model.chaptersAtSync) of
                        Nothing ->
                            Requests.send Nothing (Requests.Post <| Chapter.encode chapter) (Json.list Chapter.decoder) "chapters"
                            |> Requests.toEffect GoToChapterList (\_ -> NoOp)

                        Just oldChapter ->
                            Diff.chapter oldChapter (Just chapter)
                            |> Diff.toDiffRecord
                            |> batchRequest
                            |> Requests.toEffect GoToChapterList (\_ -> NoOp)
            in (model, chapterUpdateRequest)

        GoToChapterList chapters ->
            (,)
            { model |
                chaptersAtSync = chapters,
                viewMode = ChapterList,
                chapterListEditor = initListEditor chapters
            }
            Effects.none

        GoToChapterEdit chapter ->
            (,)
            { model |
                viewMode = ChapterEdit,
                chapterEditor = initChapterEditor chapter
            }
            Effects.none

        _ -> (model, Effects.none)

render : Signal.Address Action -> Model -> Html
render address model =
    div [ id "scroll-container" ]
        [
            case model.viewMode of
                ChapterList ->
                    page
                        ChapterListEditor.renderHeading
                        ChapterListEditor.renderControls
                        ChapterListEditor.renderBody
                        (Signal.forwardTo address ChapterListEditorFwd)
                        model.chapterListEditor

                ChapterEdit ->
                    page
                        ChapterEditor.renderHeading
                        ChapterEditor.renderControls
                        ChapterEditor.renderContent
                        (Signal.forwardTo address ChapterEditorFwd)
                        model.chapterEditor

                Loading ->
                    Html.text "LOADING..."

                _ -> Html.div [] []
        ]

page : (Signal.Address subAction -> model -> Html)
    -> (Signal.Address subAction -> model -> Html)
    -> (Signal.Address subAction -> model -> Html)
    ->  Signal.Address subAction
    ->  model
    -> Html
page topBarHeading topBarControls content address model =
    div []
        [ div
            [ class "top-bar" ]
            [ div
                [ class "left" ]
                [ topBarHeading address model ]
            , div
                [ class "right" ]
                [ topBarControls address model ]
            , div [ class "clear" ] []
            ]
        , div
            [ class "container" ]
            [ content address model
            , div [ class "clear" ] []
            ]
        ]

---- WIRING ----

--model : Signal Model
--model = Signal.foldp update init inputs

app = StartApp.start
    { init = init
    , update = update
    , view = render
    , inputs = [actions.signal]
    }

actions : Signal.Mailbox Action
actions = Signal.mailbox NoOp

main : Signal Html
main = app.html

port tasks : Signal (Task.Task Never ())
port tasks =
    app.tasks

port contextChange : Signal (String, String)
port contextChange =
    Signal.map
        (\model -> (toString model.viewMode, toString model.chapterEditor.stage))
        app.model
    |> Signal.dropRepeats

--Editor (save overall state / route to modules)
--    ChapterListEditor (hold temporary reorderable chapter list state / commit changes back to Editor)
--        ReorderableList (view to mess with reorderable chapter lists)
