module Main where

import           Development.Shake
import           Development.Shake.FilePath
import qualified Text.Jasmine as JS

main :: IO ()
main = shakeArgs opts $ do
    want [ "public/coming_soon.html"
         , "public/editor.html"
         , "public/mailchimp-signup.html"
         , "public/reader.html"
         , "public/renderer.html"
         , "public/dist/css/countdown.min.css" 
         , "public/dist/css/editor.min.css" 
         , "public/dist/css/reader.min.css" 
         , "public/dist/css/renderer.min.css" 
         , "public/dist/js/countdown.min.js" 
         , "public/dist/js/editor.min.js" 
         , "public/dist/js/reader.min.js" 
         , "public/dist/js/renderer.min.js" 
         ]

    "public/*.html" %> \out ->
        cmd_ "echo" out 
  where opts = shakeOptions{ shakeThreads = 0
                           , shakeColor = True
                           }
    
