module Core.Utils.MaybeExtra exposing (..)

(?) : Maybe a -> a -> a
(?) =
    flip Maybe.withDefault

infixr 9 ?

oneOf : List (Maybe a) -> Maybe a
oneOf = List.filter ((/=) Nothing) >> List.head >> Maybe.withDefault Nothing
