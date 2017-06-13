module Editor.Models.Session where

import Data.Maybe (Maybe)
import Editor.Utils.GoogleServices (AccessToken, Auth2, DriveReadOnlyScope, EmailScope, FilePicker, Gapi, GooglePickerObject, IdToken, ProfileScope, Ready)

type RequiredScopes = (driveReadOnly :: DriveReadOnlyScope, email :: EmailScope, profile :: ProfileScope)

type Session = 
    { accessToken :: AccessToken RequiredScopes
    , idToken :: IdToken RequiredScopes
    }

type GoogleServices = 
    { gapi :: Maybe (Gapi (auth2 :: Auth2 Ready, filepicker :: GooglePickerObject))
    , filepicker :: Maybe FilePicker
    }

