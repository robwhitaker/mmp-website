module Editor.ChapterEditor where

import Core.Models.Chapter as Chapter exposing (Chapter)
import Editor.Entry.Reorderable as EntryReorderable
import Editor.ReorderableList as RL
import Core.Models.Entry as Entry exposing (Entry)
import Editor.Parser as Parser

import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)

import Markdown

import Date
import Time
import String

type alias Model =
    { stage : Stage
    , chapter : Chapter
    --, needsCompare : Bool
    , chapterEntryText : String
    , oldEntryList : RL.ReorderableList Entry
    , newEntryList : RL.ReorderableList Entry
    , commitAddr : Signal.Address Chapter
    , cancelAddr : Signal.Address ()
    }

type Stage = TextEntry | EntryAlignment | MetaDataEditing

init : Signal.Address Chapter -> Signal.Address () -> Chapter -> Model
init commitAddr cancelAddr chapter =
    { stage =
        if chapter.id == Nothing || List.length chapter.entries_ == 0
        then TextEntry
        else MetaDataEditing
    , chapter = chapter
    --, needsCompare = not (List.length chapter.entries_ == 0)
    , chapterEntryText = ""
    , oldEntryList =
        RL.fromListWith EntryReorderable.make chapter.entries_
    , newEntryList = RL.empty
    , commitAddr = commitAddr
    , cancelAddr = cancelAddr
    }

type Action
    = Continue
    | ImportChapter
    | TextUpdate String
    | ReorderFwd RL.Action
    | ReleaseDateField Int String
    | AuthorsNoteField Int String
    | ChapterReleaseDateField String
    | ChapterAuthorsNoteField String
    | GenerateReleaseDates (Maybe Int)
    | NoOp

