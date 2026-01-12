
import React from 'react';
import type { VerseAnalysis, ConnectionType } from '../types';

interface ConnectionsDisplayProps {
  analysis: VerseAnalysis;
  onStoryArcSelect: (arcName: string) => void;
  onThemeSelect: (theme: string) => void;
  onSwitchTab: (tab: any) => void;
}

const connectionConfig: Record<ConnectionType, { icon: React.ReactNode; color: string }> = {
    'Story Arc': {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>,
        color: 'border-rose-400 text-rose-300',
    },
    'Key Theme': {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>,
        color: 'border-sky-400 text-sky-300',
    },
    'Key Figure': {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.53-2.475M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-4.663M12 3.375c-3.45 0-6.375 2.825-6.375 6.375s2.825 6.375 6.375 6.375 6.375-2.825 6.375-6.375S15.45 3.375 12 3.375Z" /></svg>,
        color: 'border-amber-400 text-amber-300',
    },
    'Key Doctrine': {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" /></svg>,
        color: 'border-indigo-400 text-indigo-300',
    },
    'Symbol': {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" /></svg>,
        color: 'border-fuchsia-400 text-fuchsia-300',
    },
    'Typology': {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>,
        color: 'border-teal-400 text-teal-300',
    },
    'Prophetic Link': {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>,
        color: 'border-lime-400 text-lime-300',
    },
    'Covenant': {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>,
        color: 'border-violet-400 text-violet-300',
    }
};

export const ConnectionsDisplay: React.FC<ConnectionsDisplayProps> = ({ analysis, onStoryArcSelect, onThemeSelect, onSwitchTab }) => {
  if (!analysis.connections || analysis.connections.length === 0) {
    return <p className="text-text-muted">No specific connections were synthesized for this passage.</p>;
  }
  
  const handleCardClick = (type: ConnectionType, title: string) => {
    switch(type) {
        case 'Story Arc':
            onStoryArcSelect(title);
            break;
        case 'Key Theme':
        case 'Key Doctrine':
            onThemeSelect(title);
            break;
        case 'Key Figure':
            onSwitchTab('characters');
            break;
        case 'Symbol':
            onSwitchTab('symbolism');
            break;
        case 'Typology':
            onSwitchTab('typology');
            break;
        case 'Prophetic Link':
            onSwitchTab('prophetic');
            break;
        case 'Covenant':
            onSwitchTab('covenantal');
            break;
    }
  };

  return (
    <div className="space-y-6">
        <div className="bg-accent/10 border-l-4 border-accent p-4 rounded-r-lg">
            <h3 className="font-bold text-accent-light">Starting with the Big Picture</h3>
            <p className="text-sm text-accent-light/80 mt-1">
                Good interpretation starts here. Before diving into details, understand how this passage connects to the Bible's main stories, themes, and figures. Use these connections as a guide for your study.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.connections.map((item, index) => {
                const { icon, color } = connectionConfig[item.type];
                return (
                    <button 
                        key={index} 
                        onClick={() => handleCardClick(item.type, item.title)}
                        className={`group bg-primary/40 p-4 rounded-lg border-l-4 ${color} text-left transition-all hover:bg-primary/80 hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary focus:ring-accent-light`}
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">{icon}</div>
                            <div className="flex-1">
                                <p className="text-xs font-bold uppercase tracking-wider opacity-80">{item.type}</p>
                                <h4 className="text-lg font-bold text-text-main mt-1">{item.title}</h4>
                                <p className="text-sm text-text-muted mt-2">{item.description}</p>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    </div>
  );
};