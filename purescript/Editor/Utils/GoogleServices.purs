module Editor.Utils.GoogleServices 
    ( awaitGapi
    , loadAuth2
    , loadFilePicker
    , initAuth2
    , googleLogin
    , initPicker
    , showPicker
    , joinScope
    , (<+>)
    , profileScope
    , emailScope
    , driveReadOnlyScope
    , fromAccessToken
    , AccessToken
    , Scope
    , ProfileScope
    , EmailScope
    , DriveReadOnlyScope
    , GAPI
    , FilePicker
    , Gapi
    , Auth2
    , Ready
    , NotReady
    , GooglePickerObject
    , FileId
    , ClientId
    , ResponseType
    ) where

import Prelude
import Control.Monad.Aff (Aff)
import Control.Monad.Eff (kind Effect)
import Data.Function.Uncurried (Fn3, Fn5, runFn3, runFn5)
import Data.Maybe (Maybe(..))
import Data.Nullable (Nullable, toMaybe)
import Data.String (joinWith)
import Unsafe.Coerce (unsafeCoerce)

type GoogleAuthData scopes = 
    { accessToken :: Maybe (AccessToken scopes)
    , idToken :: Maybe String
    }
    
type FileId = String
type ClientId = String
type ResponseType = String 

foreign import data GAPI :: Effect

foreign import data FilePicker :: Type

foreign import data Gapi :: # Type -> Type
foreign import data Auth2 :: Type -> Type
foreign import data Ready :: Type
foreign import data NotReady :: Type
foreign import data GooglePickerObject :: Type

foreign import data Scope :: # Type -> Type
foreign import data ProfileScope :: Type
foreign import data EmailScope :: Type
foreign import data DriveReadOnlyScope :: Type

foreign import data AccessToken :: # Type -> Type

foreign import awaitGapi :: forall eff. Aff (gapi :: GAPI | eff) (Gapi ())

foreign import _load :: forall eff. String -> Aff (gapi :: GAPI | eff) Unit

loadAuth2 :: forall eff g. Gapi g -> Aff (gapi :: GAPI | eff) (Gapi (auth2 :: Auth2 NotReady | g))
loadAuth2 _ = do
    _load "auth2"
    pure $ unsafeCoerce unit

loadFilePicker :: forall eff g. Gapi g -> Aff (gapi :: GAPI | eff) (Gapi (filepicker :: GooglePickerObject | g))
loadFilePicker _ = do
    _load "picker"
    pure $ unsafeCoerce unit

foreign import initAuth2 :: forall eff g. ClientId 
                                       -> Gapi (auth2 :: Auth2 NotReady | g) 
                                       -> Aff (gapi :: GAPI | eff) (Gapi (auth2 :: Auth2 Ready | g))

foreign import _googleLogin :: forall a scopes eff. Fn5 (Maybe a) 
                                                        (a -> Maybe a) 
                                                        ClientId 
                                                        (Scope scopes) 
                                                        ResponseType 
                                                        (Aff (gapi :: GAPI | eff) (GoogleAuthData scopes))

googleLogin :: forall scopes eff g. ClientId 
                                 -> Scope scopes 
                                 -> ResponseType 
                                 -> Gapi (auth2 :: Auth2 Ready | g)
                                 -> (Aff (gapi :: GAPI | eff) (GoogleAuthData scopes))
googleLogin clientId scope responseType _ = 
    runFn5 _googleLogin Nothing Just clientId scope responseType

foreign import initPicker :: forall scopes eff g. AccessToken (driveReadOnly :: DriveReadOnlyScope | scopes) 
                                               -> Gapi (filepicker :: GooglePickerObject | g)
                                               -> Aff (gapi :: GAPI | eff) FilePicker

foreign import _showPicker :: forall eff. FilePicker -> Aff (gapi :: GAPI | eff) (Nullable FileId)

showPicker :: forall eff. FilePicker -> Aff (gapi :: GAPI | eff) (Maybe FileId)
showPicker = _showPicker >>> map toMaybe

-- Scopes

fromAccessToken :: forall scopes. AccessToken scopes -> String
fromAccessToken = unsafeCoerce

fromScope :: forall scopes. Scope scopes -> String
fromScope = unsafeCoerce

joinScope :: forall a b r. Union a b r => Scope a -> Scope b -> Scope r
joinScope s1 s2 = unsafeCoerce (fromScope s1 <> " " <> fromScope s2)

infixr 5 joinScope as <+>

profileScope :: Scope (profile :: ProfileScope)
profileScope = unsafeCoerce "profile"

emailScope :: Scope (email :: EmailScope)
emailScope = unsafeCoerce "email"

driveReadOnlyScope :: Scope (driveReadOnly :: DriveReadOnlyScope)
driveReadOnlyScope = unsafeCoerce "https://www.googleapis.com/auth/drive.readonly"
