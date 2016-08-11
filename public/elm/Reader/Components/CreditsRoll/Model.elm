module Reader.Components.CreditsRoll.Model exposing (Model,empty)

type alias Model =
    { visible     : Bool
    , fading      : Bool
    , isScrolling : Bool
    , scrollPos   : Int
    }

empty : Model
empty = 
    { visible = False
    , fading  = False
    , isScrolling  = False
    , scrollPos = 0
    }