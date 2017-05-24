module Core.Models.Chapter exposing (..)

import Core.Models.Entry as Entry exposing (Entry)

import Json.Decode as Decoder exposing (Decoder, field)

type alias Chapter =
    { id             : Maybe Int
    , order          : Int
    , isInteractive  : Bool
    , interactiveUrl : String
    , stylesheet     : String
    , title          : String
    , content        : String
    , releaseDate    : String
    , authorsNote    : String
    , entries_       : List Entry
    }

empty : Chapter
empty =
    { id             = Nothing
    , order          = -1
    , isInteractive  = False
    , interactiveUrl = ""
    , stylesheet     = ""
    , title          = ""
    , content        = ""
    , releaseDate    = ""
    , authorsNote    = ""
    , entries_       = []
    }

decoder : Decoder Chapter
decoder =
    let apply = Decoder.andThen << flip Decoder.map
    in Decoder.map Chapter 
        (field "id" <| Decoder.maybe Decoder.int)
        |> apply (field "order" Decoder.int)
        |> apply (field "isInteractive" Decoder.bool)
        |> apply (field "interactiveUrl" Decoder.string)
        |> apply (field "stylesheet" Decoder.string)
        |> apply (field "title" Decoder.string)
        |> apply (field "content" Decoder.string)
        |> apply (field "releaseDate" <| Decoder.map (Maybe.withDefault "") (Decoder.maybe Decoder.string))
        |> apply (field "authorsNote" Decoder.string)
        |> apply (field "entries" <| Decoder.list Entry.decoder)