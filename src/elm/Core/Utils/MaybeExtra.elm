module Core.Utils.MaybeExtra exposing (oneOf)


oneOf : List (Maybe a) -> Maybe a
oneOf =
    List.filter ((/=) Nothing) >> List.head >> Maybe.withDefault Nothing