update : Action -> Model -> Model
update action model =
    case action of
        ImportChapter ->
            { model |
                stage = TextEntry,
                chapterEntryText = "",
                oldEntryList =
                    RL.fromListWith EntryReorderable.make model.chapter.entries_
            }
        Continue ->
            case model.stage of
                TextEntry ->
                    let maybeNewChapter = Parser.parse model.chapterEntryText
                    in case maybeNewChapter of
                        Nothing -> { model | stage = MetaDataEditing }
                        Just newChapter ->
                            let newEntries = List.map (\entry -> { entry | chapter = Maybe.withDefault (-1) model.chapter.id } ) newChapter.entries_
                                oldChapterReorderableList =
                                    RL.pad (List.length newEntries - RL.length model.oldEntryList) model.oldEntryList
                                oldChapter = model.chapter
                            in
                                { model |
                                    chapter =
                                        { oldChapter |
                                            title = newChapter.title,
                                            stylesheet = newChapter.stylesheet,
                                            content = newChapter.content,
                                            entries_ = newEntries
                                        },
                                    oldEntryList = oldChapterReorderableList,
                                    newEntryList = RL.fromListWith EntryReorderable.make newEntries,
                                    stage =
                                        if not (List.length newEntries /= 0 && RL.length model.oldEntryList /= 0)
                                        then MetaDataEditing
                                        else EntryAlignment
                                }

                EntryAlignment ->
                    let chapter = model.chapter
                    in
                        { model |
                            stage = MetaDataEditing,
                            chapter =
                                { chapter |
                                    entries_ =
                                        RL.mergeWith
                                            (\first second -> { second | id = first.id, releaseDate = first.releaseDate, authorsNote = first.authorsNote })
                                            model.oldEntryList
                                            model.newEntryList
                                        |> RL.toList
                                }
                        }

                _ -> model

        TextUpdate str -> { model | chapterEntryText = str }

        ReorderFwd subAction -> { model | oldEntryList = RL.update subAction model.oldEntryList }

        ReleaseDateField index releaseDate ->
            let chapter = model.chapter
            in
                { model |
                    chapter =
                        { chapter | entries_ = List.indexedMap (\i entry -> if i == index then { entry | releaseDate = releaseDate } else entry) model.chapter.entries_ }
                }
        ChapterReleaseDateField releaseDate ->
            let chapter = model.chapter
            in { model | chapter = { chapter | releaseDate = releaseDate } }

        ChapterAuthorsNoteField authorsNote ->
            let chapter = model.chapter
            in { model | chapter = { chapter | authorsNote = authorsNote } }

        AuthorsNoteField index authorsNote ->
            let chapter = model.chapter
            in
                { model |
                    chapter =
                        { chapter | entries_ = List.indexedMap (\i entry -> if i == index then { entry | authorsNote = authorsNote } else entry) model.chapter.entries_ }
                }

        GenerateReleaseDates maybeIndex ->
            let
                dateOffsetByWeek date week =
                    date
                    |> Date.toTime
                    |> (+) (Time.hour * 24 * 7 * week)
                    |> Date.fromTime

                dateToString d =
                    List.map (\f -> f d)
                        [ Date.dayOfWeek >> toString
                        , always " "
                        , Date.month >> toString
                        , always " "
                        , Date.day >> toString
                        , always ", "
                        , Date.year >> toString
                        , always " "
                        , Date.hour >> toString
                        , always ":"
                        , Date.minute >> toString
                        , always ":"
                        , Date.second >> toString
                        ]
                    |> String.concat

                baseDate =
                    case maybeIndex of
                        Just index ->
                            model.chapter.entries_
                            |> List.drop index
                            |> List.head
                            |> Maybe.map .releaseDate
                            |> Maybe.withDefault ""
                        Nothing -> model.chapter.releaseDate

                lastLevel =
                    case maybeIndex of
                        Just index ->
                            model.chapter.entries_
                            |> List.drop (Maybe.withDefault 0 maybeIndex)
                            |> List.head
                            |> Maybe.map .level
                            |> Maybe.withDefault 0
                        Nothing -> 0


                updatedChapter =
                    let chapter = model.chapter
                    in
                        case Date.fromString baseDate of
                            Err _ -> chapter
                            Ok date ->
                                List.foldl
                                    (\entry (weekNum, lastLevel, index, updatedEntries) ->
                                        let weekNum' = if lastLevel < entry.level then weekNum else weekNum + 1
                                        in
                                            if index <= Maybe.withDefault -1 maybeIndex
                                            then (weekNum, lastLevel, index+1, entry :: updatedEntries)
                                            else
                                                (,,,)
                                                    weekNum'
                                                    entry.level
                                                    (index + 1)
                                                    ({ entry |
                                                        releaseDate = dateOffsetByWeek date weekNum' |> dateToString
                                                     } :: updatedEntries)
                                    )
                                    (0, lastLevel, 0, [])
                                    (chapter.entries_)
                                |> \(_, _, _, updatedEntries) ->
                                    { chapter |
                                        entries_ =
                                            List.reverse updatedEntries
                                            |> List.map (\entry ->
                                                { entry | releaseDate =
                                                    entry.releaseDate
                                                    |> Date.fromString
                                                    |> \d ->
                                                        case d of
                                                            Ok d' -> dateToString d'
                                                            Err _ -> entry.releaseDate
                                                }),
                                        releaseDate =
                                            chapter.releaseDate
                                            |> Date.fromString
                                            |> \d ->
                                                case d of
                                                    Ok d' -> dateToString d'
                                                    Err _ -> chapter.releaseDate
                                    }
            in { model | chapter = updatedChapter }


        _ -> model

renderHeading : Signal.Address Action -> Model -> Html
renderHeading address model =
    div [ class "chapter-editor-heading" ]
        [ div [ class "id" ] [ text <| Maybe.withDefault "" <| Maybe.map (toString >> (++) "#") model.chapter.id ]
        , h2 [] [ text <| Parser.stripTags <| model.chapter.title ]
        ]

renderControls : Signal.Address Action -> Model -> Html
renderControls address model =
    case model.stage of
        MetaDataEditing ->
            div []
                [ button [ onClick model.commitAddr model.chapter ] [ text "Save & Exit" ]
                , button [ onClick address ImportChapter ] [ text "Import Chapter" ]
                , button [ onClick model.cancelAddr () ] [ text "Cancel" ]
                ]

        _ ->
            div []
                [ button [ onClick address Continue ] [ text "Continue" ]
                , button [ onClick model.cancelAddr () ] [ text "Cancel" ]
                ]



