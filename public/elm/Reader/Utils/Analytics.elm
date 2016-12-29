module Reader.Utils.Analytics exposing (..)

import Time exposing (Time)
import Reader.Aliases exposing (RenderElementID, AnalyticEvent)
import String
import Char
import Result

(=>) = (<|)
infixr 9 =>

type Analytic
    = SocialButtons ActionSocialButton
    | Book ActionBook
    | BookNavigation ActionBookNavigation

type ActionSocialButton
    = Share LabelShareMethod
    | Follow LabelFollowMethod

type LabelShareMethod
    = ShareFacebook
    | ShareTwitter
    | ShareTumblr
    | ShareGooglePlus
    | ShareReddit

type LabelFollowMethod
    = FollowFacebook
    | FollowTwitter
    | FollowEllo
    | FollowRss
    | FollowEmail

type ActionBook
    = Open OpenMethod
    | InlineShareLinkClick RenderElementID
    | InlineCommentsLinkClick RenderElementID

type OpenMethod
    = CoverClick MillisecondsSinceLoad
    | UrlLoad

type alias MillisecondsSinceLoad = Time

type ActionBookNavigation
    = TableOfContents RenderElementID
    | PageTurn RenderElementID
    | Url RenderElementID
    | Bookmark RenderElementID

emptyAnalyticEvent : AnalyticEvent
emptyAnalyticEvent =
    { category = ""
    , action = ""
    , label = Nothing
    , value = Nothing
    }

toAnalyticEvent : Analytic -> AnalyticEvent
toAnalyticEvent = toString
                >> String.filter (\ch -> ch /= '(' && ch /= ')')
                >> String.words
                >> List.map (
                    String.toList
                    >> List.map (\ch ->
                                    if Char.isUpper ch then
                                        ['|',ch]
                                    else
                                        [ch]
                                )
                    >> List.concat
                    >> String.fromList
                    >> String.split "|"
                    >> String.join " "
                    >> String.trim
                    )
                >> List.foldl (\current (xs,last) ->
                        let
                            newCurrent = String.trim <|
                                if String.startsWith last current then
                                    String.dropLeft (String.length last) current
                                else
                                    current
                        in
                            (xs ++ [newCurrent], current)
                    )
                    ([],"")
                >> Tuple.first
                >> \xs -> case xs of
                    [c,a] ->
                        { emptyAnalyticEvent
                        | category = c
                        , action = a
                        }
                    [c,a,l] ->
                        { emptyAnalyticEvent
                        | category = c
                        , action = a
                        , label = Just l
                        }
                    [c,a,l,v] ->
                        { emptyAnalyticEvent
                        | category = c
                        , action = a
                        , label = Just l
                        , value = Result.toMaybe <| String.toInt v
                        }
                    _ -> Debug.crash "Malformed analytic."



