module Reader.Utils.Disqus exposing (..)

import Reader.Model exposing (RenderElement, TOC)
import Reader.Utils exposing (selectedTitleFromSL)
import Reader.Aliases exposing (LocationHost)
import Core.Utils.SelectionList as SL

type alias DisqusData =
    { identifier : String
    , url        : String
    , title      : String
    }

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
