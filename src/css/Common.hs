{-# LANGUAGE OverloadedStrings #-}

module Common where

import Clay
import Prelude hiding (span, (**))
import Data.Monoid ((<>))

shareButtons :: Css
shareButtons = do
    ".share-btn" ? do
        position relative
        zIndex 0
        backgroundColor grey
        overflow hidden
        fontSize (px 12)
        fontFamily [ "Helvetica", "Arial" ] [ sansSerif ]
        textAlign center
        height (px 20)
        display inlineBlock
        borderRadius' (em 0.25)
        cursor pointer
        color white
        fontWeight bold
        textShadow (px 1) (px 1) (px 0) black
        minWidth (px 75)
        maxWidth (px 75)

        img ? do
            height (px 20)
            width (px 20)
            margin' (px 0) (px 0)
            minHeight (pct 100)
            verticalAlign middle
            float floatLeft

        span ? do
            verticalAlign middle
            margin (em 0) (em 0.6) (em 0) (em 0.4)
            height (pct 100)
            lineHeight (px 20)

        ".hover-overlay" ? do
            position absolute
            backgroundColor (rgba 255 255 255 0.1)
            top (px 0)
            left (px 0)
            right (px 0)
            bottom (px 0)
            display none

        hover &
            ".hover-overlay" ? display block

        -- Custom Share Buttons

        ".facebook-share-btn" & do 
            backgroundImage $
                linearGradient (straight sideTop) 
                               [ (rgba 74 104 183 1, pct 0)
                               , (rgba 59 86 161 1, pct 100) 
                               ]

        ".twitter-share-btn" & do 
            backgroundImage $
                linearGradient (straight sideTop) 
                               [ (rgba 254 254 254 1, pct 0)
                               , (rgba 225 225 225 1, pct 100) 
                               ]
            color (rgba 51 51 51 1)
            noTextShadow

            ".hover-overlay" ? backgroundColor (rgba 255 255 255 0.3)

        ".tumblr-share-btn" & do
            backgroundImage $
                linearGradient (straight sideTop) 
                               [ (rgba 54 70 93 1, pct 0)
                               , (rgba 54 70 93 1, pct 100) 
                               ]
            
        ".gplus-share-btn" & do
            backgroundImage $
                linearGradient (straight sideTop) 
                               [ (rgba 191 72 59 1, pct 0)
                               , (rgba 196 59 43 1, pct 100) 
                               ]

        ".reddit-share-btn" & do
            img ? width (pct 100)
            ".hover-overlay" ? backgroundColor (rgba 255 255 255 0.3)

    a # ".button" ? do
        display block
        textAlign center
        color white
        textDecoration none
        marginBottom (em 1)

        hover & do
            backgroundColor (rgba 51 0 0 1)
            cursor pointer

noPadding = padding (px 0) (px 0) (px 0) (px 0)
noMargin  = margin (px 0) (px 0) (px 0) (px 0)
centerMargin = margin (px 0) auto (px 0) auto
borderRadius' n = borderRadius n n n n 
padding' padTop padSide = padding padTop padSide padTop padSide
margin' mTop mSide = margin mTop mSide mTop mSide
noBorder = border solid (px 0) (rgba 0 0 0 0)
noTextShadow = textShadow (px 0) (px 0) (px 0) (rgba 0 0 0 0)
noOutline = outline solid (em 0) (rgba 0 0 0 0)
padding1 pad = padding pad pad pad pad
margin1 mar = margin mar mar mar mar
noBoxShadow = boxShadow (px 0) (px 0) (px 0) (rgba 0 0 0 0)
listStyleNone = "list-style" -: "none"

radialGradient' :: Loc l => l -> Radial -> Ramp -> BackgroundImage
radialGradient' d r xs = other $ Value $
    let Value v = "radial-gradient(" <> value [value r <> " at " <> value d, ramp xs] <> ")"
    in 
        browsers <> v
  where ramp :: Ramp -> Value
        ramp xs = value (Prelude.map (\(a, b) -> value (value a, value b)) xs)
