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
import Reader.Utils exposing (..)
import Reader.Utils.Cmd exposing (renderCmd, switchSelectedIdCmd, setTitleCmd, setDisqusThread)
import Reader.Utils.Disqus as Disqus

import Reader.Components.Modal.Messages as Modal
import Reader.Components.Modal.Update as Modal
import Reader.Components.ShareDialog as ShareDialog
import Reader.Components.CreditsRoll as CreditsRoll
import Reader.Components.ContactModal as ContactModal

import String
import Task
import Process

---- UPDATE ----

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case debugLog "msg" msg of

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
            let (_, newToc, _) = gotoHeading id model.toc
                newShareDialog =
                    ShareDialog.initInnerModel
                        id
                        model.locationHost
                        (selectedTitleFromSL newToc)
                        model.shareDialog
            in update (ShareDialogMsg Modal.ShowModal) { model | shareDialog = newShareDialog }

        ShareDialogMsg modalMsg ->
            let (newDialog, cmds) = Modal.update modalMsg model.shareDialog
            in
                { model | shareDialog = newDialog }
                    ! [ Cmd.map ShareDialogMsg cmds ]

        CreditsRollMsg modalMsg ->
            let (newCredits, cmds) = Modal.update modalMsg model.creditsRoll
            in
                { model | creditsRoll = newCredits }
                    ! [ Cmd.map CreditsRollMsg cmds ]

        ContactModalMsg modalMsg ->
            let (newContact, cmds) = Modal.update modalMsg model.contactModal
            in
                { model | contactModal = newContact }
                    ! [ Cmd.map ContactModalMsg cmds ]

        ChangeSelectedHeading hId ->
            let (_, newToc, cmds) = gotoHeading hId model.toc
                newModel =
                    { model | toc = newToc }
            in
                newModel
                    ! [ switchSelectedIdCmd False model newModel, cmds ]

        TurnPage dir ->
            if model.state == Rendering || model.state == TurningPage then
                model ! []
            else case dir of
                Forward ->
                    if model.pages.current + 1 >= model.pages.total -- >= because 0 indexed
                    then
                        let
                            nToc =
                                SL.traverseFromSelectedUntil
                                    SL.next
                                    (\entry -> entry.chapter /= model.toc.selected.chapter)
                                    model.toc
                                        |> Maybe.withDefault model.toc
                            (newTocUnchecked, newToc, cmds) = gotoHeading nToc.selected.id model.toc
                            newModel =
                                if newToc == model.toc then
                                    model
                                else
                                    { model
                                        | toc = newToc
                                        , lastNavAction = PageTurn Forward
                                        , state = Rendering
                                    }

                            newCmd =
                                if newModel == model then
                                    Cmd.none
                                else
                                    renderCmd False { newModel | toc = newTocUnchecked }
                        in
                            newModel
                                ! [ newCmd, cmds ]
                    else
                        let
                            newModel =
                                { model
                                    | pages =
                                        { current = model.pages.current + 1
                                        , total = model.pages.total
                                        }
                                    , lastNavAction = PageTurn Forward
                                    , state = TurningPage
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
                            (_, newToc, cmds) = gotoHeading nToc.selected.id model.toc
                        in
                            if newToc == model.toc then
                                let newModel = { model | showCover = True }
                                in
                                    newModel
                                        ! [ setTitleCmd newModel ]
                            else
                                let newModel =
                                    { model
                                        | toc = newToc
                                        , lastNavAction = PageTurn Backward
                                        , state = Rendering
                                    }
                                in
                                    newModel
                                        ! [ renderCmd True newModel, cmds ]
                    else
                        let
                            newModel =
                                { model
                                    | pages =
                                        { current = model.pages.current - 1
                                        , total = model.pages.total
                                        }
                                    , lastNavAction = PageTurn Backward
                                    , state = TurningPage
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

                (newTocUnchecked, newToc, cmds) =
                    gotoHeading (maybeRenderElemID ? "") model.toc

                triggersRender = newToc.selected.chapter /= model.toc.selected.chapter

                lastNavAction =
                    if newToc == model.toc then
                        model.lastNavAction
                    else
                        PageJump newToc.selected.id
                newModel =
                    { model
                        | toc = newToc
                        , tocExpanded = expanded
                        , lastNavAction = lastNavAction
                        , state = if triggersRender then Rendering else model.state
                    }

                nextCmd =
                    if triggersRender then
                        renderCmd False { newModel | toc = newTocUnchecked }
                    else
                        if maybeRenderElemID == Nothing then
                            Cmd.none
                        else
                            jumpToEntry newTocUnchecked.selected.id
            in
                newModel
                    ! [ nextCmd, cmds ]

        Load chapters { readEntries, bookmark } locationHash locationHost ->
            let loadedModel = Reader.Model.Helpers.fromChapterList chapters (Dict.fromList readEntries)
                paramID =
                    locationHash
                        |> String.toLower
                        |> Regex.find (Regex.AtMost 1) (Regex.regex "#!/?([ec][0-9]+)|(latest)")
                        |> List.head
                        |> Maybe.map (.submatches >> Maybe.oneOf)
                        |>  (\megaMaybe ->
                                case megaMaybe of
                                    (Just (Just id)) -> id
                                    _                       -> ""
                            )

                maxReleaseDate = maxReleaseDateAsTime loadedModel.toc
                targetID =
                    if paramID == "latest" then
                        Maybe.map .id (List.head (List.filter (.releaseDate >> dateStringToTime >> (==) maxReleaseDate) (SL.toList loadedModel.toc))) ? paramID
                    else
                        paramID

                selectedID = Maybe.oneOf
                    [ Maybe.map (always targetID) (SL.indexOf (.id >> (==) targetID) loadedModel.toc)
                    , bookmark
                    ] ? ""
                (newTocUnchecked, newToc, cmds) = gotoHeading selectedID loadedModel.toc
                newModel =
                    { loadedModel
                        | state = Rendering
                        , toc = newToc
                        , showCover = targetID /= newTocUnchecked.selected.id
                        , locationHost = locationHost
                        , bookmark = if bookmark == Nothing then NoBookmark else HasBookmark
                    }
            in
                newModel
                    ! [ renderCmd False { newModel | toc = newTocUnchecked } ]

        ChapterHasRendered currentPage numPages headingIds ->
            let (_, newToc, cmds) =
                    case model.lastNavAction of
                        PageJump _ ->
                            (model.toc, model.toc, Cmd.none)
                        _ ->
                            if List.member model.toc.selected.id headingIds then
                                gotoHeading model.toc.selected.id model.toc
                            else
                                gotoHeading (List.head headingIds ? model.toc.selected.id) model.toc
                --a = Debug.log "(OLD,NEWTOC)" <| (model.toc.selected.id, newToc.selected.id, model.lastNavAction, headings)
                newModel =
                    { model
                        | pages =
                            { current = currentPage
                            , total = numPages
                            }
                        , state = Ready
                        , headingIDsOnPage = headingIds
                        , toc = newToc
                    }
            in
                newModel
                    ! [ switchSelectedIdCmd True model newModel, cmds ]

        ChapterHasReflowed currentPage numPages maybeFocusedId headingIds ->
            let newFocusedId =
                    if List.length headingIds == 0 && maybeFocusedId /= Nothing then
                        maybeFocusedId ? model.toc.selected.id
                    else if List.member model.toc.selected.id headingIds then
                        model.toc.selected.id
                    else if Just ((SL.next model.toc).selected.id) == List.head headingIds then
                        model.toc.selected.id
                    else
                        List.head headingIds ? model.toc.selected.id

                (_, newToc, cmds) = gotoHeading newFocusedId model.toc

                newModel =
                    { model
                        | pages =
                            { current = currentPage
                            , total = numPages
                            }
                        , state = Ready
                        , toc = newToc
                        , headingIDsOnPage = headingIds
                    }
            in
                newModel
                    ! [ switchSelectedIdCmd False model newModel, cmds ]

        UpdateHeadingsOnPage { headingsOnPage, headingAtTop } ->
            let newSelectedId =
                    case model.lastNavAction of
                        PageTurn dir ->
                            case dir of
                                Forward ->
                                    if List.length headingsOnPage > 0 && model.toc.selected.id /= "" && not headingAtTop then
                                        (List.reverse >> List.head) model.headingIDsOnPage ? model.toc.selected.id
                                    else
                                        Maybe.oneOf
                                            [ List.head headingsOnPage
                                            , (List.reverse >> List.head) model.headingIDsOnPage
                                            ] ? model.toc.selected.id

                                Backward ->
                                    Maybe.oneOf
                                        [ (List.reverse >> List.head) headingsOnPage
                                        , (List.head model.headingIDsOnPage) `Maybe.andThen` (\firstIDOnPrevPage ->
                                                SL.indexOf (.id >> (==) firstIDOnPrevPage) model.toc `Maybe.andThen` (\index ->
                                                    let tocAtIndex = SL.goto index model.toc
                                                        newToc = tocAtIndex |> untilContent SL.previous
                                                    in
                                                        if newToc.selected.chapter /= model.toc.selected.chapter then
                                                            Just tocAtIndex.selected.id
                                                        else
                                                            Just newToc.selected.id
                                                )
                                            )
                                        ] ? model.toc.selected.id

                                _ -> model.toc.selected.id

                        PageJump headingID ->
                            headingID

                (_, newToc, cmds) = gotoHeading newSelectedId model.toc

                arrivedAtHeadingCmds =
                    if model.lastNavAction == PageTurn Forward && not (List.member newSelectedId headingsOnPage) then
                        case List.head headingsOnPage of
                            Just id ->
                                setBookmarkInStorage id
                            Nothing ->
                                Cmd.none
                    else
                        Cmd.none

                newModel =
                    { model
                        | headingIDsOnPage = headingsOnPage
                        , toc = newToc
                        , state = Ready
                    }

                forceUpdate =
                    case model.lastNavAction of
                        PageJump _ -> True
                        _ -> False

            in
                newModel
                    ! [ switchSelectedIdCmd forceUpdate model newModel, arrivedAtHeadingCmds, cmds ]

        Dump msg ->
            let dump = Debug.log "Dump: " msg
            in model ! []

        NoOp -> model ! []

---- HELPERS ----

untilContent : (TOC -> TOC) -> TOC -> TOC
untilContent traverse toc =
    SL.traverseFromSelectedUntil traverse (.body >> (/=) "") toc
    |> Maybe.withDefault toc

gotoHeading : RenderElementID -> TOC -> (TOC, TOC, Cmd Msg) --(@headingID,@contentAfterHeadingID,setStorageCmds)
gotoHeading headingID toc =
    SL.indexOf (.id >> (==) headingID) toc `Maybe.andThen` (\index ->
        let tocAtHeadingId = SL.goto index toc
            tocWithContent =
                if tocAtHeadingId.selected.body == "" then
                    untilContent SL.next tocAtHeadingId
                else
                    tocAtHeadingId

        in
            if tocWithContent.selected.body == "" then
                Nothing
            else
                let (tocWithContentMarked, cmds) = markSelectedRead tocWithContent
                in Just (tocAtHeadingId, tocWithContentMarked, Cmd.batch [ cmds, setBookmarkInStorage tocAtHeadingId.selected.id ] )
    ) |> Maybe.withDefault (toc, toc, Cmd.none)

markSelectedRead : TOC -> (TOC, Cmd Msg)
markSelectedRead toc =
    let selectedIndex = SL.selectedIndex toc
        markTocRead t last cmd =
            if t.selected.level < last.selected.level && t.selected.body == "" then
                markTocRead
                    (SL.previous
                        (SL.mapSelected
                            (\selected ->
                                { selected | isRead = True }
                            ) t
                        )
                    )
                    t
                    (Cmd.batch [ cmd, setReadInStorage t.selected.id ])
            else
                (SL.goto selectedIndex t, cmd)
    in
        markTocRead
            (SL.previous
                (SL.mapSelected
                    (\selected ->
                        { selected | isRead = True }
                    ) toc
                )
            )
            toc
            (setReadInStorage toc.selected.id)
