module Core.Utils.MaybeExtra exposing (..)

(?) : Maybe a -> a -> a
(?) =
    flip Maybe.withDefault

infixr 9 ?
