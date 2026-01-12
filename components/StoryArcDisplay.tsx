
import React from 'react';
import type { StoryArcAnalysis } from '../types';
import { ClickableText } from './ClickableText';
import { SectionSpinner } from './SectionSpinner';

interface StoryArcDisplayProps {
  data: StoryArcAnalysis;
  onReferenceSelect: (reference: string) => void;
  onThemeSelect: (theme: string) => void;
  onStartChat: (subject: string) => void;
}

export const StoryArcDisplay: React.FC<StoryArcDisplayProps> = ({ data, onReferenceSelect, onThemeSelect, onStartChat }) => {
  const { arcName, summary, timeline, characterDevelopment, thematicSignificance, christologicalConnection, redemptiveHistoricalSignificance, principlesForToday } = data;

  return (
    <div className="bg-secondary/50 border border-slate-700 p-6 rounded-xl shadow-lg space-y-8">
      <header className="pb-4 border-b border-slate-700">
        <p className="text-sm uppercase tracking-wider text-text-muted">Story Arc Explorer</p>
        {arcName ? (
            <h2 className="text-3xl font-bold text-accent-light capitalize">{arcName}</h2>
        ) : (
            <div className="h-9 w-64 bg-primary/50 rounded-md animate-pulse mt-1"></div>
        )}
      </header>

      <section>
        <h3 className="text-xl font-semibold text-accent-light mb-2">Narrative Summary</h3>
        {summary ? (
            <ClickableText text={summary} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} className="text-text-main leading-relaxed" />
        ) : <SectionSpinner />}
      </section>

      <section>
        <h3 className="text-xl font-semibold text-accent-light mb-4">Key Events Timeline</h3>
        {timeline ? (
            timeline.length > 0 ? (
                <div className="relative pl-6 border-l-2 border-slate-600 space-y-8">
                {timeline.map((event, index) => (
                    <div key={index} className="relative">
                    <div className="absolute -left-[35px] top-1 flex items-center justify-center h-6 w-6 rounded-full bg-secondary ring-4 ring-primary">
                        <div className="h-2 w-2 rounded-full bg-accent"></div>
                    </div>
                    <p className="text-sm text-text-muted">{event.title}</p>
                    <button onClick={() => onReferenceSelect(event.reference)} className="text-lg font-bold text-accent-light hover:underline" aria-label={`View analysis for ${event.reference}`}>
                        {event.reference}
                    </button>
                    <p className="text-text-main mt-1 text-sm">{event.summary}</p>
                    </div>
                ))}
                </div>
            ) : <p className="text-text-muted pl-6">No timeline events were generated for this arc.</p>
        ) : <SectionSpinner />}
      </section>
      
      {characterDevelopment ? (
        <section className="pt-6 border-t border-slate-700">
          <h3 className="text-xl font-semibold text-accent-light mb-4">Character Development</h3>
          {characterDevelopment.length > 0 ? (
            <div className="space-y-4">
              {characterDevelopment.map((char, index) => (
                <div key={index} className="bg-primary/40 p-4 rounded-lg">
                  <h4 className="font-bold text-lg text-accent-light">{char.name}</h4>
                  <ClickableText text={char.development} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} className="text-text-main mt-1" />
                </div>
              ))}
            </div>
           ) : <p className="text-text-muted">No specific character development analysis available.</p>}
        </section>
      ) : <SectionSpinner />}

      {thematicSignificance ? (
        <section className="pt-6 border-t border-slate-700">
            <h3 className="text-xl font-semibold text-accent-light mb-2">Thematic Significance</h3>
            <ClickableText text={thematicSignificance} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} className="text-text-main leading-relaxed" />
        </section>
      ) : <SectionSpinner />}

      {redemptiveHistoricalSignificance ? (
        <section className="pt-6 border-t border-slate-700">
            <h3 className="text-xl font-semibold text-accent-light mb-2">Redemptive-Historical Significance</h3>
            <ClickableText text={redemptiveHistoricalSignificance} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} className="text-text-main leading-relaxed" />
        </section>
      ) : <SectionSpinner />}

      {christologicalConnection ? (
        <section className="pt-6 border-t border-slate-700">
            <h3 className="text-xl font-semibold text-accent-light mb-2">Connection to Christ</h3>
            <div className="bg-gradient-to-br from-accent/10 to-secondary-accent/5 p-4 rounded-lg border border-accent/20">
            <ClickableText text={christologicalConnection} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} className="text-text-main italic" />
            </div>
        </section>
      ) : <SectionSpinner />}

      {principlesForToday ? (
        <section className="pt-6 border-t border-slate-700">
            <h3 className="text-xl font-semibold text-accent-light mb-4">Principles for Today</h3>
             {principlesForToday.length > 0 ? (
            <div className="space-y-4">
              {principlesForToday.map((item, index) => (
                <div key={index} className="bg-primary/40 p-4 rounded-lg border-l-4 border-accent">
                  <h4 className="font-bold text-lg text-accent-light">{item.principle}</h4>
                  <ClickableText text={item.explanation} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} className="text-text-main mt-1" />
                </div>
              ))}
            </div>
           ) : <p className="text-text-muted">No specific principles for today were derived from this arc.</p>}
        </section>
      ) : <SectionSpinner />}

      <section className="pt-6 border-t border-slate-700">
        <button
            onClick={() => onStartChat(arcName || 'this story arc')}
            disabled={!arcName}
            className="w-full flex items-center justify-center gap-2 bg-accent/20 hover:bg-accent/30 text-accent-light font-semibold py-3 px-4 rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 transition-transform group-hover:scale-110">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.53-0.481M21 12a9.753 9.753 0 0 0-4.722-8.37l-1.028.917A48.455 48.455 0 0 0 12 4.5c-2.131 0-4.16.6-5.902 1.634l-1.028-.917A9.753 9.753 0 0 0 3 12m0 0a9.753 9.753 0 0 0 4.722 8.37l1.028-.917a48.455 48.455 0 0 0 5.902 1.634c.537.043 1.07.065 1.616.065 4.97 0 9-3.694 9-8.25Z" />
            </svg>
            Discuss this story arc in a chat
        </button>
      </section>
    </div>
  );
};