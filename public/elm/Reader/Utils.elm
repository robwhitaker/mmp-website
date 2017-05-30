module Reader.Utils exposing (..)

import String
import Date
import Time exposing (Time)
import Regex

import Tuple exposing (first)

import Core.Utils.MaybeExtra exposing (..)

import Core.Utils.SelectionList as SL exposing (SelectionList)
import Core.Utils.String exposing (stripTags)

import Reader.Aliases exposing (..)

selectedTitleFromSL : SelectionList { a | heading : String, level : Int } -> String
selectedTitleFromSL sl =
    SL.toList sl
    |> List.take (SL.selectedIndex sl + 1)
    |> List.reverse
    |> List.foldl (\elem (acc,lastLevel) ->
            if elem.level < lastLevel then
                ((elem.level, stripTags elem.heading) :: acc, elem.level)
            else
                (acc, lastLevel)
        ) ([(sl.selected.level, stripTags sl.selected.heading)], sl.selected.level)
    |> first
    |> List.foldl (\(lvl, heading) (section, title) ->
            let str = String.trim heading
                splitStr = Regex.replace (Regex.AtMost 1) (Regex.regex "\\.\\s+") (always "<~!~>^^%") str
                                |> Regex.replace (Regex.AtMost 1) (Regex.regex "[0-9]+\\s+") (.match >> flip (++) "<~!~>^^%")
                                |> String.split "<~!~>^^%"
                segSect = List.head splitStr ? "" |> String.trim
                segTitle = List.head (List.drop 1 splitStr) ? "" |> String.trim
            in
                ( if String.isEmpty section then segSect else section ++ "-" ++ segSect
                , if String.isEmpty segTitle then title else segTitle
                )
        ) ("","")
    |> (\(section, title) ->
        if title == "" then
            section
        else
            section ++ " - " ++ title
    )

selectedTopParentId : TOC -> RenderElementID
selectedTopParentId sl =
    let prev = SL.previous sl
    in
        if prev.selected.level < sl.selected.level && not (isOwnRelease prev.selected) then
            selectedTopParentId prev
        else
            sl.selected.id

isOwnRelease : RenderElement -> Bool
isOwnRelease { body, isInteractive } = String.trim body /= "" || isInteractive

dateStringToTime : String -> Time
dateStringToTime dateStr =
    case Date.fromString dateStr of
        Ok date -> Date.toTime date
        Err _   -> 0

maxReleaseDateAsTime : SelectionList { a | releaseDate : String } -> Time
maxReleaseDateAsTime list =
    List.foldl (\{ releaseDate } maxRD ->
        Basics.max maxRD (dateStringToTime releaseDate)
    ) 0 (SL.toList list)

