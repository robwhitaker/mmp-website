module Editor.Components.ChapterSync where

import Prelude
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Control.Alt (map, (<$>), (<|>))
import Control.Monad.Aff (Aff)
import Control.Monad.Aff.Console (CONSOLE, log)
import Control.MonadPlus (class Plus)
import Data.Array (catMaybes, filter, length, mapWithIndex, replicate, updateAt, zipWith, (!!))
import Data.Bifunctor (lmap, rmap)
import Data.DateTime (DateTime(..))
import Data.DateTime.Locale (LocalDateTime, LocalValue(..))
import Data.Eq (class Eq)
import Data.Maybe (Maybe(..), fromJust, fromMaybe, isJust, maybe)
import Data.Monoid (class Monoid)
import Data.Newtype (class Newtype, over, unwrap)
import Data.String (joinWith, null)
import Data.Tuple (Tuple(..), fst, snd)
import Editor.Data.DateTime.Utils (formatReadable)
import Editor.Models.Chapter (Chapter(..), LocalChapter, LocalOptionalEntryChapter)
import Editor.Models.Entry (Entry(..), LocalEntry, empty)
import Editor.Utils.Array (normalizeArrays, swap)
import Editor.Utils.ModelHelpers (copyCommonMetadata)
import Editor.Utils.Parser (stripTags)
import Halogen (Action)

type State =
    { chapterOriginal :: LocalOptionalEntryChapter
    , chapter :: LocalOptionalEntryChapter
    }

data Query a 
    = Initialize a
    | Continue a
    | Cancel a
    | MoveEntry Int Int a
    | DeleteEntry Int a

type Input = Unit

data Message 
    = GoToMetadataEditor LocalChapter
    | GoToChapterList
    | OptionChange (Array (Tuple String (Action Query)))

type AppEffects eff = Aff
    ( console :: CONSOLE
    | eff
    )

