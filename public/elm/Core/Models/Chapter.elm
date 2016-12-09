module Core.Models.Chapter exposing (..)

import Core.Models.Entry as Entry exposing (Entry)

import Json.Decode as Decoder exposing (Decoder, field)
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
    Decoder.map8 Chapter
        (field "id" <| Decoder.maybe Decoder.int)
        (field "order" <| Decoder.int)
        (field "stylesheet" <| Decoder.string)
        (field "title" <| Decoder.string)
        (field "content" <| Decoder.string)
        (field "release_date" <| Decoder.map (Maybe.withDefault "") (Decoder.maybe Decoder.string))
        (field "authors_note" <| Decoder.string)
        (field "entries" <| Decoder.list Entry.decoder)

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
        , ("entries_attributes", Encoder.list <| List.map Entry.encode chapter.entries_)
        ]

