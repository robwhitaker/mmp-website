module Reader.Utils.Cmd exposing (SelectionSwitchFlags, ShouldForce(..), genRenderBlob_, renderCmd, setDisqusThread, switchSelectedIdCmd)

import Browser.Navigation as Navigation
import Core.Utils.MaybeExtra exposing (..)
import Core.Utils.SelectionList as SL exposing (SelectionList)
import Dict
import Reader.Aliases exposing (..)
import Reader.Model exposing (..)
import Reader.Ports exposing (..)
import Reader.Utils exposing (matchNoMoreThan, selectedTitleFromSL, selectedTopParentId, unsafeRegex)
import Reader.Utils.Disqus as Disqus
import Regex
import String



---- TYPES FOR CLARITY ----


type ShouldForce
    = ForceChange
    | NoForceChange


type alias SelectionSwitchFlags =
    { forceSelectionChange : ShouldForce }



---- COMMAND BUILDERS ----


renderCmd : Bool -> Model -> Cmd msg
renderCmd isPageTurnBack model =
    renderChapter
        { renderObj = genRenderBlob_ model
        , eId = model.toc.selected.id
        , isPageTurnBack = isPageTurnBack
        }


switchSelectedIdCmd : SelectionSwitchFlags -> Model -> Model -> Cmd msg
switchSelectedIdCmd { forceSelectionChange } oldModel newModel =
    let
        -- forceChange is there for cases where these updates happen after a JS event, like a chapter render.
        -- The model will not have changed, but these things still need to be updated.
        forceChange =
            forceSelectionChange == ForceChange

        disqusUpdate =
            if oldModel.toc.selected.id == newModel.toc.selected.id && not forceChange then
                Cmd.none

            else
                setDisqusThread newModel

        selectedUpdate =
            if oldModel.toc.selected.id == newModel.toc.selected.id && not forceChange then
                Cmd.none

            else
                setSelectedId newModel.toc.selected.id

        hashUpdate =
            if (oldModel.toc.selected.id == newModel.toc.selected.id && not forceChange) || newModel.showCover then
                Cmd.none

            else
                Navigation.replaceUrl newModel.navigationKey <| "#!/" ++ selectedTopParentId newModel.toc
    in
    Cmd.batch
        [ disqusUpdate
        , selectedUpdate
        , hashUpdate
        ]


setDisqusThread : Model -> Cmd msg
setDisqusThread model =
    switchDisqusThread <| Disqus.disqusDataFromTOC model.locationHost model.toc



---- HELPERS ----


genRenderBlob_ : Model -> RenderBlob
genRenderBlob_ model =
    let
        injectID renderElem =
            { renderElem
                | heading =
                    Regex.replace
                        (unsafeRegex "id=\".*?\"|\">")
                        (matchNoMoreThan 1 <|
                            \{ match } ->
                                "\" id=\""
                                    ++ renderElem.id
                                    ++ "\""
                                    ++ (if String.left 2 match == "id" then
                                            ""

                                        else
                                            ">"
                                       )
                        )
                        renderElem.heading
                        |> (if renderElem.isInteractive then
                                Regex.replace
                                    (unsafeRegex "(<h\\d.*?>)(.*?)(<\\/h\\d>)")
                                    (matchNoMoreThan 1 <|
                                        \{ match, submatches } ->
                                            case List.filterMap identity submatches of
                                                [ openTag, content, closeTag ] ->
                                                    openTag
                                                        ++ "<a href=\""
                                                        ++ renderElem.interactiveUrl
                                                        ++ "\""
                                                        ++ "   id=\"interactive-"
                                                        ++ renderElem.id
                                                        ++ "\">"
                                                        ++ "<i class=\"fa fa-gamepad\" aria-hidden=\"true\"></i>"
                                                        ++ content
                                                        ++ "</a>"
                                                        ++ closeTag

                                                _ ->
                                                    match
                                    )

                            else
                                identity
                           )
            }
    in
    { stylesheet = Dict.get model.toc.selected.chapter model.stylesheets |> Maybe.withDefault ""
    , renderElements = List.map injectID <| List.filter (.chapter >> (==) model.toc.selected.chapter) <| SL.toList model.toc
    }
