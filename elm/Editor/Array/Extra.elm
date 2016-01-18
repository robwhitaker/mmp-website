module Editor.Array.Extra where

import Array exposing (Array)

swap : Int -> Int -> Array a -> Array a
swap firstPos secondPos arr =
    Maybe.map2
        (\first second -> arr |> Array.set firstPos second |> Array.set secondPos first)
        (Array.get firstPos arr)
        (Array.get secondPos arr)
    |> Maybe.withDefault arr

