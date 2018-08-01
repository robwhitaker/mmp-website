module Editor.Components.ChapterList where

import Prelude
import Control.Monad.Eff.Console as Console
import Editor.Models.Chapter as Chapter
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Control.Monad.Aff (attempt)
import Control.Monad.Aff (Aff)
import Control.Monad.Aff.Console (CONSOLE, log)
import Control.Monad.Eff.Exception (error)
import Control.Monad.Eff.Now (NOW, nowDateTime)
import Control.Monad.Eff.Unsafe (unsafePerformEff)
import Control.Monad.Error.Class (throwError)
import Control.Monad.Except (runExcept)
import Control.Monad.Reader (ReaderT(..), ask)
import Control.Plus ((<|>))
import Data.Argonaut (encodeJson)
import Data.Argonaut.Core (jsonNull)
import Data.Array (catMaybes, concat, concatMap, deleteAt, drop, dropWhile, filter, groupBy, head, intercalate, last, length, sortWith, takeWhile, (!!), (:))
import Data.Array (mapWithIndex, sort, updateAt, (!!))
import Data.DateTime.Locale (LocalDateTime)
import Data.Either (either)
import Data.Int (round, toNumber)
import Data.JSDate (LOCALE)
import Data.List (find)
import Data.Maybe (Maybe(..), maybe)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Newtype (unwrap)
import Data.Newtype (over)
import Data.NonEmpty (fromNonEmpty)
import Data.String (joinWith, null, split, Pattern(..))
import Data.Traversable (for, sequence, traverse)
import Data.Tuple (Tuple(..))
import Data.Tuple.Nested (tuple3)
import Editor.Data.DateTime.Utils (dateTimeWithLocale, formatISO8601, formatReadable, removeLocale)
import Editor.Models.Chapter (Chapter(..), LocalChapter, ServerChapter, fromServerChapter, toServerChapter)
import Editor.Models.Entry (Entry(..))
import Editor.Models.Session (Session, GoogleServices)
import Editor.Utils.Array (swap)
import Editor.Utils.GoogleServices (AccessToken, DriveReadOnlyScope, GAPI, showPicker)
import Editor.Utils.ModelHelpers (ReleaseGroup, fromReleaseGroup, makeReleaseGroupTitle, makeReleaseGroups)
import Editor.Utils.Parser (getHeadingGroups, getTagContents, parseChapter, stripTags)
import Editor.Utils.Requests (crupdate, deleteChapter, getChapterHtmlFromGDocs, postChapters)
import Halogen.HTML (span_)
import Halogen.HTML.Properties (class_, id_)
import Halogen.Query (Action)
import Network.HTTP.Affjax (AJAX)

type State = 
    { chapters :: Array LocalChapter
    , chaptersOriginal :: Array LocalChapter
    , now :: Maybe LocalDateTime
    }

data Query a 
    = Initialize a
    | MoveChapter Int Int a
    | SyncChapter LocalChapter a
    | EditChapterMetadata LocalChapter a
    | ChangeChapterSource LocalChapter a
    | NewChapter a
    | DeleteChapter Int a
    | Save a
    | Cancel a

type Input = Unit

data Message
    = GoToMetadataEditor LocalChapter
    | OptionChange (Array (Tuple String (Action Query)))
    | GoToChapterSync LocalChapter LocalChapter

type AppEffects eff = ReaderT (Tuple Session GoogleServices) (Aff 
    ( ajax :: AJAX 
    , gapi :: GAPI
    , console :: CONSOLE
    , locale :: LOCALE
    , now :: NOW
    | eff
    ))



type ChapterListComponent eff = H.Component HH.HTML Query Input Message (AppEffects eff)

