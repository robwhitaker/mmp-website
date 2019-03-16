module Core.Utils.String exposing (stripTags)

import Regex


stripTags : String -> String
stripTags =
    let
        r1 =
            Maybe.withDefault Regex.never (Regex.fromString "<.*?>|</.*?>")

        r2 =
            Maybe.withDefault Regex.never (Regex.fromString "&[a-zA-Z0-9]*?;")
    in
    Regex.replace r1 (always "")
        >> Regex.replace r2 (always " ")
