module Reader.Components.ShareDialog.Model exposing (Model, empty)

import Reader.Aliases exposing (..)

type alias Model =
    { shareId          : RenderElementID
    , locationHost     : LocationHost
    , sectionTitle     : String
    , visible          : Bool
    , fading           : Bool
    , shareFromHeading : Bool
    }

empty : Model
empty =
    { shareId = ""
    , locationHost = ""
    , sectionTitle = ""
    , visible = False
    , fading = False
    , shareFromHeading = True
    }
