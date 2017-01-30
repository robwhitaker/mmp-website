module Reader.Update exposing (..)

import Dict exposing (Dict)
import Maybe
import Regex
import Time
import UrlParser
import Navigation

import Core.Utils.SelectionList as SL exposing (SelectionList)
import Core.Utils.MaybeExtra exposing (..)
import Core.Models.Chapter exposing (Chapter)

import Reader.Model exposing (..)
import Reader.Aliases exposing (..)
import Reader.Model.Helpers
import Reader.Messages exposing (..)
import Reader.Ports exposing (..)
import Reader.Utils exposing (..)
import Reader.Utils.Analytics as Analytics exposing (..)
import Reader.Utils.Cmd as CmdHelpers exposing (renderCmd, switchSelectedIdCmd, setTitleCmd, setDisqusThread)
import Reader.Utils.Disqus as Disqus

import Reader.Components.Modal.Messages as Modal
import Reader.Components.Modal.Update as Modal
import Reader.Components.ShareDialog as ShareDialog
import Reader.Components.CreditsRoll as CreditsRoll
import Reader.Components.ContactModal as ContactModal

import String
import Task
import Process
import Array

---- UPDATE ----

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case debugLog "msg" msg of

        CoverOpen method ->
            let analyticData = model.analyticData
                newModel =
                    { model
                        | showCover = False
                        , analyticData = { analyticData | firstCoverOpen = True }
                    }
                coverOpenAnalyticTrigger =
                    if model.analyticData.firstCoverOpen == False then
                        Task.perform (SendCoverOpenAnalytic method) Time.now
                    else
                        Cmd.none

                coverOpenHashEvent =
                    Navigation.modifyUrl <| "#!/" ++ (selectedTopParentId newModel.toc)
            in
                newModel
                    ! [ setTitleCmd newModel, setDisqusThread newModel, coverOpenAnalyticTrigger, coverOpenHashEvent ]

        SendCoverOpenAnalytic method firstOpenTime ->
            model
                ! [ sendAnalyticEvent (Analytics.toAnalyticEvent (Book => Open => method => firstOpenTime - model.analyticData.progStartTime)) ]

        SendFollowAnalytic analyticsLabel ->
            model
                ! [ sendAnalyticEvent <| Analytics.toAnalyticEvent (SocialButtons => Follow => analyticsLabel) ]

        OpenSharePopup sharePopupSettings ->
            let analyticEvent = Analytics.toAnalyticEvent <| SocialButtons => Share => sharePopupSettings.analyticsLabel
            in
                model
                    ! [ openSharePopup sharePopupSettings.data, sendAnalyticEvent analyticEvent ]

        ShowShareDialog id ->
            let (_, newToc, _) = gotoHeading id model.toc
                newShareDialog =
                    ShareDialog.initInnerModel
                        (selectedTopParentId newToc)
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
                flags =
                    { forceSelectionChange = CmdHelpers.NoForceChange
                    , analyticFn = Just (BookNavigation << InlineLinkClick)
                    }
            in
                newModel
                    ! [ switchSelectedIdCmd flags model newModel, cmds ]

        TurnPage dir ->
            if model.state == Rendering || model.state == Reflowing then
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
                            analyticData = model.analyticData
                            newModel =
                                if newToc == model.toc then
                                    model
                                else
                                    { model
                                        | toc = newToc
                                        , state = Rendering
                                        , analyticData =
                                            { analyticData
                                                | lastLoggedNavID = newToc.selected.id
                                            }
                                    }

                            newCmd =
                                if newModel == model then
                                    Cmd.none
                                else
                                    renderCmd False { newModel | toc = newTocUnchecked }
                        in
                            newModel
                                ! [ newCmd, cmds, sendAnalyticEvent <| Analytics.toAnalyticEvent (BookNavigation => PageTurnForward => newToc.selected.id) ]
                    else
                        let
                            newPage = model.pages.current + 1

                            headingsOnPage = getHeadingsOnPage newPage model.idsByPage

                            headingAtTop =
                                List.head (getAllOnPage newPage model.idsByPage) == List.head headingsOnPage &&
                                List.head headingsOnPage /= Nothing

                            lastHeading =
                                getHeadingsOnPage model.pages.current model.idsByPage
                                    |> List.reverse
                                    |> List.head

                            newSelectedId =
                                if headingAtTop then
                                    List.head headingsOnPage ? model.toc.selected.id
                                else
                                    lastHeading ? model.toc.selected.id

                            (_, newToc, cmds) = gotoHeading newSelectedId model.toc

                            (arrivedAtHeadingCmds, lastLoggedId) =
                                -- if we've arrived at a heading that is not the selected one, set it to the bookmark manually
                                if not (List.member newSelectedId headingsOnPage) then
                                    case List.head headingsOnPage of
                                        Just id ->
                                            (,)
                                                (Cmd.batch
                                                    [ setBookmarkInStorage id
                                                    , if id /= model.analyticData.lastLoggedNavID then
                                                        sendAnalyticEvent <| Analytics.toAnalyticEvent (BookNavigation => PageTurnForward => id)
                                                      else
                                                        Cmd.none
                                                    ]
                                                )
                                                id
                                        Nothing ->
                                            (Cmd.none, newToc.selected.id)
                                else
                                    (Cmd.none, newToc.selected.id)

                            analyticData = model.analyticData
                            newModel =
                                { model
                                    | pages =
                                        { current = newPage
                                        , total = model.pages.total
                                        }
                                    , toc = newToc
                                    , analyticData =
                                        { analyticData
                                            | lastLoggedNavID = lastLoggedId
                                        }
                                }
                            flags =
                                { forceSelectionChange = CmdHelpers.NoForceChange
                                , analyticFn = Just (BookNavigation << PageTurnForward)
                                }
                        in
                            newModel
                                ! [ setPage newModel.pages.current
                                  , switchSelectedIdCmd flags model newModel
                                  , arrivedAtHeadingCmds
                                  , cmds
                                  ]

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
                                    hideHashCmd = Navigation.modifyUrl "/"
                                in
                                    newModel
                                        ! [ setTitleCmd newModel, hideHashCmd ]
                            else
                                let analyticData = model.analyticData
                                    newModel =
                                    { model
                                        | toc = newToc
                                        , state = Rendering
                                        , analyticData =
                                            { analyticData
                                                | lastLoggedNavID = newToc.selected.id
                                            }
                                    }
                                in
                                    newModel
                                        ! [ renderCmd True newModel, cmds, sendAnalyticEvent <| Analytics.toAnalyticEvent (BookNavigation => PageTurnBackward => newToc.selected.id) ]
                    else
                        let
                            newPage = model.pages.current - 1

                            headingsOnPage = getHeadingsOnPage newPage model.idsByPage

                            lastHeading = List.head <| getHeadingsOnPage model.pages.current model.idsByPage

                            newSelectedId =
                                oneOf
                                    [ (List.reverse >> List.head) headingsOnPage
                                    , lastHeading |> Maybe.andThen (\firstIDOnPrevPage ->
                                            SL.indexOf (.id >> (==) firstIDOnPrevPage) model.toc |> Maybe.andThen (\index ->
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

                            (_, newToc, cmds) = gotoHeading newSelectedId model.toc

                            analyticData = model.analyticData
                            newModel =
                                { model
                                    | pages =
                                        { current = model.pages.current - 1
                                        , total = model.pages.total
                                        }
                                    , toc = newToc
                                    , analyticData =
                                        { analyticData
                                            | lastLoggedNavID = newToc.selected.id
                                        }
                                }
                            flags =
                                { forceSelectionChange = CmdHelpers.NoForceChange
                                , analyticFn = Just (BookNavigation << PageTurnBackward)
                                }
                        in
                            newModel
                                ! [ setPage newModel.pages.current
                                  , switchSelectedIdCmd flags model newModel
                                  , cmds
                                  ]

        Dropdown (maybeRenderElemID, maybeExpanded) ->
            let expanded = Maybe.withDefault model.tocExpanded maybeExpanded
            in
                case maybeRenderElemID of
                    Nothing ->
                        { model | tocExpanded = expanded }
                            ! [
                                if model.tocExpanded /= expanded && expanded == True then
                                    sendAnalyticEvent <| Analytics.toAnalyticEvent (Book => DropdownOpen)
                                else
                                    Cmd.none
                              ]
                    Just renderElemID ->
                        let (newModel, cmds) =
                                jumpToEntry renderElemID model
                                    { forceSelectionChange = CmdHelpers.ForceChange
                                    , analyticFn = Just (BookNavigation << TableOfContents)
                                    }
                        in
                            { newModel | tocExpanded = expanded }
                                ! [ cmds
                                  , if model.tocExpanded /= expanded && expanded == True then
                                        sendAnalyticEvent <| Analytics.toAnalyticEvent (Book => DropdownOpen)
                                    else
                                        Cmd.none
                                  ]

        Load chapters { readEntries, bookmark } progStartTime location ->
            let loadedModel_ = Reader.Model.Helpers.fromChapterList chapters (Dict.fromList readEntries)
                loadedModel = --to make sure the async load doesn't throw away the results from the nextReleaseDate HTTP request
                    { loadedModel_ | nextReleaseDate = model.nextReleaseDate }
                -- get rid of the hashbang because it spooks the UrlParser
                loc = { location | hash = String.filter ((/=) '!') location.hash }
                paramID = UrlParser.parseHash UrlParser.string loc ? ""
                maxReleaseDate = maxReleaseDateAsTime loadedModel.toc
                targetID =
                    if paramID == "latest" then
                        Maybe.map .id (List.head (List.filter (.releaseDate >> dateStringToTime >> (==) maxReleaseDate) (SL.toList loadedModel.toc))) ? paramID
                    else
                        paramID

                (selectedID, analyticFn) = oneOf
                    [ Maybe.map (always (targetID, (BookNavigation << UrlLoad))) (SL.indexOf (.id >> (==) targetID) loadedModel.toc)
                    , Maybe.map (flip (,) (BookNavigation << Bookmark)) bookmark
                    ] ? (loadedModel.toc.selected.id, (BookNavigation << FirstLoad))
                (newTocUnchecked, newToc, cmds) = gotoHeading selectedID loadedModel.toc
                showCover = targetID /= newTocUnchecked.selected.id
                newModel =
                    { loadedModel
                        | state = Rendering
                        , toc = newToc
                        , showCover = showCover && model.showCover
                        , locationHost = location.protocol ++ "//" ++ location.host
                        , bookmark = if bookmark == Nothing then NoBookmark else HasBookmark
                        , analyticData =
                            { firstCoverOpen = not showCover
                            , progStartTime = progStartTime
                            , lastLoggedNavID = newToc.selected.id
                            }
                    }
                analyticEvent =
                    if not showCover then
                        sendAnalyticEvent <| Analytics.toAnalyticEvent (Book => Open => OpenUrlLoad)
                    else
                        Cmd.none
            in
                newModel
                    ! [ renderCmd False { newModel | toc = newTocUnchecked }
                      , sendAnalyticEvent <| Analytics.toAnalyticEvent (analyticFn newToc.selected.id)
                      , analyticEvent
                      ]

        ChapterHasRendered currentPage idsByPage ->
            let
                newModel =
                    { model
                        | pages =
                            { current = currentPage
                            , total = Array.length idsByPage
                            }
                        , state = Ready
                        , idsByPage = idsByPage
                    }
                renderEvent = sendAnalyticEvent <| Analytics.toAnalyticEvent (Book => BookRender)
                flags =
                    { forceSelectionChange = CmdHelpers.ForceChange
                    , analyticFn = Nothing
                    }
            in
                newModel
                    ! [ switchSelectedIdCmd flags model newModel, renderEvent ]

        ChapterHasReflowed currentPage idsByPage ->
            let
                headingIds = getHeadingsOnPage currentPage idsByPage

                getPrevHeadingId : PageNum -> IdsByPage -> Maybe String
                getPrevHeadingId pNum ids =
                    if pNum < 0 then
                        Nothing
                    else
                        let hs = getHeadingsOnPage pNum ids
                            h  = List.head <| List.reverse hs
                        in case h of
                            Just hId -> Just hId
                            Nothing  -> getPrevHeadingId (pNum-1) ids

                maybeFocusedId =
                    if List.length headingIds == 0 then
                        getPrevHeadingId (currentPage-1) idsByPage
                    else
                        Nothing

                newFocusedId =
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
                            , total = Array.length idsByPage
                            }
                        , state = Ready
                        , toc = newToc
                        , idsByPage = idsByPage
                    }
                reflowEvent = sendAnalyticEvent <| Analytics.toAnalyticEvent (Book => BookReflow)
                flags =
                    { forceSelectionChange = CmdHelpers.NoForceChange
                    , analyticFn = Nothing
                    }
            in
                newModel
                    ! [ switchSelectedIdCmd flags model newModel
                      , reflowEvent
                      , cmds
                      ]

        SetNextReleaseDate date ->
            { model | nextReleaseDate = Just date }
                ! []

        Dump msg ->
            let dump = Debug.log "Dump: " msg
            in model ! []

        Ping ->
            model ! [ pingback True ]

        StartReflow ->
            { model | state = Reflowing }
                ! [ beginReflow True ]

        NoOp -> model ! []

---- HELPERS ----

untilContent : (TOC -> TOC) -> TOC -> TOC
untilContent traverse toc =
    SL.traverseFromSelectedUntil traverse (.body >> (/=) "") toc
    |> Maybe.withDefault toc

gotoHeading : RenderElementID -> TOC -> (TOC, TOC, Cmd Msg) --(@headingID,@contentAfterHeadingID,setStorageCmds)
gotoHeading headingID toc =
    SL.indexOf (.id >> (==) headingID) toc |> Maybe.andThen (\index ->
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

getHeadingsOnPage : PageNum -> IdsByPage -> List RenderElementID
getHeadingsOnPage pageNum idsByPage =
    Array.get pageNum idsByPage
        |> Maybe.withDefault []
        |> List.filter (\id -> String.startsWith "c" id || String.startsWith "e" id)

getAllOnPage : PageNum -> IdsByPage -> List RenderElementID
getAllOnPage pageNum idsByPage =
    Array.get pageNum idsByPage ? []



jumpToEntry : RenderElementID -> Model -> CmdHelpers.SelectionSwitchFlags -> (Model, Cmd Msg)
jumpToEntry renderElemID model flags =
    let
        findPageOfId : RenderElementID -> IdsByPage -> Int -> Maybe Int
        findPageOfId rId idsByPage index =
            case Array.get index idsByPage of
                Just list ->
                    if List.member rId list then
                        Just index
                    else
                        findPageOfId rId idsByPage (index+1)
                Nothing ->
                    Nothing

        (newTocUnchecked, newToc, cmds) =
            gotoHeading renderElemID model.toc

        triggersRender = newToc.selected.chapter /= model.toc.selected.chapter

        newPage =
            findPageOfId newTocUnchecked.selected.id model.idsByPage 0 ? model.pages.current

        analyticData = model.analyticData
        newModel =
            { model
                | pages =
                    { current = newPage
                    , total = model.pages.total
                    }
                , toc = newToc
                , state = if triggersRender then Rendering else model.state
                , analyticData =
                    { analyticData
                        | lastLoggedNavID = newToc.selected.id
                    }
            }

        nextCmd =
            if triggersRender then
                renderCmd False { newModel | toc = newTocUnchecked }
            else
                setPage newModel.pages.current
    in
        (newModel, Cmd.batch [ switchSelectedIdCmd flags model newModel, nextCmd, cmds ])
