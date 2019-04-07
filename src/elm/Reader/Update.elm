module Reader.Update exposing (getAllOnPage, getHeadingsOnPage, gotoHeading, jumpToEntry, markSelectedRead, untilContent, update)

import Array
import Browser.Navigation as Navigation
import Core.Models.Chapter exposing (Chapter)
import Core.Utils.MaybeExtra exposing (..)
import Core.Utils.SelectionList as SL exposing (SelectionList)
import Dict exposing (Dict)
import Maybe
import Process
import Reader.Aliases exposing (..)
import Reader.Components.ContactModal as ContactModal
import Reader.Components.CreditsRoll as CreditsRoll
import Reader.Components.Modal.Messages as Modal
import Reader.Components.Modal.Update as Modal
import Reader.Components.ShareDialog as ShareDialog
import Reader.Messages exposing (..)
import Reader.Model exposing (..)
import Reader.Model.Helpers
import Reader.Ports exposing (..)
import Reader.Utils exposing (..)
import Reader.Utils.Cmd as CmdHelpers exposing (renderCmd, setDisqusThread, setTitleCmd, switchSelectedIdCmd)
import Reader.Utils.Disqus as Disqus
import Regex
import String
import Task
import Time
import Url



---- UPDATE ----


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case debugLog "msg" msg of
        CoverOpen ->
            let
                newModel =
                    { model
                        | showCover = False
                    }

                coverOpenHashEvent =
                    Navigation.replaceUrl model.navigationKey <| "#!/" ++ selectedTopParentId newModel.toc
            in
            ( newModel
            , Cmd.batch [ setTitleCmd newModel, setDisqusThread newModel, coverOpenHashEvent ]
            )

        UpdateWindowSize viewport ->
            let
                minRatio =
                    0.75

                idealRatio =
                    0.8

                maxRatio =
                    1

                widthToHeightRatio =
                    68.5 / 80

                winHeight =
                    viewport.viewport.height

                newSize =
                    case model.bookDimensions of
                        Nothing ->
                            Just ( widthToHeightRatio * winHeight * idealRatio, winHeight * idealRatio )

                        Just ( width, height ) ->
                            Just <|
                                if height / winHeight < minRatio || height / winHeight > maxRatio then
                                    ( widthToHeightRatio * winHeight * idealRatio, winHeight * idealRatio )

                                else
                                    ( width, height )
            in
            ( { model | bookDimensions = newSize }
            , Cmd.none
            )

        OpenSharePopup sharePopupSettings ->
            ( model
            , Cmd.batch [ openSharePopup sharePopupSettings.data ]
            )

        ShowShareDialog id ->
            let
                ( _, newToc, _ ) =
                    gotoHeading id model.toc

                newShareDialog =
                    ShareDialog.initInnerModel
                        (selectedTopParentId newToc)
                        model.locationHost
                        (selectedTitleFromSL newToc)
                        model.shareDialog
            in
            update (ShareDialogMsg Modal.ShowModal) { model | shareDialog = newShareDialog }

        ShareDialogMsg modalMsg ->
            let
                ( newDialog, cmds ) =
                    Modal.update modalMsg model.shareDialog
            in
            ( { model | shareDialog = newDialog }
            , Cmd.map ShareDialogMsg cmds
            )

        CreditsRollMsg modalMsg ->
            let
                ( newCredits, cmds ) =
                    Modal.update modalMsg model.creditsRoll
            in
            ( { model | creditsRoll = newCredits }
            , Cmd.map CreditsRollMsg cmds
            )

        ContactModalMsg modalMsg ->
            let
                ( newContact, cmds ) =
                    Modal.update modalMsg model.contactModal
            in
            ( { model | contactModal = newContact }
            , Cmd.map ContactModalMsg cmds
            )

        ChangeSelectedHeading hId ->
            let
                ( _, newToc, cmds ) =
                    gotoHeading hId model.toc

                newModel =
                    { model | toc = newToc }

                flags =
                    { forceSelectionChange = CmdHelpers.NoForceChange
                    }
            in
            ( newModel
            , Cmd.batch [ switchSelectedIdCmd flags model newModel, cmds ]
            )

        TurnPage dir ->
            if model.state == Rendering || model.state == Reflowing then
                ( model
                , Cmd.none
                )

            else
                case dir of
                    Forward ->
                        if
                            model.pages.current + 1 >= model.pages.total
                            -- >= because 0 indexed
                        then
                            let
                                nToc =
                                    SL.traverseFromSelectedUntil
                                        SL.next
                                        (\entry -> entry.chapter /= model.toc.selected.chapter)
                                        model.toc
                                        |> Maybe.withDefault model.toc

                                ( newTocUnchecked, newToc, cmds ) =
                                    gotoHeading nToc.selected.id model.toc

                                newModel =
                                    if newToc == model.toc then
                                        model

                                    else
                                        { model
                                            | toc = newToc
                                            , state = Rendering
                                        }

                                newCmd =
                                    if newModel == model then
                                        Cmd.none

                                    else
                                        renderCmd False { newModel | toc = newTocUnchecked }
                            in
                            ( newModel
                            , Cmd.batch [ newCmd, cmds ]
                            )

                        else
                            let
                                newPage =
                                    model.pages.current + 1

                                headingsOnPage =
                                    getHeadingsOnPage newPage model.idsByPage

                                headingAtTop =
                                    List.head (getAllOnPage newPage model.idsByPage)
                                        == List.head headingsOnPage
                                        && List.head headingsOnPage
                                        /= Nothing

                                lastHeading =
                                    getHeadingsOnPage model.pages.current model.idsByPage
                                        |> List.reverse
                                        |> List.head

                                newSelectedId =
                                    if headingAtTop then
                                        List.head headingsOnPage |> Maybe.withDefault model.toc.selected.id

                                    else
                                        lastHeading |> Maybe.withDefault model.toc.selected.id

                                ( _, newToc, cmds ) =
                                    gotoHeading newSelectedId model.toc

                                ( arrivedAtHeadingCmds, lastLoggedId ) =
                                    -- if we've arrived at a heading that is not the selected one, set it to the bookmark manually
                                    if not (List.member newSelectedId headingsOnPage) then
                                        case List.head headingsOnPage of
                                            Just id ->
                                                ( Cmd.batch
                                                    [ setBookmarkInStorage id
                                                    ]
                                                , id
                                                )

                                            Nothing ->
                                                ( Cmd.none, newToc.selected.id )

                                    else
                                        ( Cmd.none, newToc.selected.id )

                                newModel =
                                    { model
                                        | pages =
                                            { current = newPage
                                            , total = model.pages.total
                                            }
                                        , toc = newToc
                                    }

                                flags =
                                    { forceSelectionChange = CmdHelpers.NoForceChange
                                    }
                            in
                            ( newModel
                            , Cmd.batch
                                [ setPage newModel.pages.current
                                , switchSelectedIdCmd flags model newModel
                                , arrivedAtHeadingCmds
                                , cmds
                                ]
                            )

                    Backward ->
                        if model.pages.current - 1 < 0 then
                            let
                                nToc =
                                    SL.traverseFromSelectedUntil
                                        SL.previous
                                        (\entry -> isOwnRelease entry && entry.chapter /= model.toc.selected.chapter)
                                        model.toc
                                        |> Maybe.withDefault model.toc

                                ( _, newToc, cmds ) =
                                    gotoHeading nToc.selected.id model.toc
                            in
                            if newToc == model.toc then
                                let
                                    newModel =
                                        { model | showCover = True }

                                    hideHashCmd =
                                        Navigation.replaceUrl model.navigationKey "/"
                                in
                                ( newModel
                                , Cmd.batch [ setTitleCmd newModel, hideHashCmd ]
                                )

                            else
                                let
                                    newModel =
                                        { model
                                            | toc = newToc
                                            , state = Rendering
                                        }
                                in
                                ( newModel
                                , Cmd.batch [ renderCmd True newModel, cmds ]
                                )

                        else
                            let
                                newPage =
                                    model.pages.current - 1

                                headingsOnPage =
                                    getHeadingsOnPage newPage model.idsByPage

                                lastHeading =
                                    List.head <| getHeadingsOnPage model.pages.current model.idsByPage

                                newSelectedId =
                                    oneOf
                                        [ (List.reverse >> List.head) headingsOnPage
                                        , lastHeading
                                            |> Maybe.andThen
                                                (\firstIDOnPrevPage ->
                                                    SL.indexOf (.id >> (==) firstIDOnPrevPage) model.toc
                                                        |> Maybe.andThen
                                                            (\index ->
                                                                let
                                                                    tocAtIndex =
                                                                        SL.goto index model.toc

                                                                    nToc =
                                                                        tocAtIndex |> untilContent SL.previous
                                                                in
                                                                if nToc.selected.chapter /= model.toc.selected.chapter then
                                                                    Just tocAtIndex.selected.id

                                                                else
                                                                    Just nToc.selected.id
                                                            )
                                                )
                                        ]
                                        |> Maybe.withDefault model.toc.selected.id

                                ( _, newToc, cmds ) =
                                    gotoHeading newSelectedId model.toc

                                newModel =
                                    { model
                                        | pages =
                                            { current = model.pages.current - 1
                                            , total = model.pages.total
                                            }
                                        , toc = newToc
                                    }

                                flags =
                                    { forceSelectionChange = CmdHelpers.NoForceChange
                                    }
                            in
                            ( newModel
                            , Cmd.batch
                                [ setPage newModel.pages.current
                                , switchSelectedIdCmd flags model newModel
                                , cmds
                                ]
                            )

        Dropdown ( maybeRenderElemID, maybeExpanded ) ->
            let
                expanded =
                    Maybe.withDefault model.tocExpanded maybeExpanded
            in
            case maybeRenderElemID of
                Nothing ->
                    ( { model | tocExpanded = expanded }
                    , Cmd.none
                    )

                Just renderElemID ->
                    let
                        ( newModel, cmds ) =
                            jumpToEntry renderElemID
                                model
                                { forceSelectionChange = CmdHelpers.ForceChange
                                }
                    in
                    ( { newModel | tocExpanded = expanded }
                    , Cmd.batch
                        [ cmds ]
                    )

        Load chapters { readEntries, bookmark } progStartTime location navigationKey userTimezone ->
            let
                loadedModel_ =
                    Reader.Model.Helpers.fromChapterList chapters
                        (Dict.fromList readEntries)
                        navigationKey
                        userTimezone

                loadedModel =
                    --to make sure the async load doesn't throw away the results from the nextReleaseDate HTTP request
                    { loadedModel_
                        | nextReleaseDate = model.nextReleaseDate
                        , bookDimensions = model.bookDimensions
                    }

                loc =
                    Maybe.withDefault "" location.fragment

                paramID =
                    if String.startsWith "!/" loc then
                        String.dropLeft 2 loc

                    else if String.startsWith "/" loc then
                        String.dropLeft 1 loc

                    else
                        loc

                maxReleaseDate =
                    maxReleaseDateAsTime loadedModel.toc

                targetID =
                    if paramID == "latest" then
                        Maybe.map .id
                            (List.head
                                (List.filter (.releaseDate >> dateStringToTime >> (==) maxReleaseDate)
                                    (SL.toList loadedModel.toc)
                                )
                            )
                            |> Maybe.withDefault paramID

                    else
                        paramID

                selectedID =
                    oneOf
                        [ Maybe.map (always targetID) (SL.indexOf (.id >> (==) targetID) loadedModel.toc)
                        , bookmark
                        ]
                        |> Maybe.withDefault loadedModel.toc.selected.id

                ( newTocUnchecked, newToc, cmds ) =
                    gotoHeading selectedID loadedModel.toc

                showCover =
                    targetID /= newTocUnchecked.selected.id

                protocolString p =
                    case p of
                        Url.Http ->
                            "http://"

                        Url.Https ->
                            "https://"

                newModel =
                    { loadedModel
                        | state = Rendering
                        , toc = newToc
                        , showCover = showCover && model.showCover
                        , locationHost = protocolString location.protocol ++ location.host
                        , bookmark =
                            if bookmark == Nothing then
                                NoBookmark

                            else
                                HasBookmark
                    }
            in
            ( newModel
            , Cmd.batch
                [ renderCmd False { newModel | toc = newTocUnchecked } ]
            )

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

                flags =
                    { forceSelectionChange = CmdHelpers.ForceChange }
            in
            ( newModel
            , Cmd.batch [ switchSelectedIdCmd flags model newModel ]
            )

        ChapterHasReflowed currentPage idsByPage ->
            let
                headingIds =
                    getHeadingsOnPage currentPage idsByPage

                getPrevHeadingId : PageNum -> IdsByPage -> Maybe String
                getPrevHeadingId pNum ids =
                    if pNum < 0 then
                        Nothing

                    else
                        let
                            hs =
                                getHeadingsOnPage pNum ids

                            h =
                                List.head <| List.reverse hs
                        in
                        case h of
                            Just hId ->
                                Just hId

                            Nothing ->
                                getPrevHeadingId (pNum - 1) ids

                maybeFocusedId =
                    if List.length headingIds == 0 then
                        getPrevHeadingId (currentPage - 1) idsByPage

                    else
                        Nothing

                newFocusedId =
                    if List.length headingIds == 0 && maybeFocusedId /= Nothing then
                        maybeFocusedId |> Maybe.withDefault model.toc.selected.id

                    else if List.member model.toc.selected.id headingIds then
                        model.toc.selected.id

                    else if Just (SL.next model.toc).selected.id == List.head headingIds then
                        model.toc.selected.id

                    else
                        List.head headingIds |> Maybe.withDefault model.toc.selected.id

                ( _, newToc, cmds ) =
                    gotoHeading newFocusedId model.toc

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

                flags =
                    { forceSelectionChange = CmdHelpers.NoForceChange }
            in
            ( newModel
            , Cmd.batch
                [ switchSelectedIdCmd flags model newModel
                , cmds
                ]
            )

        SetNextReleaseDate date ->
            ( { model | nextReleaseDate = Just date }
            , Cmd.none
            )

        Dump message ->
            let
                dump =
                    Debug.log "Dump: " message
            in
            ( model
            , Cmd.none
            )

        Ping ->
            ( model
            , pingback True
            )

        StartReflow ->
            ( { model | state = Reflowing }
            , beginReflow True
            )

        NoOp ->
            ( model
            , Cmd.none
            )



