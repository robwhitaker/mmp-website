module Editor.Components.Editor where

import Editor.Components.ChapterList as ChapterList
import Editor.Components.MetadataEditor as MetadataEditor
import Control.Monad.Aff (Aff)
import Control.Monad.Aff.Console (log)
import Control.Monad.Eff.Console (CONSOLE)
import Data.JSDate (LOCALE)
import Data.Maybe (isJust, isNothing)
import Editor.Models.Chapter (Chapter(..))
import Editor.Utils.GoogleAuth (GAPI, GoogleAuthData, googleLogin, initPicker, showPicker, load, initAuth2, awaitGapi)
import Halogen (lifecycleParentComponent)
import Halogen.Component.ChildPath (cp2)
import Network.HTTP.Affjax (AJAX)

import Data.Either.Nested (Either2)
import Halogen.Component.ChildPath (cp1)

import Data.Functor.Coproduct.Nested (Coproduct2)
import Data.Tuple (Tuple(..))
import Halogen (Action)

import Prelude
import Data.Maybe (Maybe(..))
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP

data ActiveComponent 
    = ChapterList (Array (Tuple String (Action ChapterList.Query)))
    | MetadataEditor Chapter (Array (Tuple String (Action MetadataEditor.Query)))

type State = 
    { activeComponent :: ActiveComponent
    , googleAuth :: Maybe GoogleAuthData 
    }

data Query a 
    = HandleChapterList ChapterList.Message a
    | HandleMetadataEditor MetadataEditor.Message a
    | SendChapterListAction (Action ChapterList.Query) a
    | SendMetadataEditorAction (Action MetadataEditor.Query) a
    | Initialize a
    | Login a

type Input = Unit

type Message = Void

type ChildQuery = Coproduct2 ChapterList.Query MetadataEditor.Query
type ChildSlot = Either2 Unit Unit

type AppEffects eff = Aff
    ( ajax :: AJAX
    , locale :: LOCALE
    , console :: CONSOLE
    , gapi :: GAPI
    | eff
    )

editor :: forall eff. H.Component HH.HTML Query Input Message (AppEffects eff)
editor =
    H.lifecycleParentComponent
      { initialState: const initialState
      , render
      , eval
      , receiver: const Nothing
      , initializer: Just (H.action Initialize)
      , finalizer: Nothing
      }
  where
        initialState :: State
        initialState = { activeComponent : ChapterList [], googleAuth : Nothing }

        render :: State -> H.ParentHTML Query ChildQuery ChildSlot (AppEffects eff)
        render state =
            HH.div_
                [ topBar 
                , if isJust state.googleAuth
                    then case state.activeComponent of
                        ChapterList _ -> 
                            HH.slot' cp1 unit ChapterList.chapterList unit (HE.input HandleChapterList)
                        MetadataEditor chapter _ -> 
                            HH.slot' cp2 unit MetadataEditor.metadataEditor chapter (HE.input HandleMetadataEditor)
                    else HH.text "Not logged in."
                ]
          where
                topBar :: H.ParentHTML Query ChildQuery ChildSlot (AppEffects eff)
                topBar = 
                    HH.div_ $ 
                        [ HH.h1_ [ HH.text "Chapter List Editor" ] ] <>
                        (case state.activeComponent of
                            ChapterList options ->
                                map (optionBtn SendChapterListAction) options
                            MetadataEditor _ options -> 
                                map (optionBtn2 SendMetadataEditorAction) options) <>
                        (if isNothing state.googleAuth
                            then 
                                [ HH.button
                                    [ HE.onClick (HE.input_ Login) ]
                                    [ HH.text "Login" ] 
                                ]
                            else
                                [])
                        
                                
                optionBtn toQuery (Tuple label action) = 
                    HH.button
                        [ HE.onClick (HE.input_ $ toQuery action) ]
                        [ HH.text label ]

                optionBtn2 toQuery (Tuple label action) = 
                    HH.button
                        [ HE.onClick (HE.input_ $ toQuery action) ]
                        [ HH.text label ]

        eval :: Query ~> H.ParentDSL State Query ChildQuery ChildSlot Void (AppEffects eff)
        eval = case _ of
            Initialize next -> do
                -- setup Google auth and file picker
                H.liftAff do 
                    awaitGapi
                    load "auth2"
                    load "picker"
                    initAuth2 "361874213844-33mf5b41pp4p0q38q26u8go81cod0h7f.apps.googleusercontent.com"
                pure next

            HandleChapterList (ChapterList.OptionChange options) next -> do
                H.modify \state -> state { activeComponent = ChapterList options }
                pure next
            HandleChapterList (ChapterList.EditChapter chapter) next -> do
                H.modify \state -> state { activeComponent = MetadataEditor chapter [] }
                pure next

            HandleMetadataEditor (MetadataEditor.OptionChange options) next -> do
                H.modify \state -> 
                    case state.activeComponent of
                        MetadataEditor chapter _ ->
                            state { activeComponent = MetadataEditor chapter options }
                        _ -> state
                pure next
            HandleMetadataEditor MetadataEditor.BackToChapterList next -> do
                H.modify \state -> state { activeComponent = ChapterList [] }
                pure next

            SendChapterListAction action next -> do
                H.query' cp1 unit $ H.action action
                pure next

            SendMetadataEditorAction action next -> do
                H.query' cp2 unit $ H.action action
                pure next

            Login next -> do
                result <- H.liftAff do
                    result <- googleLogin "361874213844-33mf5b41pp4p0q38q26u8go81cod0h7f.apps.googleusercontent.com" 
                                          ["profile", "email", "https://www.googleapis.com/auth/drive.readonly"]
                                          ["id_token", "permission"]
                    log "Logged in..."
                    picker <- initPicker result.accessToken
                    log "Picker?"
                    fId <- showPicker picker
                    log $ show fId
                    pure result
                H.modify \state -> state { googleAuth = Just result }
                pure next
