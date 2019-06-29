module Reader.Utils.Disqus exposing (disqusDataFromTOC, renderElemToDisqusId, toDisqusId)

import Core.Utils.SelectionList as SL
import Reader.Aliases exposing (DisqusData, LocationHost, RenderElement, TOC)
import Reader.Utils exposing (selectedTitleFromSL)


disqusDataFromTOC : LocationHost -> TOC -> DisqusData
disqusDataFromTOC host toc =
    { identifier = renderElemToDisqusId toc.selected
    , url = host ++ "/#!/" ++ renderElemToDisqusId toc.selected
    , title = selectedTitleFromSL toc
    }


renderElemToDisqusId : RenderElement -> String
renderElemToDisqusId =
    .id >> toDisqusId


toDisqusId : String -> String
toDisqusId =
    identity
