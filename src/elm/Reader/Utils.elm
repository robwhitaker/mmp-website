module Reader.Utils exposing (dateStringToTime, isOwnRelease, matchNoMoreThan, maxReleaseDateAsTime, selectedTitleFromSL, selectedTopParentId, unsafeRegex)

import Core.Utils.MaybeExtra exposing (..)
import Core.Utils.SelectionList as SL exposing (SelectionList)
import Core.Utils.String exposing (stripTags)
import Iso8601
import Reader.Aliases exposing (..)
import Regex exposing (Regex)
import String
import Time exposing (Posix)
import Tuple exposing (first)


unsafeRegex : String -> Regex
unsafeRegex =
    Regex.fromString >> Maybe.withDefault Regex.never


matchNoMoreThan : Int -> (Regex.Match -> String) -> (Regex.Match -> String)
matchNoMoreThan n f =
    \match ->
        if match.number <= n then
            f match

        else
            match.match


selectedTitleFromSL : SelectionList { a | heading : String, level : Int } -> String
selectedTitleFromSL sl =
    SL.toList sl
        |> List.take (SL.selectedIndex sl + 1)
        |> List.reverse
        |> List.foldl
            (\elem ( acc, lastLevel ) ->
                if elem.level < lastLevel then
                    ( ( elem.level, stripTags elem.heading ) :: acc, elem.level )

                else
                    ( acc, lastLevel )
            )
            ( [ ( sl.selected.level, stripTags sl.selected.heading ) ], sl.selected.level )
        |> first
        |> List.foldl
            (\( lvl, heading ) ( section, title ) ->
                let
                    str =
                        String.trim heading

                    splitStr =
                        Regex.replace (unsafeRegex "\\.\\s+") (matchNoMoreThan 1 <| always "<~!~>^^%") str
                            |> Regex.replace (unsafeRegex "[0-9]+\\s+") (matchNoMoreThan 1 <| .match >> (\a -> (++) a "<~!~>^^%"))
                            |> String.split "<~!~>^^%"

                    segSect =
                        List.head splitStr |> Maybe.withDefault "" |> String.trim

                    segTitle =
                        List.head (List.drop 1 splitStr) |> Maybe.withDefault "" |> String.trim
                in
                ( if String.isEmpty section then
                    segSect

                  else
                    section ++ "-" ++ segSect
                , if String.isEmpty segTitle then
                    title

                  else
                    segTitle
                )
            )
            ( "", "" )
        |> (\( section, title ) ->
                if title == "" then
                    section

                else
                    section ++ " - " ++ title
           )


selectedTopParentId : TOC -> RenderElementID
selectedTopParentId sl =
    let
        prev =
            SL.previous sl
    in
    if prev.selected.level < sl.selected.level && not (isOwnRelease prev.selected) then
        selectedTopParentId prev

    else
        sl.selected.id


isOwnRelease : RenderElement -> Bool
isOwnRelease { body, isInteractive } =
    String.trim body /= "" || isInteractive


dateStringToTime : String -> Posix
dateStringToTime dateStr =
    Result.withDefault (Time.millisToPosix 0) (Iso8601.toTime dateStr)


maxReleaseDateAsTime : SelectionList { a | releaseDate : String } -> Posix
maxReleaseDateAsTime list =
    List.foldl
        (\{ releaseDate } maxRD ->
            Basics.max maxRD (Time.posixToMillis <| dateStringToTime releaseDate)
        )
        0
        (SL.toList list)
        |> Time.millisToPosix
