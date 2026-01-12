
import React, { useState } from 'react';
import { exportVerseAnalysisToDocx } from '../services/exportService';
import type { VerseAnalysis } from '../types';
import { ClickableText } from './ClickableText';

interface VerseDisplayProps {
  book: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
  analysis: VerseAnalysis;
  onAnalyzeFullPassage: () => void;
  onAnalyzeNext: () => void;
  onAnalyzePrevious: () => void;
  isLoading: boolean;
  onReferenceSelect: (reference: string) => void;
  onThemeSelect?: (theme: string) => void;
  onStartChat: (subject: string) => void;
}

export const VerseDisplay: React.FC<VerseDisplayProps> = ({ 
    book, 
    chapter, 
    startVerse, 
    endVerse, 
    analysis, 
    onAnalyzeFullPassage, 
    onAnalyzeNext,
    onAnalyzePrevious,
    isLoading, 
    onReferenceSelect,
    onThemeSelect,
    onStartChat
}) => {
    const { verseText, verses } = analysis;
    const [isExporting, setIsExporting] = useState(false);
    const isMultiVerse = startVerse !== endVerse;

    const handleExport = () => {
        if (!analysis.verseText) return; // Can't export without text
        setIsExporting(true);
        try {
            exportVerseAnalysisToDocx(analysis as Required<VerseAnalysis>, { book, chapter, startVerse, endVerse });
        } catch (e) {
            console.error("Export failed", e);
        } finally {
            setTimeout(() => setIsExporting(false), 1000);
        }
    };
    
    const referenceString = startVerse === endVerse 
        ? `${book} ${chapter}:${startVerse}` 
        : `${book} ${chapter}:${startVerse}-${endVerse}`;

    const bibleGatewayLink = `https://www.biblegateway.com/passage/?search=${encodeURIComponent(book)}+${chapter}&version=KJV`;

  return (
    <div className="bg-secondary/50 border border-gray-700/50 p-6 rounded-xl shadow-lg">
       <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-4">
                <h3 className="text-xl font-bold text-accent-light">{referenceString}</h3>
                 <a 
                    href={bibleGatewayLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-text-muted hover:text-accent-light transition-colors border border-gray-600 px-3 py-1.5 rounded-full bg-primary/50 hover:border-accent/50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                    </svg>
                    <span>Read Chapter</span>
                </a>
            </div>
            <div className="flex items-center gap-2">
                 <div className="flex-shrink-0 bg-primary/60 p-1 rounded-lg border border-gray-600/50 flex space-x-1">
                    <span className="px-3 py-1 text-sm font-semibold rounded-md bg-accent text-white shadow">KJV</span>
                </div>
                <button 
                    onClick={handleExport}
                    disabled={isExporting || !verseText}
                    className="flex items-center gap-2 text-sm font-medium flex-shrink-0 bg-primary/50 text-text-muted hover:bg-primary/80 hover:text-text-main px-3 py-1.5 rounded-lg border border-gray-600/50 transition-colors disabled:opacity-50 disabled:cursor-wait"
                    aria-label="Export to Word document"
                >
                    {isExporting ? (
                         <svg className="animate-spin h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                    )}
                    <span>{isExporting ? 'Exporting...' : 'Export'}</span>
                </button>
            </div>
        </div>
        
        {isMultiVerse && verses && verses.length > 0 ? (
            <div className="mt-4 space-y-3 text-lg text-text-main">
                {verses.map((v) => (
                    <div key={v.verse} className="flex items-start gap-3 group">
                        <span className="font-mono text-base text-text-muted/70 pt-1 select-none">[{v.verse}]</span>
                        <button
                            className="text-left italic hover:text-white transition-colors focus:outline-none focus:text-white"
                            onClick={() => onReferenceSelect(`${book} ${chapter}:${v.verse}`)}
                            aria-label={`Analyze verse ${v.verse}`}
                        >
                            <ClickableText text={v.text} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} as="span" />
                        </button>
                    </div>
                ))}
            </div>
        ) : (
            <blockquote className="mt-4 text-lg italic text-text-main relative pl-6">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent to-transparent"></div>
                 { verseText?.KJV ? (
                    <ClickableText text={`"${verseText.KJV}"`} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} as="span" />
                 ) : (
                    <div className="space-y-2 animate-pulse w-full not-italic">
                        <div className="h-4 bg-primary/80 rounded w-full"></div>
                        <div className="h-4 bg-primary/80 rounded w-5/6"></div>
                        <div className="h-4 bg-primary/80 rounded w-3/4"></div>
                    </div>
                 )}
            </blockquote>
        )}

        <div className="mt-6 pt-4 border-t border-gray-700/50 flex flex-wrap gap-4 justify-between items-center">
            <div className="flex items-center gap-2">
                <button 
                    onClick={onAnalyzePrevious}
                    disabled={isLoading}
                    aria-label="Analyze previous verse or passage"
                    className="flex items-center gap-2 bg-primary/50 hover:bg-primary/80 text-text-muted hover:text-text-main font-semibold py-2 px-3 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                    <span>Previous</span>
                </button>
                 <button 
                    onClick={onAnalyzeNext}
                    disabled={isLoading}
                    aria-label="Analyze next verse or passage"
                    className="flex items-center gap-2 bg-primary/50 hover:bg-primary/80 text-text-muted hover:text-text-main font-semibold py-2 px-3 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    <span>Next</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                </button>
            </div>
            {startVerse === endVerse && (
                <button 
                    onClick={onAnalyzeFullPassage}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-accent/20 hover:bg-accent/30 text-accent-light font-semibold py-2 px-4 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 transition-transform group-hover:scale-110">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M20.25 20.25v-4.5m0 4.5h-4.5m4.5 0L15 15m-6-6L3.75 20.25m16.5-16.5L9 9" />
                    </svg>
                    <span>Expand to full passage</span>
                </button>
            )}
        </div>
         <div className="mt-6 pt-6 border-t border-slate-700">
            <button
                onClick={() => onStartChat(referenceString)}
                disabled={!referenceString}
                className="w-full flex items-center justify-center gap-2 bg-accent/20 hover:bg-accent/30 text-accent-light font-semibold py-3 px-4 rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 transition-transform group-hover:scale-110">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.53-0.481M21 12a9.753 9.753 0 0 0-4.722-8.37l-1.028.917A48.455 48.455 0 0 0 12 4.5c-2.131 0-4.16.6-5.902 1.634l-1.028-.917A9.753 9.753 0 0 0 3 12m0 0a9.753 9.753 0 0 0 4.722 8.37l1.028-.917a48.455 48.455 0 0 0 5.902 1.634c.537.043 1.07.065 1.616.065 4.97 0 9-3.694 9-8.25Z" />
                </svg>
                Discuss this passage in a chat
            </button>
        </div>
    </div>
  );
};
