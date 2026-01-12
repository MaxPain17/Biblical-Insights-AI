
import React from 'react';
import type { NarrativeFlowAnalysis } from '../types';

interface SectionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, icon, children }) => (
    <div className="bg-primary/30 p-4 rounded-lg border border-gray-700/50">
        <h5 className="text-sm font-bold text-accent-light uppercase tracking-wider mb-2 flex items-center gap-2">
            {icon}
            {title}
        </h5>
        <div className="text-text-main text-sm leading-relaxed">{children}</div>
    </div>
);


export const NarrativeFlow: React.FC<{ data: NarrativeFlowAnalysis }> = ({ data }) => {
    if (!data || !data.isNarrative) {
        return <p className="text-text-muted">This passage is not identified as a narrative genre.</p>;
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Section title="Setting" icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                }>
                    <p>{data.setting}</p>
                </Section>
                 <Section title="Characters" icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.53-2.475M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-4.663M12 3.375c-3.45 0-6.375 2.825-6.375 6.375s2.825 6.375 6.375 6.375 6.375-2.825 6.375-6.375S15.45 3.375 12 3.375Z" />
                    </svg>
                }>
                    <ul className="space-y-1">
                        {data.characters.map((char, index) => (
                            <li key={index}>
                                <span className="font-semibold text-text-main">{char.name}:</span>
                                <span className="text-text-muted"> {char.role}</span>
                            </li>
                        ))}
                    </ul>
                </Section>
            </div>

            <Section title="Plot Summary" icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            }>
                <p>{data.plotSummary}</p>
            </Section>

             <Section title="Narrative Technique" icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
            }>
                <p>{data.narrativeTechnique}</p>
            </Section>

             <Section title="Thematic Development" icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                </svg>
            }>
                <p>{data.thematicDevelopment}</p>
            </Section>

        </div>
    );
};
