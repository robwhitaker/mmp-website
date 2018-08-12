{-# LANGUAGE OverloadedStrings #-}

module Main where

import           Clay
import           Data.Text (Text)
import qualified Data.Text.Lazy.IO as T
import           System.Environment (getArgs)

import qualified Countdown as Countdown

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
                "renderer" -> undefined
                "editor" -> undefined

