module Editor.Components.Editor where

import Prelude
import Editor.Components.ChapterList as ChapterList
import Editor.Components.ChapterSync as ChapterSync
import Editor.Components.MetadataEditor as MetadataEditor
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Control.Alt ((<$>))
import Control.Monad.Aff (Aff)
import Control.Monad.Aff.Console (log)
import Control.Monad.Eff.Console (CONSOLE)
import Control.Monad.Eff.Now (NOW)
import Control.Monad.Reader.Trans (runReaderT)
import Data.Bifunctor (rmap)
import Data.Either.Nested (Either3)
import Data.Either.Nested (Either2)
import Data.Functor.Coproduct.Nested (Coproduct3)
import Data.Functor.Coproduct.Nested (Coproduct2)
import Data.JSDate (LOCALE)
import Data.Maybe (isJust, isNothing)
import Data.Maybe (Maybe(..))
import Data.Tuple (fst, snd)
import Data.Tuple (Tuple(..))
import Editor.Models.Chapter (Chapter(..), LocalChapter)
import Editor.Utils.GoogleAuth (FilePicker, GAPI, GoogleAuthData, GoogleServices, awaitGapi, googleLogin, initAuth2, initPicker, load, showPicker)
import Halogen (lifecycleParentComponent)
import Halogen (Action)
import Halogen.Component.ChildPath (cp2, cp3)
import Halogen.Component.ChildPath (cp1)
import Halogen.HTML (i)
import Halogen.HTML.Properties (id_)
import Network.HTTP.Affjax (AJAX)

data ActiveComponent 
    = ChapterList (Array (Tuple String (Action ChapterList.Query)))
    | MetadataEditor LocalChapter (Array (Tuple String (Action MetadataEditor.Query)))
    | ChapterSync LocalChapter LocalChapter (Array (Tuple String (Action ChapterSync.Query)))

type State = 
    { activeComponent :: ActiveComponent
    , googleServices :: Maybe GoogleServices
    }

data Query a 
    = HandleChapterList ChapterList.Message a
    | HandleMetadataEditor MetadataEditor.Message a
    | HandleChapterSync ChapterSync.Message a
    | SendChapterListAction (Action ChapterList.Query) a
    | SendMetadataEditorAction (Action MetadataEditor.Query) a
    | SendChapterSyncAction (Action ChapterSync.Query) a
    | Initialize a
    | Login a

type Input = Unit

type Message = Void

type ChildQuery = Coproduct3 ChapterList.Query MetadataEditor.Query ChapterSync.Query
type ChildSlot = Either3 Unit Unit Unit

