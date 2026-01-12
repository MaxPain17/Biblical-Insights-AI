import React from 'react';
import type { PropheticFulfillmentItem } from '../types';

interface PropheticFulfillmentProps {
  data: PropheticFulfillmentItem[];
  onReferenceSelect: (reference: string) => void;
}

export const PropheticFulfillment: React.FC<PropheticFulfillmentProps> = ({ data, onReferenceSelect }) => {
  if (!data || data.length === 0) {
    return <p className="text-text-muted">No prophetic connections were found for this passage.</p>;
  }

  const getTypeStyles = (type: 'Prophecy' | 'Fulfillment') => {
    return type === 'Prophecy'
      ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
      : 'bg-green-500/10 text-green-300 border-green-500/30';
  };

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
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-bold text-accent-light flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                </svg>
                {item.reference}
            </h4>
            <span className={`py-1 px-2.5 rounded-full text-xs font-semibold border ${getTypeStyles(item.type)}`}>
              {item.type}
            </span>
          </div>
          <blockquote className="border-l-4 border-slate-600 pl-4 italic text-text-main my-3">
            "{item.verseText}"
          </blockquote>
          <div>
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Connection Explanation</span>
            <p className="text-text-main mt-1">{item.explanation}</p>
          </div>
        </div>
      ))}
    </div>
  );
};