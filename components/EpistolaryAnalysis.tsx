import React from 'react';
import { Tooltip } from './Tooltip';
import { TOOLTIP_DEFINITIONS } from '../tooltipContent';
import type { EpistolaryAnalysis as EpistolaryAnalysisType } from '../types';
import { ClickableText } from './ClickableText';

interface EpistolaryAnalysisProps {
  data: EpistolaryAnalysisType;
  onDoctrineSelect: (doctrine: string) => void;
  onReferenceSelect: (reference: string) => void;
  onThemeSelect: (theme: string) => void;
}

export const EpistolaryAnalysis: React.FC<EpistolaryAnalysisProps> = ({ data, onDoctrineSelect, onReferenceSelect, onThemeSelect }) => {
  if (!data || !data.isEpistle) {
    return <p className="text-text-muted">This passage is not part of an epistle.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
            <h4 className="text-lg font-bold text-accent-light flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
              </svg>
              Argument Structure
            </h4>
            <Tooltip text={TOOLTIP_DEFINITIONS.EPISTOLARY_ARGUMENT} />
        </div>
        <ClickableText text={data.argumentStructure} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} className="text-text-main leading-relaxed pl-7" />
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-2">
            <h4 className="text-lg font-bold text-accent-light flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
              Key Doctrines
            </h4>
            <Tooltip text={TOOLTIP_DEFINITIONS.EPISTOLARY_DOCTRINES} />
        </div>
        <div className="flex flex-wrap gap-2 pl-7">
            {data.keyDoctrines.map((doctrine, index) => (
                <button 
                    key={index}
                    onClick={() => onDoctrineSelect(doctrine)}
                    className="py-1 px-2.5 rounded-full text-sm bg-sky-500/10 text-sky-300 border border-sky-500/30 hover:bg-sky-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary/50 focus:ring-sky-400"
                >
                    {doctrine}
                </button>
            ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
            <h4 className="text-lg font-bold text-accent-light flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962A3.75 3.75 0 0 1 15 12a3.75 3.75 0 0 1-2.25 3.512m-3.75 1.488A2.25 2.25 0 0 1 6.75 18v-2.625A3.375 3.375 0 0 1 6 12a3.375 3.375 0 0 1 3-3.375" />
                </svg>
              Original Application
            </h4>
            <Tooltip text={TOOLTIP_DEFINITIONS.EPISTOLARY_APPLICATION} />
        </div>
        <ClickableText text={data.originalApplication} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} className="text-text-main leading-relaxed pl-7" />
      </div>
    </div>
  );
};