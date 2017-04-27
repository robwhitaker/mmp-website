module Editor.Utils.GoogleAuth where

import Prelude
import Control.Monad.Aff (Aff)
import Control.Monad.Eff (Eff)
import Data.Foreign.Null (Null(..))
import Data.Foreign.Undefined (Undefined(..))
import Data.Function.Uncurried (Fn2, Fn3, runFn2, runFn3)
import Data.Maybe (Maybe)
import Data.Nullable (Nullable, toMaybe)
import Data.String (joinWith)

type GoogleAuthData = 
    { accessToken :: String
    , idToken :: String
    }
type FileId = String
type ClientId = String
type Scope = Array String
type ResponseType = Array String 
type ServiceLabel = String
type AccessToken = String

foreign import data GAPI :: !
foreign import data FilePicker :: *
foreign import data Gapi :: *

foreign import awaitGapi :: forall eff. Aff (gapi :: GAPI | eff) Gapi

foreign import load :: forall eff. ServiceLabel -> Aff (gapi :: GAPI | eff) Unit

foreign import initAuth2 :: forall eff. ClientId -> Aff (gapi :: GAPI | eff) Unit

foreign import _googleLogin :: forall eff. Fn3 ClientId String String (Aff (gapi :: GAPI | eff) GoogleAuthData)

foreign import initPicker :: forall eff. AccessToken -> Aff (gapi :: GAPI | eff) FilePicker

foreign import _showPicker :: forall eff. FilePicker -> Aff (gapi :: GAPI | eff) (Nullable FileId)

googleLogin :: forall eff. ClientId -> Scope -> ResponseType -> (Aff (gapi :: GAPI | eff) GoogleAuthData)
googleLogin clientId scope responseType = 
    runFn3 _googleLogin clientId (joinWith " " scope) (joinWith " " responseType)

showPicker :: forall eff. FilePicker -> Aff (gapi :: GAPI | eff) (Maybe FileId)
showPicker = _showPicker >>> map toMaybe

