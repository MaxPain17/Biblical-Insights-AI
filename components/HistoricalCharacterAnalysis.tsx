import React from 'react';
import type { HistoricalCharacterAnalysis as HistoricalCharacterAnalysisType } from '../types';

interface HistoricalCharacterAnalysisProps {
  data: HistoricalCharacterAnalysisType;
  onReferenceSelect: (reference: string) => void;
}

export const HistoricalCharacterAnalysis: React.FC<HistoricalCharacterAnalysisProps> = ({ data }) => {
  if (!data || !data.hasCharacters || data.characters.length === 0) {
    return <p className="text-text-muted">No key historical figures were identified for detailed analysis in this passage.</p>;
  }

  return (
    <div className="space-y-4">
      {data.characters.map((character, index) => (
        <div key={index} className="bg-primary/40 p-4 rounded-lg border border-gray-700">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-xl font-bold text-accent-light">{character.name}</h4>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300 font-semibold">{character.role}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-1">Significance</p>
            <p className="text-text-main">{character.significance}</p>
          </div>
        </div>
      ))}
    </div>
  );
};