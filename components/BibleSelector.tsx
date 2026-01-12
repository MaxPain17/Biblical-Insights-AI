

import React, { useState, useMemo } from 'react';
import { BIBLE_DATA } from '../bibleData';
import { INVALID_SEARCH_TOPICS } from '../constants';
import { CATEGORIZED_STORY_ARCS } from '../storyArcs';
import { CATEGORIZED_TOPICS } from '../theologicalTopics';
import { SYSTEMATIC_STUDY_TOPICS } from '../systematicTopics';
import type { AnalysisMode, KnowledgeLevel } from '../types';
import { useAppContext } from '../context/AppContext';
import { translations, bookTranslations } from '../utils/translations';
import { EventSelectorModal } from './EventSelectorModal';
import { ReferenceSelectorModal } from './ReferenceSelectorModal';
import { createPortal } from 'react-dom';

export const BibleSelector: React.FC = () => {
    const {
        mode, setMode, selectedBook, setSelectedBook, selectedChapter, setSelectedChapter,
        startVerse, setStartVerse, endVerse, setEndVerse, expandToPassage, setExpandToPassage,
        topic, setTopic, question, setQuestion, event, setEvent, storyArc, setStoryArc,
        handleAnalyze, isLoading, handleNewStudy, t, language,
    } = useAppContext();

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isStoryPopupOpen, setIsStoryPopupOpen] = useState(false);
    const [isStoryArcPopupOpen, setIsStoryArcPopupOpen] = useState(false);
    const [isTopicPopupOpen, setIsTopicPopupOpen] = useState(false);
    const [topicSearchQuery, setTopicSearchQuery] = useState('');
    const [systematicStudyLevel, setSystematicStudyLevel] = useState<KnowledgeLevel>('Beginner');

    const isFormValid = useMemo(() => {
        switch (mode) {
            case 'reference':
            case 'event':
            case 'storyArc':
            case 'systematic':
                return true;
            case 'topic': {
                const trimmedTopic = topic.trim();
                if (trimmedTopic.length < 2) return false;
                if (INVALID_SEARCH_TOPICS.has(trimmedTopic.toLowerCase())) return false;
                return true;
            }
            case 'qa':
                return question.trim().length >= 5;
            default:
                return false;
        }
    }, [mode, topic, question]);

    const modeDetails = {
        reference: {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
            ),
            text: t('verseAnalysis'),
            description: t('deepExegesis'),
        },
        topic: {
            icon: (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                </svg>
            ),
            text: t('thematicStudy'),
            description: t('exploreTopics'),
        },
        event: {
            icon: (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
            ),
            text: t('eventAnalysis'),
            description: t('analyzeNarratives'),
        },
        storyArc: {
            icon: (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                </svg>
            ),
            text: t('storyArc'),
            description: t('exploreTimelines'),
        },
        systematic: {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0h9.75m-9.75-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                </svg>
            ),
            text: t('guidedStudy'),
            description: t('structuredLearning'),
        },
        qa: { icon: <></>, text: '', description: '' }, // Keep for type consistency, but won't be rendered.
    };

    const studyCategories = {
        exegetical: {
            title: t('exegesis'),
            description: t('verseByVerse'),
            modes: ['reference'] as AnalysisMode[],
        },
        topical: {
            title: t('topicalExploration'),
            description: t('conceptAndNarrative'),
            modes: ['topic', 'event', 'storyArc'] as AnalysisMode[],
        },
        guided: {
            title: t('guidedLearning'),
            description: t('structuredStudy'),
            modes: ['systematic'] as AnalysisMode[],
        }
    };

    const filteredTopics = useMemo(() => {
        if (!topicSearchQuery.trim()) {
            return CATEGORIZED_TOPICS;
        }
        const lowercasedQuery = topicSearchQuery.toLowerCase();
        return CATEGORIZED_TOPICS
            .map(category => ({
                ...category,
                topics: category.topics.filter(t => t.toLowerCase().includes(lowercasedQuery)),
            }))
            .filter(category => category.topics.length > 0);
    }, [topicSearchQuery]);
    
    const handleReferenceSelection = (selection: { book: string, chapter: number, startVerse: number, endVerse: number }) => {
        setSelectedBook(selection.book);
        setSelectedChapter(selection.chapter);
        setStartVerse(selection.startVerse);
        setEndVerse(selection.endVerse);
        setIsPopupOpen(false);
    };

    const handleThematicInputChange = (newInput: string) => {
        const isQuestion = newInput.trim().endsWith('?') || /^(what|who|where|when|why|how|is|are|do|does|can|should|will|which)\b/i.test(newInput.trim());
        if (isQuestion) {
            setQuestion(newInput);
            setTopic('');
            setMode('qa');
        } else {
            setTopic(newInput);
            setQuestion('');
            setMode('topic');
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'systematic') {
            handleNewStudy({ mode: 'systematic', level: systematicStudyLevel, topic: 'Full Study Plan' });
        } else {
            handleAnalyze();
        }
    };
        
    const getButtonText = () => {
        switch (mode) {
            case 'reference': return t(startVerse === endVerse && expandToPassage ? 'analyzePassage' : 'analyzeReference');
            case 'topic': return t('analyzeTopic');
            case 'qa': return t('analyzeQuestion');
            case 'event': return t('analyzeEvent');
            case 'storyArc': return t('analyzeStoryArc');
            case 'systematic': return `${t('startGuidedStudy')}: ${systematicStudyLevel}`;
            default: return 'Analyze';
        }
    };
    
    const getReferenceString = () => {
        const bookName = bookTranslations[language]?.[selectedBook] || selectedBook;
        if (startVerse === endVerse) {
            return `${bookName} ${selectedChapter}:${startVerse}`;
        }
        return `${bookName} ${selectedChapter}:${startVerse}-${endVerse}`;
    }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-accent-light">{t('newStudy')}</h2>
      
      {Object.values(studyCategories).map(category => (
        <div key={category.title}>
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">{t(category.title as keyof typeof translations.en)}</h3>
            <div className="grid grid-cols-1 gap-2">
                {category.modes.map(key => {
                    const details = modeDetails[key as Exclude<AnalysisMode, 'chat'>];
                    if (!details.text) return null;
                    return (
                        <button 
                            key={key}
                            onClick={() => setMode(key)} 
                            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                                mode === key || (key === 'topic' && mode === 'qa')
                                    ? 'bg-accent/20 border-accent' 
                                    : 'bg-primary/50 border-gray-700/60 hover:border-accent/50'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`text-accent ${mode !== key && !(key === 'topic' && mode === 'qa') ? 'opacity-70' : ''}`}>
                                    {details.icon}
                                </div>
                                <div>
                                    <p className="font-bold text-text-main">{details.text}</p>
                                    <p className="text-sm text-text-muted mt-0.5">{details.description}</p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
      ))}

      {mode === 'reference' && (
        <div className="relative space-y-4">
            <div>
                <label className="block text-sm font-medium text-text-muted mb-1">{t('reference')}</label>
                <button
                onClick={() => { setIsPopupOpen(true); }}
                className="w-full bg-primary/50 border border-gray-700/60 rounded-lg p-2.5 text-left focus:ring-2 focus:ring-accent focus:border-accent transition flex justify-between items-center text-text-main hover:bg-primary/80"
                >
                <span className="font-medium text-lg">{getReferenceString()}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-text-muted">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
                </button>
            </div>
            
            <div>
                <label htmlFor="expand-toggle" className="flex items-center justify-between cursor-pointer group">
                    <span className="flex flex-col">
                        <span className="text-sm font-medium text-text-main group-hover:text-accent-light transition-colors">Expand to full passage</span>
                        <span className="text-sm text-text-muted">Automatically find the complete paragraph context.</span>
                    </span>
                    <div className="relative">
                        <input 
                            type="checkbox" 
                            id="expand-toggle" 
                            className="sr-only" 
                            checked={expandToPassage} 
                            onChange={(e) => setExpandToPassage(e.target.checked)}
                            disabled={startVerse !== endVerse}
                        />
                        <div className={`block w-12 h-6 rounded-full transition-colors ${expandToPassage && startVerse === endVerse ? 'bg-accent' : 'bg-gray-600'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${expandToPassage && startVerse === endVerse ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                </label>
                <p className="text-sm text-text-muted mt-2 pl-1 italic">Note: Analysis is best with 1-15 verses.</p>
            </div>

            <ReferenceSelectorModal
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                onSelect={handleReferenceSelection}
            />
        </div>
      )}

      {(mode === 'topic' || mode === 'qa') && (
        <div className="relative">
            <label htmlFor="topic-input" className="block text-sm font-medium text-text-muted mb-1">Enter a Topic or Ask a Question</label>
            <div className="flex gap-2">
                <input
                    id="topic-input"
                    type="text"
                    value={mode === 'topic' ? topic : question}
                    onChange={(e) => handleThematicInputChange(e.target.value)}
                    placeholder="e.g., 'Faith' or 'What is the meaning of grace?'"
                    className="flex-grow bg-primary/50 border border-gray-700/60 rounded-lg p-2.5 text-text-main focus:ring-2 focus:ring-accent focus:border-accent transition"
                />
                <button
                    onClick={() => setIsTopicPopupOpen(true)}
                    className="flex-shrink-0 bg-primary/50 border border-gray-700/60 rounded-lg px-3 py-2.5 text-text-muted hover:text-text-main hover:border-accent/50 focus:ring-2 focus:ring-accent focus:border-accent transition flex items-center gap-2"
                    aria-label="Browse categorized topics"
                    title="Browse categorized topics"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 8.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                    </svg>
                    <span className="text-sm font-medium">Browse</span>
                </button>
            </div>
            {isTopicPopupOpen && createPortal(
                <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" onClick={() => setIsTopicPopupOpen(false)}></div>
                    <div className="relative bg-secondary/95 backdrop-blur-xl border-t md:border border-gray-700/60 rounded-t-2xl md:rounded-xl shadow-2xl w-full md:w-[800px] flex flex-col max-h-[90vh] md:h-[700px] transition-transform duration-300 ease-out transform translate-y-0">
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-600 rounded-full md:hidden"></div>
                        <div className="flex justify-between items-center p-4 pt-6 md:pt-4 border-b border-gray-700 flex-shrink-0">
                            <h2 className="text-lg font-bold text-accent-light">Select a Theological Topic</h2>
                            <button onClick={() => setIsTopicPopupOpen(false)} className="text-text-muted hover:text-white bg-primary/50 p-1.5 rounded-full transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 border-b border-gray-700">
                            <input
                                type="text"
                                value={topicSearchQuery}
                                onChange={(e) => setTopicSearchQuery(e.target.value)}
                                placeholder="Search topics..."
                                className="w-full bg-primary/50 border border-gray-600 rounded-lg px-4 py-2 text-text-main focus:ring-2 focus:ring-accent focus:border-accent transition"
                                autoFocus
                            />
                        </div>
                        <div className="overflow-y-auto custom-scrollbar p-4">
                            {filteredTopics.map((category) => (
                                <div key={category.title} className="mb-8">
                                    <h2 className={`text-xl font-bold text-text-main mb-4 pl-4 border-l-4 ${category.color}`}>{category.title}</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pl-4">
                                        {category.topics.map(t => (
                                            <button 
                                                key={t}
                                                onClick={() => {
                                                    handleThematicInputChange(t);
                                                    setIsTopicPopupOpen(false);
                                                    setTopicSearchQuery(''); // Reset search
                                                }}
                                                className="w-full text-left text-sm p-2 rounded-md transition-colors text-text-main hover:bg-primary/60 focus:outline-none focus:ring-2 focus:ring-accent"
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                             {filteredTopics.length === 0 && (
                                <div className="text-center py-10 text-text-muted">
                                    <p>No topics found for "{topicSearchQuery}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
      )}
      
      {mode === 'event' && (
        <div className="relative">
            <label htmlFor="event-select" className="block text-sm font-medium text-text-muted mb-1">Select an Event</label>
            <button
                id="event-select"
                onClick={() => setIsStoryPopupOpen(true)}
                className="w-full bg-primary/50 border border-gray-700/60 rounded-lg p-2.5 text-left focus:ring-2 focus:ring-accent focus:border-accent transition flex justify-between items-center text-text-main"
            >
                <span>{event}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-text-muted">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </button>
            <EventSelectorModal
                isOpen={isStoryPopupOpen}
                onClose={() => setIsStoryPopupOpen(false)}
                onSelect={(selectedEvent) => {
                    setEvent(selectedEvent);
                    setIsStoryPopupOpen(false);
                }}
            />
        </div>
      )}

      {mode === 'storyArc' && (
         <div className="relative">
            <label htmlFor="storyarc-select" className="block text-sm font-medium text-text-muted mb-1">Select a Narrative Arc</label>
            <button
                id="storyarc-select"
                onClick={() => setIsStoryArcPopupOpen(true)}
                className="w-full bg-primary/50 border border-gray-700/60 rounded-lg p-2.5 text-left focus:ring-2 focus:ring-accent focus:border-accent transition flex justify-between items-center text-text-main"
            >
                <span>{storyArc}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-text-muted">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </button>
            {isStoryArcPopupOpen && createPortal(
                <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" onClick={() => setIsStoryArcPopupOpen(false)}></div>
                    <div className="relative bg-secondary/95 backdrop-blur-xl border-t md:border border-gray-700/60 rounded-t-2xl md:rounded-xl shadow-2xl w-full md:w-[800px] flex flex-col max-h-[90vh] md:h-[700px] transition-transform duration-300 ease-out transform translate-y-0">
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-600 rounded-full md:hidden"></div>
                        <div className="flex justify-between items-center p-4 pt-6 md:pt-4 border-b border-gray-700 flex-shrink-0">
                            <h2 className="text-lg font-bold text-accent-light">Select a Narrative Arc</h2>
                            <button onClick={() => setIsStoryArcPopupOpen(false)} className="text-text-muted hover:text-white bg-primary/50 p-1.5 rounded-full transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="overflow-y-auto custom-scrollbar p-4">
                            {(() => {
                                let arcCounter = 0;
                                return CATEGORIZED_STORY_ARCS.map((category) => (
                                    <div key={category.title} className="mb-8">
                                        <h2 className={`text-xl font-bold text-text-main mb-4 pl-4 border-l-4 ${category.color}`}>{category.title}</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pl-4">
                                            {category.arcs.map(arc => {
                                                arcCounter++;
                                                return (
                                                    <button 
                                                        key={arc}
                                                        onClick={() => {
                                                            setStoryArc(arc);
                                                            setIsStoryArcPopupOpen(false);
                                                        }}
                                                        className="w-full text-left text-sm p-2 rounded-md transition-colors text-text-main hover:bg-primary/60 focus:outline-none focus:ring-2 focus:ring-accent flex items-start gap-2"
                                                    >
                                                        <span className="font-mono text-xs text-text-muted w-6 text-right pt-0.5">{arcCounter}.</span>
                                                        <span className="flex-1">{arc}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
       )}
       
       {mode === 'systematic' && (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-text-muted">Select Knowledge Level</label>
            <div className="flex justify-center bg-primary/40 p-1 rounded-lg">
                {(['Beginner', 'Intermediate', 'Advanced'] as KnowledgeLevel[]).map(level => (
                    <button
                        key={level}
                        onClick={() => setSystematicStudyLevel(level)}
                        className={`w-full text-center px-4 py-2 text-sm font-semibold rounded-md transition-colors ${systematicStudyLevel === level ? 'bg-accent text-white shadow' : 'text-text-muted hover:text-white'}`}
                    >
                        {level}
                    </button>
                ))}
            </div>
            <p className="text-sm text-text-muted text-center px-2">
                {SYSTEMATIC_STUDY_TOPICS.find(cat => cat.level === systematicStudyLevel)?.introduction}
            </p>
        </div>
       )}

      <button
        onClick={handleSubmit}
        disabled={isLoading || !isFormValid}
        className="w-full flex items-center justify-center bg-gradient-to-r from-accent to-secondary-accent text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed group shadow-lg shadow-violet-500/30 hover:shadow-violet-400/50 hover:scale-[1.02]"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
            <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                </svg>
                {getButtonText()}
            </>
        )}
      </button>
    </div>
  );
};
