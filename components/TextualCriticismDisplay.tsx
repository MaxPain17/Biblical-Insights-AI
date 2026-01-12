
import React from 'react';
import type { TextualCriticismData } from '../types';
import { Tooltip } from './Tooltip';
import { TOOLTIP_DEFINITIONS } from '../tooltipContent';

interface TextualCriticismDisplayProps {
  data: TextualCriticismData;
  onReferenceSelect: (reference: string) => void;
}

export const TextualCriticismDisplay: React.FC<TextualCriticismDisplayProps> = ({ data, onReferenceSelect }) => {
  return (
    <div className="space-y-6">
        <div className="bg-amber-900/10 border border-amber-700/30 p-4 rounded-lg">
             <div className="flex items-center gap-2 mb-2">
                <h4 className="text-lg font-bold text-amber-500 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    Manuscript Reliability
                </h4>
                <Tooltip text={TOOLTIP_DEFINITIONS.TEXTUAL_RELIABILITY} />
             </div>
            <p className="text-text-main leading-relaxed">{data.manuscriptReliability}</p>
        </div>

        <div>
            <div className="flex items-center gap-2 mb-4">
                <h4 className="text-lg font-bold text-text-muted uppercase tracking-wider text-sm">Significant Variants</h4>
                <Tooltip text={TOOLTIP_DEFINITIONS.TEXTUAL_VARIANTS} />
            </div>
            <div className="space-y-4">
                {data.variants.map((variant, index) => (
                    <button 
                        key={index}
                        onClick={() => onReferenceSelect(variant.verse)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onReferenceSelect(variant.verse);
                            }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`View analysis for ${variant.verse}`}
                        className="w-full text-left bg-primary/40 border border-gray-700 p-4 rounded-lg transition-all duration-200 hover:border-accent hover:bg-secondary/60 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent block"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-accent font-bold">{variant.verse}</span>
                            <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">{variant.manuscripts}</span>
                        </div>
                        <div className="mb-3">
                            <span className="text-xs text-text-muted uppercase mr-2">Variant Reading:</span>
                            <span className="font-serif italic text-lg text-white">"{variant.variantText}"</span>
                        </div>
                        <div className="text-sm text-gray-300 border-t border-gray-700 pt-2 mt-2">
                            <span className="font-semibold text-accent-light">Significance: </span>
                            {variant.significance}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
};
