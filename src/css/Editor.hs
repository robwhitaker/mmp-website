{-# LANGUAGE OverloadedStrings #-}

module Editor where

import           Clay
import qualified Clay.Flexbox as FB
import           Prelude hiding (head, span, div, (**))
import           Data.Monoid ((<>))
import           Common

stylesheet :: Css
stylesheet = do
    importUrl "https://fonts.googleapis.com/css?family=Roboto+Slab:100,300,400"

    star ? do
        noPadding 
        noMargin

    (html <> body) ? do
        backgroundColor (rgba 237 237 237 1)
        color (rgba 51 51 51 1)
        fontFamily [ "Roboto Slab" ] [ sansSerif ]
        fontWeight (weight 300)

    (h1 <> h2 <> h3 <> h4 <> h5 <> h6) ? do
        fontWeight (weight 300)

    "#top-bar" ? do
        backgroundColor (rgba 0 150 136 1)
        color white
        height (px 60)
        position fixed
        top (px 0)
        left (px 0)
        right (px 0)
        boxShadow (px 0) (px 0) (px 5) (rgba 51 51 51 1)
        textShadow (px 1) (px 1) (px 0) (rgba 51 51 51 1)

        h1 ? do
            display inlineBlock
            paddingLeft (em 0.5)
            lineHeight (pct 170)

            i ? do
                fontSize (px 28)
                marginRight (em 0.5)
                verticalAlign middle
                cursor pointer

                hover & do
                    textShadow (px 2) (px 2) (px 0) (rgba 51 51 51 1)

        button ? do
            height (pct 100)
            fontSize (px 18)
            float floatRight
            paddingLeft (em 1.2)
            paddingRight (em 1.2)
            noBorder
            borderLeft solid (px 1) (rgba 68 191 179 1)
            backgroundColor transparent
            fontFamily [ "Roboto Slab" ] [ sansSerif ]
            color white
            cursor pointer
            textShadow (px 1) (px 1) (px 0) (rgba 51 51 51 1)
            transition "background-color" 0.2 ease 0

            hover & do
                backgroundColor (rgba 68 191 179 1)
                
    "#top-bar-spacer" ? do
        height (px 60)

    "#chapter-list" ? do
        display flex
        flexWrap FB.wrap
        justifyContent spaceAround
        maxWidth (px 1500)
        margin' (em 1) auto

        ".left-col" ? do
            width (pct 65)

        ".right-col" ? do
            width (pct 32)

        ".chapter-tile" ? do
            padding' (em 0.5) (em 1)
            boxShadow (px 0) (px 2) (px 2) (rgba 204 204 204 1)
            margin' (em 1) (em 0)
            backgroundColor white

            ".chapter-data" ? do
                clear both

            h2 ? do 
                display inlineBlock

            a ? do
                fontWeight (weight 400)

        ul # ".upcoming-releases" ? do
            "list-style" -: "none"
            noMargin
            noPadding

        li # ".upcoming-release" ? do
            margin' (em 0.5) (em 0)

            h3 ? do
                fontSize (px 17)

        (h1 <> h2 <> h3) ** i ? do
            margin' (em 0) (em 0.2)

        ".right-col" ? do
            span ? fontStyle italic

            h2 ? do
                display block
                borderBottom solid (px 1) (rgba 51 51 51 1)
                marginBottom (em 0.4)

        h3 ? do
            fontSize (px 20)
            fontWeight (weight 400)
            marginTop (em 0.4)

    ".chapter-controls" ? do
        whiteSpace nowrap
        float floatRight
        color (rgba 0 150 136 1)
        marginTop (px 5)

        i ? do
            margin' (em 0) (em 0.2)
            cursor pointer

        
    ((".chapter-controls" ** (i # hover)) <> (i # ".clickablehover") <> (a ** (i # hover))) ? do
        "textShadow" -: "(px 0) (px 1) (px 0) rgba(51, 51, 51, 1) !important"

    a ? do
        color (rgba 0 150 136 1)
        textDecoration none

        hover & do
            textDecoration underline

    "#chapter-sync" ? do
        maxWidth (px 1500)
        margin' (em 1) auto

        span ? do
            fontStyle italic
            fontSize (px 16)
            display block
            float floatLeft
            color (rgba 119 119 119 1)

        i ? do
            margin' (em 0) (em 0.2)
            color (rgba 0 150 136 1)
            
    ".tile" ? do
        padding' (em 0.5) (em 1)
        boxShadow (px 0) (px 2) (px 2) (rgba 204 204 204 1)
        margin' (em 1) (em 0)
        backgroundColor white

    ".chapter-sync-chapter" ? do
        textAlign center

    ".metadata-box-container" ? do
        display flex
        flexWrap FB.wrap
        justifyContent spaceAround
        marginTop (em 1)

        div <? do
            FB.flex 1 1 (px 1)
            maxWidth (pct 40)

            h2 <? do
                borderBottom solid (px 1) (rgba 221 221 221 1)

                ".no-border" & noBorder

            div <? do
                maxHeight (px 80)
                overflow auto
                marginBottom (em 1)

        ".wrap" & do
            div <? do
                display block
                maxWidth (pct 60)

                div <? maxWidth (pct 100)

    "#chapter-sync" ? do

        table ? do
            width (pct 100)
            textAlign center
            borderSpacing (em 1.5)

            td ? do 
                ".arrow-col" & do
                    i ? fontSize (px 38)

                ".imported-chapter" & do
                    h2 ? fontWeight (weight 400)

                ".original-chapter" & do
                    h2 ? do
                        fontWeight (weight 400)

                        i ? margin' (em 0) (em 0.2)

        ".data-row" ? do
            margin' (em 0.7) (em 0)

            i ? do
                marginLeft (em 1.5)

                firstChild & do
                    marginLeft (em 0)


        ".control-row" ** (div # lastChild) ? do
            clear both


        h3 ? do
            fontWeight (weight 400)


    ".disabled" ? do
        "color" -: "rgba(204, 204, 204, 1) !important"


    ".clickable" ? do
        "cursor" -: "pointer !important"

    input ? do
        noBorder
        borderBottom solid (px 1) (rgba 221 221 221 1)
        minWidth (px 250)
        textAlign center

        focus & noOutline 

    textarea ? do
        width (pct 100)
        minHeight (px 100)

    ".flex-container" ? do
        display flex
        flexWrap FB.wrap
        justifyContent spaceAround

        div <? FB.flex 1 1 (px 1)

    ".preview-container" ? do
        border solid (px 1) (rgba 221 221 221 1)
        maxWidth (pct 30)

        iframe ? do
            width (pct 100)
            height (pct 100)
            noBorder
            maxHeight (pct 100)


    ".level-0" ? marginLeft (em 0)

    ".level-1" ? do
        borderLeft solid (em 3.2) (rgba 0 150 136 0.7)
        width (pct 95)
        boxSizing borderBox

        h1 ? fontSize (px 28)

    ".level-2" ? do
        borderLeft solid (em 6.4) (rgba 0 150 136 0.7)
        width (pct 90)
        boxSizing borderBox

        h1 ? do
            fontSize (px 26)
            fontWeight (weight 400)

    ".no-left-margin" ? do
        "margin-left" -: "0 !important"

    ".hide" ? do
        "display" -: "none !important"

