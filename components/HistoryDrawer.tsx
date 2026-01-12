
import React from 'react';
import type { HistoryItem } from '../types';
import { useAppContext } from '../context/AppContext';

const getHistoryItemDisplay = (item: HistoryItem) => {
    switch (item.mode) {
        case 'reference':
            const refString = item.startVerse === item.endVerse 
                ? `${item.book} ${item.chapter}:${item.startVerse}`
                : `${item.book} ${item.chapter}:${item.startVerse}-${item.endVerse}`;
            return {
                icon: '📖',
                type: 'Reference',
                details: refString
            };
        case 'topic':
            return {
                icon: '💡',
                type: 'Topic',
                details: item.topic
            };
        case 'qa':
            return {
                icon: '❓',
                type: 'Q&A',
                details: item.question
            };
        case 'event':
            return {
                icon: '📜',
                type: 'Event',
                details: item.event
            };
        case 'storyArc':
            return {
                icon: '📈',
                type: 'Story Arc',
                details: item.storyArc
            };
        case 'chat':
            return {
                icon: '💬',
                type: 'Chat',
                details: `Conversation about ${item.subject}`
            };
        case 'systematic':
            return {
                icon: '📚',
                type: 'Systematic',
                details: `${item.level}: ${item.topic}`
            };
    }
}

export const HistoryDrawer: React.FC = () => {
  const {
    isHistoryOpen,
    setIsHistoryOpen,
    studyHistory,
    handleHistorySelect,
    handleClearHistory,
  } = useAppContext();

  if (!isHistoryOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isHistoryOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsHistoryOpen(false)}
        aria-hidden="true"
      ></div>

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-full max-w-md bg-secondary shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isHistoryOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-drawer-title"
      >
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
            <h2 id="history-drawer-title" className="text-lg font-semibold text-accent-light flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              Study History
            </h2>
            <button
              onClick={() => setIsHistoryOpen(false)}
              className="p-1 rounded-full text-text-muted hover:bg-primary/80 hover:text-text-main transition-colors"
              aria-label="Close history drawer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </header>

          <div className="flex-grow overflow-y-auto custom-scrollbar p-2">
            {studyHistory.length === 0 ? (
                <div className="text-center p-8 text-text-muted">
                    <p>Your study history is empty.</p>
                    <p className="text-sm">Analyses you run will appear here.</p>
                </div>
            ) : (
                <ul className="space-y-1">
                    {studyHistory.map((item, index) => {
                        const displayInfo = getHistoryItemDisplay(item);
                        if (!displayInfo) return null;
                        const { icon, type, details } = displayInfo;
                        const key = `${type}-${details.substring(0, 50)}-${index}`;
                        return (
                             <li key={key}>
                                <button onClick={() => handleHistorySelect(item)} className="w-full text-left p-3 rounded-lg hover:bg-primary/50 transition-colors flex items-start gap-3">
                                    <span className="text-xl mt-1">{icon}</span>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-bold uppercase tracking-wider text-accent">{type}</p>
                                        <p className="text-text-main truncate">{details}</p>
                                    </div>
                                </button>
                             </li>
                        );
                    })}
                </ul>
            )}
          </div>
           {studyHistory.length > 0 && (
            <footer className="p-4 border-t border-gray-700 flex-shrink-0">
                <button
                    onClick={handleClearHistory}
                    className="w-full flex items-center justify-center gap-2 text-sm bg-red-900/40 text-red-300 hover:bg-red-900/60 py-2 rounded-lg transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    Clear History
                </button>
            </footer>
           )}
        </div>
      </aside>
    </>
  );
};
