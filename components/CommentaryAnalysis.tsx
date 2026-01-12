
import React from 'react';
import type { VerseAnalysis } from '../types';
import { Tooltip } from './Tooltip';
import { TOOLTIP_DEFINITIONS } from '../tooltipContent';
import { ClickableText } from './ClickableText';

interface CommentaryAnalysisProps {
  analysis: VerseAnalysis;
  onReferenceSelect: (reference: string) => void;
  onThemeSelect: (theme: string) => void;
}

const Section: React.FC<{ title: string; tooltipText: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, tooltipText, icon, children }) => (
    <div className="relative pl-11">
        <div className="absolute left-3 top-0 flex items-center justify-center h-6 w-6 rounded-full bg-secondary">
             {icon}
        </div>
        <div className="absolute left-[21px] top-6 bottom-0 w-px bg-gradient-to-b from-slate-600 to-transparent"></div>
        <div className="flex items-center gap-2 mb-2">
            <h4 className="text-xl font-semibold text-accent-light">{title}</h4>
            <Tooltip text={tooltipText} />
        </div>
        <div className="pb-6">
            <div className="text-text-main leading-relaxed">{children}</div>
        </div>
    </div>
);

export const CommentaryAnalysis: React.FC<CommentaryAnalysisProps> = ({ analysis, onReferenceSelect, onThemeSelect }) => {
  const { commentaryAnalysis: data, groundingMetadata } = analysis;

  if (!data) {
    return <p className="text-text-muted">No commentary available.</p>;
  }

  return (
    <div className="space-y-2">
      <Section 
        title="Book Summary & Context" 
        tooltipText={TOOLTIP_DEFINITIONS.COMMENTARY_BOOK_SUMMARY}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-accent">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
      }>
        <ClickableText text={data.bookSummary} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} />
      </Section>

      <Section 
        title="Chapter Context"
        tooltipText={TOOLTIP_DEFINITIONS.COMMENTARY_CHAPTER_CONTEXT}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-accent">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 6.45 3.75H18a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 18 21.75H6.45A2.251 2.251 0 0 1 4.2 19.5V6.108c0-1.135.845-2.098 1.976-2.192a48.424 48.424 0 0 0 1.123-.08" />
          </svg>
      }>
        <ClickableText text={data.chapterContext} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} />
      </Section>

       <Section 
        title="Passage Commentary"
        tooltipText={TOOLTIP_DEFINITIONS.COMMENTARY_PASSAGE}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-accent">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.53-0.481M21 12a9.753 9.753 0 0 0-4.722-8.37l-1.028.917A48.455 48.455 0 0 0 12 4.5c-2.131 0-4.16.6-5.902 1.634l-1.028-.917A9.753 9.753 0 0 0 3 12m0 0a9.753 9.753 0 0 0 4.722 8.37l1.028-.917a48.455 48.455 0 0 0 5.902 1.634c.537.043 1.07.065 1.616.065 4.97 0 9-3.694 9-8.25Z" />
          </svg>
      }>
        <ClickableText text={data.passageCommentary} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} />
      </Section>

      {data.theologicalPerspectives && data.theologicalPerspectives.length > 0 && (
          <Section 
            title="Theological Perspectives"
            tooltipText={TOOLTIP_DEFINITIONS.COMMENTARY_PERSPECTIVES}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-accent">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
          }>
              <div className="space-y-4">
                  {data.theologicalPerspectives.map((item, index) => (
                      <div key={index} className="bg-primary/30 p-3 rounded-lg border-l-2 border-accent/50">
                          <h5 className="font-bold text-sm text-accent-light uppercase tracking-wide mb-1">{item.viewpoint}</h5>
                          <ClickableText text={item.description} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} className="text-sm text-text-main" />
                      </div>
                  ))}
              </div>
          </Section>
      )}

      {data.practicalApplication && data.practicalApplication.length > 0 && (
          <Section 
            title="Life Application"
            tooltipText={TOOLTIP_DEFINITIONS.COMMENTARY_APPLICATION}
            icon={
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-accent">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
          }>
               <ul className="space-y-2">
                   {data.practicalApplication.map((app, index) => (
                       <li key={index} className="flex items-start gap-2">
                           <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0"></span>
                           <ClickableText text={app} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} className="text-text-main" />
                       </li>
                   ))}
               </ul>
          </Section>
      )}

      {data.devotionalThought && (
          <Section 
            title="Devotional Insight"
            tooltipText={TOOLTIP_DEFINITIONS.COMMENTARY_DEVOTIONAL}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-accent">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
          }>
              <div className="bg-gradient-to-br from-accent/10 to-secondary-accent/5 p-4 rounded-lg border border-accent/20 italic text-text-main">
                  <ClickableText text={`"${data.devotionalThought}"`} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} />
              </div>
          </Section>
      )}
      
      {groundingMetadata && groundingMetadata.groundingChunks.length > 0 && (
          <div className="relative pl-11">
              <div className="absolute left-3 top-0 flex items-center justify-center h-6 w-6 rounded-full bg-secondary">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-accent">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
              </div>
              <div className="absolute left-[21px] top-6 bottom-0 w-px bg-gradient-to-b from-slate-600 to-transparent"></div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-xl font-semibold text-accent-light">Verifiable Sources (Web)</h4>
                <Tooltip text={TOOLTIP_DEFINITIONS.COMMENTARY_SOURCES_WEB} />
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
              {groundingMetadata.groundingChunks.map((chunk, index) => (
                  <a 
                      key={index} 
                      href={chunk.web.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      title={chunk.web.uri}
                      className="flex items-center gap-1.5 py-1.5 px-3 rounded-full text-sm border bg-accent/10 text-accent-light border-accent/30 hover:bg-accent/20 transition-colors"
                  >
                      {chunk.web.title}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                  </a>
              ))}
              </div>
               <div className="pb-6"></div>
          </div>
      )}

      {data.sources && data.sources.length > 0 && (
        <div className="relative pl-11">
            <div className="absolute left-3 top-0 flex items-center justify-center h-6 w-6 rounded-full bg-secondary">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-accent">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
            </div>
            <div className="flex items-center gap-2 mb-2">
                <h4 className="text-xl font-semibold text-accent-light">Sources Synthesized (Conceptual)</h4>
                <Tooltip text={TOOLTIP_DEFINITIONS.COMMENTARY_SOURCES_CONCEPTUAL} />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
            {data.sources.map((source, index) => (
                <span key={index} className="flex items-center gap-1.5 py-1.5 px-3 rounded-full text-sm border bg-sky-500/10 text-sky-300 border-sky-500/30">
                    {source.name}
                </span>
            ))}
            </div>
        </div>
      )}
    </div>
  );
};