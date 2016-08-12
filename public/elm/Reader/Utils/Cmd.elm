module Reader.Utils.Cmd exposing (..)

import Reader.Model exposing (..)
import Reader.Ports exposing (..)
import Reader.Utils exposing (selectedTitleFromSL)

import Reader.Utils.Disqus as Disqus

import Core.Utils.MaybeExtra exposing (..)
import Core.Utils.SelectionList as SL exposing (SelectionList)

import Dict
import Regex
import String

---- COMMAND BUILDERS ----

renderCmd : Bool -> Model -> Cmd msg
renderCmd isPageTurnBack model =
    renderChapter
        { renderObj = genRenderBlob_ model
        , eId = model.toc.selected.id
        , isPageTurnBack = isPageTurnBack
        }

switchSelectedIdCmd : Bool -> Model -> Model -> Cmd msg
switchSelectedIdCmd forceChange oldModel newModel =
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

        --storageUpdate =
        --    if oldModel.toc.selected.id == newModel.toc.selected.id && not forceChange then
        --        Cmd.none
        --    else
        --        setReadInStorage newModel.toc.selected.id
    in
        Cmd.batch
            [ disqusUpdate
            , titleUpdate
            --, storageUpdate
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