type AppEffects eff = Aff
    ( ajax :: AJAX
    , locale :: LOCALE
    , console :: CONSOLE
    , gapi :: GAPI
    , now :: NOW
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
        initialState = { activeComponent : ChapterList [], googleServices : Nothing }

        render :: State -> H.ParentHTML Query ChildQuery ChildSlot (AppEffects eff)
        render state =
            HH.div_
                [ HH.div
                    [ HP.id_ "top-bar" ] $ 
                    [ HH.h1_ $ case state.activeComponent of
                        ChapterList _ -> [ HH.text "Midnight Murder Party Editor" ]
                        _ -> [ HH.i 
                                [ HP.class_ (H.ClassName "fa fa-chevron-left")
                                , HP.attr (H.AttrName "aria-hidden") "true" 
                                , HE.onClick (HE.input_ $ HandleMetadataEditor MetadataEditor.GoToChapterList) --TODO: Reusing this route is janky
                                ] []
                             , HH.text "Midnight Murder Party Editor"
                             ]
                    ] <>
                    (case state.activeComponent of
                        ChapterList options ->
                            renderOption <$> mapOptions SendChapterListAction options
                        MetadataEditor _ options -> 
                            renderOption <$> mapOptions SendMetadataEditorAction options
                        ChapterSync _ _ options -> 
                            renderOption <$> mapOptions SendChapterSyncAction options) <>
                    (if isNothing state.googleServices
                        then 
                            [ HH.button
                                [ HE.onClick (HE.input_ Login) ]
                                [ HH.text "Login" ] 
                            ]
                        else
                            []) 
                , HH.div [ HP.id_ "top-bar-spacer" ] []
                , case state.googleServices of
                    Just googleServices ->
                        case state.activeComponent of
                            ChapterList _ -> 
                                HH.slot' cp1 unit (H.hoist (flip runReaderT googleServices) ChapterList.chapterList) unit (HE.input HandleChapterList)
                            MetadataEditor chapter _ -> 
                                HH.slot' cp2 unit MetadataEditor.metadataEditor chapter (HE.input HandleMetadataEditor)
                            ChapterSync chapterOriginal chapterNew _ ->
                                HH.slot' cp3 unit (ChapterSync.chapterSync chapterOriginal chapterNew) unit (HE.input HandleChapterSync)
                    Nothing -> HH.text "Not logged in."
                ]
          where                
                mapOptions :: forall a b. (a -> b) -> Array (Tuple String a) -> Array (Tuple String b)
                mapOptions f = map (rmap f) 

                renderOption (Tuple label action) = 
                    HH.button
                        [ HE.onClick (HE.input_ action) ]
                        [ HH.text label ]

        eval :: Query ~> H.ParentDSL State Query ChildQuery ChildSlot Void (AppEffects eff)
        eval = case _ of
            Initialize next -> do
                -- setup Google auth and file picker
                H.liftAff do 
                    _ <- awaitGapi
                    load "auth2"
                    load "picker"
                    initAuth2 "361874213844-33mf5b41pp4p0q38q26u8go81cod0h7f.apps.googleusercontent.com"
                pure next

            HandleChapterList (ChapterList.OptionChange options) next -> do
                H.modify \state -> state { activeComponent = ChapterList options }
                pure next
            HandleChapterList (ChapterList.GoToMetadataEditor chapter) next -> do
                H.modify \state -> state { activeComponent = MetadataEditor chapter [] }
                pure next
            HandleChapterList (ChapterList.GoToChapterSync chapterOriginal chapterNew) next -> do
                H.modify \state -> state { activeComponent = ChapterSync chapterOriginal chapterNew [] }
                pure next

            HandleMetadataEditor (MetadataEditor.OptionChange options) next -> do
                H.modify \state -> 
                    case state.activeComponent of
                        MetadataEditor chapter _ ->
                            state { activeComponent = MetadataEditor chapter options }
                        _ -> state
                pure next
            HandleMetadataEditor MetadataEditor.GoToChapterList next -> do
                H.modify \state -> state { activeComponent = ChapterList [] }
                pure next

            HandleChapterSync (ChapterSync.OptionChange options) next -> do
                H.modify \state -> 
                    case state.activeComponent of 
                        ChapterSync chapterOriginal chapterNew _ ->
                            state { activeComponent = ChapterSync chapterOriginal chapterNew options }
                        _ -> state
                pure next
            HandleChapterSync ChapterSync.GoToChapterList next -> do
                H.modify \state -> state { activeComponent = ChapterList [] }
                pure next
            HandleChapterSync (ChapterSync.GoToMetadataEditor chapter) next -> do
                H.modify \state -> state { activeComponent = MetadataEditor chapter [] }
                pure next            

            SendChapterListAction action next -> do
                _ <- H.query' cp1 unit $ H.action action
                pure next

            SendMetadataEditorAction action next -> do
                _ <- H.query' cp2 unit $ H.action action
                pure next

            SendChapterSyncAction action next -> do
                _ <- H.query' cp3 unit $ H.action action
                pure next

            Login next -> do
                result <- H.liftAff do
                    result <- googleLogin "361874213844-33mf5b41pp4p0q38q26u8go81cod0h7f.apps.googleusercontent.com" 
                                          ["profile", "email", "https://www.googleapis.com/auth/drive.readonly"]
                                          ["id_token", "permission"]
                    picker <- initPicker result.accessToken
                    pure $ Tuple result picker
                H.modify (_ { googleServices = Just { accessToken : (fst result).accessToken, idToken : (fst result).idToken, filePicker : snd result }})
                pure next
