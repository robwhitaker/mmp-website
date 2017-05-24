module Core.Models.Entry exposing (..)

import Json.Decode as Decoder exposing (Decoder, field)
import Json.Encode as Encoder exposing (Value)

type alias Entry =
    { id             : Maybe Int
    , chapter        : Int
    , level          : Int
    , order          : Int
    , isInteractive  : Bool
    , interactiveUrl : String
    , title          : String
    , content        : String
    , releaseDate    : String
    , authorsNote    : String
    }

empty : Entry
empty =
    { id             = Nothing
    , chapter        = -1
    , level          = -1
    , order          = -1
    , isInteractive  = False
    , interactiveUrl = ""
    , title          = ""
    , content        = ""
    , releaseDate    = ""
    , authorsNote    = ""
    }

decoder : Decoder Entry
decoder =
    let apply = Decoder.andThen << flip Decoder.map
    in Decoder.map Entry
        (field "id" <| Decoder.maybe Decoder.int)
        |> apply (field "chapterId" Decoder.int)
        |> apply (field "level" Decoder.int)
        |> apply (field "order" Decoder.int)
        |> apply (field "isInteractive" Decoder.bool)
        |> apply (field "interactiveUrl" Decoder.string)
        |> apply (field "title" Decoder.string)
        |> apply (field "content" Decoder.string)
        |> apply (field "releaseDate" <| Decoder.map (Maybe.withDefault "") (Decoder.maybe Decoder.string))
        |> apply (field "authorsNote" Decoder.string)