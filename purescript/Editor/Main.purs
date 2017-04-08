module Editor.Main where

import Prelude
import Data.Either
import Debug.Trace
import Editor.Models.Chapter as Chapter
import Control.Monad.Aff (Aff)
import Control.Monad.Eff.Class (liftEff)
import Control.Monad.Eff.Console (CONSOLE, log)
import Control.Monad.Except (runExcept)
import Data.Array (length)
import Data.Foreign (ForeignError(..))
import Data.Foreign.Class (read, write)
import Data.List.NonEmpty (NonEmptyList(..))
import Editor.Models.Chapter (Chapter(..))
import Editor.Utils.Requests (getChapters, postChapters)
import Network.HTTP.Affjax (AJAX)

main :: forall e. Aff (console :: CONSOLE, ajax :: AJAX | e) Unit
main = do
  chs <- getChapters
  chsAll <- postChapters ""
  let chapters = either (const []) id chs.response
  let chaptersAll = either (const []) id chsAll.response
  liftEff $ log $ show $ length chapters
  liftEff $ log $ show $ length chaptersAll
