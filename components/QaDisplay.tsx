
import React, { useState } from 'react';
import type { QaAnalysis } from '../types';
import { exportQaAnalysisToDocx } from '../services/exportService';
import { Tooltip } from './Tooltip';
import { TOOLTIP_DEFINITIONS } from '../tooltipContent';
import { ClickableText } from './ClickableText';
import { SectionSpinner } from './SectionSpinner';

interface QaDisplayProps {
  data: QaAnalysis;
  onReferenceSelect: (reference: string) => void;
  onThemeSelect: (theme: string) => void;
  onQuestionSelect: (question: string) => void;
  onStartChat: (subject: string) => void;
}

export const QaDisplay: React.FC<QaDisplayProps> = ({ data, onReferenceSelect, onThemeSelect, onQuestionSelect, onStartChat }) => {
    const [isExporting, setIsExporting] = useState(false);
    const { question, foundationalPrinciples, answer, addressingContradictions, historicalContext, theologicalPerspectives, keyConcepts, reflectionPoints, supportingVerses } = data;

    const allDataLoaded = answer && foundationalPrinciples && supportingVerses;

    const handleExport = () => {
        setIsExporting(true);
        try {
            exportQaAnalysisToDocx(data as Required<QaAnalysis>);
        } catch(e) {
            console.error("Export failed", e);
        } finally {
            setTimeout(() => setIsExporting(false), 1000);
        }
    };

    return (
        <div className="bg-secondary/50 border border-slate-700 p-6 rounded-xl shadow-lg space-y-8">
            <header className="pb-4 border-b border-slate-700 flex justify-between items-start">
                <div>
                    <p className="text-sm uppercase tracking-wider text-text-muted">Question</p>
                    {question ? (
                        <h2 className="text-3xl font-bold text-accent-light">{question}</h2>
                    ) : (
                        <div className="h-9 w-96 bg-primary/50 rounded-md animate-pulse mt-1"></div>
                    )}
                </div>
                <button 
                    onClick={handleExport}
                    disabled={isExporting || !allDataLoaded}
                    className="flex items-center gap-2 text-sm font-medium flex-shrink-0 bg-primary/50 text-text-muted hover:bg-primary/80 hover:text-text-main px-3 py-2 rounded-lg border border-slate-600 transition-colors disabled:opacity-50 disabled:cursor-wait"
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
            </header>
            
            {foundationalPrinciples ? (
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-xl font-semibold text-accent-light">Foundational Principles</h3>
                        <Tooltip text={TOOLTIP_DEFINITIONS.QA_PRINCIPLES} />
                    </div>
                    { foundationalPrinciples.length > 0 ? (
                        <div className="space-y-3 pl-8">
                            {foundationalPrinciples.map((item, index) => (
                                <div key={index} className="bg-primary/30 p-3 rounded-lg border-l-2 border-accent/50">
                                    <h5 className="font-bold text-sm text-accent-light uppercase tracking-wide mb-1">{item.principle}</h5>
                                    <ClickableText as="p" className="text-sm text-text-main" text={item.explanation} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} />
                                </div>
                            ))}
                        </div>
                    ) : <p className="pl-8 text-text-muted">No specific foundational principles identified.</p>}
                </section>
            ) : <SectionSpinner />}

            <section className={foundationalPrinciples ? "pt-6 border-t border-slate-700" : ""}>
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-accent-light flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                        </svg>
                        Answer
                    </h3>
                    <Tooltip text={TOOLTIP_DEFINITIONS.QA_ANSWER} />
                </div>
                {answer ? <ClickableText as="p" className="text-text-main leading-relaxed whitespace-pre-wrap pl-8" text={answer} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} /> : <SectionSpinner />}
            </section>
            
             {addressingContradictions && (
                <section className="pt-6 border-t border-slate-700">
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-xl font-semibold text-accent-light">Addressing Apparent Contradictions</h3>
                        <Tooltip text={TOOLTIP_DEFINITIONS.QA_CONTRADICTIONS} />
                    </div>
                     {addressingContradictions.length > 0 ? (
                        <div className="space-y-4 pl-8">
                            {addressingContradictions.map((item, index) => (
                                <div key={index} className="bg-primary/30 p-4 rounded-lg border border-gray-700">
                                    <h5 className="font-bold text-amber-400">Apparent Conflict: <ClickableText as="span" className="italic font-normal text-text-main" text={`"${item.apparentContradiction}"`} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} /></h5>
                                    <p className="text-sm text-text-main mt-2 pt-2 border-t border-gray-600">
                                        <span className="font-bold text-sky-400">Resolution:</span>{' '}
                                        <ClickableText as="span" text={item.resolution} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} />
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : <p className="pl-8 text-text-muted">No apparent contradictions were addressed for this question.</p>}
                </section>
            )}

            {historicalContext ? (
                <section className="pt-6 border-t border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-accent-light flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" /></svg>
                            Historical & Cultural Context
                        </h3>
                        <Tooltip text={TOOLTIP_DEFINITIONS.QA_HISTORICAL} />
                    </div>
                    <ClickableText as="p" className="text-text-main leading-relaxed pl-8" text={historicalContext} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} />
                </section>
            ): <SectionSpinner />}

             {theologicalPerspectives ? (
                <section className="pt-6 border-t border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-accent-light flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                            Theological Perspectives
                        </h3>
                        <Tooltip text={TOOLTIP_DEFINITIONS.QA_PERSPECTIVES} />
                    </div>
                    <ClickableText as="p" className="text-text-main leading-relaxed pl-8" text={theologicalPerspectives} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} />
                </section>
             ): <SectionSpinner />}

             {keyConcepts ? (
                <section className="pt-6 border-t border-slate-700">
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-xl font-semibold text-accent-light">Key Theological Concepts</h3>
                        <Tooltip text={TOOLTIP_DEFINITIONS.QA_CONCEPTS} />
                    </div>
                     {keyConcepts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-8">
                            {keyConcepts.map((item, index) => (
                                <button key={index} onClick={() => onThemeSelect(item.concept)} className="bg-primary/60 p-4 rounded-lg border border-slate-600 text-left transition-colors hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent">
                                    <h4 className="font-bold text-accent-light">{item.concept}</h4>
                                    <p className="text-text-muted text-sm mt-1">{item.definition}</p>
                                </button>
                            ))}
                        </div>
                    ) : <p className="pl-8 text-text-muted">No key concepts identified.</p>}
                </section>
            ): <SectionSpinner />}

            {reflectionPoints ? (
                <section className="pt-6 border-t border-slate-700">
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-xl font-semibold text-accent-light">Points for Reflection</h3>
                        <Tooltip text={TOOLTIP_DEFINITIONS.QA_REFLECTION} />
                    </div>
                     {reflectionPoints.length > 0 ? (
                        <ul className="space-y-3 pl-8">
                            {reflectionPoints.map((point, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-accent flex-shrink-0 mt-1"><path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" /></svg>
                                    <button onClick={() => onQuestionSelect(point)} className="text-left text-text-main hover:text-accent-light transition-colors">{point}</button>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="pl-8 text-text-muted">No reflection points provided.</p>}
                </section>
            ): <SectionSpinner />}

            {supportingVerses ? (
                <section className="pt-6 border-t border-slate-700">
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-xl font-semibold text-accent-light">Supporting Scripture</h3>
                        <Tooltip text={TOOLTIP_DEFINITIONS.QA_VERSES} />
                    </div>
                    {supportingVerses.length > 0 ? (
                        <div className="space-y-4">
                            {supportingVerses.map((item, index) => (
                                <button key={index} onClick={() => onReferenceSelect(item.reference)} aria-label={`View analysis for ${item.reference}`} className="w-full text-left bg-primary/60 p-4 rounded-lg border border-slate-700 transition-all duration-200 hover:border-accent hover:bg-secondary/60 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent">
                                    <h4 className="text-lg font-bold text-accent-light mb-2 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
                                        {item.reference}
                                    </h4>
                                    <blockquote className="border-l-4 border-slate-600 pl-4 italic text-text-main my-3">"{item.verseText}"</blockquote>
                                    <div>
                                        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Relevance</span>
                                        <ClickableText as="p" className="text-text-main mt-1" text={item.explanation} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : <SectionSpinner />}
                </section>
            ) : <SectionSpinner />}

             <div className="pt-8 border-t border-slate-700">
                <button
                    onClick={() => onStartChat(question || 'this question')}
                    disabled={!question}
                    className="w-full flex items-center justify-center gap-2 bg-accent/20 hover:bg-accent/30 text-accent-light font-semibold py-3 px-4 rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 transition-transform group-hover:scale-110"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.53-0.481M21 12a9.753 9.753 0 0 0-4.722-8.37l-1.028.917A48.455 48.455 0 0 0 12 4.5c-2.131 0-4.16.6-5.902 1.634l-1.028-.917A9.753 9.753 0 0 0 3 12m0 0a9.753 9.753 0 0 0 4.722 8.37l1.028-.917a48.455 48.455 0 0 0 5.902 1.634c.537.043 1.07.065 1.616.065 4.97 0 9-3.694 9-8.25Z" /></svg>
                    Ask a follow up question
                </button>
            </div>
        </div>
    );
};
