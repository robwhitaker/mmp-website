module Core.Utils.MaybeExtra where

(?) : Maybe a -> a -> a
(?) =
    flip Maybe.withDefault

infixr 9 ?
