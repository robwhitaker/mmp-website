module Reader.Utils.Cmd exposing (..)

import Reader.Model exposing (..)
import Reader.Aliases exposing (..)
import Reader.Ports exposing (..)
import Reader.Utils exposing (selectedTitleFromSL)

import Reader.Utils.Disqus as Disqus
import Reader.Utils.Analytics as Analytics exposing (Analytic)

import Core.Utils.MaybeExtra exposing (..)
import Core.Utils.SelectionList as SL exposing (SelectionList)

import Dict
import Regex
import String
import Navigation

---- COMMAND BUILDERS ----

renderCmd : Bool -> Model -> Cmd msg
renderCmd isPageTurnBack model =
    renderChapter
        { renderObj = genRenderBlob_ model
        , eId = model.toc.selected.id
        , isPageTurnBack = isPageTurnBack
        }

switchSelectedIdCmd : Bool -> Bool -> Model -> Model -> Maybe (RenderElementID -> Analytic) -> Cmd msg
switchSelectedIdCmd forceChange isHashChange oldModel newModel mkNavAnalytic =
    let
        disqusUpdate =
            if oldModel.toc.selected.id == newModel.toc.selected.id && not forceChange then
                Cmd.none
            else
                setDisqusThread newModel

        titleUpdate =
            if oldModel.toc.selected.id == newModel.toc.selected.id && oldModel.showCover == newModel.showCover && not forceChange then
                Cmd.none
            else
                setTitleCmd newModel

        selectedUpdate =
            if oldModel.toc.selected.id == newModel.toc.selected.id && not forceChange then
                Cmd.none
            else
                setSelectedId newModel.toc.selected.id

        hashUpdate =
            if oldModel.toc.selected.id == newModel.toc.selected.id && not forceChange || isHashChange then
                Cmd.none
            else
                Navigation.newUrl <| "#!/" ++ newModel.toc.selected.id

        analyticEvent =
            if (oldModel.toc.selected.id == newModel.toc.selected.id || newModel.toc.selected.id == oldModel.analyticData.lastLoggedNavID) && not forceChange then
                Cmd.none
            else
                case mkNavAnalytic of
                    Just navAnalyticFn ->
                        sendAnalyticEvent <| Analytics.toAnalyticEvent (navAnalyticFn newModel.toc.selected.id)
                    Nothing ->
                        Cmd.none

    in
        Cmd.batch
            [ disqusUpdate
            , titleUpdate
            , selectedUpdate
            , hashUpdate
            , analyticEvent
            ]

setTitleCmd : Model -> Cmd msg
setTitleCmd model =
    setTitle <|
        if model.showCover then
            "Midnight Murder Party"
        else
            selectedTitleFromSL model.toc ++ " | Midnight Murder Party"

setDisqusThread : Model -> Cmd msg
setDisqusThread model =
    switchDisqusThread <| Disqus.disqusDataFromTOC model.locationHost model.toc

---- HELPERS ----

genRenderBlob_ : Model -> RenderBlob
genRenderBlob_ model =
    let
        injectID renderElem =
            { renderElem |
                heading =
                    Regex.replace
                        (Regex.AtMost 1)
                        (Regex.regex "id=\".*?\"|\">")
                        (\{ match } -> "\" id=\"" ++ renderElem.id ++ "\"" ++ if String.left 2 match == "id" then "" else ">")
                        renderElem.heading
            }
    in
        { stylesheet = Dict.get model.toc.selected.chapter model.stylesheets ? ""
        , renderElements = List.map injectID <| List.filter (.chapter >> (==) model.toc.selected.chapter) <| SL.toList model.toc
        }