chapterList :: forall eff. ChapterListComponent eff
chapterList =
    H.lifecycleComponent
      { initialState: const initialState
      , render
      , eval
      , receiver: const Nothing
      , initializer: Just (H.action Initialize)
      , finalizer: Nothing
      } 
  where
        initialState :: State
        initialState = { chapters : [], chaptersOriginal : [], now : Nothing }

        render :: State -> H.ComponentHTML Query
        render state = 
            HH.div 
                [ HP.id_ "chapter-list" ] 
                [ HH.div [ HP.class_ (H.ClassName "left-col") ] $ mapWithIndex chapterToHtml state.chapters
                , HH.div 
                    [ HP.class_ (H.ClassName "right-col") ] $
                    [ HH.div 
                        [ HP.class_ (H.ClassName "chapter-tile next-release") ] $
                        [ HH.h2_ [ HH.text "Next Release" ] ] <>
                        case head nextReleases of
                            Nothing -> [ HH.text "No release scheduled." ]
                            Just _ ->
                                concatMap (\release ->
                                    [ HH.h3_ [ interactiveIcon (getReleaseGroupIsInteractive release), HH.text $ makeReleaseGroupTitle release ] 
                                    , HH.span_ [ HH.text $ maybe "" formatReadable $ getReleaseGroupDate release ]
                                    ]
                                ) nextReleases
                    , HH.div 
                        [ HP.class_ (H.ClassName "chapter-tile upcoming-releases") ] 
                        [ HH.h2_ [ HH.text "Upcoming Releases" ]
                        , case upcomingReleases !! (length nextReleases) of
                            Nothing -> HH.text "No upcoming releases."
                            Just _ -> 
                                HH.ul [ HP.class_ (H.ClassName "upcoming-releases") ] $ map (\releaseGroup -> 
                                    HH.li 
                                        [ HP.class_ (H.ClassName "upcoming-release") ]
                                        [ HH.h3_ [ interactiveIcon (getReleaseGroupIsInteractive releaseGroup), HH.text $ makeReleaseGroupTitle releaseGroup ]
                                        , HH.span_ [ HH.text $ maybe "" id $ map formatReadable $ getReleaseGroupDate releaseGroup ]
                                        ]
                                ) $ drop (length nextReleases) upcomingReleases
                        ]
                    ] 
                ]    
          where
            chapterToHtml chapterIndex ch@(Chapter chR@{id,title,docId,isInteractive}) = 
                HH.div
                    [ HP.class_ $ H.ClassName "chapter-tile" ]
                    [ HH.h2_ 
                        [ HH.a
                            [ HP.href chR.interactiveUrl
                            , HP.target "_blank" 
                            ]
                            [ interactiveIcon isInteractive ]
                        , HH.a 
                            [ HP.href $ "https://docs.google.com/document/d/" <> docId <> "/edit"
                            , HP.target "_blank" 
                            ] 
                            [ HH.text $ stripTags title ] 
                        ] 
                    , HH.div 
                        [ HP.class_ $ H.ClassName "chapter-controls" ]
                        [ HH.i [ HP.class_ (H.ClassName "fa fa-pencil-square-o")
                                , HP.attr (H.AttrName "aria-hidden") "true"
                                , HE.onClick $ HE.input_ (EditChapterMetadata ch)
                                ] []
                        , HH.i [ HP.class_ (H.ClassName "fa fa-refresh")
                                , HP.attr (H.AttrName "aria-hidden") "true"
                                , HE.onClick $ HE.input_ (SyncChapter ch)
                                ] []
                        , HH.i [ HP.class_ (H.ClassName "fa fa-download")
                                , HP.attr (H.AttrName "aria-hidden") "true"
                                , HE.onClick $ HE.input_ (ChangeChapterSource ch)
                                ] []
                        , HH.i [ HP.class_ (H.ClassName "fa fa-arrow-up")
                                , HP.attr (H.AttrName "aria-hidden") "true"
                                , HE.onClick $ HE.input_ (MoveChapter chapterIndex (chapterIndex - 1))
                                ] []
                        , HH.i [ HP.class_ (H.ClassName "fa fa-arrow-down")
                                , HP.attr (H.AttrName "aria-hidden") "true"
                                , HE.onClick $ HE.input_ (MoveChapter chapterIndex (chapterIndex + 1))
                                ] []
                        , HH.i [ HP.class_ (H.ClassName "fa fa-trash")
                                , HP.attr (H.AttrName "aria-hidden") "true"
                                , HE.onClick $ HE.input_ (DeleteChapter chapterIndex)
                                ] []
                        ]
                    , HH.div 
                        [ HP.class_ $ H.ClassName "chapter-data" ] $ 
                        [ HH.text $ intercalate " / "
                            [ show (wordCount ch) <> " words"
                            , show (length chR.entries) <> " entries"
                            , maybe "Not scheduled" formatReadable chR.releaseDate
                            ]
                        ]
                    ]
            
            interactiveIcon isInteractive = HH.i [ HP.class_ (H.ClassName $ "fa fa-gamepad" <> if isInteractive then "" else " hide"), HP.attr (H.AttrName "aria-hidden") "true" ] []

            upcomingReleases :: Array ReleaseGroup
            upcomingReleases = 
                map (makeReleaseGroups >>> fromNonEmpty (:)) state.chaptersOriginal
                # concat
                # filter (\releaseGroup -> maybe false id do
                    releaseDate <- getReleaseGroupDate releaseGroup
                    now <- state.now
                    pure $ removeLocale releaseDate > removeLocale now)
                # sortWith (getReleaseGroupDate >>> maybe Nothing (removeLocale >>> Just))

            nextReleases :: Array ReleaseGroup 
            nextReleases = 
                case head upcomingReleases of
                    Nothing -> []
                    Just nextRelease -> takeWhile (getReleaseGroupDate >>> (==) (getReleaseGroupDate nextRelease)) upcomingReleases

            getReleaseGroupDate :: ReleaseGroup -> Maybe LocalDateTime
            getReleaseGroupDate = fromReleaseGroup _.releaseDate

            getReleaseGroupIsInteractive :: ReleaseGroup -> Boolean
            getReleaseGroupIsInteractive = fromReleaseGroup _.isInteractive

            words :: String -> Array String
            words = split (Pattern " ")

            -- Silly magic numbers to make the word count line up closer with the Google Docs word count
            wordCount :: LocalChapter -> Int
            wordCount (Chapter { content, entries }) = round $ (\n -> n - (n*0.026)) $ toNumber $ length $ filter (not <<< null) $ words $
                stripTags content <> " " <> (stripTags $ joinWith " " $ map (\(Entry e) -> e.content) entries)

        eval :: Query ~> H.ComponentDSL State Query Message (AppEffects eff)
        eval = case _ of
            Initialize next -> do
                chs <- H.liftAff postChapters
                localChs <- H.liftEff $ 
                    either 
                        (const $ pure []) 
                        (traverse fromServerChapter >>> map sort >>> map (map \(Chapter chapter) -> Chapter chapter { entries = sort chapter.entries }))
                        chs.response
                now <- H.liftEff nowDateTime    
                H.put { chapters : localChs, chaptersOriginal : localChs, now : Just now }
                updateOptions
                pure next
            
            MoveChapter baseIndex swapIndex next -> do
                H.modify \(state@{ chapters }) -> fromMaybe state do
                    newChapters <- swap baseIndex swapIndex chapters
                    pure $ state { chapters = mapWithIndex (\index -> over Chapter (_ { order = index })) newChapters }
                updateOptions
                pure next

            SyncChapter chapter next -> do
                Tuple session _ <- ask
                newChapter <- H.liftAff $ retrieveChapter session.accessToken (unwrap chapter).docId (unwrap chapter).order                    
                H.raise $ GoToChapterSync chapter newChapter
                pure next
            
            ChangeChapterSource chapter next -> do
                Tuple session googleServices <- ask
                newChapter <- H.liftAff do
                    case googleServices.filepicker of
                        Nothing -> throwError $ error "Filepicker not initialized."
                        Just filepicker -> do 
                            newChapterId <- showPicker filepicker >>= maybe (throwError $ error "No file picked.") pure
                            retrieveChapter session.accessToken newChapterId (unwrap chapter).order
                H.raise $ GoToChapterSync chapter newChapter
                pure next

            EditChapterMetadata chapter next -> do
                H.raise $ GoToMetadataEditor chapter
                pure next

            NewChapter next -> do
                state <- H.get
                Tuple session googleServices <- ask
                newChapter <- H.liftAff do
                    case googleServices.filepicker of
                        Nothing -> throwError $ error "Filepicker not initialized."
                        Just filepicker -> do
                            chapterId <- showPicker filepicker >>= maybe (throwError $ error "No file picked.") pure
                            retrieveChapter session.accessToken chapterId (length state.chaptersOriginal)
                H.raise $ GoToMetadataEditor newChapter
                pure next


            DeleteChapter index next -> do
                H.modify \(state@{ chapters }) -> state { chapters = 
                        mapWithIndex (\i -> over Chapter (_ { order = i })) $ fromMaybe chapters $ deleteAt index chapters 
                    }
                updateOptions
                pure next
            
            Save next -> do
                state <- H.get
                _ <- H.liftAff $ sequence $ catMaybes $ flip map state.chaptersOriginal \(Chapter oldChapter) -> do
                    case find (unwrap >>> _.id >>> (==) oldChapter.id) state.chapters of
                        Nothing -> Just $ deleteChapter (fromMaybe (-1) oldChapter.id)
                        Just newChapter -> 
                            if Chapter oldChapter == newChapter then
                                Nothing
                            else
                                Just $ crupdate (toServerChapter newChapter)
                H.modify (_ { chaptersOriginal = state.chapters })
                updateOptions
                pure next
                
            
            Cancel next -> do
                H.modify \(state@{ chapters, chaptersOriginal }) -> state { chapters = chaptersOriginal }
                updateOptions
                pure next
          where
                updateOptions = do
                    state <- H.get
                    if state.chapters /= state.chaptersOriginal 
                        then 
                            H.raise $ OptionChange
                                [ Tuple "Cancel" Cancel
                                , Tuple "Save"   Save
                                ]
                        else
                            H.raise $ OptionChange
                                [ Tuple "New Chapter" NewChapter ] 

                -- TODO: type sig causes an error
                retrieveChapter :: forall scope e. AccessToken (driveReadOnly :: DriveReadOnlyScope | scope) -> String -> Int -> Aff (ajax :: AJAX | e) LocalChapter
                retrieveChapter accessToken docId order = do
                    chapterResponse <- getChapterHtmlFromGDocs accessToken docId
                    either 
                        (\err -> throwError $ error $ "Failed to parse chapter: " <> show err) 
                        (pure <<< over Chapter (_ { order = order, docId = docId }))
                        (runExcept $ parseChapter chapterResponse.response)

                


