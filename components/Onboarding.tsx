

import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { parseReference } from '../utils/referenceParser';
import type { KnowledgeLevel } from '../types';
import { EventSelectorModal } from './EventSelectorModal';
import { ReferenceSelectorModal } from './ReferenceSelectorModal';

type StudyPath = 'passage' | 'topic' | 'story' | 'systematic';

export const Onboarding: React.FC = () => {
    const { handleNewStudy, showToast, isLoading, t } = useAppContext();
    const [selectedPath, setSelectedPath] = useState<StudyPath | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [isEventSelectorOpen, setIsEventSelectorOpen] = useState(false);
    const [isReferenceSelectorOpen, setIsReferenceSelectorOpen] = useState(false);

    const studyPaths: { id: StudyPath; icon: React.ReactNode; title: string; description: string }[] = [
        {
            id: 'passage',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mb-4 text-accent-light">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
            ),
            title: t('verseAnalysis'),
            description: t('deepExegesis'),
        },
        {
            id: 'topic',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mb-4 text-accent-light">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                </svg>
            ),
            title: t('thematicStudy'),
            description: t('exploreTopics'),
        },
        {
            id: 'story',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mb-4 text-accent-light">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
            ),
            title: t('eventAnalysis'),
            description: t('analyzeNarratives'),
        },
        {
            id: 'systematic',
            icon: (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mb-4 text-accent-light">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0h9.75m-9.75-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                </svg>
            ),
            title: t('guidedStudy'),
            description: t('structuredLearning')
        }
    ];

    const suggestions: Record<Exclude<StudyPath, 'systematic' | 'story' | 'passage'>, string[]> = {
        topic: ['Grace', 'The Trinity', 'What is justification?'],
    };

    const handlePathSelect = (pathId: StudyPath) => {
        if (pathId === 'story') {
            setIsEventSelectorOpen(true);
        } else if (pathId === 'passage') {
            setIsReferenceSelectorOpen(true);
        } else {
            setSelectedPath(pathId);
            setInputValue('');
        }
    };

    const handleEventSelect = (selectedEvent: string) => {
        setIsEventSelectorOpen(false);
        if (isLoading) {
            showToast("Please wait for the current analysis to finish loading.");
            return;
        }
        handleNewStudy({ mode: 'event', event: selectedEvent });
    };

    const handleReferenceSelect = (selection: { book: string, chapter: number, startVerse: number, endVerse: number }) => {
        setIsReferenceSelectorOpen(false);
        if (isLoading) {
            showToast("Please wait for the current analysis to finish loading.");
            return;
        }
        handleNewStudy({ mode: 'reference', ...selection });
    };
    
    const handleBack = () => {
        setSelectedPath(null);
    };

    const handleSubmit = (e?: React.FormEvent, value?: string) => {
        if (e) e.preventDefault();
        const finalValue = value || inputValue;
        if (!finalValue.trim() || isLoading) return;

        let studyItem;
        if (selectedPath === 'topic') {
            const isQuestion = finalValue.trim().endsWith('?') || /^(what|who|where|when|why|how|is|are|do|does|can|should|will|which|whom)\b/i.test(finalValue.trim());
            if (isQuestion) {
                studyItem = { mode: 'qa', question: finalValue };
            } else {
                studyItem = { mode: 'topic', topic: finalValue };
            }
        }
        
        if (studyItem) {
            handleNewStudy(studyItem);
        }
    };
    
    const handleGuidedStudySelect = (level: KnowledgeLevel) => {
        if (isLoading) return;
        handleNewStudy({ mode: 'systematic', level, topic: 'Full Study Plan' });
    }
    
    const renderInput = () => {
        if (selectedPath === 'systematic') {
            return (
                <div className="w-full max-w-2xl mx-auto animate-fade-in text-left">
                    <button onClick={handleBack} className="flex items-center gap-2 text-sm text-text-muted hover:text-accent-light mb-8 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                        Back to Study Options
                    </button>
                    <label className="block text-2xl font-semibold text-text-main mb-4">Choose Your Knowledge Level</label>
                    <div className="flex flex-col sm:flex-row gap-4">
                        {(['Beginner', 'Intermediate', 'Advanced'] as KnowledgeLevel[]).map(level => (
                             <button
                                key={level}
                                onClick={() => handleGuidedStudySelect(level)}
                                className="w-full text-center px-4 py-3 text-lg font-semibold rounded-lg transition-all bg-primary/50 border border-gray-600 text-text-main hover:bg-accent hover:text-white hover:border-accent-light focus:outline-none focus:ring-2 focus:ring-accent"
                                >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>
            );
        }
        
        let placeholder = '';
        let title = '';
        if (selectedPath === 'topic') {
            title = 'Enter a Topic or Question';
            placeholder = 'e.g., "Faith" or "What is the purpose of the law?"';
        }

        return (
            <div className="w-full max-w-2xl mx-auto animate-fade-in text-left">
                 <button onClick={handleBack} className="flex items-center gap-2 text-sm text-text-muted hover:text-accent-light mb-8 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                    Back to Study Options
                </button>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block text-2xl font-semibold text-text-main mb-3">{title}</label>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-primary/50 border border-gray-600 rounded-lg p-4 text-text-main text-lg focus:ring-2 focus:ring-accent focus:border-accent transition"
                        autoFocus
                    />
                    
                    <div className="pt-2">
                        <p className="text-xs text-text-muted mb-2">Or, try one of these popular starting points:</p>
                        <div className="flex flex-wrap gap-2">
                            {selectedPath && suggestions[selectedPath as Exclude<StudyPath, 'systematic' | 'story' | 'passage'>]?.map(suggestion => (
                                <button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => handleSubmit(undefined, suggestion)}
                                    className="px-3 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 bg-primary/50 text-text-muted hover:bg-secondary/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary/95 focus:ring-accent-light"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading || !inputValue.trim()}
                        className="!mt-8 w-full flex items-center justify-center bg-gradient-to-r from-accent to-secondary-accent text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed group shadow-lg shadow-violet-500/30 hover:shadow-violet-400/50 hover:scale-[1.02]"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>
                        Analyze
                    </button>
                </form>
            </div>
        );
    };
    
    return (
        <div className="bg-secondary/50 border border-gray-700/50 p-8 rounded-xl shadow-lg text-center">
            {!selectedPath ? (
                <div className="animate-fade-in">
                    <h2 className="text-3xl font-bold text-text-main mb-4">{t('howToStudy')}</h2>
                    <p className="text-text-muted max-w-3xl mx-auto mb-10">{t('chooseStartingPoint')}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {studyPaths.map(path => (
                           <button 
                                key={path.id} 
                                onClick={() => handlePathSelect(path.id)}
                                className="flex flex-col items-center bg-primary/40 p-6 rounded-lg border border-gray-700/60 text-center transition-all duration-200 hover:border-accent hover:bg-primary/80 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent"
                            >
                               {path.icon}
                               <h3 className="font-bold text-lg text-text-main mb-2">{path.title}</h3>
                               <p className="text-sm text-text-muted">{path.description}</p>
                           </button>
                        ))}
                    </div>
                </div>
            ) : (
                renderInput()
            )}
            <EventSelectorModal
                isOpen={isEventSelectorOpen}
                onClose={() => setIsEventSelectorOpen(false)}
                onSelect={handleEventSelect}
            />
            <ReferenceSelectorModal
                isOpen={isReferenceSelectorOpen}
                onClose={() => setIsReferenceSelectorOpen(false)}
                onSelect={handleReferenceSelect}
            />
        </div>
    );
};
