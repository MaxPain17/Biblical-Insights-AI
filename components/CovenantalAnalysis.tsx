import React from 'react';
import type { CovenantalAnalysis as CovenantalAnalysisType } from '../types';

interface CovenantalAnalysisProps {
  data: CovenantalAnalysisType;
  onReferenceSelect: (reference: string) => void;
}

export const CovenantalAnalysis: React.FC<CovenantalAnalysisProps> = ({ data }) => {
  if (!data || !data.hasCovenantLink || data.links.length === 0) {
    return <p className="text-text-muted">No specific covenantal connections were identified for this passage.</p>;
  }

  return (
    <div className="space-y-6">
      {data.links.map((item, index) => (
        <div key={index} className="bg-primary/40 p-4 rounded-lg border border-gray-700">
          <h4 className="text-xl font-bold text-accent-light mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
            {item.covenant}
          </h4>
          <div className="space-y-3 pl-8">
            <div>
              <p className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-1">Connection</p>
              <p className="text-text-main">{item.connection}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-1">Significance</p>
              <p className="text-text-main italic">{item.significance}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};