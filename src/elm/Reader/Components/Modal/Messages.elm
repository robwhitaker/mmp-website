module Reader.Components.Modal.Messages exposing (Msg(..))


type Msg msg
    = ShowModal
    | HideModal
    | FadeModal
    | PassMsgToComponent msg
    | NoOp
