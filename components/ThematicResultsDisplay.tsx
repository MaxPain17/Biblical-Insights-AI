
import React, { useState } from 'react';
import type { ThematicAnalysis } from '../types';
import { exportThematicAnalysisToDocx } from '../services/exportService';
import { Tooltip } from './Tooltip';
import { TOOLTIP_DEFINITIONS } from '../tooltipContent';
import { SectionSpinner } from './SectionSpinner';
import { ClickableText } from './ClickableText';

interface ThematicResultsDisplayProps {
  data: ThematicAnalysis;
  onReferenceSelect: (reference: string) => void;
  onThemeSelect: (theme: string) => void;
  onStartChat: (subject: string) => void;
}

export const ThematicResultsDisplay: React.FC<ThematicResultsDisplayProps> = ({ data, onReferenceSelect, onThemeSelect, onStartChat }) => {
  const [isExporting, setIsExporting] = useState(false);
  const { topic, summary, historicalContext, otFoundation, ntFulfillment, christologicalConnection, creedalDevelopment, keyWords, diversePerspectives, commonMisconceptions, keyConcepts, practicalApplication, relatedThemes, keyVerses } = data;

  const handleExport = () => {
    setIsExporting(true);
    try {
        exportThematicAnalysisToDocx(data as Required<ThematicAnalysis>);
    } catch(e) {
        console.error("Export failed", e);
    } finally {
        setTimeout(() => setIsExporting(false), 1000);
    }
  };

  const allDataLoaded = summary && historicalContext && otFoundation && ntFulfillment && keyVerses;

  return (
    <div className="bg-secondary/50 border border-slate-700 p-6 rounded-xl shadow-lg space-y-8">
      <header className="pb-4 border-b border-slate-700 flex justify-between items-start">
        <div>
          <p className="text-sm uppercase tracking-wider text-text-muted">Thematic Study</p>
          {topic ? (
            <h2 className="text-3xl font-bold text-accent-light capitalize">{topic}</h2>
          ) : (
            <div className="h-9 w-48 bg-primary/50 rounded-md animate-pulse mt-1"></div>
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
      
      <section>
        <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-semibold text-accent-light flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>
                Summary
            </h3>
            <Tooltip text={TOOLTIP_DEFINITIONS.THEMATIC_SUMMARY} />
        </div>
        {summary ? <ClickableText text={summary} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} className="text-text-main leading-relaxed whitespace-pre-wrap pl-8" /> : <SectionSpinner />}
      </section>

      {keyWords ? (
        <section className="pt-6 border-t border-slate-700">
            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-semibold text-accent-light flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" /></svg>
                    Key Original Language Terms
                </h3>
                <Tooltip text={TOOLTIP_DEFINITIONS.THEMATIC_KEYWORDS} />
            </div>
             { keyWords.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                  {keyWords.map((item, index) => (
                      <div key={index} className="bg-primary/60 p-4 rounded-lg border border-slate-600">
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-bold text-accent-light">{item.word}</h4>
                          <p className="text-sm font-mono text-text-muted">{item.strongs}</p>
                        </div>
                        <p className="font-mono text-lg text-text-main">{item.original} <span className="italic text-base text-text-muted">({item.transliteration})</span></p>
                        <p className="text-text-muted text-sm mt-1">{item.briefMeaning}</p>
                      </div>
                  ))}
              </div>
            ) : <p className="pl-8 text-text-muted">No specific key words identified for this topic.</p>}
        </section>
      ) : <SectionSpinner /> }

      <section className="pt-6 border-t border-slate-700">
        <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-semibold text-accent-light flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" /></svg>
                Historical & Cultural Context
            </h3>
            <Tooltip text={TOOLTIP_DEFINITIONS.THEMATIC_HISTORICAL} />
        </div>
        {historicalContext ? <ClickableText text={historicalContext} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} className="text-text-main leading-relaxed pl-8" /> : <SectionSpinner />}
      </section>

      <section className="pt-6 border-t border-slate-700">
        <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-semibold text-accent-light">Theological Development</h3>
            <Tooltip text={TOOLTIP_DEFINITIONS.THEMATIC_DEVELOPMENT} />
        </div>
        <div className="pl-8 space-y-4">
            <div>
                <h4 className="font-semibold text-text-main text-lg mb-1">Old Testament Foundation</h4>
                {otFoundation ? <ClickableText text={otFoundation} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} className="text-text-main leading-relaxed whitespace-pre-wrap" /> : <SectionSpinner />}
            </div>
             <div>
                <h4 className="font-semibold text-text-main text-lg mb-1">New Testament Fulfillment</h4>
                {ntFulfillment ? <ClickableText text={ntFulfillment} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} className="text-text-main leading-relaxed whitespace-pre-wrap" /> : <SectionSpinner />}
            </div>
        </div>
      </section>

      {christologicalConnection ? (
        <section className="pt-6 border-t border-slate-700">
            <div className="flex items-center gap-2 mb-2">
                 <h3 className="text-xl font-semibold text-accent-light flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    Connection to Christ
                </h3>
                <Tooltip text={TOOLTIP_DEFINITIONS.THEMATIC_CHRISTOLOGICAL} />
            </div>
            <div className="bg-gradient-to-br from-accent/10 to-secondary-accent/5 p-4 rounded-lg border border-accent/20 pl-8">
              <ClickableText text={christologicalConnection} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} className="text-text-main italic" />
            </div>
        </section>
      ) : <SectionSpinner />}

      {creedalDevelopment ? (
        <section className="pt-6 border-t border-slate-700">
             <div className="flex items-center gap-2 mb-2">
                 <h3 className="text-xl font-semibold text-accent-light flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                    Historical & Creedal Development
                </h3>
                <Tooltip text={TOOLTIP_DEFINITIONS.THEMATIC_CREEDAL} />
            </div>
            <ClickableText text={creedalDevelopment} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} className="text-text-main leading-relaxed pl-8" />
        </section>
      ) : <SectionSpinner />}
      
      {diversePerspectives && (
          <section className="pt-6 border-t border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-xl font-semibold text-accent-light">Diverse Perspectives</h3>
                  <Tooltip text={TOOLTIP_DEFINITIONS.THEMATIC_PERSPECTIVES} />
              </div>
              {diversePerspectives.length > 0 ? (
                <div className="space-y-4 pl-8">
                    {diversePerspectives.map((item, index) => (
                        <div key={index} className="bg-primary/30 p-3 rounded-lg border-l-2 border-accent/50">
                            <h5 className="font-bold text-sm text-accent-light uppercase tracking-wide mb-1">{item.viewpoint}</h5>
                            <p className="text-sm text-text-main">{item.description}</p>
                        </div>
                    ))}
                </div>
              ) : <SectionSpinner />}
          </section>
      )}

      {commonMisconceptions && (
          <section className="pt-6 border-t border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-xl font-semibold text-accent-light">Common Misconceptions</h3>
                  <Tooltip text={TOOLTIP_DEFINITIONS.THEMATIC_MISCONCEPTIONS} />
              </div>
              {commonMisconceptions.length > 0 ? (
                <div className="space-y-4 pl-8">
                    {commonMisconceptions.map((item, index) => (
                        <div key={index} className="bg-red-900/10 p-4 rounded-lg border border-red-700/30">
                            <h5 className="font-bold text-red-400">Misconception: <span className="italic font-normal">"{item.misconception}"</span></h5>
                            <p className="text-sm text-text-main mt-2 pt-2 border-t border-red-700/20"><span className="font-bold text-green-400">Correction:</span> {item.correction}</p>
                        </div>
                    ))}
                </div>
              ) : <SectionSpinner />}
          </section>
      )}

      {keyConcepts ? (
        <section className="pt-6 border-t border-slate-700">
            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-semibold text-accent-light">Key Theological Concepts</h3>
                <Tooltip text={TOOLTIP_DEFINITIONS.THEMATIC_CONCEPTS} />
            </div>
            {keyConcepts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-8">
                  {keyConcepts.map((item, index) => (
                      <button 
                          key={index} 
                          onClick={() => onThemeSelect(item.concept)}
                          className="bg-primary/60 p-4 rounded-lg border border-slate-600 text-left transition-colors hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                          <h4 className="font-bold text-accent-light">{item.concept}</h4>
                          <p className="text-text-muted text-sm mt-1">{item.definition}</p>
                      </button>
                  ))}
              </div>
            ) : <p className="pl-8 text-text-muted">No key concepts identified for this topic.</p>}
        </section>
      ) : <SectionSpinner /> }

      {relatedThemes ? (
        <section className="pt-6 border-t border-slate-700">
            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-semibold text-accent-light">Related Themes</h3>
                <Tooltip text={TOOLTIP_DEFINITIONS.THEMATIC_RELATED} />
            </div>
            { relatedThemes.length > 0 ? (
              <div className="flex flex-wrap gap-2 pl-8">
                  {relatedThemes.map((theme, index) => (
                      <button 
                          key={index}
                          onClick={() => onThemeSelect(theme)}
                          className="py-1 px-2.5 rounded-full text-sm bg-sky-500/10 text-sky-300 border border-sky-500/30 hover:bg-sky-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary/50 focus:ring-sky-400"
                      >
                          {theme}
                      </button>
                  ))}
              </div>
            ) : <p className="pl-8 text-text-muted">No related themes found.</p> }
        </section>
      ) : <SectionSpinner />}

      {practicalApplication ? (
        <section className="pt-6 border-t border-slate-700">
            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-semibold text-accent-light">Practical Application</h3>
                <Tooltip text={TOOLTIP_DEFINITIONS.THEMATIC_APPLICATION} />
            </div>
            { practicalApplication.length > 0 ? (
              <ul className="space-y-3 pl-8">
                  {practicalApplication.map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-accent flex-shrink-0 mt-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
                          </svg>
                          <p className="text-text-main">{point}</p>
                      </li>
                  ))}
              </ul>
            ) : <SectionSpinner />}
        </section>
      ) : <SectionSpinner /> }

      {keyVerses ? (
        <section className="pt-6 border-t border-slate-700">
            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-semibold text-accent-light">Key Verses</h3>
                <Tooltip text={TOOLTIP_DEFINITIONS.THEMATIC_VERSES} />
            </div>
            { keyVerses.length > 0 ? (
              <div className="space-y-4">
                  {keyVerses.map((item, index) => (
                      <button 
                          key={index} 
                          onClick={() => onReferenceSelect(item.reference)}
                          aria-label={`View analysis for ${item.reference}`}
                          className="w-full text-left bg-primary/60 p-4 rounded-lg border border-slate-700 transition-all duration-200 hover:border-accent hover:bg-secondary/60 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                          <h4 className="text-lg font-bold text-accent-light mb-2 flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                              </svg>
                              {item.reference}
                          </h4>
                          <blockquote className="border-l-4 border-slate-600 pl-4 italic text-text-main my-3">
                              "{item.verseText}"
                          </blockquote>
                          <div>
                              <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Relevance to "{topic}"</span>
                              <ClickableText text={item.explanation} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} className="text-text-main mt-1" />
                          </div>
                      </button>
                  ))}
              </div>
            ) : <SectionSpinner />}
        </section>
      ) : <SectionSpinner />}

      <div className="pt-8 border-t border-slate-700">
        <button
            onClick={() => onStartChat(topic || 'this topic')}
            disabled={!topic}
            className="w-full flex items-center justify-center gap-2 bg-accent/20 hover:bg-accent/30 text-accent-light font-semibold py-3 px-4 rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 transition-transform group-hover:scale-110">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.53-0.481M21 12a9.753 9.753 0 0 0-4.722-8.37l-1.028.917A48.455 48.455 0 0 0 12 4.5c-2.131 0-4.16.6-5.902 1.634l-1.028-.917A9.753 9.753 0 0 0 3 12m0 0a9.753 9.753 0 0 0 4.722 8.37l1.028-.917a48.455 48.455 0 0 0 5.902 1.634c.537.043 1.07.065 1.616.065 4.97 0 9-3.694 9-8.25Z" />
            </svg>
            Discuss this topic in a chat
        </button>
      </div>
    </div>
  );
};