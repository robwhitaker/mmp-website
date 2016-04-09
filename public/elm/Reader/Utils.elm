module Reader.Utils where

import String

import Core.Utils.SelectionList as SL exposing (SelectionList)
import Editor.Parser exposing (stripTags)

selectedTitleFromSL : SelectionList { a | heading : String, level : Int } -> String
selectedTitleFromSL sl =
    SL.toList sl
    |> List.take (SL.selectedIndex sl + 1)
    |> List.reverse
    |> List.foldl (\elem (acc,lastLevel) ->
            if elem.level < lastLevel then
                (stripTags elem.heading :: acc, elem.level)
            else
                (acc, lastLevel)
        ) ([stripTags sl.selected.heading], sl.selected.level)
    |> fst
    |> List.intersperse " - "
    |> String.concat
