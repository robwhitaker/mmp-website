module Reader.Update exposing (..)

import Dict exposing (Dict)
import Maybe
import Regex

import Core.Utils.SelectionList as SL exposing (SelectionList)
import Core.Utils.MaybeExtra exposing (..)
import Core.Models.Chapter exposing (Chapter)

import Reader.Model exposing (..)
import Reader.Aliases exposing (..)
import Reader.Model.Helpers
import Reader.Messages exposing (..)
import Reader.Ports exposing (..)
import Reader.Utils exposing (selectedTitleFromSL)
import Reader.Utils.Cmd exposing (renderCmd, switchSelectedIdCmd, setTitleCmd, setDisqusThread)
import Reader.Utils.Disqus as Disqus

import Reader.Components.ShareDialog.Messages as ShareDialog
import Reader.Components.ShareDialog.Update as ShareDialog

import String
import Task
import Process

---- UPDATE ----

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case Reader.Messages.debugLog "msg" msg of

        CoverClick ->
            let newModel =
                { model | showCover = False }
            in
                newModel
                    ! [ setTitleCmd newModel, setDisqusThread newModel ]

        OpenSharePopup sharePopupSettings ->
            model
                ! [ openSharePopup sharePopupSettings ]

        ShowShareDialog id ->
            update (ShareDialogMsg <| ShareDialog.ShowWith id <| selectedTitleFromSL <| gotoHeading id model.toc) model

        ShareDialogMsg sdmsg ->
            let (newDialog, cmds) = ShareDialog.update sdmsg model.shareDialog
            in
                { model | shareDialog = newDialog }
                    ! [ Cmd.map ShareDialogMsg cmds ]

        ChangeSelectedHeading hId ->
            let newModel =
                { model | toc = gotoHeading hId model.toc }
            in
                newModel
                    ! [ switchSelectedIdCmd False model newModel ]

        TurnPage dir ->
            case dir of
                Forward ->
                    if model.pages.current + 1 >= model.pages.total -- >= because 0 indexed
                    then
                        let
                            nToc =
                                SL.traverseFromSelectedUntil
                                    SL.next
                                    (\entry -> entry.body /= "" && entry.chapter /= model.toc.selected.chapter)
                                    model.toc
                                        |> Maybe.withDefault model.toc
                            newModel =
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
                        in
                            newModel
                                ! [ renderCmd False newModel ]
                    else
                        let
                            newModel =
                                { model
                                    | pages =
                                        { current = model.pages.current + 1
                                        , total = model.pages.total
                                        }
                                    , lastNavAction = PageTurn Forward
                                }
                        in
                            newModel
                                ! [ setPage newModel.pages.current ]

                Backward ->
                    if model.pages.current - 1 < 0
                    then
                        let nToc =
                            SL.traverseFromSelectedUntil
                                    SL.previous
                                    (\entry -> entry.body /= "" && entry.chapter /= model.toc.selected.chapter)
                                    model.toc
                                        |> Maybe.withDefault model.toc
                        in
                            if nToc == model.toc then
                                let newModel = { model | showCover = True }
                                in
                                    newModel
                                        ! [ setTitleCmd newModel ]
                            else
                                let newModel =
                                    { model
                                        | toc = nToc
                                        , lastNavAction = PageTurn Backward
                                        , state = Rendering
                                    }
                                in
                                    newModel
                                        ! [ renderCmd True newModel ]
                    else
                        let
                            newModel =
                                { model
                                    | pages =
                                        { current = model.pages.current - 1
                                        , total = model.pages.total
                                        }
                                    , lastNavAction = PageTurn Backward
                                }
                        in
                            newModel
                                ! [ setPage newModel.pages.current ]

                PageNum num ->
                    if num >= model.pages.total || num < 0 then
                        model ! []
                    else
                        let newModel =
                            { model
                                | pages =
                                    { current = num
                                    , total = model.pages.total
                                    }
                                , lastNavAction =
                                    case model.lastNavAction of
                                        PageJump _ -> model.lastNavAction
                                        _          -> PageTurn (PageNum num)
                            }
                        in
                            newModel
                                ! [ setPage newModel.pages.current ]

        Dropdown (maybeRenderElemID, maybeExpanded) ->
            let expanded = Maybe.withDefault model.tocExpanded maybeExpanded

                nextUntilContent = untilContent SL.next

                newToc =
                    case maybeRenderElemID of
                        Just id ->
                            let targetToc = gotoHeading id model.toc
                            in
                                if targetToc.selected.body == "" then
                                    untilContent SL.next targetToc
                                else
                                    targetToc
                        Nothing ->
                            model.toc

                triggersRender = newToc.selected.chapter /= model.toc.selected.chapter

                lastNavAction =
                    if newToc == model.toc then
                        model.lastNavAction
                    else
                        PageJump newToc.selected.id
                newModel =
                    { model | toc = newToc, tocExpanded = expanded, lastNavAction = lastNavAction, state = if triggersRender then Rendering else model.state }

                nextCmd =
                    if triggersRender then
                        renderCmd False newModel
                    else
                        if model.toc.selected.id == newModel.toc.selected.id then
                            Cmd.none
                        else
                            jumpToEntry newModel.toc.selected.id
            in
                newModel
                    ! [ nextCmd ]

        Load chapters readEntries locationHash ->
            let targetID = String.dropLeft 3 locationHash
                loadedModel = Reader.Model.Helpers.fromChapterList chapters (Dict.fromList readEntries)
                newToc = gotoHeading targetID loadedModel.toc
                newModel = { loadedModel | state = Rendering, toc = newToc, showCover = loadedModel.toc.selected.id == newToc.selected.id }
            in
                newModel
                    ! [ renderCmd False newModel ]

        ChapterHasRendered currentPage numPages headingIds ->
            let headings = headingIdFilter model.toc headingIds
                newToc =
                    case model.lastNavAction of
                        PageJump _ ->
                            model.toc
                        _ ->
                            gotoHeading (List.head headings ? model.toc.selected.id) model.toc
                newModel =
                    { model
                        | pages =
                            { current = currentPage
                            , total = numPages
                            }
                        , state = Ready
                        , headingIDsOnPage = headings
                        , toc = newToc
                    }
            in
                newModel
                    ! [ switchSelectedIdCmd True model newModel ]

        ChapterHasReflowed currentPage numPages maybeFocusedId headingIds ->
            let headings = headingIdFilter model.toc headingIds

                newFocusedId =
                    if List.length headings == 0 && maybeFocusedId /= Nothing then
                        maybeFocusedId ? model.toc.selected.id
                    else if List.member model.toc.selected.id headings then
                        model.toc.selected.id
                    else
                        List.head headings ? model.toc.selected.id

                newModel =
                    { model
                        | pages =
                            { current = currentPage
                            , total = numPages
                            }
                        , state = Ready
                        , toc = gotoHeading newFocusedId model.toc
                        , headingIDsOnPage = headings
                    }
            in
                newModel
                    ! [ switchSelectedIdCmd False model newModel ]

        UpdateHeadingsOnPage { headingsOnPage, headingAtTop } ->
            let headings = headingIdFilter model.toc headingsOnPage
                newSelectedId =
                    case model.lastNavAction of
                        PageTurn dir ->
                            case dir of
                                Forward ->
                                    if List.length headings > 0 && model.toc.selected.id /= "" && not headingAtTop then
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

                newModel =
                    { model
                        | headingIDsOnPage = headings
                        , toc = gotoHeading newSelectedId model.toc
                    }

                forceUpdate =
                    case model.lastNavAction of
                        PageJump _ -> True
                        _ -> False

            in
                newModel
                    ! [ switchSelectedIdCmd forceUpdate model newModel ]

        Dump msg ->
            let dump = Debug.log "Dump: " msg
            in model ! []

        NoOp -> model ! []

---- HELPERS ----

untilContent : (TOC -> TOC) -> TOC -> TOC
untilContent traverse toc =
    SL.traverseFromSelectedUntil traverse (.body >> (/=) "") toc
    |> Maybe.withDefault toc

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
