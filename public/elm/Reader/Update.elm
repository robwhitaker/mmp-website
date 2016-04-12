module Reader.Update where

import Dict exposing (Dict)
import Maybe
import Effects exposing (Effects, Never)


import Core.Utils.SelectionList as SL exposing (SelectionList)
import Core.Utils.MaybeExtra exposing (..)
import Core.Models.Chapter exposing (Chapter)

import Reader.Model exposing (..)
import Reader.Model.Helpers
import Reader.Components.Dropdown as Dropdown

---- TYPE ALIASES ----

type alias CurrentPage = Int
type alias NumPages = Int
type alias FocusedElementID = RenderElementID
type alias HeadingIDsOnPage = List RenderElementID

---- ACTIONS ----

type Action
    = TurnPage Direction
    | Load (List Chapter) (List (RenderElementID, Bool))
    | ChapterHasRendered NumPages HeadingIDsOnPage
    | ChapterHasReflowed CurrentPage NumPages (Maybe FocusedElementID) HeadingIDsOnPage
    | UpdateHeadingsOnPage (List String)
    | Dropdown Dropdown.Action
    | Dump String
    | NoOp

---- UPDATE ----

update : Action -> Model -> (Model, Effects Action)
update action model =
    flip (,) Effects.none <|
        case action of
            TurnPage dir ->
                case dir of
                    Forward ->
                        if model.pages.current + 1 >= model.pages.total -- >= because 0 indexed
                        then model --TODO: Load next chapter
                        else
                            { model
                                | pages =
                                    { current = model.pages.current + 1
                                    , total = model.pages.total
                                    }
                                , lastNavAction = PageTurn Forward
                            }

                    Backward ->
                        if model.pages.current - 1 < 0
                        then model --TODO: Load previous chapter
                        else
                            { model
                                | pages =
                                    { current = model.pages.current - 1
                                    , total = model.pages.total
                                    }
                                , lastNavAction = PageTurn Backward
                            }

                    PageNum num ->
                        if num >= model.pages.total || num < 0 then
                            model
                        else
                            { model | pages = { current = num, total = model.pages.total }, lastNavAction = PageTurn (PageNum num) }

            Dropdown (maybeRenderElemID, maybeExpanded) ->
                let expanded = Maybe.withDefault model.tocExpanded maybeExpanded

                    nextUntilContent toc =
                        if toc.selected.body == "" && SL.next toc /= toc then
                            nextUntilContent (SL.next toc)
                        else
                            toc

                    (newToc, lastNavAction) =
                        case maybeRenderElemID of
                            Just id ->
                                let nToc = nextUntilContent (gotoHeading id model.toc)
                                in (nToc, PageJump nToc.selected.id)
                            Nothing ->
                                (model.toc, model.lastNavAction)
                in
                    { model | toc = newToc, tocExpanded = expanded, lastNavAction = lastNavAction }

            Load chapters readEntries ->
                let loadedModel = Reader.Model.Helpers.fromChapterList chapters (Dict.fromList readEntries)
                in
                    { loadedModel | state = Rendering }

            ChapterHasRendered numPages headingIds ->
                let headings = headingIdFilter model.toc headingIds
                    newToc = gotoHeading (List.head headings ? "") model.toc
                in
                    { model
                        | pages =
                            { current = 0
                            , total = numPages
                            }
                        , state = Ready
                        , headingIDsOnPage = headings
                        , toc = newToc
                    }

            ChapterHasReflowed currentPage numPages maybeFocusedId headingIds ->
                let headings = headingIdFilter model.toc headingIds

                    newFocusedId =
                        if List.length headings == 0 && maybeFocusedId /= Nothing then
                            maybeFocusedId ? model.toc.selected.id
                        else if List.member model.toc.selected.id headings then
                            model.toc.selected.id
                        else
                            List.head headings ? model.toc.selected.id
                in
                    { model
                        | pages =
                            { current = currentPage
                            , total = numPages
                            }
                        , state = Ready
                        , toc = gotoHeading newFocusedId model.toc
                        , headingIDsOnPage = headings
                        , lastNavAction = PageReflow
                    }

            UpdateHeadingsOnPage headingIds ->
                let headings = headingIdFilter model.toc headingIds
                    newSelectedId =
                        case model.lastNavAction of
                            PageTurn dir ->
                                case dir of
                                    Forward ->
                                        if List.length headings > 0 && model.toc.selected.id /= "" then
                                            (List.reverse >> List.head) model.headingIDsOnPage ? model.toc.selected.id
                                        else
                                            Maybe.oneOf
                                                [ List.head headings
                                                , (List.reverse >> List.head) model.headingIDsOnPage
                                                ] ? model.toc.selected.id

                                    Backward ->
                                        Maybe.oneOf
                                            [(List.reverse >> List.head) headings
                                            , (List.head model.headingIDsOnPage) `Maybe.andThen` (\firstIDOnPrevPage ->
                                                    Just (gotoHeading firstIDOnPrevPage model.toc |> SL.previous |> .selected |> .id)
                                                )
                                            ] ? model.toc.selected.id

                                    _ -> model.toc.selected.id

                            PageJump headingID ->
                                headingID

                            PageReflow ->
                                model.toc.selected.id

                            Render ->
                                List.head headings ? model.toc.selected.id
                in
                    { model
                        | headingIDsOnPage = headings
                        , toc = gotoHeading newSelectedId model.toc
                    }

            Dump msg ->
                let dump = Debug.log "Dump: " msg
                in model

            _ -> model

---- HELPERS ----

headingIdFilter : TOC -> HeadingIDsOnPage -> HeadingIDsOnPage
headingIdFilter toc headingIds =
    let
        elemsWithContent =
            SL.toList toc
            |> List.filter (.chapter >> (==) toc.selected.chapter)
            |> List.foldl (\renderElem elemDict ->
                    Dict.insert renderElem.id (renderElem.body /= "") elemDict
                ) Dict.empty
    in
        List.filter (flip Dict.get elemsWithContent >> Maybe.withDefault False) headingIds

gotoHeading : RenderElementID -> TOC -> TOC
gotoHeading headingID toc =
    SL.indexOf (.id >> (==) headingID) toc `Maybe.andThen` (\index ->
        Just <| SL.goto index toc
    ) |> Maybe.withDefault toc |> markSelectedRead

markSelectedRead : TOC -> TOC
markSelectedRead toc =
    let selectedIndex = SL.selectedIndex toc
        markTocRead t last =
            if t.selected.level < last.selected.level && t.selected.body == "" then
                markTocRead (SL.previous (SL.mapSelected (\selected -> { selected | isRead = True }) t)) t
            else
                SL.goto selectedIndex t
    in markTocRead (SL.previous (SL.mapSelected (\selected -> { selected | isRead = True }) toc)) toc
