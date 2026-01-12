
import React from 'react';
import type { CrossReferenceItem } from '../types';

interface CrossReferenceAnalysisProps {
  data: CrossReferenceItem[];
  onReferenceSelect: (reference: string) => void;
}

export const CrossReferenceAnalysis: React.FC<CrossReferenceAnalysisProps> = ({ data, onReferenceSelect }) => {
  if (!data || data.length === 0) {
    return <p className="text-text-muted">No cross-references available for this verse.</p>;
  }

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div 
          key={index} 
          onClick={() => onReferenceSelect(item.reference)}
          onKeyDown={(e) => {
             if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onReferenceSelect(item.reference);
             }
          }}
          role="button"
          tabIndex={0}
          aria-label={`View analysis for ${item.reference}`}
          className="w-full text-left bg-primary/60 p-4 rounded-lg border border-slate-700 transition-all duration-200 hover:border-accent hover:bg-secondary/60 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent block"
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
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Relevance</span>
            <p className="text-text-main mt-1">{item.explanation}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
