module Reader.Utils.Disqus exposing (..)

import Reader.Model exposing (RenderElement, TOC)
import Reader.Utils exposing (selectedTitleFromSL)
import Core.Utils.SelectionList as SL

type alias DisqusData =
    { identifier : String
    , url        : String
    , title      : String
    }

disqusDataFromTOC : TOC -> DisqusData
disqusDataFromTOC toc =
    { identifier = renderElemToDisqusId toc.selected
    , url        = "http://localhost:4567/#!/" ++ renderElemToDisqusId toc.selected
    , title      = selectedTitleFromSL toc
    }

renderElemToDisqusId : RenderElement -> String
renderElemToDisqusId =
    .id >> toDisqusId

toDisqusId : String -> String
toDisqusId = (++) "disqus-"
