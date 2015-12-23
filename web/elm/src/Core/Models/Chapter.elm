module Core.Models.Chapter where

import Core.Models.Entry as Entry exposing (Entry)

import Json.Decode as Decoder exposing (Decoder)
import Json.Encode as Encoder exposing (Value)

type alias Chapter =
    { id          : Maybe Int
    , order       : Int
    , stylesheet  : String
    , title       : String
    , content     : String
    , releaseDate : String
    , authorsNote : String
    , entries_    : List Entry
    }

empty : Chapter
empty =
    { id          = Nothing
    , order       = -1
    , stylesheet  = ""
    , title       = ""
    , content     = ""
    , releaseDate = ""
    , authorsNote = ""
    , entries_    = []
    }

decoder : Decoder Chapter
decoder =
    Decoder.object8 Chapter
        (Decoder.maybe Decoder.int)
        Decoder.int
        Decoder.string
        Decoder.string
        Decoder.string
        Decoder.string
        Decoder.string
        (Decoder.list Entry.decoder)

encode : Chapter -> Value
encode chapter =
    Encoder.object
        [ ("id", Maybe.map Encoder.int chapter.id |> Maybe.withDefault Encoder.null)
        , ("order", Encoder.int chapter.order)
        , ("stylesheet", Encoder.string chapter.stylesheet)
        , ("title", Encoder.string chapter.title)
        , ("content", Encoder.string chapter.content)
        , ("releaseDate", Encoder.string chapter.releaseDate)
        , ("authorsNote", Encoder.string chapter.authorsNote)
        ]

