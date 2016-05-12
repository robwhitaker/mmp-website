module Reader.Reader where

import Dict
import Regex
import String
import StartApp
import Keyboard
import Effects exposing (Effects, Never)
import Task exposing (Task)
import Html exposing (Html)

import Mouse

import Core.Utils.SelectionList as SL
import Core.Utils.MaybeExtra exposing (..)

import Reader.Model exposing (..)
import Reader.Update exposing (..)
import Reader.View exposing (..)
import Reader.Utils exposing (..)

import Reader.Components.Disqus exposing (..)

import Core.HTTP.Requests as Requests
import Json.Decode as Json
import Core.Models.Chapter as Chapter

--TODO: remove these when done
import Debug

init : (Model, Effects Action)
init =
    (,)
        Reader.Model.empty
        (Requests.send Nothing (Requests.Get) (Json.list Chapter.decoder) "/chapters"
            |> Requests.toEffect
                (\chapters -> Load chapters readEntries location)
                (\_ -> NoOp)
        )

genRenderBlob : Model -> RenderBlob
genRenderBlob model =
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

---- WIRING ----

app = StartApp.start
    { init   = init
    , update = update
    , view   = view
    , inputs = [ arrowKeys, chapterRenderedIn, chapterReflowIn, headingsUpdated, pageSet, closeDropdown, commentsLinkClick ]
    }

main : Signal Html
main = app.html

-- Inputs --

arrowKeys : Signal Action
arrowKeys =
    Signal.merge iframeArrows Keyboard.arrows
    |> Signal.map (\{ x } ->
        if x == -1 then TurnPage Backward
        else if x == 1 then TurnPage Forward
        else NoOp
        )
    |> Signal.dropRepeats

chapterRenderedIn : Signal Action
chapterRenderedIn =
    chapterRendered
    |> Signal.map
        (\{currentPage, numPages, headingsOnPage} -> ChapterHasRendered currentPage numPages headingsOnPage)
    |> Signal.dropRepeats

chapterReflowIn : Signal Action
chapterReflowIn =
    chapterReflowed
    |> Signal.map
        (\(currentPage, numPages, focusedHeadingId, headingIds) -> ChapterHasReflowed currentPage numPages focusedHeadingId headingIds)
    |> Signal.dropRepeats

headingsUpdated : Signal Action
headingsUpdated =
    headingUpdate
    |> Signal.map UpdateHeadingsOnPage

pageSet : Signal Action
pageSet =
    Signal.map (PageNum >> TurnPage) setPage

closeDropdown : Signal Action
closeDropdown =
    Signal.merge
        (Signal.map (\_ -> Dropdown (Nothing, Just False)) mouseClick)
        (Signal.sampleOn Mouse.clicks (Signal.constant <| Dropdown (Nothing, Just False)))

commentsLinkClick : Signal Action
commentsLinkClick = Signal.map ChangeSelectedHeadingForComments changeHeadingFromCommentsLink

-- Static Ports --

port location : String

port readEntries : List (RenderElementID, Bool)

-- Inbound Ports --

port chapterRendered : Signal { currentPage : Int, numPages : Int, headingsOnPage : List String }

port chapterReflowed : Signal (Int, Int, Maybe String, List String)

port headingUpdate : Signal (List String)

port changeHeadingFromCommentsLink : Signal String

port iframeArrows : Signal { x : Int, y : Int }

port setPage : Signal Int

port mouseClick : Signal ()

-- Outbound Ports --

port tasks : Signal (Task.Task Never ())
port tasks =
    app.tasks

port currentPage : Signal Int
port currentPage =
    app.model
    |> Signal.map (\model ->
            if model.lastNavAction == PageReflow || model.lastNavAction == Render then
                -1
            else
                model.pages.current
        )
    |> Signal.dropRepeats

port currentChapter : Signal { renderObj : RenderBlob, eId : RenderElementID, isPageTurnBack : Bool }
port currentChapter =
    app.model
    |> Signal.map (\model -> { renderObj = genRenderBlob model, eId = model.toc.selected.id, isPageTurnBack = model.lastNavAction == PageTurn Backward })
    |> Signal.sampleOn (Signal.map (.toc >> .selected >> .chapter) app.model |> Signal.dropRepeats)
    |> Signal.dropRepeats

port currentDisqusThread : Signal DisqusData
port currentDisqusThread =
    app.model
    |> Signal.filter (.toc >> .selected >> .body >> (/=) "") empty
    |> Signal.map (.toc >> disqusDataFromTOC)
    |> Signal.dropRepeats

port title : Signal String
port title =
    app.model
    |> Signal.map (\model ->
        if model.showCover then
            "Midnight Murder Party"
        else
            selectedTitleFromSL model.toc ++ " | Midnight Murder Party"
    ) |> Signal.dropRepeats

port currentEntry : Signal (RenderElementID, Bool)
port currentEntry =
    app.model
    |> Signal.map (\model ->
            let
                shouldJump =
                    case model.lastNavAction of
                        PageJump _ -> True
                        _ -> False
            in (model.toc.selected.id, shouldJump)
        )
    |> Signal.dropRepeats
