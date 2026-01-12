import React from 'react';
import type { StructuralAnalysisData } from '../types';
import { TOOLTIP_DEFINITIONS, LITERARY_DEVICE_DEFINITIONS } from '../tooltipContent';
import { NarrativeFlow } from './NarrativeFlow';
import { ClickableText } from './ClickableText';
import { Section } from './Section';

interface StructuralAnalysisProps {
    data: StructuralAnalysisData;
    onReferenceSelect: (reference: string) => void;
    onThemeSelect: (theme: string) => void;
}

const DeviceWithTooltip: React.FC<{ device: string }> = ({ device }) => {
    // A simple lookup. Case-insensitive to handle variations from the AI.
    const definition = Object.entries(LITERARY_DEVICE_DEFINITIONS).find(([key]) => key.toLowerCase() === device.toLowerCase())?.[1] || "A literary technique used by the author for a specific effect.";

    return (
        <div className="relative group flex items-center">
            <span className="py-1 px-2.5 rounded-full text-sm bg-primary/80 border border-slate-600 text-text-muted cursor-help">{device}</span>
            <div className="absolute bottom-full mb-2 w-72 bg-primary p-3 rounded-lg text-sm text-text-main shadow-lg border border-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none transform -translate-x-1/2 left-1/2 z-10">
                <p className="font-bold text-accent-light mb-1">{device}</p>
                {definition}
                 <svg
                    className="absolute text-primary h-2 w-full left-0 top-full"
                    x="0px"
                    y="0px"
                    viewBox="0 0 255 255"
                >
                    <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
                </svg>
            </div>
        </div>
    );
};

export const StructuralAnalysis: React.FC<StructuralAnalysisProps> = ({ data, onReferenceSelect, onThemeSelect }) => {
  if (!data) {
    return <p className="text-text-muted">No structural analysis available.</p>;
  }

  return (
    <div className="space-y-2">
        {/* 1. Literary Genre - The Foundation */}
        <Section 
            title="Literary Genre" 
            tooltipText={TOOLTIP_DEFINITIONS.LITERARY_GENRE} 
            relevance={<ClickableText text={data.literaryGenre?.relevance} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} as="div" />}
            icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-accent">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
            }
        >
            <ClickableText text={data.literaryGenre?.content} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} />
        </Section>
        
        {/* 2. Passage Outline - The Skeleton */}
        <Section 
            title="Passage Outline" 
            tooltipText={TOOLTIP_DEFINITIONS.PASSAGE_OUTLINE} 
            relevance={<ClickableText text={data.passageOutline?.relevance} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} as="div" />}
            icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-accent">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
            }
        >
            <ul className="space-y-2">
                {data.passageOutline?.items?.map((item, index) => (
                    <li key={index} className="flex items-start bg-primary/30 p-2 rounded border border-gray-700/50">
                        <span className="font-bold text-accent-light w-20 flex-shrink-0 text-sm mt-0.5">{item.verses}</span>
                        <ClickableText text={item.point} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} className="text-sm" as="span" />
                    </li>
                ))}
            </ul>
        </Section>

        {/* 3. Narrative Flow */}
        {data.narrativeFlow && data.narrativeFlow.isNarrative && (
             <Section 
                title="Narrative Flow" 
                tooltipText={TOOLTIP_DEFINITIONS.NARRATIVE_FLOW} 
                icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-accent">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.092 1.21-.138 2.43-.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7Zm-16.5 0a3.004 3.004 0 0 1 3-3h10.5a3.004 3.004 0 0 1 3 3v2.25a3.004 3.004 0 0 1-3 3H6a3.004 3.004 0 0 1-3-3V12Z" />
                    </svg>
                }
            >
                <NarrativeFlow data={data.narrativeFlow} />
            </Section>
        )}

        {/* 4. Discourse Analysis - Connection to Context */}
        <Section 
            title="Discourse Analysis" 
            tooltipText={TOOLTIP_DEFINITIONS.DISCOURSE_ANALYSIS} 
            relevance={<ClickableText text={data.discourseAnalysis?.relevance} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} as="div" />}
            icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-accent">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                </svg>
            }
        >
            <ClickableText text={data.discourseAnalysis?.content} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} />
        </Section>

        {/* 5. Literary Devices - The Style */}
        <Section 
            title="Literary Devices" 
            tooltipText={TOOLTIP_DEFINITIONS.LITERARY_DEVICES} 
            relevance={<ClickableText text={data.literaryDevices?.relevance} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} as="div" />}
            icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-accent">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                </svg>
            }
        >
             <div className="flex flex-wrap gap-2">
                {data.literaryDevices?.items?.map((device, index) => (
                    <DeviceWithTooltip key={index} device={device} />
                ))}
            </div>
        </Section>

        {/* 6. Figures of Speech */}
        {data.figuresOfSpeech && data.figuresOfSpeech.length > 0 && (
            <Section 
                title="Figures of Speech" 
                tooltipText={TOOLTIP_DEFINITIONS.FIGURES_OF_SPEECH} 
                icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-accent">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
                    </svg>
                }
            >
                <div className="space-y-3">
                    {data.figuresOfSpeech.map((item, index) => (
                        <div key={index} className="bg-primary/30 p-3 rounded border border-gray-700/50">
                            <h5 className="font-bold text-accent-light">{item.figure}</h5>
                            <blockquote className="text-sm italic text-gray-300 my-1 border-l-2 border-gray-500 pl-2">
                                <ClickableText text={`"${item.example}"`} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} as="span" />
                            </blockquote>
                            <ClickableText text={item.explanation} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} className="text-sm text-text-main" />
                        </div>
                    ))}
                </div>
            </Section>
        )}
        
        {/* 7. Grammatical Highlights - The Fine Details */}
        <Section 
            title="Grammatical Highlights" 
            tooltipText={TOOLTIP_DEFINITIONS.GRAMMATICAL_HIGHLIGHTS} 
            relevance={<ClickableText text={data.grammaticalHighlights?.relevance} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} as="div" />}
            icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-accent">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                </svg>
            }
        >
            <ClickableText text={data.grammaticalHighlights?.content} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} />
        </Section>
    </div>
  );
};