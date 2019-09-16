{-# LANGUAGE OverloadedStrings #-}

module Reader where

import           Clay
import qualified Clay.Flexbox as FB
import           Prelude hiding (head, span, div, (**))
import           Data.Monoid ((<>))
import           Common

stylesheet :: Css
stylesheet = do
    importUrl "https://fonts.googleapis.com/css?family=Tangerine"
    importUrl "https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300"
    importUrl "https://fonts.googleapis.com/css?family=Droid+Serif"

    -- ======== GENERAL ========

    star ? do
        noPadding
        noMargin

    (body <> html) ? do
        height (pct 100)
        width (pct 100)
        maxWidth (pct 100)

    body ? do
        backgroundImage (url "/static/img/dark-pattern.jpg")
        backgroundAttachment attachFixed

        (div <> (div |> div)) <? height (pct 100)

    -- Low res image swapping
    body # ".wood-bg-loaded" ** (section # ".reader") ? do
            backgroundImage (url "/static/img/wood-bg-11.png")

    body # ".banner-logo-loaded" ** ".banner-logo" ? do
        backgroundImage (url "/static/img/MMPLogoFinal.png")

    body # ".book-cover-loaded" ** (".loader" # ".cover") ? do
        backgroundImage (url "/static/img/book-new-5.png")

    body # ".book-back-loaded" ** ".book" ** ".book-back" ? do
        backgroundImage (url "/static/img/book-back.png") --INSIDE

    div ? do
        "#fb-root" & do
            display none

        "#error-popup" & do
            position fixed
            right (em 1)
            top (em 1)
            width (pct 20)
            height (px 0)
            backgroundColor (rgba 0 0 0 0.7)
            border solid (px 1) (rgba 229 178 73 1)
            borderRadius' (em 0.4)
            zIndex 10000000
            color white
            padding1 (em 1)
            fontFamily ["Open Sans Condensed"] [ sansSerif ]
            minWidth (px 300)
            height auto
            fontSize (px 18)
            lineHeight (pct 150)
            letterSpacing (px 1)
            display none

            p ? do
                margin' (em 1) (em 0)

                lastChild & do
                    margin (em 1) (em 0) (em 0) (em 0)

                ".email" & do
                    textAlign (alignSide sideCenter)

                ".close" & do
                    textAlign (alignSide sideRight)


    -- ======== PAGE SECTIONS ========

    section ? do
        minHeight (pct 100)

        ".reader" & do
            backgroundImage (url "/static/img/wood-bg-11-low.png")
            backgroundSize cover
            backgroundPosition (placed sideCenter sideTop)
            boxShadow (px 0) (px 20) (em 1) (rgba 0 0 0 0.8)

        ".comments" & do
            display flex
            width (px 1000)
            maxWidth (pct 100)
            centerMargin
            alignItems (AlignItemValue $ value $ placed sideCenter sideTop)
            flexFlow row FB.wrap

    -- ======== READER SECTION ========

    -- ---- Banner ----

    ".banner" ? do
        height (vh 15)
        width (vh 70.5)
        maxWidth (pct 100)
        centerMargin


    ".banner-logo" ? do
        backgroundImage (url "/static/img/MMPLogoFinal_low.png")
        backgroundSize (by (pct 100) (pct 100))
        height (pct 100)
        maxWidth (pct 100)


    -- ---- Book Display ----

    ".book" ? do
        minHeight (px 256)
        minWidth (px 200)
        maxWidth (pct 100)
        margin (vh 1) auto (em 0) auto
        backgroundSize (by (pct 100) (pct 100))
        position relative

        ".drop-shadow" ? do
            position absolute
            borderRadius' (px 4)
            background (rgba 0 0 0 0.7)
            top (px 0)
            left (px 0)
            right (px 0)
            bottom (px 0)
            boxShadow (px 3) (px 0) (px 18) (rgba 0 0 0 0.7) --TODO: removed 12px spread since Clay doesn't support it. Does this still look okay?

        ".book-inner" ? do
            display flex
            flexDirection column
            position absolute
            top (pct 2)
            bottom (pct 2)
            left (pct 12)
            right (pct 12)

            ".top-bar" ? do
                padding (px 22) (em 0) (em 0) (em 0)
                textAlign (alignSide sideCenter)

            iframe ? do
                FB.flex 1 1 (px 1)
                noBorder
                width (pct 100)

            ".bottom-bar" ? do
                textAlign (alignSide sideCenter)
                display flex
                height (px 60)
                maxHeight (px 60)
                alignItems center

                div <? do
                    FB.flex 1 1 (px 1)

        ".book-arrow" ? do
            fontSize (px 35)
            color (rgba 68 68 68 1)
            display flex
            alignItems center

            ".btn-disabled" & do
                cursor cursorDefault

                ".last-page-txt" ? do
                    display block

                i ? do
                    display none

                hover & do
                    cursor cursorDefault

            hover & do
                cursor pointer
                fontSize (px 38)

        ".last-page-txt" ? do
            display none
            textAlign (alignSide sideRight)
            fontSize (px 14)
            whiteSpace nowrap


        ".page-num" ? do
            fontFamily [ "Droid Serif", "Times New Roman" ] [ serif ]
            fontSize (px 15)
            color (rgba 68 68 68 1)

        -- ---- Book Display > Loader Overlay ----

        ".loader" ? do
            position absolute
            top (px 0)
            right (px 0)
            bottom (px 0)
            left (px 0)
            backgroundSize (by (pct 100) (pct 100))
            display none
            zIndex 100
            fontFamily [ "Tangerine", "Droid Serif", "Times New Roman" ] [ serif ]
            fontSize (px 50)
            fontWeight bold
            color (rgba 51 51 51 1)
            verticalAlign middle
            alignItems center
            justifyContent center
            textAlign (alignSide sideCenter)
            flexDirection column

            ".cover" & do
                backgroundImage (url "/static/img/book-new-5-low.png")
                zIndex 101
                cursor pointer


                ".glow" ? do
                    position absolute
                    top (px 0)
                    left (pct 6)
                    right (px 0)
                    bottom (px 0)
                    backgroundImage (radialGradient' sideCenter (circle farthestCorner)
                                    [ ( rgba 203 128 14 0.25, pct 0)
                                    , ( rgba 203 128 14 0.4, pct 23)
                                    , ( rgba 0 0 0 0.4, pct 58)
                                    ])
                    opacity 0.5
                    animationName "glow-fade"
                    animationDuration 0.7
                    animationTimingFunction linear
                    animationDirection alternate
                    animationIterationCount infinite

                    hover & do
                        opacity 0.7
                        animation "fadeInFrom" 0.2 linear 0 (iterationCount 1) alternate forwards
                        backgroundImage (radialGradient' sideCenter (circle farthestCorner)
                                        [ ( rgba 203 128 14 0.35, pct 0)
                                        , ( rgba 203 128 14 0.45, pct 23)
                                        , ( rgba 0 0 0 0.55, pct 58)
                                        ])

                    ".cover-txt" ? do
                        color (rgba 220 162 52 1)
                        fontSize (vh 8)
                        fontFamily [ "Tangerine", "Droid Serif", "Times New Roman" ] [ serif ]
                        fontWeight normal
                        margin' 0 (em 1)
                        position absolute
                        bottom (pct 70)
                        left (px 0)
                        right (pct 6)
                        textAlign (alignSide sideCenter)
                        whiteSpace nowrap
                        textShadow (px 2) (px 2) (px 0) (rgba 0 0 0 1)

                        ".start-reading-txt" & do
                            bottom (pct 24)
                            fontSize (vh 3.5)
                            opacity 0
                            animation "fadein" 1 linear 6.5 (iterationCount 1) alternate forwards

            ".isDisplayed" & do
                display flex

            ".loading-label" ? do
                textAlign (alignSide sideCenter)

        ".book-back" ? do
            zIndex 1
            backgroundImage (url "/static/img/book-back-low.png") --INSIDE
            position absolute
            backgroundSize (by(pct 100) (pct 100))
            top (px 0)
            bottom (px 0)
            left (px 0)
            right (px 0)

    ".forward-btn" ** star ? do
        marginLeft auto

    -- ---- Book Display > Dropdown Menu ----

    ".drop-down-container" ? do
        display inlineBlock
        maxWidth (pct 90)
        whiteSpace nowrap
        margin (em 0) auto (em 1) auto
        cursor pointer
        position relative

        ".expanded" & do
            minWidth (pct 70)

            ".selected-label" ? do
                color black
                backgroundColor (rgba 238 238 238 1)
                border solid (px 1) (rgba 153 153 153 1)
                borderBottomRightRadius (px 0) (px 0)
                borderBottomLeftRadius (px 0) (px 0)
                borderBottomStyle dashed
                noBoxShadow

                hover & do
                    noBoxShadow

            ".arrow-down" ? do
                borderWidth (px 0)

            ul ? do
                border solid (px 1) (rgba 153 153 153 1)
                borderTop solid (px 0) (rgba 0 0 0 0)
                maxHeight (vh 60)

                (li # ".latest") ** ".alert" ? do
                    display inlineBlock

        ".selected-label" ? do
            textAlign (alignSide sideCenter)
            overflow hidden
            display flex
            maxWidth (pct 100)
            border solid (px 1) (rgba 0 0 0 0)
            borderRadius' (em 0.2)
            padding' (em 0.6) (em 1)
            fontSize (px 14)
            fontFamily [ "Droid Serif", "Times New Roman" ] [ serif ]
            color (rgba 68 68 68 1)
            boxShadow (px 0) (px 0) (px 2) (rgba 165 149 144 1)
            transition "background-color" 0.2 easeInOut 0

            hover & do
                boxShadow (px 0) (px 0) (px 2) (rgba 34 34 34 1)
                color black

                ".arrow-down" ? do
                    borderTopColor (rgba 0 0 0 1)

            ".label-text" ? do
                overflow hidden
                textOverflow overflowEllipsis
                width (pct 100)

        ".arrow-down" ? do
            width (px 0)
            height (px 0)
            borderLeft solid (px 6) transparent
            borderRight solid (px 6) transparent
            display inlineBlock
            marginTop (px 6)
            marginLeft (em 0.55)
            borderTop solid (px 6) (rgba 85 85 85 1)
            transition "border-width" 0.2 easeInOut 0

        ".drop-down-spacer" ? do
            width (pct 6)
            display inlineBlock

        ul ? do
            textAlign (alignSide sideLeft)
            listStyleNone
            position absolute
            top (pct 100)
            left (px 0)
            right (px 0)
            zIndex 100000
            backgroundColor (rgba 238 238 238 1)
            borderBottomLeftRadius (em 0.2) (em 0.2)
            borderBottomRightRadius (em 0.2) (em 0.2)
            maxHeight (vh 0)
            overflowY auto
            boxSizing borderBox
            fontFamily [ "Open Sans Condensed" ] [ sansSerif ]
            fontSize (px 17)
            color (rgba 0 0 0 1)
            transition "max-height" 0.2 easeInOut 0

            li ? do
                padding' (em 0.2) (em 0.5)
                maxWidth (pct 100)
                overflow hidden
                display flex

                ".li-label" ? do
                    FB.flex 1 1 (px 1)
                    maxWidth (pct 100)
                    overflow hidden
                    textOverflow overflowEllipsis

                hover & do
                    backgroundColor (rgba 229 178 73 1)

                ".alert" ? do
                    display none
                    backgroundColor (rgba 229 178 73 1)
                    borderRadius' (em 0.4)
                    padding' (em 0.12) (em 0.4)

                ".interactive" ? do
                    display none

                ".isInteractive" & do
                    ".interactive" ? do
                        display inlineBlock
                        padding' (em 0.12) (em 0.4)

                ".latest" & do
                    ".li-label" ? do
                        padding' (em 0.12) (px 0)

                ".selected" & do
                    backgroundColor (rgba 224 189 118 1)

                ".unread" & do
                    fontWeight bold

    -- ======== COMMENTS / AUTHOR'S NOTE SECTION ========

    ("#comments-box" <> "#authors-note") ? do
        borderRadius' (em 0.4)
        margin' (px 15) (em 0.5)
        backgroundColor (rgba 38 30 53 0.8)
        backgroundSize cover
        backgroundPosition (placed sideCenter sideCenter)
        border solid (px 1) (rgba 200 200 200 0.2)
        maxWidth (pct 100)
        padding' (em 0.5) (em 1)
        boxSizing borderBox

    "#comments-box" ? do
        FB.flex 3 1 auto
        minWidth (px 300)

    "#authors-note" ? do
        FB.flex 1 1 auto
        minWidth (px 200)
        color (rgba 221 221 221 1)

    h2 # ".fancy-heading" ? do
        color white
        fontFamily [ "Tangerine", "Droid Serif", "Times New Roman" ] [ serif ]
        fontSize (px 45)
        textAlign (alignSide sideCenter)
        fontWeight normal
        margin' (em 0.5) (em 0)

        ".no-bottom-margin" & do
            marginBottom (em 0)

    ".byline" ? do
        fontStyle italic
        textAlign (alignSide sideCenter)

    ".authors-note-text" ? do
        marginTop (em 1)
        textAlign justify
        lineHeight (em 1.4)


    ".authors-note-text" ** p ? do
        marginBottom (em 1.4)

    a ? do
        color (rgba 229 178 73 1)
        textDecoration none

        hover & textDecoration underline

    (section # ".comments") ** (span # ".highlight-color") ? do
        color (rgba 229 178 73 1)

    -- ======== FOOTER ========

    footer ? do
        background black
        boxSizing borderBox
        padding (em 2) (em 0) (em 0.2) (em 0)
        fontSize (px 14)
        fontFamily [ "Helvetica", "Arial" ] [ sansSerif ]

        ".footer-link-block" ? do
            display flex
            flexFlow row FB.wrap

        ul ? do listStyleNone

        h2 # ".fancy-heading" ? do
            margin (em 0) (em 0) (em 0.2) (em 0)
            fontSize (px 36)

        img ? do
            width (px 30)
            height (px 30)
            margin' (px 0) (em 0.2)

            "src" @= "/static/img/ello-icon.jpg" & do
                boxSizing borderBox
                padding1 (px 2)
                backgroundColor white

        li # firstChild ? do
            marginTop (px 0)

        li ? do
            cursor pointer
            margin' (em 0.5) (em 0)

            a ? do
                fontFamily [ "Open Sans Condensed"] [ sansSerif ]
                fontSize (px 18)

        ".link-section" ? do
            FB.flex 1 1 auto
            textAlign (alignSide sideCenter)
            margin' (em 1) (em 0.5)
            minWidth (px 200)

        ".share-btn" ? do
            display block
            margin' (em 0.5) auto

    ".copy" ? do
        textAlign (alignSide sideCenter)
        fontSize (px 12)
        color (rgba 153 153 153 1)
        marginTop (em 1)
        display block

    -- ======== MAILCHIMP ========

    iframe # "#mailchimp-signup" ? do
        noBorder
        display block
        width (px 200)
        margin (em 0.5) auto (px 0) auto
        height (px 80)

    "#mc_embed_signup" ? do
        fontSize (px 14)
        fontFamily [ "Open Sans Condensed" ] [ sansSerif ]
        width (px 200)
        centerMargin
        textAlign (alignSide sideCenter)

        input # ".email" ? do
            width (pct 100)
            display block
            fontSize (px 16)
            textAlign (alignSide sideCenter)
            borderRadius' (em 0.2)
            borderBottomRightRadius (em 0) (em 0)
            borderBottomLeftRadius (em 0) (em 0)
            padding1 (px 8)
            backgroundColor (rgba 255 255 255 0.9)
            noBorder
            boxSizing borderBox

        ".button" ? do
            width (pct 100)
            borderRadius' (em 0.2)
            borderTopRightRadius (em 0) (em 0)
            borderTopLeftRadius (em 0) (em 0)
            backgroundColor (rgba 229 178 73 1)
            textShadow (px 0) (px 0) (px 4) (rgba 0 0 0 1)
            fontFamily [ "Helvetica", "Arial" ] [ sansSerif ]
            fontSize (px 15)
            boxSizing borderBox
            letterSpacing (px 1)
            padding1 (px 7)
            noBorder
            color white
            transition "background-color" 0.2 easeInOut 0

            hover & do
                backgroundColor (rgba 195 144 39 1)
                cursor pointer

    "#mc_embed_signup_scroll" ? do
        centerMargin

    -- ======== Share Buttons ========

    shareButtons

    -- ======== SHARE DIALOG ========

    ".modal" # ".share-dialog-container" ? do
        display flex
        alignItems center
        justifyContent center

        ".overlay" ? do
            position absolute
            top (px 0)
            bottom (px 0)
            left (px 0)
            right (px 0)
            zIndex 1500
            backgroundColor (rgba 0 0 0 0.9)

    ".share-dialog" ? do
        FB.flex 1 1 (px 1)
        maxWidth (px 500)
        padding1 (em 1)
        borderRadius' (em 0.4)
        color white
        position relative
        zIndex 1501
        cursor cursorText
        fontSize (px 18)
        fontFamily [ "Helvetica", "Arial" ] [ sansSerif ]
        overflow auto
        maxHeight (pct 100)

        ".url-container" ? do
            marginBottom (em 1)

            input ? do
                width (pct 100)
                borderRadius' (em 0.4)
                noBorder
                fontSize (px 24)
                padding' (em 0.5) (em 1)
                boxSizing borderBox
                textAlign (alignSide sideCenter)

        input # ("type" @= "checkbox") ? do
            width (px 30)
            height (px 30)
            margin (em 0.4) (em 1) (em 0) (em 0)
            marginLeft (em 3)
            float floatLeft
            cursor pointer

        ".share-section-title" ? do
            fontSize (px 15)
            fontStyle italic
            color (rgba 229 178 73 1)

        ".social-media-buttons" ? do
            marginTop (em 2)
            paddingTop (em 1)
            textAlign (alignSide sideCenter)
            borderTop solid (px 1) (rgba 204 204 204 1)

            div <? do
                margin' (em 0.5) (em 1)

        ".close" ? do
            color white
            position absolute
            right (px 20)
            top (px 10)
            fontSize (px 30)
            cursor pointer
            zIndex 100000

            hover & do
                transform (scale 1.2 1.2)

    -- ======= ANIMATIONS ======

    keyframes "glow-fade"
        [ (0, opacity 0.93)
        , (20, opacity 1)
        , (21, opacity 0.9)
        , (22, opacity 1)
        , (23, opacity 0.93)
        , (24, opacity 1)
        , (30, opacity 0.93)
        , (34, opacity 1)
        , (50, opacity 1)
        , (51, opacity 0.9)
        , (52, opacity 1)
        , (53, opacity 0.93)
        , (54, opacity 1)
        , (70, opacity 1)
        , (71, opacity 0.93)
        , (72, opacity 1)
        , (73, opacity 0.93)
        , (74, opacity 1)
        , (90, opacity 1)
        , (91, opacity 0.93)
        , (92, opacity 1)
        , (93, opacity 0.93)
        , (94, opacity 1)
        , (100, opacity 1)
        ]

    keyframes "fadeInFrom"
        [ (0,  opacity 0.7)
        , (100, opacity 1)
        ]

    keyframesFromTo "fadein" (opacity 0) (opacity 1)
    keyframesFromTo "fadeout" (opacity 1) (opacity 0)

    -- ======= CREDITS ======

    ".modal" # ".credits-overlay" ? do
        backgroundColor black
        animation "fadein" 2 linear 0 (iterationCount 1) alternate forwards

    ".credits-container" ? do
        fontWeight (weight 300)
        fontSize (px 30)
        fontFamily [ "Open Sans Condensed" ] [ sansSerif ]
        textAlign (alignSide sideCenter)
        color (rgba 255 255 255 1)
        height (pct 100)
        maxHeight (pct 100)
        overflow hidden

    ".full-spacer" ? do
        height (pct 100)

    ".end-block" ? do
        height (pct 100)
        display flex
        alignItems center

    ".movie" ? do
        marginBottom (px 50)
        fontSize (px 50)

    ".job" ? do
        marginTop (px 50)
        fontFamily [ "Tangerine", "Droid Serif", "Times New Roman" ] [ serif ]
        marginBottom (px 5)
        fontSize (px 48)

    ".name" ? do
        marginBottom (px 20)
        textTransform uppercase
        fontSize (px 25)

    ".end-credits-btn" ? do
        position fixed
        zIndex 10000000000000001
        top (px 5)
        right (px 5)
        border solid (px 1) white
        borderRadius' (em 0.2)
        color white
        fontSize (px 25)
        padding1 (em 0.5)
        cursor pointer

        hover & do
            color (rgba 229 178 73 1)
            borderColor (rgba 229 178 73 1)

    -- ===== CONTACT ME =====

    ".contact-modal-container" ? do
        width (pct 100)
        height (pct 100)
        display flex
        alignItems center
        justifyContent center

    ".contact-modal-text" ? do
        FB.flex 1 1 (px 1)
        color (rgba 221 221 221 1)
        maxWidth (px 500)
        padding1 (em 1)
        cursor cursorText
        fontSize (px 18)
        fontFamily [ "Open Sans Condensed" ] [ sansSerif ]
        overflow auto
        maxHeight (pct 100)
        position relative

        p ? do
            margin' (em 1.5) (em 0)
            textAlign (alignSide sideCenter)

            ".email" & do
                fontSize (px 20)

        strong ? do
            fontSize (px 19)
            color white

    -- ======== MODAL =======

    ".modal" ? do
        backgroundColor (rgba 0 0 0 0.9)
        position fixed
        top (px 0)
        bottom (px 0)
        left (px 0)
        right (px 0)
        zIndex 10000000000000000
        overflow hidden
        opacity 0
        animation "fadein" 0.4 linear 0 (iterationCount 1) alternate forwards

        ".fading" & do
            animation "fadeout" 0.4 linear 0 (iterationCount 1) alternate forwards

        ".close-x" ? do
            color white
            position absolute
            right (px 20)
            top (px 10)
            fontSize (px 30)
            cursor pointer

            hover & do
                transform (scale 1.2 1.2)

    -- ======== MISC ========

    ".hidden" ? visibility hidden

    ".no-display" ? ("display" -: "none !important")

    ".no-scroll" ? ("overflow" -: "hidden !important")
