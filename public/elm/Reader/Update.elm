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

import String
import Task

---- TYPE ALIASES ----

type alias CurrentPage = Int
type alias NumPages = Int
type alias FocusedElementID = RenderElementID
type alias HeadingIDsOnPage = List RenderElementID
type alias LocationHash = String

---- ACTIONS ----

type Action
    = TurnPage Direction
    | CoverClick
    | ShareFromHeading Bool
    | ShowShareDialog RenderElementID
    | HideShareDialogIn Float
    | HideShareDialog
    | Load (List Chapter) (List (RenderElementID, Bool)) LocationHash
    | ChapterHasRendered CurrentPage NumPages HeadingIDsOnPage
    | ChapterHasReflowed CurrentPage NumPages (Maybe FocusedElementID) HeadingIDsOnPage
    | UpdateHeadingsOnPage (List String)
    | ChangeSelectedHeadingForComments String
    | Dropdown Dropdown.Action
    | Dump String
    | NoOp

---- UPDATE ----

update : Action -> Model -> (Model, Effects Action)
update action model =
    case action of

        CoverClick ->
            flip (,) Effects.none
                { model | showCover = False }

        ShareFromHeading willShare ->
            flip (,) Effects.none
                { model | shareFromHeading = willShare }

        ShowShareDialog hId ->
            flip (,) Effects.none
                { model | toc = gotoHeading hId model.toc, lastNavAction = CommentsLinkClick, showShareDialog = True, shareFromHeading = True }

        HideShareDialog ->
            flip (,) Effects.none
                { model | showShareDialog = False, fadingShareDialog = False }

        HideShareDialogIn milli ->
            (,)
                { model | fadingShareDialog = True }
                ((Task.sleep milli `Task.andThen` \_ -> Task.succeed HideShareDialog) |> Effects.task)

        ChangeSelectedHeadingForComments hId ->
            flip (,) Effects.none
                { model | toc = gotoHeading hId model.toc, lastNavAction = CommentsLinkClick }

        TurnPage dir ->
            flip (,) Effects.none <|
                if model.showCover || model.showShareDialog then
                    if dir == Forward then
                        { model | showCover = False }
                    else
                        model
                else case dir of
                    Forward ->
                        if model.pages.current + 1 >= model.pages.total -- >= because 0 indexed
                        then
                            let nToc = untilContent SL.next <| SL.next model.toc
                            in
                                if nToc == model.toc then
                                    { model
                                        | toc = SL.goto 0 model.toc
                                        , lastNavAction = PageTurn Forward
                                        , state = Rendering
                                        , showCover = True
                                    }
                                else
                                    { model
                                        | toc = nToc
                                        , lastNavAction = PageTurn Forward
                                        , state = Rendering
                                    }
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
                        then
                            let nToc = untilContent SL.previous <| SL.previous model.toc
                            in
                                if nToc == SL.previous model.toc then
                                    { model | showCover = True }
                                else
                                    { model
                                        | pages =
                                            { current = model.pages.current - 1
                                            , total = model.pages.total
                                            }
                                        , toc = nToc
                                        , lastNavAction = PageTurn Backward
                                        , state = Rendering
                                    }
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

                nextUntilContent = untilContent SL.next

                newToc =
                    case maybeRenderElemID of
                        Just id ->
                            nextUntilContent (gotoHeading id model.toc)
                        Nothing ->
                            model.toc

                triggersRender = newToc.selected.chapter /= model.toc.selected.chapter

                lastNavAction =
                    if newToc == model.toc then
                        model.lastNavAction
                    else
                        if triggersRender then
                            Render
                        else
                            PageJump newToc.selected.id
            in
                flip (,) Effects.none
                    { model | toc = newToc, tocExpanded = expanded, lastNavAction = lastNavAction, state = if triggersRender then Rendering else model.state }

        Load chapters readEntries locationHash ->
            let targetID = String.dropLeft 3 locationHash
                loadedModel = Reader.Model.Helpers.fromChapterList chapters (Dict.fromList readEntries)
                newToc = gotoHeading targetID loadedModel.toc
            in
                flip (,) Effects.none
                    { loadedModel | state = Rendering, toc = newToc, showCover = loadedModel.toc == newToc }

        ChapterHasRendered currentPage numPages headingIds ->
            let headings = headingIdFilter model.toc headingIds
                newToc = gotoHeading (List.head headings ? model.toc.selected.id) model.toc
            in
                flip (,) Effects.none
                    { model
                        | pages =
                            { current = currentPage
                            , total = numPages
                            }
                        , state = Ready
                        , headingIDsOnPage = headings
                        , toc = newToc
                        , lastNavAction = Render
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
                flip (,) Effects.none
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

                        _ -> model.toc.selected.id
            in
                flip (,) Effects.none
                    { model
                        | headingIDsOnPage = headings
                        , toc = gotoHeading newSelectedId model.toc
                    }

        Dump msg ->
            let dump = Debug.log "Dump: " msg
            in flip (,) Effects.none model

        _ -> flip (,) Effects.none model

---- HELPERS ----

untilContent : (TOC -> TOC) -> TOC -> TOC
untilContent f toc =
    if toc.selected.body == "" && f toc /= toc then
        let nToc = untilContent f (f toc)
        in
            if nToc.selected.body == "" then
                toc
            else
                nToc
    else
        toc

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
