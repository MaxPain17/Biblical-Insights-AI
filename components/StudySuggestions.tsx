
import React from 'react';
import type { FunctionCall } from '@google/genai';
import { useAppContext } from '../context/AppContext';
import { parseReference } from '../utils/referenceParser';

interface StudySuggestionsProps {
  suggestions: FunctionCall[];
}

const suggestionConfig: Record<string, { icon: React.ReactNode; title: string; }> = {
    startVerseAnalysis: {
        icon: '📖',
        title: 'Deep Dive: Verse Analysis'
    },
    startThematicStudy: {
        icon: '💡',
        title: 'Deep Dive: Thematic Study'
    },
    startStoryArcAnalysis: {
        icon: '📈',
        title: 'Deep Dive: Story Arc'
    },
    startEventAnalysis: {
        icon: '📜',
        title: 'Deep Dive: Event Analysis'
    },
};

export const StudySuggestions: React.FC<StudySuggestionsProps> = ({ suggestions }) => {
    const { handleNewStudy, showToast } = useAppContext();

    const handleSuggestionClick = (suggestion: FunctionCall) => {
        const { name, args } = suggestion;

        switch(name) {
            case 'startVerseAnalysis':
                if (args.reference) {
                    const parsed = parseReference(args.reference as string);
                    if (parsed) {
                        handleNewStudy({ mode: 'reference', ...parsed });
                    } else {
                        showToast(`Could not parse reference: ${args.reference}`);
                    }
                }
                break;
            case 'startThematicStudy':
                if (args.topic) {
                    handleNewStudy({ mode: 'topic', topic: args.topic as string });
                }
                break;
            case 'startStoryArcAnalysis':
                if (args.arc) {
                    handleNewStudy({ mode: 'storyArc', storyArc: args.arc as string });
                }
                break;
            case 'startEventAnalysis':
                 if (args.event) {
                    handleNewStudy({ mode: 'event', event: args.event as string });
                }
                break;
            default:
                showToast(`Unknown suggestion type: ${name}`);
        }
    };
    
    if (!suggestions || suggestions.length === 0) {
        return null;
    }

    return (
        <div className="mt-4 pt-4 border-t border-gray-600/50">
            <p className="text-sm font-semibold text-text-muted mb-3">Want to go deeper?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestions.map((suggestion, index) => {
                    const config = suggestionConfig[suggestion.name];
                    if (!config) return null;

                    const detail = Object.values(suggestion.args)[0] as string;

                    return (
                        <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="group bg-primary/60 p-3 rounded-lg border border-slate-700 text-left transition-all duration-200 hover:border-accent hover:bg-secondary/60 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                             <div className="flex items-start gap-3">
                                <span className="text-xl mt-1">{config.icon}</span>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-xs font-bold uppercase tracking-wider text-accent">{config.title}</p>
                                    <p className="text-text-main truncate font-semibold mt-0.5">{detail}</p>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-text-muted"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
