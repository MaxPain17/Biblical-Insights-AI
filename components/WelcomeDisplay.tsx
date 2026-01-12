

import React from 'react';
import type { AnalysisMode } from '../types';

const modeInfo = {
    reference: {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="w-16 h-16 text-accent mb-4 stroke-url(#icon-gradient)">
                 <defs>
                    <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#22D3EE" />
                    </linearGradient>
                </defs>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
        ),
        title: 'Verse Analysis',
        description: 'Get a comprehensive, verse-by-verse breakdown of any passage. Select a single verse, a range, or let the AI find the full paragraph.',
        features: [
            'King James Version (KJV) Passage Text',
            'Original Language Word-by-Word Analysis',
            'Historical, Cultural, and Canonical Context',
            'Literary Structure, Genre, and Devices',
            'Genre-Specific Insights (e.g., Gospel Harmony)',
            'Comprehensive Commentary & Life Application',
            'Textual Criticism (Manuscript Variants)',
        ]
    },
    topic: {
        icon: (
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="w-16 h-16 text-accent mb-4 stroke-url(#icon-gradient)">
                 <defs>
                    <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#22D3EE" />
                    </linearGradient>
                </defs>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
        ),
        title: 'Thematic Study',
        description: 'Explore major biblical themes or ask complex theological questions. This mode accepts either a simple topic or a full question.',
        features: [
            'Comprehensive summary & biblical definition',
            'Trace themes from OT foundation to NT fulfillment',
            'Get scripture-supported answers to your questions',
            'Understand diverse orthodox perspectives',
            'Address common misconceptions and apparent contradictions',
            'Curated key verses for foundational study'
        ]
    },
    qa: { // This will be used when the mode is switched to qa by the input handler
        icon: (
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="w-16 h-16 text-accent mb-4 stroke-url(#icon-gradient)">
                 <defs>
                    <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#22D3EE" />
                    </linearGradient>
                </defs>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg>
        ),
        title: 'Thematic Study',
        description: 'Explore major biblical themes or ask complex theological questions. This mode accepts either a simple topic or a full question.',
         features: [
            'Comprehensive summary & biblical definition',
            'Trace themes from OT foundation to NT fulfillment',
            'Get scripture-supported answers to your questions',
            'Understand diverse orthodox perspectives',
            'Address common misconceptions and apparent contradictions',
            'Curated key verses for foundational study'
        ]
    },
    event: {
        icon: (
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="w-16 h-16 text-accent mb-4 stroke-url(#icon-gradient)">
                 <defs>
                    <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#22D3EE" />
                    </linearGradient>
                </defs>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
        ),
        title: 'Event Analysis',
        description: 'Unpack biblical parables, miracles, and key historical events with detailed narrative analysis.',
        features: [
            'Full passage text with a detailed summary',
            'Analysis of characters and symbolic elements',
            'Original audience interpretation to prevent misreading',
            'Theological deep dive into primary & secondary themes',
            'Lexical analysis of key Greek/Hebrew words'
        ]
    },
    storyArc: {
        icon: (
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="w-16 h-16 text-accent mb-4 stroke-url(#icon-gradient)">
                 <defs>
                    <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#22D3EE" />
                    </linearGradient>
                </defs>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
            </svg>
        ),
        title: 'Story Arc Explorer',
        description: "Zoom out to see the bigger picture. Select a major biblical narrative to understand its timeline, characters, and theological significance.",
        features: [
            'High-level summary of the narrative\'s role',
            'Chronological timeline of key events',
            'In-depth analysis of character development',
            'Connections to major, overarching biblical themes',
            'Christological significance (how OT points to Christ)'
        ]
    },
    systematic: {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="w-16 h-16 text-accent mb-4 stroke-url(#icon-gradient)">
                <defs>
                    <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#22D3EE" />
                    </linearGradient>
                </defs>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0h9.75m-9.75-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
        ),
        title: 'Guided Study',
        description: 'Learn theology step-by-step with a guided study plan tailored to your knowledge level, from beginner to advanced.',
        features: [
            'Structured learning path through core doctrines',
            'Choose from Beginner, Intermediate, or Advanced levels',
            'Clear explanations of complex theological topics',
            'Key verses provided for each study point',
            'Reflection questions to deepen understanding',
            'A logical progression from one doctrine to the next'
        ]
    },
};

interface WelcomeDisplayProps {
    mode: AnalysisMode;
}

export const WelcomeDisplay: React.FC<WelcomeDisplayProps> = ({ mode }) => {
    const activeMode = mode === 'chat' ? 'reference' : mode;
    const { icon, title, description, features } = modeInfo[activeMode];

    return (
        <div className="flex flex-col items-center justify-center bg-secondary/50 border border-gray-700/50 p-8 rounded-xl shadow-lg min-h-[400px]">
            {icon}
            <h2 className="text-2xl font-semibold mb-2 text-text-main">{title}</h2>
            <p className="text-text-muted text-center max-w-md mb-8 leading-relaxed">{description}</p>
            
            <div className="bg-primary/40 rounded-lg p-6 w-full max-w-md border border-gray-700/50">
                <h3 className="text-sm font-bold text-accent-light uppercase tracking-wider mb-3">What to expect</h3>
                <ul className="space-y-3">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-accent mr-3 flex-shrink-0">
                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                            </svg>
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
