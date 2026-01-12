
import React from 'react';
import type { WordAnalysisItem } from '../types';
import { Tooltip } from './Tooltip';
import { TOOLTIP_DEFINITIONS } from '../tooltipContent';

interface WordAnalysisProps {
  data: WordAnalysisItem[];
  onThemeSelect?: (theme: string) => void;
}

export const WordAnalysis: React.FC<WordAnalysisProps> = ({ data, onThemeSelect }) => {

  if (!data || data.length === 0) {
    return <p className="text-text-muted">No word analysis available.</p>;
  }

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="bg-primary/60 p-4 rounded-lg border border-slate-700 transition-all hover:border-slate-600 hover:bg-primary/80 hover:shadow-lg hover:scale-[1.01]">
          <div className="flex justify-between items-start mb-3">
             <h4 className="text-2xl font-bold text-accent-light">
                {onThemeSelect ? (
                    <button
                        onClick={() => onThemeSelect(item.word)}
                        className="text-inherit font-inherit p-0 bg-transparent border-none text-left cursor-pointer transition-all duration-200 hover:underline hover:text-white focus:outline-none focus:ring-1 focus:ring-accent rounded"
                        title={`Click for a thematic study on "${item.word}"`}
                    >
                        {item.word}
                    </button>
                ) : (
                    item.word
                )}
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-text-muted uppercase tracking-wider">Original</span>
                    <Tooltip text={TOOLTIP_DEFINITIONS.LEXICAL_ORIGINAL} />
                </div>
                <span className="font-mono text-2xl text-text-main">{item.original}</span>
            </div>
            <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-text-muted uppercase tracking-wider">Transliteration</span>
                    <Tooltip text={TOOLTIP_DEFINITIONS.LEXICAL_TRANSLITERATION} />
                </div>
                <span className="italic text-text-main">{item.transliteration}</span>
            </div>
             <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-text-muted uppercase tracking-wider">Strong's</span>
                    <Tooltip text={TOOLTIP_DEFINITIONS.LEXICAL_STRONGS} />
                </div>
                <span className="text-text-main">{item.strongs}</span>
            </div>
             <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-text-muted uppercase tracking-wider">Grammar</span>
                    <Tooltip text={TOOLTIP_DEFINITIONS.LEXICAL_GRAMMAR} />
                </div>
                <span className="text-text-main">{item.grammar}</span>
            </div>
            <div className="md:col-span-2 flex flex-col">
                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-text-muted uppercase tracking-wider">Meaning</span>
                    <Tooltip text={TOOLTIP_DEFINITIONS.LEXICAL_MEANING} />
                </div>
                <p className="text-text-main">{item.meaning}</p>
            </div>
            <div className="md:col-span-2 flex flex-col pt-3 mt-3 border-t border-slate-700">
                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-text-muted uppercase tracking-wider">Translation Journey</span>
                    <Tooltip text={TOOLTIP_DEFINITIONS.LEXICAL_TRANSLATION_JOURNEY} />
                </div>
                <p className="text-text-main mt-1">{item.translationJourney}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
