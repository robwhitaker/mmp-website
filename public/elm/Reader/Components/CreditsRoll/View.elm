module Reader.Components.CreditsRoll.View exposing(view)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

import Reader.Components.CreditsRoll.Model exposing (Model)
import Reader.Components.CreditsRoll.Messages exposing (Msg(..))

view : Model -> Html Msg
view model =
    div 
        [ classList
            [ ("credits-overlay", True)
            , ("no-display", not model.visible)
            , ("fading", model.fading)
            ]
        , onClick FadeCredits    
        ] 
        viewContent

viewContent : List (Html Msg)
viewContent =
    [   div [ class "full-spacer" ] []
    ,   div [ class "banner movie" ] [ a [ href "/" ] [ div [ class "banner-logo" ] [] ] ]
    ] 
    ++ (List.concatMap mkCreditGroup creditGroups) ++
    [ div 
        [ class "end-block" ] 
        [
            div [ class "banner movie" ] [ a [ href "/" ] [ div [ class "banner-logo" ] [] ] ]    
        ]
    ]    
mkCreditGroup : (String, List String) -> List (Html Msg)
mkCreditGroup (job, names) =
    let
        nameDiv name = 
            div [ class "name" ] [ text name ]
    in 
        [
            div [ class "job" ] [ text job ]
        ] ++ (List.sort >> List.map nameDiv) names

creditGroups : List (String, List String)
creditGroups =
    [ (,)
        "Story / Writing"
        [rob]
    , (,)
        "Beta Reading"
        [katie,jp,nick]
    , (,)
        "Editing"
        [katie,jp,rob]
    , (,)
        "Website Design"
        [bromos,rob]
    , (,)
        "Art"
        [bromos]
    , (,)
        "Front-end Programming"
        [rob]
    , (,)
        "Back-end Programming"
        [nick]
    , (,)
        "Marketing"
        ["What's that?"]            
    ]

rob = "Rob Whitaker"
katie = "Katie Craven"
jp = "JP Welsh"
nick = "Nicholas La Roux"
bromos = "Christina Ramos"