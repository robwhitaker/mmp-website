module Reader.Components.ShareDialog.Model exposing (Model, empty)

import Reader.Aliases exposing (..)

type alias Model =
    { shareId          : RenderElementID
    , sectionTitle     : String
    , visible          : Bool
    , fading           : Bool
    , shareFromHeading : Bool
    }

empty : Model
empty =
    { shareId = ""
    , sectionTitle = ""
    , visible = False
    , fading = False
    , shareFromHeading = True
    }
