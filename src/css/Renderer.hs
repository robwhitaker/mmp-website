{-# LANGUAGE OverloadedStrings #-}

module Renderer where

import           Clay
import           Prelude hiding (head, span, div, (**))
import           Data.Monoid ((<>))
import           Common

stylesheet :: Css
stylesheet = do
    (html <> body) ? do
        height (pct 100)
        noMargin
        noPadding
        overflow hidden

    "#text-container" ? do
        "column-gap" -: "0px"
        "column-fill" -: "auto"

    "#scroll-container" ? do
        overflow hidden
    

    p ? do
        ".link-line" & do
            textAlign (alignSide sideRight)
            fontFamily [ "Times New Roman" ] [ serif ]
            fontSize (px 13)
            color (rgba 165 149 144 1)
        

            span ? do
                cursor pointer
                textDecoration underline
            

                ".divider" & do
                    content (stringContent "  ")
                    padding' (px 0) (px 3)
                    cursor cursorDefault
                    textDecoration none
    

    (h1 <> h2 <> h3 <> h4 <> h5 <> h6) ? do
        boxSizing borderBox
    

    ".reflowed" ? do
        borderTopLeftRadius (em 0.4) (em 0.4)
        borderTopRightRadius (em 0.4) (em 0.4)
        animation "reflow-highlight" 3.5 linear 0 (iterationCount 1) alternate forwards
    

    keyframes "reflow-highlight" --TODO: text-shadow px 5 is just a placeholder since it was previously unspecified... might not look right
        [ ( 0,  do 
            background (rgba 224 189 118 0) 
            textShadow (px 0) (px 0) (px 0) (rgba 0 0 0 0) ) 
        , ( 20, do 
            background (rgba 224 189 118 0.4) 
            textShadow (px 0.3) (px 0.3) (px 0) (rgba 0 0 0 1) ) 
        , ( 80, do 
            background (rgba 224 189 118 0.4) 
            textShadow (px 0.3) (px 0.3) (px 0) (rgba 0 0 0 1) ) 
        , ( 99, do 
            background (rgba 224 189 118 0) 
            textShadow (px 0) (px 0) (px 0) (rgba 0 0 0 0) )
        , ( 100, do 
            background (rgba 224 189 118 0) 
            noTextShadow )
        ]

    a ? do
        "text-decoration" -: "none !important"
        "color" -: "#C43B2B !important"
    

        i ? do
            "margin-right" -: "7px !important"
        

        hover & do
            "border-bottom" -: "1px solid #C43B2B !important"
        

        star ? do
            "color" -: "#C43B2B !important"
    
