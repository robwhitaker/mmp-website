module Reader.Aliases exposing (..)

import Array exposing (Array)
import Core.Utils.SelectionList exposing (SelectionList)
import Time exposing (Time)

type alias ChapterID        = Int
type alias CurrentPage      = PageNum
type alias FocusedElementID = RenderElementID
type alias HeadingIDsOnPage = List RenderElementID
type alias IdsByPage        = Array (List RenderElementID)
type alias LocationHash     = String
type alias LocationHost     = String
type alias NumPages         = Int
type alias PageNum          = Int
type alias RenderElementID  = String
type alias Stylesheet       = String
type alias TOC              = SelectionList RenderElement

type alias DisqusData =
    { identifier : String
    , url        : String
    , title      : String
    }

type alias LocalStorageData =
    { readEntries : List (RenderElementID, Bool)
    , bookmark : Maybe RenderElementID
    }

type alias Flags =
    { localStorage : LocalStorageData
    , hash : LocationHash
    , host : LocationHost
    , progStartTime : Time
    }

type alias HeadingUpdate = { headingsOnPage : List RenderElementID, headingAtTop : Bool }

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
