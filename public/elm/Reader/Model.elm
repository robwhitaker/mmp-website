module Reader.Model exposing (..)

import Dict exposing (Dict)

import Reader.Components.ShareDialog.Model as ShareDialog
import Reader.Components.CreditsRoll.Model as CreditsRoll
import Reader.Aliases exposing (..)
import Core.Utils.SelectionList as SL exposing (SelectionList)

---- MODELS ----

type Direction
    = Forward
    | Backward
    | PageNum Int

type LastNavAction
    = PageTurn Direction
    | PageJump RenderElementID

type State
    = Ready
    | Loading
    | Rendering
    | TurningPage

type alias TOC = SelectionList RenderElement

type alias Model =
    { toc               : TOC
    , stylesheets       : Dict ChapterID Stylesheet
    , pages             : { current : Int, total : Int }
    , showCover         : Bool
    , shareDialog       : ShareDialog.Model
    , creditsRoll       : CreditsRoll.Model
    , headingIDsOnPage  : List RenderElementID
    , lastNavAction     : LastNavAction
    , state             : State
    , tocExpanded       : Bool
    }

type alias RenderElement =
    { id          : RenderElementID
    , disqusId    : String
    , heading     : String
    , body        : String
    , authorsNote : String
    , chapter     : ChapterID
    , level       : Int
    , isRead      : Bool
    , releaseDate : String
    }

type alias RenderBlob =
    { stylesheet     : Stylesheet
    , renderElements : List RenderElement
    }

---- EMPTY MODELS ----

empty : Model
empty =
    { toc               = SL.fromList emptyRenderElement []
    , stylesheets       = Dict.empty
    , pages             = { current = 0, total = 0 }
    , showCover         = True
    , shareDialog       = ShareDialog.empty
    , creditsRoll       = CreditsRoll.empty
    , headingIDsOnPage  = []
    , lastNavAction     = PageTurn (PageNum 0)
    , state             = Loading
    , tocExpanded       = False
    }

emptyRenderElement : RenderElement
emptyRenderElement =
    { id            = ""
    , disqusId      = ""
    , heading       = ""
    , body          = ""
    , authorsNote   = ""
    , chapter       = -1
    , level         = -1
    , isRead        = False
    , releaseDate   = ""
    }
