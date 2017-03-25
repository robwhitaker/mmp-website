module Editor.Main where

import Prelude
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Console (CONSOLE, log)
import Editor.Models.Chapter as Chapter
import Data.Argonaut.Encode (encodeJson)
import Data.Argonaut.Decode (decodeJson)
import Data.Either

main :: forall e. Eff (console :: CONSOLE | e) Unit
main = do
  log $ show $ (decodeJson $ encodeJson Chapter.empty) :: Either String Chapter.Chapter
