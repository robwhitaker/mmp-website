module Editor.Utils.Json where

import Prelude
import DOM.Event.Types (customEventToEvent)
import Data.Argonaut.Generic.Aeson (options)
import Data.Argonaut.Generic.Options (Options(..))

customAesonOptions :: (Options -> Options) -> Options
customAesonOptions fn = fn options

allowMissingFields :: Options -> Options
allowMissingFields (Options opts) = Options $ opts { omitNothingFields = true }
