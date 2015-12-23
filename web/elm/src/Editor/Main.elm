module Editor.Main where

import Core.Models.Chapter as Chapter exposing (Chapter)
import Editor.ChapterListEditor as ChapterListEditor
import Editor.ChapterEditor as ChapterEditor

import Http
import StartApp
import Effects exposing (Effects, Never)
import Html exposing (..)
import Html.Attributes exposing (..)
import Debug
import Json.Decode as Json
import Task
import Core.Models.Entry as Entry
import Core.HTTP.Requests as Requests

type alias Model =
    { viewMode          : ViewMode
    , chaptersAtSync    : List Chapter
    , chapterListEditor : ChapterListEditor.Model
    , chapterEditor     : ChapterEditor.Model
    }

type ViewMode = ChapterList | ChapterCreate | ChapterEdit | Loading

chap = Chapter.empty
ch   = { chap | title = "This Is The First Chapter", id = Just 1, order = 0, releaseDate = "12/20/1993 00:00" }
ch2  = { chap | title = "Episode 2. Sleepytime Tea / The Eyeball", id = Just 2, order = 1 }
ch3  = { chap | title = "Un Dos Tres Toca La Pared", id = Just 3, order = 2 }

initListEditor : List Chapter -> ChapterListEditor.Model
initListEditor =
    ChapterListEditor.init
        (Signal.forwardTo actions.address RequestUpdateChapterList)
        (Signal.forwardTo actions.address RequestChapterForEdit)
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
        (Task.succeed (GoToChapterList [ch,ch2,ch3]) |> Effects.task)

type Action
    = ChapterListEditorFwd ChapterListEditor.Action
    | ChapterEditorFwd ChapterEditor.Action
    | RequestChapterForEdit (Maybe Int)
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

        --UpdateChapterList newChapters ->
        --    let
        --        d1 = Debug.log "Update: " (List.map .title newChapters) |> always (model, Effects.none)
        --        diffWithOlds = \news old ->
        --            news
        --            |> List.filter (.id >> (==) old.id)
        --            |> List.head
        --            |> \new ->
        --                case new of
        --                    Nothing       -> "Deleted " ++ toString old.id
        --                    Just newEntry ->
        --                        if newEntry == old
        --                        then ""
        --                        else "Updated " ++ toString old.id

        --        diff =
        --            List.map (diffWithOlds newChapters) model.chapters
        --            --++ List.map (\entry -> if entry.id == Nothing then "Created NEW" else "") newChapters
        --            -- |> List.filter ((/=) "")
        --        d2 = Debug.log "Diff: " diff
        --    in ({ model | chapters = newChapters }, Effects.none)

        RequestChapterForEdit maybeId ->
            let fx =
                Requests.postEditChapter maybeId
                |> Task.toMaybe
                |> Task.map (Maybe.map GoToChapterEdit)
                |> Task.map (Maybe.withDefault RequestChapterList)
                |> Effects.task

                tempUpdate =
                    model.chaptersAtSync
                    |> List.filter (.id >> (==) maybeId)
                    |> List.head
                    |> Maybe.map GoToChapterEdit
                    |> Maybe.withDefault (GoToChapterEdit Chapter.empty)
            in update tempUpdate model -- ( { model | viewMode = Loading }, fx )
                                       -- TODO: uncomment real request

        RequestChapterList ->
            update (GoToChapterList model.chaptersAtSync) model --TODO: fill in real request

        RequestUpdateChapterList chapters ->
            update (GoToChapterList chapters) model  --TODO: fill in real request

        RequestUpdateChapter chapter ->
            let newChapters' =
                    model.chaptersAtSync
                    |> List.map (\ch -> if ch.id == chapter.id then chapter else ch)
                newChapters =
                    if not (List.member chapter.id (List.map .id model.chaptersAtSync))
                    then newChapters' ++ [ { chapter | id = Just <| List.length newChapters' + 1 } ]
                    else newChapters'
             in update (GoToChapterList newChapters) model --TODO: replace entire thing with real request / handling

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
