module Editor.Models.Session where

import Data.Maybe (Maybe)
import Editor.Utils.GoogleServices (AccessToken, Auth2, DriveReadOnlyScope, EmailScope, FilePicker, Gapi, GooglePickerObject, ProfileScope, Ready)

type Session = 
    { accessToken :: AccessToken (driveReadOnly :: DriveReadOnlyScope, email :: EmailScope, profile :: ProfileScope)
    , idToken :: String
    }

type GoogleServices = 
    { gapi :: Maybe (Gapi (auth2 :: Auth2 Ready, filepicker :: GooglePickerObject))
    , filepicker :: Maybe FilePicker
    }

