import React from 'react';
import type { ContextAnalysisData } from '../types';
import { TOOLTIP_DEFINITIONS } from '../tooltipContent';
import { ClickableText } from './ClickableText';
import { Section } from './Section';

interface ContextAnalysisProps {
  data: ContextAnalysisData;
  onReferenceSelect: (reference: string) => void;
  onThemeSelect: (theme: string) => void;
}

export const ContextAnalysis: React.FC<ContextAnalysisProps> = ({ data, onReferenceSelect, onThemeSelect }) => {
  if (!data) {
    return <p className="text-text-muted">No context analysis available.</p>;
  }

  return (
    <div className="space-y-2">
      <Section 
        title="Historical & Cultural Context" 
        tooltipText={TOOLTIP_DEFINITIONS.HISTORICAL_CULTURAL}
        relevance={<ClickableText text={data.historicalAndCultural?.relevance} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} as="div" />}
        icon={
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-accent">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
        </svg>
      }>
        <ClickableText text={data.historicalAndCultural?.content} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} />
      </Section>

      <Section 
        title="Original Audience" 
        tooltipText={TOOLTIP_DEFINITIONS.ORIGINAL_AUDIENCE} 
        relevance={<ClickableText text={data.originalAudience?.relevance} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} as="div" />}
        icon={
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-accent">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962A3.75 3.75 0 0 1 15 12a3.75 3.75 0 0 1-2.25 3.512m-3.75 1.488A2.25 2.25 0 0 1 6.75 18v-2.625A3.375 3.375 0 0 1 6 12a3.375 3.375 0 0 1 3-3.375" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12a10.49 10.49 0 0 1 3.536-7.536A10.49 10.49 0 0 1 12 2.25c4.133 0 7.917 2.373 9.764 6.096" />
        </svg>
      }>
        <ClickableText text={data.originalAudience?.content} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} />
      </Section>
      
       <Section 
            title="Authorial Intent" 
            tooltipText={TOOLTIP_DEFINITIONS.AUTHORIAL_INTENT} 
            relevance={<ClickableText text={data.authorialIntent?.relevance} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} as="div" />}
            icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-accent">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
          </svg>
      }>
        <ClickableText text={data.authorialIntent?.content} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} />
      </Section>

      <Section 
            title="Canonical Context" 
            tooltipText={TOOLTIP_DEFINITIONS.CANONICAL_CONTEXT} 
            relevance={<ClickableText text={data.canonicalContext?.relevance} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} as="div" />}
            icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-accent">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zm20 0h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
      }>
        <ClickableText text={data.canonicalContext?.content} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} />
      </Section>
      
      <Section 
            title="Thematic Connections" 
            tooltipText={TOOLTIP_DEFINITIONS.THEMATIC_CONNECTIONS} 
            relevance={<ClickableText text={data.thematicConnections?.relevance} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} as="div" />}
            icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-accent">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
          </svg>
      }>
        <ClickableText text={data.thematicConnections?.content} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} />
      </Section>
    </div>
  );
};