---- HELPERS ----


untilContent : (TOC -> TOC) -> TOC -> TOC
untilContent traverse toc =
    SL.traverseFromSelectedUntil traverse isOwnRelease toc
        |> Maybe.withDefault toc


gotoHeading :
    RenderElementID
    -> TOC
    -> ( TOC, TOC, Cmd Msg ) --(@headingID,@contentAfterHeadingID,setStorageCmds)
gotoHeading headingID toc =
    SL.indexOf (.id >> (==) headingID) toc
        |> Maybe.andThen
            (\index ->
                let
                    tocAtHeadingId =
                        SL.goto index toc

                    tocWithContent =
                        if not (isOwnRelease tocAtHeadingId.selected) then
                            untilContent SL.next tocAtHeadingId

                        else
                            tocAtHeadingId
                in
                if not (isOwnRelease tocWithContent.selected) then
                    Nothing

                else
                    let
                        ( tocWithContentMarked, cmds ) =
                            markSelectedRead tocWithContent
                    in
                    Just ( tocAtHeadingId, tocWithContentMarked, Cmd.batch [ cmds, setBookmarkInStorage tocAtHeadingId.selected.id ] )
            )
        |> Maybe.withDefault ( toc, toc, Cmd.none )


markSelectedRead : TOC -> ( TOC, Cmd Msg )
markSelectedRead toc =
    let
        selectedIndex =
            SL.selectedIndex toc

        markTocRead t last cmd =
            if t.selected.level < last.selected.level && not (isOwnRelease t.selected) then
                markTocRead
                    (SL.previous
                        (SL.mapSelected
                            (\selected ->
                                { selected | isRead = True }
                            )
                            t
                        )
                    )
                    t
                    (Cmd.batch [ cmd, setReadInStorage t.selected.id ])

            else
                ( SL.goto selectedIndex t, cmd )
    in
    markTocRead
        (SL.previous
            (SL.mapSelected
                (\selected ->
                    { selected | isRead = True }
                )
                toc
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
    Array.get pageNum idsByPage |> Maybe.withDefault []


jumpToEntry : RenderElementID -> Model -> CmdHelpers.SelectionSwitchFlags -> ( Model, Cmd Msg )
jumpToEntry renderElemID model flags =
    let
        findPageOfId : RenderElementID -> IdsByPage -> Int -> Maybe Int
        findPageOfId rId idsByPage index =
            case Array.get index idsByPage of
                Just list ->
                    if List.member rId list then
                        Just index

                    else
                        findPageOfId rId idsByPage (index + 1)

                Nothing ->
                    Nothing

        ( newTocUnchecked, newToc, cmds ) =
            gotoHeading renderElemID model.toc

        triggersRender =
            newToc.selected.chapter /= model.toc.selected.chapter

        newPage =
            findPageOfId newTocUnchecked.selected.id model.idsByPage 0 |> Maybe.withDefault model.pages.current

        newModel =
            { model
                | pages =
                    { current = newPage
                    , total = model.pages.total
                    }
                , toc = newToc
                , state =
                    if triggersRender then
                        Rendering

                    else
                        model.state
            }

        nextCmd =
            if triggersRender then
                renderCmd False { newModel | toc = newTocUnchecked }

            else
                setPage newModel.pages.current
    in
    ( newModel, Cmd.batch [ switchSelectedIdCmd flags model newModel, nextCmd, cmds ] )
