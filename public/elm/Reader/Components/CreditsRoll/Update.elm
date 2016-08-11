module Reader.Components.CreditsRoll.Update exposing (update)

import Reader.Components.CreditsRoll.Model exposing (..)
import Reader.Components.CreditsRoll.Messages exposing (..)
import Reader.Ports exposing (rollCredits, setScrollEnabled)

import Task
import Process

update : Msg -> Model -> (Model, Cmd Msg)
update msg model = 
    case msg of
        ShowCredits -> 
            { empty | visible = True } 
                ! [ rollCredits 0, setScrollEnabled False ]
        HideCredits -> 
            { model | visible = False } 
                ! [ setScrollEnabled True ]
        FadeCredits ->
            if not model.fading then
                { model | fading = True }
                    ! [(Process.sleep 400 `Task.andThen` \_ -> Task.succeed HideCredits) |> Task.perform (\_ -> NoOp) identity] 
            else
                model ! []        
        NoOp ->
            model ! []