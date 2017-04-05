module Editor.Main where

import Prelude
import Data.Either
import Editor.Models.Chapter as Chapter
import Control.Monad.Aff (Aff)
import Control.Monad.Eff.Class (liftEff)
import Control.Monad.Eff.Console (CONSOLE, log)
import Control.Monad.Except (runExcept)
import Editor.Utils.Requests (getChapters)
import Network.HTTP.Affjax (AJAX)

main :: forall e. Aff (console :: CONSOLE, ajax :: AJAX | e) Unit
main = do
  chs <- getChapters
  liftEff $ log $ show $ runExcept chs.response
