import React from 'react';
import type { TypologyAnalysis as TypologyAnalysisType } from '../types';
import { ClickableText } from './ClickableText';

interface TypologyAnalysisProps {
    data: TypologyAnalysisType;
    onReferenceSelect: (reference: string) => void;
    onThemeSelect: (theme: string) => void;
}

export const TypologyAnalysis: React.FC<TypologyAnalysisProps> = ({ data, onReferenceSelect, onThemeSelect }) => {
  if (!data || !data.hasTypology || data.connections.length === 0) {
    return <p className="text-text-muted">No typological connections were identified for this passage.</p>;
  }

  return (
    <div className="space-y-4">
      {data.connections.map((item, index) => (
        <div key={index} className="bg-primary/40 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="text-center flex-1">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Type (Old Testament)</p>
              <h4 className="text-lg font-bold text-accent-light">{item.type}</h4>
            </div>
            <div className="flex-shrink-0 text-accent-light">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                </svg>
            </div>
            <div className="text-center flex-1">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Antitype (New Testament)</p>
              <h4 className="text-lg font-bold text-accent-light">{item.antitype}</h4>
            </div>
          </div>
          <div className="bg-secondary/40 p-3 rounded-md border-t border-gray-600">
            <p className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-1">Explanation</p>
            <ClickableText text={item.explanation} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} className="text-text-main" />
          </div>
        </div>
      ))}
    </div>
  );
};