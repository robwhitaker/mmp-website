module Reader.Aliases exposing (..)

type alias ChapterID        = Int
type alias CurrentPage      = PageNum
type alias FocusedElementID = RenderElementID
type alias HeadingIDsOnPage = List RenderElementID
type alias LocationHash     = String
type alias LocationHost     = String
type alias NumPages         = Int
type alias PageNum          = Int
type alias RenderElementID  = String
type alias Stylesheet       = String

type alias LocalStorageData =
    { readEntries : List (RenderElementID, Bool)
    , bookmark : Maybe RenderElementID
    }

type alias Flags =
    { localStorage : LocalStorageData
    , hash : LocationHash
    , host : LocationHost
    }
