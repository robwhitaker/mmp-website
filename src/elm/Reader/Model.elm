module Reader.Model exposing (..)

import Dict exposing (Dict)
import Array exposing (Array)
import Date exposing (Date)
import Window exposing (Size)

import Reader.Components.ShareDialog as ShareDialog
import Reader.Components.CreditsRoll as CreditsRoll
import Reader.Components.ContactModal as ContactModal
import Reader.Aliases exposing (..)
import Reader.Utils.Analytics exposing (AnalyticData)
import Core.Utils.SelectionList as SL exposing (SelectionList)

---- MODELS ----

type Direction
    = Forward
    | Backward

type State
    = Ready
    | Loading
    | Rendering
    | Reflowing

type BookmarkState
    = HasBookmark
    | NoBookmark
    | LoadingBookmark

type alias Model =
    { toc               : TOC
    , stylesheets       : Dict ChapterID Stylesheet
    , pages             : { current : Int, total : Int }
    , showCover         : Bool
    , shareDialog       : ShareDialog.Model
    , creditsRoll       : CreditsRoll.Model
    , contactModal      : ContactModal.Model
    , idsByPage         : IdsByPage
    , state             : State
    , tocExpanded       : Bool
    , locationHost      : LocationHost
    , bookmark          : BookmarkState
    , nextReleaseDate   : Maybe Date
    , analyticData      : AnalyticData
    , bookDimensions    : Maybe (Float, Float)
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
    , contactModal      = ContactModal.empty
    , idsByPage         = Array.empty
    , state             = Loading
    , tocExpanded       = False
    , locationHost      = ""
    , nextReleaseDate   = Nothing
    , bookmark          = LoadingBookmark
    , analyticData      = emptyAnalyticData
    , bookDimensions    = Nothing
    }

emptyRenderElement : RenderElement
emptyRenderElement =
    { id            = ""
    , disqusId      = ""
    , heading       = ""
    , body          = ""
    , isInteractive = False
    , interactiveUrl = ""
    , authorsNote   = ""
    , chapter       = -1
    , level         = -1
    , isRead        = False
    , releaseDate   = ""
    }

emptyAnalyticData : AnalyticData
emptyAnalyticData =
    { firstCoverOpen = False
    , progStartTime  = 0
    , lastLoggedNavID = ""
    }
