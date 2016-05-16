module Reader.Model exposing (..)

import Dict exposing (Dict)

import Reader.Components.ShareDialog.Model as ShareDialog
import Core.Utils.SelectionList as SL exposing (SelectionList)

---- TYPE ALIASES ----

type alias ChapterID        = Int
type alias CurrentPage      = PageNum
type alias FocusedElementID = RenderElementID
type alias HeadingIDsOnPage = List RenderElementID
type alias LocationHash     = String
type alias NumPages         = Int
type alias PageNum          = Int
type alias RenderElementID  = String
type alias Stylesheet       = String
type alias TOC              = SelectionList RenderElement

---- MODELS ----

type Direction = Forward | Backward | PageNum Int
type LastNavAction = PageTurn Direction | PageJump RenderElementID | PageReflow | Render | CommentsLinkClick
type State = Ready | Loading | Reflowing | Rendering

type alias Model =
    { toc               : TOC
    , stylesheets       : Dict ChapterID Stylesheet
    , pages             : { current : Int, total : Int }
    , showCover         : Bool
    , shareDialog       : ShareDialog.Model
    , headingIDsOnPage  : List String
    , lastNavAction     : LastNavAction
    , state             : State
    , tocExpanded       : Bool
    }

type alias RenderElement =
    { id : RenderElementID
    , disqusId : String
    , heading : String
    , body : String
    , authorsNote : String
    , chapter : ChapterID
    , level : Int
    , isRead : Bool
    , releaseDate : String
    }

type alias RenderBlob =
    { stylesheet : Stylesheet
    , renderElements : List RenderElement
    }

---- EMPTY MODELS ----

empty : Model
empty =
    { toc = SL.fromList emptyRenderElement []
    , stylesheets = Dict.empty
    , pages = { current = 0, total = 0 }
    , showCover = True
    , shareDialog = ShareDialog.empty
    , headingIDsOnPage = []
    , lastNavAction = Render
    , state = Loading
    , tocExpanded = False
    }

emptyRenderElement : RenderElement
emptyRenderElement =
    { id = ""
    , disqusId = ""
    , heading = ""
    , body = ""
    , authorsNote = ""
    , chapter = -1
    , level = -1
    , isRead = False
    , releaseDate = ""
    }