renderContent : Signal.Address Action -> Model -> Html
renderContent address model =
    case model.stage of
        TextEntry ->
                div
                    [ class "chapter-editor-container" ]
                    [ h1 [] [ text "Chapter Entry" ]
                    , textarea
                        [ class "chapter-text-entry"
                        , on "input" targetValue (Signal.message address << TextUpdate)
                        , value model.chapterEntryText
                        , placeholder "Paste chapter HTML here..."
                        ] []
                    ]

        EntryAlignment ->
           div
                [ class "chapter-editor-container" ]
                [ node "style" [] [ text model.chapter.stylesheet ]
                , h1 [] [ text "Entry Alignment" ]
                , div
                    [ class "two-pane" ]
                    [ div
                        [ class "pane" ]
                        [ RL.render (Signal.forwardTo address ReorderFwd) True model.oldEntryList ]
                    , div
                        [ class "pane" ]
                        [ RL.render (Signal.forwardTo address (always NoOp)) False model.newEntryList ]
                    ]
                ]

        MetaDataEditing ->
            div [ class "chapter-editor-container" ]
                [ node "style" [] [ text model.chapter.stylesheet ]
                , h1 [] [ text "Chapter Metadata"]
                , hr [] []
                , div
                    [ class "two-pane" ]
                    [ div [ class "pane" ]
                        [ h2 [ class "editor-heading" ] [ text "Stylesheet"]
                        , div [ class "scroll-pane" ] [ text model.chapter.stylesheet ]
                        ]
                    , div [ class "pane" ]
                        [ h2 [ class "editor-heading" ] [ text "Content"]
                        , div [ class "scroll-pane content" ] [ text model.chapter.content ]
                        ]
                    ]
                , div []
                    [div [ class "two-pane chapter-meta-editor" ]
                        [ div [ class "pane" ]
                            [ h2 [ class "editor-heading" ] [ text "Chapter Release Date" ]
                            , input
                                [ on "input" targetValue (Signal.message address << ChapterReleaseDateField)
                                , value model.chapter.releaseDate
                                , class <|
                                    if model.chapter.releaseDate == ""
                                    then ""
                                    else
                                        case Date.fromString model.chapter.releaseDate of
                                            Ok date -> "valid"
                                            Err _ -> "invalid"
                                ] []
                            , br [] []
                            , button
                                [ onClick address <| GenerateReleaseDates Nothing ]
                                [ text "Propagate Release Date" ]
                            ]
                        , div [ class "pane" ]
                            [ h2 [ class "editor-heading" ] [ text "Chapter Author's Notes" ]
                            , div [ class "authors-note-editor" ]
                                [ textarea
                                    [ on "input" targetValue (Signal.message address << ChapterAuthorsNoteField)
                                    , value model.chapter.authorsNote
                                    ]
                                    []
                                , div [ class "preview" ] [ Markdown.toHtml model.chapter.authorsNote ]
                                ]
                            ]
                        ]
                    ]
                , h1 [] [ text "Entry Metadata"]
                , hr [] []
                , div
                    [ class "entry-meta-data-editor-list" ]
                    (List.indexedMap (\index entry ->
                        div
                            [ class "entry-editor", style [("margin-left", toString ((entry.level-1) * 50) ++ "px")] ]
                            [ div [ class "id" ] [ text <| (++) "#" <| toString <| Maybe.withDefault -1 entry.id ]
                            , div [ class "title" ] [ text <| Parser.stripTags <| entry.title ]
                            , div
                                [ class "two-pane" ]
                                [ div
                                    [ class "pane" ]
                                    [ h2 [ class "editor-heading" ] [ text "Release Date" ]
                                    , input
                                        [ on "input" targetValue (Signal.message address << ReleaseDateField index)
                                        , value entry.releaseDate
                                        , class <|
                                            if entry.releaseDate == ""
                                            then ""
                                            else
                                                case Date.fromString entry.releaseDate of
                                                    Ok date -> "valid"
                                                    Err _ -> "invalid"
                                        ] []
                                    , br [] []
                                    , button
                                        [ onClick address <| GenerateReleaseDates <| Just index ]
                                        [ text "Propagate Release Date" ]
                                    , h2 [ class "editor-heading" ] [ text "Author's Note" ]
                                    , div
                                        [ class "authors-note-editor" ]
                                        [ textarea
                                            [ on "input" targetValue (Signal.message address << AuthorsNoteField index)
                                            , value entry.authorsNote
                                            ]
                                            []
                                        , div [ class "preview" ] [ Markdown.toHtml entry.authorsNote ]
                                        ]
                                    ]
                                , div
                                    [ class "pane" ]
                                    [ h2 [ class "editor-heading" ] [ text "Content" ]
                                    , div
                                        [ class "scroll-pane content" ]
                                        [ Markdown.toHtml entry.content ]
                                    ]
                                ]
                            ]
                    )
                    model.chapter.entries_)
                ]