chapterSync :: forall eff. LocalChapter -> LocalChapter -> H.Component HH.HTML Query Input Message (AppEffects eff)
chapterSync chapterOriginal chapter = 
    H.lifecycleComponent
        { initialState: const initialState
        , render
        , eval
        , receiver: const Nothing
        , initializer: Just (H.action Initialize)
        , finalizer: Nothing
        }
  where
        initialState = 
            { chapterOriginal : over Chapter (_ { entries = fst paddedEntries }) chapterOriginal
            , chapter : over Chapter (_ { entries = snd paddedEntries }) chapter
            }
          where paddedEntries = normalizeArrays (map Just (unwrap chapterOriginal).entries) (map Just (unwrap chapter).entries)

        render :: State -> H.ComponentHTML Query
        render state =
            HH.div
                [ HP.id_ "chapter-sync" ] 
                [ HH.div 
                    [ HP.class_ (H.ClassName "tile chapter-sync-chapter") ] 
                    [ HH.span_ [ HH.text $ maybe "(!!)" show (unwrap state.chapterOriginal).id ]
                    , HH.h1_ 
                        [ if (unwrap state.chapterOriginal).isInteractive
                          then HH.i [ HP.class_ (H.ClassName "fa fa-gamepad"), HP.attr (H.AttrName "aria-hidden") "true" ] []
                          else HH.span_ []
                        , HH.text $ stripTags (unwrap state.chapter).title 
                        ]
                    , HH.p [ HP.class_ (H.ClassName "data-row") ] $
                        [ releaseDateIcon
                        , HH.text $ maybe "Not scheduled" formatReadable (unwrap state.chapterOriginal).releaseDate
                        ] <> if (unwrap state.chapterOriginal).isInteractive && not (null (unwrap state.chapterOriginal).interactiveUrl) 
                                then [ interactiveUrlIcon, HH.text (unwrap state.chapterOriginal).interactiveUrl ]
                                else []
                    , HH.div
                        [ HP.class_ (H.ClassName "metadata-box-container") ] $ catMaybes
                        [ if null (unwrap state.chapterOriginal).authorsNote
                          then Nothing
                          else Just $
                               HH.div_ 
                                    [ HH.h2_ [ HH.text "Author's Note" ]
                                    , HH.div_ [ HH.text (unwrap state.chapterOriginal).authorsNote ] 
                                    ]
                        , if null (unwrap state.chapterOriginal).interactiveData || not ((unwrap state.chapterOriginal).isInteractive)
                          then Nothing
                          else Just $
                                HH.div_ 
                                    [ HH.h2_ [ HH.text "Interactive Data" ]
                                    , HH.div_ [ HH.text (unwrap state.chapterOriginal).interactiveData ] 
                                    ]                               
                        ]
                    ]
                , HH.table_ $
                    mapWithIndex (#) $ zipWith (\old new -> \i -> 
                        HH.tr [HP.attr (H.AttrName "style") "border: 1px solid black;"]
                            [ HH.td 
                                [ HP.class_ (H.ClassName "tile original-chapter") ]
                                case old of
                                    Nothing -> []
                                    Just (Entry entry) -> 
                                        [ HH.div
                                            [ HP.class_ (H.ClassName "control-row") ]
                                            [ HH.span_ [ HH.text $ maybe "(!!)" show entry.id ]
                                            , HH.div 
                                                [ HP.class_ (H.ClassName "chapter-controls") ]
                                                [ HH.i 
                                                    [ HP.class_ (H.ClassName "fa fa-arrow-up")
                                                    , HP.attr (H.AttrName "aria-hidden") "true"
                                                    , HE.onClick $ HE.input_ (MoveEntry i (i-1))
                                                    ] []
                                                , HH.i 
                                                    [ HP.class_ (H.ClassName "fa fa-arrow-down")
                                                    , HP.attr (H.AttrName "aria-hidden") "true"
                                                    , HE.onClick $ HE.input_ (MoveEntry i (i+1))
                                                    ] []
                                                , HH.i 
                                                    [ HP.class_ (H.ClassName "fa fa-trash")
                                                    , HP.attr (H.AttrName "aria-hidden") "true"
                                                    , HE.onClick $ HE.input_ (DeleteEntry i)
                                                    ] []                                                
                                                ]
                                            , HH.div_ []
                                            ]
                                        , HH.h2_ 
                                            [ if entry.isInteractive
                                              then interactiveIcon
                                              else HH.span_ []
                                            , HH.text $ stripTags entry.title
                                            ]
                                        , HH.p [ HP.class_ (H.ClassName "data-row") ] $
                                            [ releaseDateIcon
                                            , HH.text $ maybe "Not scheduled" formatReadable entry.releaseDate
                                            ] <> if entry.isInteractive && not (null entry.interactiveUrl) 
                                                 then [ interactiveUrlIcon, HH.text entry.interactiveUrl ]
                                                 else []
                                        , HH.div
                                            [ HP.class_ (H.ClassName "metadata-box-container") ] $ catMaybes
                                            [ if null entry.authorsNote
                                              then Nothing
                                              else Just $
                                                HH.div_ 
                                                    [ HH.h3_ [ HH.text "Author's Note" ]
                                                    , HH.div_ [ HH.text entry.authorsNote ] 
                                                    ]
                                            , if null entry.interactiveData || not (entry.isInteractive)
                                              then Nothing
                                              else Just $
                                                    HH.div_ 
                                                        [ HH.h3_ [ HH.text "Interactive Data" ]
                                                        , HH.div_ [ HH.text entry.interactiveData ] 
                                                        ]                               
                                            ]
                                        ]
                                    
                            , HH.td 
                                [ HP.class_ (H.ClassName "arrow-col") ]
                                [ HH.i [ HP.class_ (H.ClassName "fa fa-long-arrow-right"), HP.attr (H.AttrName "aria-hidden") "true" ] [] ]
                            , HH.td 
                                [ HP.class_ (H.ClassName "tile imported-chapter") ] 
                                [ HH.h2_ [ HH.text $ maybe "" (unwrap >>> _.title >>> stripTags) new ] ]
                            ]                    
                    ) (unwrap state.chapterOriginal).entries (unwrap state.chapter).entries
                ]
          where interactiveIcon = HH.i [ HP.class_ (H.ClassName "fa fa-gamepad"), HP.attr (H.AttrName "aria-hidden") "true" ] []
                releaseDateIcon = HH.i [ HP.class_ (H.ClassName "fa fa-calendar"), HP.attr (H.AttrName "aria-hidden") "true" ] []
                interactiveUrlIcon = HH.i [ HP.class_ (H.ClassName "fa fa-link"), HP.attr (H.AttrName "aria-hidden") "true" ] []

        eval :: Query ~> H.ComponentDSL State Query Message (AppEffects eff)
        eval = case _ of
            Initialize next -> do
                H.raise $ OptionChange
                    [ Tuple "Cancel" Cancel                       
                    , Tuple "Continue" Continue 
                    ]
                pure next

            Continue next -> do
                state <- H.get
                let newChapter = copyCommonMetadata (unwrap state.chapterOriginal) (unwrap state.chapter)
                let entriesWithChapterId = map (map \(Entry entry) -> 
                        entry { chapterId = fromMaybe (-1) newChapter.id }
                    ) (unwrap state.chapter).entries
                let newEntries = catMaybes $ zipWith (\old new -> map Entry $ copyCommonMetadata <$> old <*> new <|> new) 
                                                     (map (map unwrap) (unwrap state.chapterOriginal).entries)
                                                     entriesWithChapterId
                H.raise $ GoToMetadataEditor $ Chapter newChapter { entries = newEntries }
                pure next

            Cancel next -> do
                H.raise GoToChapterList
                pure next

            MoveEntry baseIndex swapIndex next -> do
                H.modify \state -> fromMaybe state do
                    newEntries <- swap baseIndex swapIndex (unwrap state.chapterOriginal).entries
                    pure $ state { chapterOriginal = over Chapter (_ { entries = newEntries }) state.chapterOriginal }
                pure next

            DeleteEntry index next -> do 
                H.modify \state -> fromMaybe state do
                    newEntries <- updateAt index Nothing (unwrap state.chapterOriginal).entries
                    pure $ state 
                        { chapterOriginal = 
                            over Chapter (_ { entries = newEntries }) state.chapterOriginal
                        }
                pure next
