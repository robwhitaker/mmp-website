module Reader.Utils.Disqus exposing (..)

import Reader.Utils exposing (selectedTitleFromSL)
import Reader.Aliases exposing (DisqusData, LocationHost, RenderElement, TOC)
import Core.Utils.SelectionList as SL



disqusDataFromTOC : LocationHost -> TOC -> DisqusData
disqusDataFromTOC host toc =
    { identifier = renderElemToDisqusId toc.selected
    , url        = host ++ "/#!/" ++ renderElemToDisqusId toc.selected
    , title      = selectedTitleFromSL toc
    }

renderElemToDisqusId : RenderElement -> String
renderElemToDisqusId =
    .id >> toDisqusId

toDisqusId : String -> String
toDisqusId = (++) "disqus-"
