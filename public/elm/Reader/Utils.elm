module Reader.Utils where

import String
import Regex

import Core.Utils.MaybeExtra exposing (..)

import Core.Utils.SelectionList as SL exposing (SelectionList)
import Editor.Parser exposing (stripTags)

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
    |> fst
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
    |> (\(section, title) -> section ++ " - " ++ title)
