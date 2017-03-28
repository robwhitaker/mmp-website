module Editor.Main where

import Prelude
import Control.Monad.Aff (Aff)
import Control.Monad.Eff.Class (liftEff)
import Control.Monad.Eff.Console (CONSOLE, log)
import Editor.Models.Chapter as Chapter
import Editor.Utils.Requests (getChapters)
import Data.Argonaut.Encode (encodeJson)
import Data.Argonaut.Decode (decodeJson)
import Data.Either
import Network.HTTP.Affjax (AJAX)

main :: forall e. Aff (console :: CONSOLE, ajax :: AJAX | e) Unit
main = do
  chs <- getChapters
  liftEff $ log $ show chs.response
  liftEff $ log $ show $ (decodeJson $ encodeJson Chapter.empty) :: Either String Chapter.Chapter
 