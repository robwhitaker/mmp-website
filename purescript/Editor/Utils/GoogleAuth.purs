module Editor.Utils.GoogleAuth where

import Control.Monad.Aff (Aff)
import Data.Function.Uncurried (Fn2, runFn2)

type GoogleData = 
    { accessToken :: String
    , idToken :: String
    }

foreign import googleLogin :: forall eff. Fn2 String String (Aff (| eff) GoogleData)

authorize :: forall eff. String -> String -> (Aff (| eff) GoogleData)
authorize scope responseType = 
    runFn2 googleLogin scope responseType

