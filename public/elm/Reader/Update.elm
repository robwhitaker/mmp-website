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
import Array

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
            if model.state == Rendering then
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

                            arrivedAtHeadingCmds =
                                -- if we've arrived at a heading that is not the selected one, set it to the bookmark manually
                                if not (List.member newSelectedId headingsOnPage) then
                                    case List.head headingsOnPage of
                                        Just id ->
                                            setBookmarkInStorage id
                                        Nothing ->
                                            Cmd.none
                                else
                                    Cmd.none

                            newModel =
                                { model
                                    | pages =
                                        { current = newPage
                                        , total = model.pages.total
                                        }
                                    , toc = newToc
                                }
                        in
                            newModel
                                ! [ setPage newModel.pages.current
                                  , switchSelectedIdCmd False model newModel
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
                                in
                                    newModel
                                        ! [ setTitleCmd newModel ]
                            else
                                let newModel =
                                    { model
                                        | toc = newToc
                                        , state = Rendering
                                    }
                                in
                                    newModel
                                        ! [ renderCmd True newModel, cmds ]
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

                            newModel =
                                { model
                                    | pages =
                                        { current = model.pages.current - 1
                                        , total = model.pages.total
                                        }
                                    , toc = newToc
                                }
                        in
                            newModel
                                ! [ setPage newModel.pages.current
                                  , switchSelectedIdCmd False model newModel
                                  , cmds
                                  ]

        Dropdown (maybeRenderElemID, maybeExpanded) ->
            let expanded = Maybe.withDefault model.tocExpanded maybeExpanded
            in
                case maybeRenderElemID of
                    Nothing -> { model | tocExpanded = expanded } ! []
                    Just renderElemID ->
                        let nextUntilContent = untilContent SL.next

                            (newTocUnchecked, newToc, cmds) =
                                gotoHeading renderElemID model.toc

                            triggersRender = newToc.selected.chapter /= model.toc.selected.chapter

                            newPage =
                                findPageOfId newToc.selected.id model.idsByPage 0 ? model.pages.current

                            newModel =
                                { model
                                    | pages =
                                        { current = newPage
                                        , total = model.pages.total
                                        }
                                    , toc = newToc
                                    , tocExpanded = expanded
                                    , state = if triggersRender then Rendering else model.state
                                }

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


                            nextCmd =
                                if triggersRender then
                                    renderCmd False { newModel | toc = newTocUnchecked }
                                else
                                    setPage newModel.pages.current
                        in
                            newModel
                                ! [ switchSelectedIdCmd True model newModel
                                  , nextCmd
                                  , cmds
                                  ]

        Load chapters { readEntries, bookmark } locationHash locationHost ->
            let loadedModel = Reader.Model.Helpers.fromChapterList chapters (Dict.fromList readEntries)
                paramID =
                    locationHash
                        |> String.toLower
                        |> Regex.find (Regex.AtMost 1) (Regex.regex "#!/?([ec][0-9]+)|(latest)")
                        |> List.head
                        |> Maybe.map (.submatches >> oneOf)
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

                selectedID = oneOf
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
            in
                newModel
                    ! [ switchSelectedIdCmd True model newModel ]

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
            in
                newModel
                    ! [ switchSelectedIdCmd False model newModel, cmds ]

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
