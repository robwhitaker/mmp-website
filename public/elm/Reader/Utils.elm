module Reader.Utils where

import String

import Reader.Model exposing (TOC)
import Core.Utils.SelectionList as SL
import Editor.Parser exposing (stripTags)

selectedTitleFromTOC : TOC -> String
selectedTitleFromTOC toc =
    SL.toList toc
    |> List.take (SL.selectedIndex toc + 1)
    |> List.reverse
    |> List.foldl (\elem (acc,lastLevel) ->
            if elem.level < lastLevel then
                (stripTags elem.heading :: acc, elem.level)
            else
                (acc, lastLevel)
        ) ([stripTags toc.selected.heading], toc.selected.level)
    |> fst
    |> List.intersperse " - "
    |> String.concat
