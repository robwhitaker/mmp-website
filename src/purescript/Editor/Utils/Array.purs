module Editor.Utils.Array where

import Prelude
import Control.Alternative (class Plus, empty)
import Data.Array (length, replicate, updateAt, (!!))
import Data.Maybe (Maybe)
import Data.Tuple (Tuple(..))

swap :: forall a. Int -> Int -> Array a -> Maybe (Array a)
swap baseIndex swapIndex inArray = do
    baseElem <- inArray !! baseIndex
    swapElem <- inArray !! swapIndex
    newArray <- updateAt baseIndex swapElem inArray 
                >>= updateAt swapIndex baseElem
    pure newArray

normalizeArrays :: forall f a. Plus f => Array (f a) -> Array (f a) -> Tuple (Array (f a)) (Array (f a))
normalizeArrays a1 a2 =
    Tuple (a1 <> replicate (length a2 - length a1) empty)
          (a2 <> replicate (length a1 - length a2) empty)