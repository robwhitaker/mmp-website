module Reader.Model exposing (BookmarkState(..), Direction(..), Model, State(..), empty, emptyRenderElement)

import Array exposing (Array)
import Browser.Navigation exposing (Key)
import Core.Utils.SelectionList as SL exposing (SelectionList)
import Dict exposing (Dict)
import Reader.Aliases exposing (..)
import Reader.Components.ContactModal as ContactModal
import Reader.Components.CreditsRoll as CreditsRoll
import Reader.Components.ShareDialog as ShareDialog
import Time exposing (Posix, Zone)



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
    { toc : TOC
    , stylesheets : Dict ChapterID Stylesheet
    , pages : { current : Int, total : Int }
    , showCover : Bool
    , shareDialog : ShareDialog.Model
    , creditsRoll : CreditsRoll.Model
    , contactModal : ContactModal.Model
    , idsByPage : IdsByPage
    , state : State
    , tocExpanded : Bool
    , locationHost : LocationHost
    , bookmark : BookmarkState
    , nextReleaseDate : Maybe Posix
    , bookDimensions : Maybe ( Float, Float )
    , navigationKey : Key
    , userTimezone : Zone
    }



---- EMPTY MODELS ----


empty : Key -> Model
empty navigationKey =
    { toc = SL.fromList emptyRenderElement []
    , stylesheets = Dict.empty
    , pages = { current = 0, total = 0 }
    , showCover = True
    , shareDialog = ShareDialog.empty
    , creditsRoll = CreditsRoll.empty
    , contactModal = ContactModal.empty
    , idsByPage = Array.empty
    , state = Loading
    , tocExpanded = False
    , locationHost = ""
    , nextReleaseDate = Nothing
    , bookmark = LoadingBookmark
    , bookDimensions = Nothing
    , navigationKey = navigationKey

    -- TODO: this should really be a Maybe until it gets a value
    --       instead of just using UTC as a default
    , userTimezone = Time.utc
    }


emptyRenderElement : RenderElement
emptyRenderElement =
    { id = ""
    , disqusId = ""
    , heading = ""
    , body = ""
    , isInteractive = False
    , interactiveUrl = ""
    , authorsNote = ""
    , chapter = -1
    , level = -1
    , isRead = False
    , releaseDate = ""
    }
