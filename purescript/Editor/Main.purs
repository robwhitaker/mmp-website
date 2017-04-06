module Editor.Main where

import Prelude
import Data.Either
import Editor.Models.Chapter as Chapter
import Control.Monad.Aff (Aff)
import Control.Monad.Eff.Class (liftEff)
import Control.Monad.Eff.Console (CONSOLE, log)
import Control.Monad.Except (runExcept)
import Data.Foreign (ForeignError(..))
import Data.Foreign.Class (read, write)
import Data.List.NonEmpty (NonEmptyList(..))
import Editor.Models.Chapter (Chapter(..))
import Editor.Utils.Requests (getChapters)
import Network.HTTP.Affjax (AJAX)

main :: forall e. Aff (console :: CONSOLE, ajax :: AJAX | e) Unit
main = do
  chs <- getChapters
  let chapters = either (const []) id $ runExcept chs.response
  liftEff $ log $ show chapters
  liftEff $ log $ show $ runExcept (read $ write chapters) :: Either (NonEmptyList ForeignError) (Array Chapter.Chapter)
  liftEff $ log $ show $ runExcept chs.response
