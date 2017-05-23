module Core.Models.Entry exposing (..)

import Json.Decode as Decoder exposing (Decoder, field)
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
    Decoder.map8 Entry
        (field "id" <| Decoder.maybe Decoder.int)
        (field "chapterId" <| Decoder.int)
        (field "level" <| Decoder.int)
        (field "order" <| Decoder.int)
        (field "title" <| Decoder.string)
        (field "content" <| Decoder.string)
        (field "releaseDate" <| Decoder.map (Maybe.withDefault "") (Decoder.maybe Decoder.string))
        (field "authorsNote" <| Decoder.string)

encode : Entry -> Value
encode entry =
    Encoder.object
        [ ("id", Maybe.map Encoder.int entry.id |> Maybe.withDefault Encoder.null)
        , ("chapterId", Encoder.int entry.chapter)
        , ("level", Encoder.int entry.level)
        , ("order", Encoder.int entry.order)
        , ("title", Encoder.string entry.title)
        , ("content", Encoder.string entry.content)
        , ("releaseDate", Encoder.string entry.releaseDate)
        , ("authorsNote", Encoder.string entry.authorsNote)
        ]

