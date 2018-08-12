{-# LANGUAGE OverloadedStrings #-}

module Countdown where

import           Clay
import qualified Clay.Flexbox as FB
import qualified Clay.Elements as E
import qualified Clay.Media as Media
import           Prelude hiding (head, span, div, (**))
import           Data.Monoid ((<>))
import           Common

stylesheet :: Css
stylesheet = do
    importUrl "https://fonts.googleapis.com/css?family=Tangerine"
    importUrl "https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300"
    importUrl "https://fonts.googleapis.com/css?family=Droid+Serif"

    star ? do
        noPadding
        noMargin

    (body <> html) ? do
        height (pct 100)
        width (pct 100)
        maxWidth (pct 100)
        color white
        fontSize (px 18)
        fontFamily [ "Helvetica", "Arial" ] [ sansSerif ]

    body |> div ? do
        height (pct 100)

    section ? do
        minHeight (pct 100)
        backgroundImage (url "/static/img/wood-bg-11.png")
        backgroundSize cover
        backgroundPosition (placed sideCenter sideTop)

    ".container" ? do
        width (pct 100)
        maxWidth (px 1000)
        minWidth (px 300)
        minHeight (pct 100)
        backgroundColor (rgba 0 0 0 0.4)
        centerMargin
        boxSizing borderBox
        padding' (em 1) (em 2)

    a # ".banner-img" ? do
        display block
        marginTop (px 21)

        img ? do
            display block
            width (pct 75)
            centerMargin

        query Media.screen [ Media.maxWidth (px 600) ] $ do
            width (pct 100)          

    "#countdown-timer" ? do
        margin (em 0) auto (em 2) auto
        textAlign center

        h1 ? do
            fontFamily [ "Tangerine", "Times new Roman" ] [ sansSerif ]
            fontSize (px 55)
            fontWeight (weight 500)

        ".timer-field" ? do
            display inlineBlock
            padding' (em 1) (em 2)
            minWidth (px 150)

            div ? do 
                firstChild & do
                    fontSize (px 50)
                    textAlign center

                nthChild "2" & do
                    fontSize (px 20)
                    fontFamily [ "Helvetica", "Arial", "Verdana" ] [ sansSerif ]
                    textAlign center
                    color (rgba 117 0 0 1)
                    textShadow (px 0) (px 0) (px 16) white
                    backgroundColor (rgba 255 255 255 0.1)
                    boxShadow (px 0) (px 0) (px 7) (rgba 255 255 255 0.1)
                    borderRadius' (em 0.2)

    ".preview-sub" ? do
        display flex
        flexFlow row wrapReverse        
        justifyContent spaceAround
        marginTop (em 1.5)

        div <? do
            FB.flex 1 1 (px 1)
            minWidth (px 0)
            marginBottom (em 1.5)

        ".spacer" ? do
            FB.flex 1 5 (em 1)
            minWidth (px 0)
            maxWidth (em 1.5)

        ".preview" ? do
            position relative
            width (px 500)
            alignSelf center

            -- Enforce 16:9 ratio
            after & do
                display block
                paddingTop (pct 56.25)
                content (stringContent "")

            iframe ? do
                position absolute
                top (px 0)
                bottom (px 0)
                right (px 0)
                left (px 0)
                width (pct 100)
                height (pct 100)

    "#mc_embed_signup" ? do
        noPadding
        noMargin
        fontSize (px 16)

        form ? do
            noPadding
            noMargin
        
        h2 ? do
            marginTop (px 0)
            fontSize (px 24)
            marginBottom (px 5)

            ".mmp-title" ? do
                fontFamily [ "Tangerine" ] [ sansSerif ]
                fontSize (px 35)
                color (rgba 229 178 73 1)
                fontWeight (weight 500)

        input # ("type" @= "checkbox") ? do
            marginRight (px 10)
            marginLeft (px 2.5)
            transform (scale 1.5 1.5)
            padding' (px 10) (px 10)

        ".header-label" ? do
            display block
            fontSize (px 20)
            marginTop (em 0.8)

        ul ** li ? do
            marginLeft (em 1)

        ".asterisk" ? color (rgba 229 178 73 1)

        "#mc-embedded-subscribe-form" ? do
            input # ".mce_inline_error" ? borderColor (rgba 117 0 0 1)
            div   # ".mce_inline_error" ? color       (rgba 117 0 0 1)

        ".header-label" ? marginTop (px 0)

        ".mc-field-group" ? minHeight (px 0)     

    (("#mc_embed_signup" ** ".button") <> (a # ".button")) ? do
        width (pct 100)
        backgroundColor (rgba 117 0 0 1)
        textShadow (px 0) (px 0) (px 4) (rgba 0 0 0 1)
        fontFamily [ "Helvetica", "Arial" ] [ sansSerif ]
        padding' (em 0.5) (em 0.5)
        borderRadius' (em 0.4)
        fontSize (px 22)
        transition "background" 0.2 ease 0
        height auto
        lineHeight inherit

        hover & do
            backgroundColor (rgba 51 0 0 1)
            cursor pointer

    ".tea-room-img" ? do
        width (pct 50)
        marginRight (em 1)
        marginBottom (em 1)
        float floatLeft
        borderRadius' (em 0.4)
        overflow hidden

        img ? do
            display block
            width (pct 100)

        span ? do
            display block
            background (rgba 0 0 0 0.4)
            color (rgba 170 170 170 1)
            fontSize (px 11)
            padding' (px 4) (px 4)
            textAlign center
            fontStyle italic

        query Media.screen [ Media.maxWidth (px 600) ] $ do
            width (pct 100)


    ".subscribe" ? marginTop (em 1.5)

    ".highlight-color" ? color (rgba 229 178 73 1)

    ".summary-blurb" ? do
        boxSizing borderBox
        borderRadius' (em 0.4)
        backgroundColor (rgba 0 0 0 0.4)
        centerMargin
        padding' (em 1.5) (em 1.5)

        h3 ? do
            marginBottom (em 1.5)

            E.em ? do
                fontFamily [ "Tangerine" ] [ sansSerif ]
                fontSize (px 35)
                color (rgba 229 178 73 1)
                fontWeight (weight 500)
                fontStyle normal

        p ? do
            textAlign justify
            lineHeight (pct 150)
            fontFamily [ "Verdana" ] [ sansSerif ]
            marginBottom (em 1)

            lastChild & marginBottom (em 0)

    (h2 <> h3) ? do
        fontFamily [ "Verdana" ] [ sansSerif ]
        "font-weight" -: "normal !important"

    ".testimonials" ? do
        padding (em 1.5) (em 0) (em 0) (em 0)

        h2 ? do
            marginBottom (em 1.5)
            textAlign center

        (".right-align" <> ".left-align" <> ".center-align") ? do
            width (pct 60)
            minWidth (px 250)
            margin' (em 1) auto            
            paddingBottom (px 25)
            fontSize (px 25)
            fontFamily [ "Verdana" ] [ sansSerif ]
            clear both
            textAlign center
            borderBottom solid (px 1) (rgba 255 255 255 0.4)
            
        ".center-align" ? do
            width (pct 100)
            textAlign center
            noBorder

        ".attribution" ? do
            textAlign (alignSide sideRight)
            fontSize (px 16)

    "#social-shelf" ? do
        height (px 84)
        overflow hidden
        position fixed
        top (px (-34))
        left (px 0)
        right (px 0)
        textAlign (alignSide sideRight)
        whiteSpace nowrap
        zIndex 1000000
        transition "top" 0.2 easeInOut 0

        ".expanded" & top (px 0)

    ".share-buttons" ? do
        height (px 36)
        boxSizing borderBox
        padding' (px 7) (px 7)
        borderBottom solid (px 2) (rgba 229 178 73 1)
        backgroundColor (rgba 117 0 0 1)
        textAlign center

        ".share-btn" ? margin' (em 0) (em 0.5)

    "#expand-share" ? do
        display inlineBlock
        backgroundColor (rgba 117 0 0 1)
        boxSizing borderBox
        border solid (px 2) (rgba 229 178 73 1)
        borderTop solid (px 2) (rgba 117 0 0 1)
        padding' (px 7) (em 2)
        fontSize (px 16)
        verticalAlign vAlignTop
        position relative
        top (px (-2))
        borderBottomRightRadius (em 0.2) (em 0.2)
        borderBottomLeftRadius (em 0.2) (em 0.2)
        marginRight (em 0.1)

        hover & cursor pointer

    ".social-follow" ? do
        textAlign (alignSide sideRight)
        display inlineBlock
        height (px 50)
        margin' (em 0.2) (em 0.1)

        img ? do
            width (px 27)
            height (px 27)
            margin' (px 0) (em 0.2)
            borderRadius' (em 0.2)

            ("src" @= "/static/img/ello-icon.jpg") & do
                boxSizing borderBox
                padding' (px 2) (px 2)
                backgroundColor white
    
    footer ? do
        fontSize (px 12)
        textAlign center

    shareButtons
