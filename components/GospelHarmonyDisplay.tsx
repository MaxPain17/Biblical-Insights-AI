
import React from 'react';
import type { GospelHarmonyData } from '../types';
import { Tooltip } from './Tooltip';
import { TOOLTIP_DEFINITIONS } from '../tooltipContent';

interface GospelHarmonyDisplayProps {
  data: GospelHarmonyData;
  onReferenceSelect: (reference: string) => void;
}

export const GospelHarmonyDisplay: React.FC<GospelHarmonyDisplayProps> = ({ data, onReferenceSelect }) => {
  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-accent-light flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                        </svg>
                        Comparison
                    </h4>
                    <Tooltip text={TOOLTIP_DEFINITIONS.HARMONY_COMPARISON} />
                </div>
                <div className="bg-primary/40 p-4 rounded-lg border border-gray-700 text-text-main leading-relaxed">
                    {data.synopticComparison}
                </div>
            </div>
             <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-accent-light flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                        </svg>
                        Unique Details
                    </h4>
                    <Tooltip text={TOOLTIP_DEFINITIONS.HARMONY_UNIQUE} />
                </div>
                <div className="bg-primary/40 p-4 rounded-lg border border-gray-700 text-text-main leading-relaxed">
                    {data.uniqueFeatures}
                </div>
            </div>
       </div>

       <div>
            <div className="flex items-center gap-2 mb-3">
                <h4 className="text-lg font-bold text-accent-light">Parallel Accounts</h4>
                <Tooltip text={TOOLTIP_DEFINITIONS.HARMONY_PARALLELS} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.parallels.map((item, index) => (
                    <button 
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
                        className="w-full text-left bg-secondary/60 p-4 rounded-lg border border-gray-600 transition-all duration-200 hover:border-accent hover:bg-secondary/80 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent block"
                    >
                        <span className="block text-sm font-bold text-accent mb-2">{item.reference}</span>
                        <p className="text-sm text-text-muted italic">"{item.text}..."</p>
                    </button>
                ))}
            </div>
       </div>
    </div>
  );
};
