module Core.Models.Chapter where

import Core.Models.Entry as Entry exposing (Entry)

import Json.Decode as Decoder exposing (Decoder, (:=))
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
        ("id" := Decoder.maybe Decoder.int)
        ("order" := Decoder.int)
        ("stylesheet" := Decoder.string)
        ("title" := Decoder.string)
        ("content" := Decoder.string)
        ("release_date" := Decoder.string)
        ("authors_note" := Decoder.string)
        ("entries" := Decoder.list Entry.decoder)

encode : Chapter -> Value
encode chapter =
    Encoder.object
        [ ("id", Maybe.map Encoder.int chapter.id |> Maybe.withDefault Encoder.null)
        , ("order", Encoder.int chapter.order)
        , ("stylesheet", Encoder.string chapter.stylesheet)
        , ("title", Encoder.string chapter.title)
        , ("content", Encoder.string chapter.content)
        , ("release_date", Encoder.string chapter.releaseDate)
        , ("authors_note", Encoder.string chapter.authorsNote)
        ]

