module Reader.Components.CreditsRoll.Model exposing (Model,empty)

type alias Model =
    { visible     : Bool
    , fading      : Bool
    }

empty : Model
empty =
    { visible = False
    , fading  = False
    }
