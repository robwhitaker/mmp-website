module Core.Utils.SelectionList where

type alias SelectionList a =
    { previous : List a
    , selected : a
    , next     : List a
    }

next : SelectionList a -> SelectionList a
next sl =
    if List.length sl.next > 0 then
        { sl |
            previous = sl.selected :: sl.previous,
            selected = List.head sl.next |> Maybe.withDefault sl.selected,
            next     = List.drop 1 sl.next
        }
    else
        sl

previous : SelectionList a -> SelectionList a
previous sl =
    if List.length sl.previous > 0 then
        { sl |
            previous = List.drop 1 sl.previous,
            selected = List.head sl.previous |> Maybe.withDefault sl.selected,
            next     = sl.selected :: sl.next
        }
    else
        sl

length : SelectionList a -> Int
length sl =
    List.length sl.previous + 1 + List.length sl.next

selectedIndex : SelectionList a -> Int
selectedIndex sl =
    List.length sl.previous

goto : Int -> SelectionList a -> SelectionList a
goto index sl =
    let currentIndex = selectedIndex sl
    in
        if index == currentIndex then
            sl
        else if index < currentIndex && List.length sl.previous > 0 then
            goto index (previous sl)
        else if index > currentIndex && List.length sl.next > 0 then
            goto index (next sl)
        else
            sl

fromList : a -> List a -> SelectionList a
fromList x xs =
    { previous = []
    , selected = x
    , next     = xs
    }

toList : SelectionList a -> List a
toList sl =
    List.reverse sl.previous ++ [sl.selected] ++ sl.next

indexOf : (a -> Bool) -> SelectionList a -> Maybe Int
indexOf pred sl =
    let
        indexOf' index list =
            case List.head list of
                Just head ->
                    if pred head then
                        Just index
                    else
                        indexOf' (index+1) (Maybe.withDefault [] <| List.tail list)
                Nothing -> Nothing
    in
        indexOf' 0 (toList sl)

mapSelected : (a -> a) -> SelectionList a -> SelectionList a
mapSelected fn sl =
    { sl | selected = fn sl.selected }
