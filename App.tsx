

import React, { useEffect, useState, useCallback } from 'react';
import { BibleSelector } from './components/BibleSelector';
import { Spinner } from './components/Spinner';
import { HistoryDrawer } from './components/HistoryDrawer';
import { Toast } from './components/Toast';
import { MainContentTabs } from './components/MainContentTabs';
import { useAppContext } from './context/AppContext';
import { generateStudyKey } from './utils/generateStudyKey';
import { ChatFAB } from './components/ChatFAB';
import { SelectionToolbar } from './components/SelectionToolbar';
import { Onboarding } from './components/Onboarding';
import { SettingsControl } from './components/SettingsControl';
import { MobileMenuDrawer } from './components/MobileMenuDrawer';
import { RenameGroupModal } from './components/RenameGroupModal';
import { AboutModal } from './components/AboutModal';
import { HistoryItem } from './types';

const App: React.FC = () => {
  const {
    isLoading,
    isChatLoading,
    activeStudies,
    studyData,
    activeTabIndex,
    activeSubTabIndex,
    toastMessage,
    isHistoryOpen,
    setIsHistoryOpen,
    selectionToolbarState,
    setSelectionToolbarState,
    language,
    t,
    setIsMobileMenuOpen,
    renamingGroupInfo,
    handleRenameGroup,
    setRenamingGroupInfo,
  } = useAppContext();

  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  useEffect(() => {
    const handleMouseUp = (event: MouseEvent) => {
      const toolbar = (event.target as HTMLElement).closest('[data-selection-toolbar]');
      if (toolbar) return;

      const selection = window.getSelection();
      const selectedText = selection ? selection.toString().trim() : '';

      if (selectedText && selectedText.length > 2) { // Only show for selections > 2 chars
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        const target = range.startContainer.parentElement;
        const isEditable = target?.isContentEditable || ['INPUT', 'TEXTAREA'].includes(target?.tagName || '');
        
        if (isEditable) {
          if (selectionToolbarState.visible) {
            setSelectionToolbarState({ visible: false, text: '', top: 0, left: 0 });
          }
          return;
        }

        setSelectionToolbarState({
            visible: true,
            text: selectedText,
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX + rect.width / 2,
        });
      }
    };

    const handleInteraction = (event: MouseEvent | TouchEvent) => {
      if (selectionToolbarState.visible) {
        const toolbar = (event.target as HTMLElement).closest('[data-selection-toolbar]');
        if (!toolbar) {
          setSelectionToolbarState({ visible: false, text: '', top: 0, left: 0 });
        }
      }
    };

    const handleScroll = () => {
      if (selectionToolbarState.visible) {
        setSelectionToolbarState({ visible: false, text: '', top: 0, left: 0 });
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [selectionToolbarState.visible, setSelectionToolbarState]);


  // FIX: Correctly get the active study item from a group or a single tab.
  const getActiveStudy = useCallback((): HistoryItem | null => {
    const activeItem = activeStudies[activeTabIndex];
    if (!activeItem) return null;
    if ('isGroup' in activeItem) {
        return activeItem.items[activeSubTabIndex] ?? null;
    }
    return activeItem;
  }, [activeStudies, activeTabIndex, activeSubTabIndex]);

  const activeStudy = getActiveStudy();
  const activeStudyKey = activeStudy ? generateStudyKey(activeStudy, language) : null;

  return (
    <div className="min-h-screen bg-primary font-sans text-text-main p-4 md:p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-primary to-primary">
        <div className="fixed top-4 right-4 md:top-8 md:right-8 z-30">
          <div className="flex items-center gap-1 p-1.5 rounded-xl border border-gray-700/60 bg-secondary/50">
             <button
              onClick={() => setIsAboutModalOpen(true)}
              className="bg-transparent text-white h-10 w-10 rounded-lg flex items-center justify-center transition-colors hover:bg-accent/20 focus:outline-none focus:ring-2 focus:ring-accent/50"
              aria-label="About this app"
              title="About this app"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-text-muted">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </button>
            <SettingsControl />
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="bg-transparent text-white h-10 w-10 rounded-lg flex items-center justify-center transition-colors hover:bg-accent/20 focus:outline-none focus:ring-2 focus:ring-accent/50"
              aria-label="View study history"
              title="View study history"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-text-muted transition-colors">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </button>
          </div>
        </div>
      <div className="max-w-7xl mx-auto relative">
        <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-center mb-8 md:mb-12">
            <div className="flex justify-start">
                {activeStudies.length > 0 && (
                  <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="lg:hidden bg-secondary/50 border border-gray-700/60 text-white h-12 w-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                    aria-label="Open study menu"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                  </button>
                )}
            </div>

            <div> {/* Centered content */}
                <div className="flex items-center justify-center gap-2 md:gap-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="w-8 h-8 md:w-10 md:h-10 text-accent stroke-url(#icon-gradient)">
                    <defs>
                      <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#22D3EE" />
                      </linearGradient>
                    </defs>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                  <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-light to-secondary-accent pb-1">
                    Biblical Insights AI
                  </h1>
                </div>
            </div>

            <div className="flex justify-end">
                {/* This empty div acts as a spacer, taking up 1fr of space to balance the left column */}
            </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
          {activeStudies.length > 0 && (
            <div className="hidden lg:block lg:col-span-4 space-y-6">
              <div className="bg-secondary/50 backdrop-blur-sm border border-gray-700/50 p-6 rounded-xl shadow-lg sticky top-8">
                <BibleSelector />
              </div>
            </div>
          )}

          <div className={activeStudies.length > 0 ? "col-span-12 lg:col-span-8" : "col-span-12"}>
            {activeStudies.length === 0 ? (
                (isLoading || isChatLoading) ? <div className="mt-20"><Spinner /></div> : <Onboarding />
            ) : (
              <MainContentTabs />
            )}
            {activeStudies.length > 0 && isLoading && activeStudyKey && !studyData[activeStudyKey] && <Spinner />}
          </div>
          
          <MobileMenuDrawer />
          {isHistoryOpen && <HistoryDrawer />}
        </main>
        
        <ChatFAB />
        <Toast message={toastMessage} />
        <SelectionToolbar />
        {renamingGroupInfo && (
            <RenameGroupModal
                isOpen={!!renamingGroupInfo}
                currentName={renamingGroupInfo.currentName}
                onClose={() => setRenamingGroupInfo(null)}
                onSave={handleRenameGroup}
            />
        )}
        <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
      </div>
    </div>
  );
};

export default App;
