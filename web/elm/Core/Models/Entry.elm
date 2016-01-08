module Core.Models.Entry where

import Json.Decode as Decoder exposing (Decoder, (:=))
import Json.Encode as Encoder exposing (Value)

type alias Entry =
    { id          : Maybe Int
    , chapter     : Int
    , level       : Int
    , order       : Int
    , title       : String
    , content     : String
    , releaseDate : String
    , authorsNote : String
    }

empty : Entry
empty =
    { id          = Nothing
    , chapter     = -1
    , level       = -1
    , order       = -1
    , title       = ""
    , content     = ""
    , releaseDate = ""
    , authorsNote = ""
    }

decoder : Decoder Entry
decoder =
    Decoder.object8 Entry
        ("id" := Decoder.maybe Decoder.int)
        ("chapter_id" := Decoder.int)
        ("level" := Decoder.int)
        ("order" := Decoder.int)
        ("title" := Decoder.string)
        ("content" := Decoder.string)
        ("release_date" := Decoder.string)
        ("authors_note" := Decoder.string)

encoder : Entry -> Value
encoder entry =
    Encoder.object
        [ ("id", Maybe.map Encoder.int entry.id |> Maybe.withDefault Encoder.null)
        , ("chapter_id", Encoder.int entry.chapter)
        , ("level", Encoder.int entry.level)
        , ("order", Encoder.int entry.order)
        , ("title", Encoder.string entry.title)
        , ("content", Encoder.string entry.content)
        , ("release_date", Encoder.string entry.releaseDate)
        , ("authors_note", Encoder.string entry.authorsNote)
        ]

