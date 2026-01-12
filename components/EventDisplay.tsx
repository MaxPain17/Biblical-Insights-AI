

import React, { useState } from 'react';
import type { EventAnalysis } from '../types';
import { exportEventAnalysisToDocx } from '../services/exportService';
import { WordAnalysis } from './WordAnalysis';
import { CrossReferenceAnalysis } from './CrossReferenceAnalysis';
import { Tooltip } from './Tooltip';
import { TOOLTIP_DEFINITIONS } from '../tooltipContent';
import { SectionSpinner } from './SectionSpinner';

interface EventDisplayProps {
  data: EventAnalysis;
  onReferenceSelect: (reference: string) => void;
  onThemeSelect: (theme: string) => void;
  onQuestionSelect: (question: string) => void;
  onStartChat: (subject: string) => void;
}

export const EventDisplay: React.FC<EventDisplayProps> = ({ data, onReferenceSelect, onThemeSelect, onQuestionSelect, onStartChat }) => {
    const [isExporting, setIsExporting] = useState(false);
    const { title, passageReference, passageText, summary, charactersAndSymbolism, historicalContext, originalAudienceInterpretation, primaryMessage, secondaryThemes, reflectionPoints, keyWordAnalysis, relatedVerses } = data;

    const allDataLoaded = passageText && summary && primaryMessage;

    const handleExport = () => {
        setIsExporting(true);
        try {
            exportEventAnalysisToDocx(data as Required<EventAnalysis>);
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
                    <p className="text-sm uppercase tracking-wider text-text-muted">Event Study</p>
                    {title ? (
                      <>
                        <h2 className="text-3xl font-bold text-accent-light">{title}</h2>
                        <button onClick={() => onReferenceSelect(passageReference!)} className="text-lg text-accent hover:underline" aria-label={`View analysis for ${passageReference}`}>
                            {passageReference}
                        </button>
                      </>
                    ) : (
                       <>
                        <div className="h-9 w-64 bg-primary/50 rounded-md animate-pulse mt-1"></div>
                        <div className="h-6 w-32 bg-primary/50 rounded-md animate-pulse mt-2"></div>
                       </>
                    )}
                </div>
                <button 
                    onClick={handleExport}
                    disabled={isExporting || !allDataLoaded}
                    className="flex items-center gap-2 text-sm font-medium flex-shrink-0 bg-primary/50 text-text-muted hover:bg-primary/80 hover:text-text-main px-3 py-2 rounded-lg border border-slate-600 transition-colors disabled:opacity-50 disabled:cursor-wait"
                    aria-label="Export to Word document"
                >
                    {isExporting ? (
                         <svg className="animate-spin h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                    )}
                    <span>{isExporting ? 'Exporting...' : 'Export'}</span>
                </button>
            </header>
            
            <section>
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-accent-light">Passage Text (NKJV)</h3>
                    <Tooltip text={TOOLTIP_DEFINITIONS.PARABLE_TEXT} />
                </div>
                {passageText ? (
                    <blockquote className="border-l-4 border-slate-600 pl-4 italic text-text-main my-3 whitespace-pre-wrap">"{passageText}"</blockquote>
                ) : <SectionSpinner />}
            </section>
            
            <section className="pt-6 border-t border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-accent-light flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>Summary</h3>
                    <Tooltip text={TOOLTIP_DEFINITIONS.PARABLE_SUMMARY} />
                </div>
                {summary ? <p className="text-text-main leading-relaxed whitespace-pre-wrap pl-8">{summary}</p> : <SectionSpinner />}
            </section>

             {charactersAndSymbolism ? (
                <section className="pt-6 border-t border-slate-700">
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-xl font-semibold text-accent-light">Characters & Symbolism</h3>
                        <Tooltip text={TOOLTIP_DEFINITIONS.PARABLE_CHARACTERS} />
                    </div>
                    { charactersAndSymbolism.length > 0 ? (
                        <div className="space-y-3 pl-8">
                            {charactersAndSymbolism.map((item, index) => (
                                <div key={index}>
                                    <h4 className="font-bold text-accent-light">{item.name}</h4>
                                    <p className="text-text-muted mt-1">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    ) : <p className="pl-8 text-text-muted">No specific characters identified for analysis.</p>}
                </section>
            ) : <SectionSpinner />}

            {historicalContext ? (
                <section className="pt-6 border-t border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-accent-light flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" /></svg>Historical & Cultural Context</h3>
                        <Tooltip text={TOOLTIP_DEFINITIONS.PARABLE_CONTEXT} />
                    </div>
                    <p className="text-text-main leading-relaxed pl-8">{historicalContext}</p>
                </section>
            ) : <SectionSpinner />}
            
            {originalAudienceInterpretation ? (
                <section className="pt-6 border-t border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-accent-light">Original Audience Interpretation</h3>
                        <Tooltip text={TOOLTIP_DEFINITIONS.PARABLE_AUDIENCE} />
                    </div>
                    <p className="text-text-main leading-relaxed pl-8">{originalAudienceInterpretation}</p>
                </section>
            ) : <SectionSpinner />}
            
            {primaryMessage ? (
                <section className="pt-6 border-t border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-accent-light flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>Theological Message</h3>
                        <Tooltip text={TOOLTIP_DEFINITIONS.PARABLE_MESSAGE} />
                    </div>
                    <div className="space-y-4 pl-8">
                        <div>
                            <h4 className="font-semibold text-text-main text-lg mb-1">Primary Message</h4>
                            <p className="text-text-main leading-relaxed whitespace-pre-wrap">{primaryMessage}</p>
                        </div>
                        {secondaryThemes && ( secondaryThemes.length > 0 ? (
                            <div>
                                <h4 className="font-semibold text-text-main text-lg mb-2">Secondary Themes</h4>
                                <div className="flex flex-wrap gap-2">
                                    {secondaryThemes.map((theme, index) => (
                                        <button key={index} onClick={() => onThemeSelect(theme)} className="py-1 px-2.5 rounded-full text-sm bg-sky-500/10 text-sky-300 border border-sky-500/30 hover:bg-sky-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary/50 focus:ring-sky-400">{theme}</button>
                                    ))}
                                </div>
                            </div>
                        ) : <p className="text-text-muted text-sm">No secondary themes identified.</p>)}
                    </div>
                </section>
            ) : <SectionSpinner />}
            
            {keyWordAnalysis ? (
                <section className="pt-6 border-t border-slate-700">
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-xl font-semibold text-accent-light">Key Word Analysis</h3>
                        <Tooltip text={TOOLTIP_DEFINITIONS.PARABLE_WORDS} />
                    </div>
                    <div className="pl-8">
                        {keyWordAnalysis.length > 0 ? <WordAnalysis data={keyWordAnalysis} onThemeSelect={onThemeSelect} /> : <p className="text-text-muted">No key words were identified for detailed analysis.</p>}
                    </div>
                </section>
            ) : <SectionSpinner />}

            {relatedVerses ? (
                <section className="pt-6 border-t border-slate-700">
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-xl font-semibold text-accent-light">Related Verses</h3>
                        <Tooltip text={TOOLTIP_DEFINITIONS.PARABLE_VERSES} />
                    </div>
                     <div className="pl-8">
                        {relatedVerses.length > 0 ? <CrossReferenceAnalysis data={relatedVerses} onReferenceSelect={onReferenceSelect} /> : <p className="text-text-muted">No related verses found.</p>}
                    </div>
                </section>
            ) : <SectionSpinner />}

            {reflectionPoints ? (
                <section className="pt-6 border-t border-slate-700">
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-xl font-semibold text-accent-light">Points for Reflection</h3>
                        <Tooltip text={TOOLTIP_DEFINITIONS.PARABLE_REFLECTION} />
                    </div>
                     { reflectionPoints.length > 0 ? (
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
            ) : <SectionSpinner />}
            
            <div className="pt-8 border-t border-slate-700">
                <button
                    onClick={() => onStartChat(title || 'this story')}
                    disabled={!title}
                    className="w-full flex items-center justify-center gap-2 bg-accent/20 hover:bg-accent/30 text-accent-light font-semibold py-3 px-4 rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 transition-transform group-hover:scale-110"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.53-0.481M21 12a9.753 9.753 0 0 0-4.722-8.37l-1.028.917A48.455 48.455 0 0 0 12 4.5c-2.131 0-4.16.6-5.902 1.634l-1.028-.917A9.753 9.753 0 0 0 3 12m0 0a9.753 9.753 0 0 0 4.722 8.37l1.028-.917a48.455 48.455 0 0 0 5.902 1.634c.537.043 1.07.065 1.616.065 4.97 0 9-3.694 9-8.25Z" /></svg>
                    Discuss this event in a chat
                </button>
            </div>
        </div>
    );
};
