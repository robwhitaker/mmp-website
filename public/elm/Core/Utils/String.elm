module Core.Utils.String exposing (..)

import Regex

stripTags : String -> String
stripTags =
    Regex.replace Regex.All (Regex.regex "<.*?>|</.*?>") (always "")
    >> Regex.replace Regex.All (Regex.regex "&[a-zA-Z0-9]*?;") (always " ")
