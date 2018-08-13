{-# LANGUAGE OverloadedStrings #-}

module Main where

import           Clay
import           Data.Text (Text)
import qualified Data.Text.Lazy.IO as T
import           System.Environment (getArgs)

import qualified Countdown as Countdown
import qualified Renderer as Renderer
import qualified Editor as Editor

main :: IO ()
main = do
    args <- getArgs
    if length args < 1 then
        return ()
    else
        T.putStrLn . renderWith compact [] $
            case Prelude.head args of
                "countdown" -> Countdown.stylesheet
                "reader" -> undefined
                "renderer" -> Renderer.stylesheet
                "editor" -> Editor.stylesheet

