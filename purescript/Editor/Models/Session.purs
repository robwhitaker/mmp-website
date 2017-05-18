module Editor.Models.Session where

import Data.Maybe (Maybe)
import Editor.Utils.GoogleServices (AccessToken, Auth2, DriveReadOnlyScope, FilePicker, Gapi, GooglePickerObject, Ready)

type Session = 
    { accessToken :: AccessToken (driveReadOnly :: DriveReadOnlyScope)
    , idToken :: String
    }

type GoogleServices = 
    { gapi :: Maybe (Gapi (auth2 :: Auth2 Ready, filepicker :: GooglePickerObject))
    , filepicker :: Maybe FilePicker
    }

