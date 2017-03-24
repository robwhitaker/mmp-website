module Editor.Main where

import Prelude
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Console (CONSOLE, log)
import Editor.Models.Chapter as Chapter

main :: forall e. Eff (console :: CONSOLE | e) Unit
main = do
  log $ show Chapter.empty
