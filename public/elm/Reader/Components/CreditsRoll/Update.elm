module Reader.Components.CreditsRoll.Update exposing (update)

import Reader.Components.CreditsRoll.Model exposing (..)
import Reader.Components.CreditsRoll.Messages exposing (..)
import Reader.Ports exposing (rollCredits)

import Task
import Process

update : Msg -> Model -> (Model, Cmd Msg)
update msg model = 
    case msg of
        ShowCredits -> 
            { empty | visible = True } 
                ! [ rollCredits 0 ]
        HideCredits -> 
            { model | visible = False } 
                ! []
        FadeCredits ->
            if not model.fading then
                { model | fading = True }
                    ! [(Process.sleep 2000 `Task.andThen` \_ -> Task.succeed HideCredits) |> Task.perform (\_ -> NoOp) identity] 
            else
                model ! []        
        NoOp ->
            model ! []