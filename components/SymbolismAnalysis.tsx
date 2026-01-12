import React from 'react';
import type { SymbolismAnalysis as SymbolismAnalysisType } from '../types';
import { ClickableText } from './ClickableText';

interface SymbolismAnalysisProps {
  data: SymbolismAnalysisType;
  onReferenceSelect: (reference: string) => void;
  onThemeSelect: (theme: string) => void;
}

export const SymbolismAnalysis: React.FC<SymbolismAnalysisProps> = ({ data, onReferenceSelect, onThemeSelect }) => {
  if (!data || !data.hasSymbols || data.symbols.length === 0) {
    return <p className="text-text-muted">No specific symbols were identified for analysis in this passage.</p>;
  }

  return (
    <div className="space-y-4">
      {data.symbols.map((item, index) => (
        <div key={index} className="bg-primary/40 p-4 rounded-lg border-l-4 border-fuchsia-400">
            <h4 className="text-xl font-bold text-accent-light mb-3">{item.symbol}</h4>
            <div className="space-y-3">
                <div>
                    <p className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-1">Meaning</p>
                    <ClickableText text={item.meaning} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} className="text-text-main" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-1">Significance</p>
                    <ClickableText text={item.significance} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} className="text-text-main italic" />
                </div>
            </div>
        </div>
      ))}
    </div>
  );
};