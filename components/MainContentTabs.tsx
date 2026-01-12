import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { HistoryItem, AnalysisResult, VerseAnalysis, ThematicAnalysis, QaAnalysis, EventAnalysis, StoryArcAnalysis, ChatAnalysis, SystematicAnalysis, TabItem, TabGroup } from '../types';
import { generateStudyKey, getStudyTitle } from '../utils/generateStudyKey';
import { VerseDisplay } from './VerseDisplay';
import { AnalysisTabs } from './AnalysisTabs';
import { ThematicResultsDisplay } from './ThematicResultsDisplay';
import { QaDisplay } from './QaDisplay';
import { EventDisplay } from './EventDisplay';
import { StoryArcDisplay } from './StoryArcDisplay';
import { ChatDisplay } from './ChatDisplay';
import { SystematicDisplay } from './SystematicDisplay';
import { useAppContext } from '../context/AppContext';
import { ErrorDisplay } from './ErrorDisplay';
import { TabContextMenu } from './TabContextMenu';

type DraggedItem = { type: 'tab', index: number } | { type: 'sub-tab', groupIndex: number, subIndex: number };

const Tab: React.FC<{
    study: HistoryItem;
    isActive: boolean;
    onClick: () => void;
    onClose: () => void;
    onContextMenu: (e: React.MouseEvent) => void;
    onDragStart: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onDragEnter: (e: React.DragEvent) => void;
    isGroupingTarget: boolean;
}> = ({ study, isActive, onClick, onClose, onContextMenu, onDragStart, onDrop, onDragEnter, isGroupingTarget }) => {

    return (
        <div
            draggable
            onDragStart={onDragStart}
            onDrop={onDrop}
            onDragEnter={onDragEnter}
            onClick={onClick}
            onContextMenu={onContextMenu}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
            role="button"
            tabIndex={0}
            className={`flex-shrink-0 flex items-center gap-2 py-2 pl-4 pr-3 rounded-t-lg cursor-pointer transition-all duration-150 group relative focus:outline-none focus:ring-2 focus:ring-accent ${
                isActive
                    ? 'bg-secondary/50 text-text-main -mb-px' 
                    : 'bg-primary/50 text-text-muted hover:bg-secondary/40'
            } ${isGroupingTarget ? 'scale-110 z-20 group-target-glow' : ''}`}
        >
            <span className="text-sm font-medium truncate pointer-events-none">{getStudyTitle(study, 'en')}</span>
            <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="p-1.5 rounded-full text-gray-500 group-hover:text-gray-300 group-hover:bg-gray-600/50 transition-colors"
                aria-label={`Close tab for ${getStudyTitle(study, 'en')}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
            {!isActive && <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-700/50"></div>}
        </div>
    );
};


export const MainContentTabs: React.FC = () => {
    const {
        activeStudies: studies, studyData, activeTabIndex, activeSubTabIndex, setActiveTab, handleCloseTab,
        isLoading, isChatLoading, error, handleNewStudy, handleCrossReferenceSelect, handleReferenceSelectInChat, handleThemeSelect, handleThemeSelectInChat,
        handleSendChatMessage, handleReorderTabs, language, handleAnalyzeNext, handleAnalyzePrevious,
        handleAnalyzeFullPassage, handleCloseOtherTabs, handleCloseTabsToRight, handleCloseAllTabs,
        handleCreateTabGroup, handleAddToGroup, handleUngroupTab, startRenameGroup,
        expandedGroupId, setExpandedGroupId,
        isGroupSelectionMode, selectedTabsForGrouping, targetGroupForAdding,
        startGroupSelectionMode, cancelGroupSelectionMode, toggleTabForGrouping, toggleGroupForTargeting,
        handleCreateGroupFromSelection, handleAddToGroupFromSelection,
        handleMoveTabOutOfGroup, handleReorderInGroup, handleRemoveFromGroup,
    } = useAppContext();
    
    const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
    const [groupingTarget, setGroupingTarget] = useState<DraggedItem | null>(null);
    const dragOverTimeoutRef = useRef<number | null>(null);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; tabIndex: number; subTabIndex?: number; } | null>(null);
    
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    useEffect(() => {
        if (!isGroupSelectionMode) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                cancelGroupSelectionMode();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isGroupSelectionMode, cancelGroupSelectionMode]);

    const handleDragStart = (e: React.DragEvent, item: DraggedItem) => {
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('application/json', JSON.stringify(item));
        setExpandedGroupId(null); // Collapse groups on drag
    };

    const handleDragEnter = (e: React.DragEvent, item: DraggedItem) => {
        if (!draggedItem || (draggedItem.type === item.type && 'index' in draggedItem && 'index' in item && draggedItem.index === item.index)) return;
        clearTimeout(dragOverTimeoutRef.current!);
        dragOverTimeoutRef.current = window.setTimeout(() => {
            if (draggedItem) setGroupingTarget(item);
        }, 500);
    };

    const handleDragLeave = () => {
        clearTimeout(dragOverTimeoutRef.current!);
        setGroupingTarget(null);
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropTarget: DraggedItem) => {
        e.preventDefault();
        clearTimeout(dragOverTimeoutRef.current!);
        if (!draggedItem) return;

        const isGrouping = !!groupingTarget;

        // --- Handle Reordering and Grouping ---
        if (draggedItem.type === 'tab' && dropTarget.type === 'tab') {
            isGrouping ? handleCreateTabGroup(draggedItem.index, dropTarget.index) : handleReorderTabs(draggedItem.index, dropTarget.index);
        } else if (draggedItem.type === 'tab' && dropTarget.type === 'sub-tab') {
            handleAddToGroup(draggedItem.index, dropTarget.groupIndex);
        } else if (draggedItem.type === 'sub-tab' && dropTarget.type === 'sub-tab' && draggedItem.groupIndex === dropTarget.groupIndex) {
            handleReorderInGroup(draggedItem.groupIndex, draggedItem.subIndex, dropTarget.subIndex);
        } else if (draggedItem.type === 'sub-tab' && dropTarget.type === 'tab') {
            handleMoveTabOutOfGroup(draggedItem.groupIndex, draggedItem.subIndex, dropTarget.index);
        }
        
        setDraggedItem(null);
        setGroupingTarget(null);
    };

    const handleDropOnContainer = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (draggedItem?.type === 'sub-tab') {
            handleMoveTabOutOfGroup(draggedItem.groupIndex, draggedItem.subIndex, studies.length);
        }
        setDraggedItem(null);
        setGroupingTarget(null);
    }
    
    const handleDragEnd = () => {
        setDraggedItem(null);
        setGroupingTarget(null);
        clearTimeout(dragOverTimeoutRef.current!);
    };

    const handleContextMenu = (e: React.MouseEvent, tabIndex: number, subTabIndex?: number) => {
        e.preventDefault();
        setContextMenu({ x: e.pageX, y: e.pageY, tabIndex, subTabIndex });
    };

    const handleRename = () => {
        if (contextMenu === null) return;
        startRenameGroup(contextMenu.tabIndex);
    };
    
    const getActiveStudy = useCallback((): HistoryItem | null => {
        const activeItem = studies[activeTabIndex];
        if (!activeItem) return null;
        if ('isGroup' in activeItem) {
            return activeItem.items[activeSubTabIndex] ?? null;
        }
        return activeItem;
    }, [studies, activeTabIndex, activeSubTabIndex]);

    const checkOverflow = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        const hasOverflow = container.scrollWidth > container.clientWidth;
        setIsOverflowing(hasOverflow);
        setCanScrollLeft(container.scrollLeft > 5);
        setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 5);
    }, []);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        checkOverflow();
        const resizeObserver = new ResizeObserver(checkOverflow);
        resizeObserver.observe(container);
        container.addEventListener('scroll', checkOverflow, { passive: true });
        return () => {
            resizeObserver.disconnect();
            container.removeEventListener('scroll', checkOverflow);
        };
    }, [checkOverflow, studies.length, expandedGroupId, isGroupSelectionMode]);

    const handleScroll = (direction: 'left' | 'right') => {
        scrollContainerRef.current?.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
    };

    const renderActiveTabContent = () => {
        const activeStudy = getActiveStudy();
        if (!activeStudy) return null;
        const key = generateStudyKey(activeStudy, language);
        const otherLangKey = generateStudyKey(activeStudy, language === 'en' ? 'tl' : 'en');
        
        const dataToRender = studyData[key] ?? studyData[otherLangKey];
        const showTranslationPrompt = !studyData[key] && !!studyData[otherLangKey];
        
        if (error && !dataToRender) return <ErrorDisplay message={error} />;
        if (!dataToRender) return null;

        const content = (() => {
            switch (activeStudy.mode) {
                 case 'reference': return (<><VerseDisplay book={activeStudy.book} chapter={activeStudy.chapter} startVerse={activeStudy.startVerse} endVerse={activeStudy.endVerse} analysis={dataToRender as VerseAnalysis} onAnalyzeNext={handleAnalyzeNext} onAnalyzePrevious={handleAnalyzePrevious} onAnalyzeFullPassage={handleAnalyzeFullPassage} isLoading={isLoading} onReferenceSelect={handleCrossReferenceSelect} onThemeSelect={(theme) => handleThemeSelect(theme)} onStartChat={(subject) => handleNewStudy({ mode: 'chat', subject })}/><AnalysisTabs analysis={dataToRender as VerseAnalysis} onReferenceSelect={handleCrossReferenceSelect} onDoctrineSelect={(doctrine) => handleNewStudy({ mode: 'topic', topic: doctrine })} onStoryArcSelect={(arc) => handleNewStudy({ mode: 'storyArc', storyArc: arc })} onThemeSelect={handleThemeSelect}/></>);
                case 'topic': return <ThematicResultsDisplay data={dataToRender as ThematicAnalysis} onReferenceSelect={handleCrossReferenceSelect} onThemeSelect={(theme) => handleThemeSelect(theme)} onStartChat={(subject) => handleNewStudy({ mode: 'chat', subject })} />;
                case 'qa': return <QaDisplay data={dataToRender as QaAnalysis} onReferenceSelect={handleCrossReferenceSelect} onThemeSelect={(theme) => handleThemeSelect(theme)} onQuestionSelect={(q) => handleNewStudy({mode: 'qa', question: q})} onStartChat={(subject) => handleNewStudy({ mode: 'chat', subject })} />;
                case 'event': return <EventDisplay data={dataToRender as EventAnalysis} onReferenceSelect={handleCrossReferenceSelect} onThemeSelect={(theme) => handleThemeSelect(theme)} onQuestionSelect={(q) => handleNewStudy({mode: 'qa', question: q})} onStartChat={(subject) => handleNewStudy({ mode: 'chat', subject })} />;
                case 'storyArc': return <StoryArcDisplay data={dataToRender as StoryArcAnalysis} onReferenceSelect={handleCrossReferenceSelect} onThemeSelect={handleThemeSelect} onStartChat={(subject) => handleNewStudy({ mode: 'chat', subject })} />;
                case 'chat': return <ChatDisplay data={dataToRender as ChatAnalysis} onSendMessage={handleSendChatMessage} isLoading={isChatLoading} onReferenceSelect={handleReferenceSelectInChat} onThemeSelect={handleThemeSelectInChat} />;
                case 'systematic': {
                    const planData = dataToRender as SystematicAnalysis;
                    if (!planData) return null;
                    return <SystematicDisplay data={planData} onReferenceSelect={handleCrossReferenceSelect} onThemeSelect={(theme) => handleNewStudy({ mode: 'topic', topic: theme })} onQuestionSelect={(q) => handleNewStudy({ mode: 'qa', question: q })} onStartChat={(subject) => handleNewStudy({ mode: 'chat', subject })} />;
                }
                default: return null;
            }
        })();

        return wrapWithTranslationPrompt(content, activeStudy, showTranslationPrompt);
    };

    const wrapWithTranslationPrompt = (content: React.ReactNode, activeStudy: HistoryItem, show: boolean) => {
        if (!show || activeStudy.mode === 'chat') return content;
        const targetLangName = language === 'tl' ? 'Tagalog' : 'English';
        const sourceLangName = language === 'en' ? 'Tagalog' : 'English';
        return <div>
            <div className="sticky top-0 z-20 p-3 bg-secondary/90 backdrop-blur-sm border-b border-gray-700/60 mb-4 rounded-xl shadow-lg flex items-center justify-center gap-4">
                <p className="text-sm text-text-muted"><span className="font-semibold">{`This analysis is in ${sourceLangName}.`}</span></p>
                <button onClick={() => handleNewStudy(activeStudy)} disabled={isLoading || isChatLoading} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-md transition-colors bg-accent text-white hover:bg-accent-light disabled:bg-gray-500 disabled:cursor-not-allowed">
                    {isLoading || isChatLoading ? 'Translating...' : `Translate to ${targetLangName}`}
                </button>
            </div>
            {content}
        </div>;
    };

    const canCreateGroup = selectedTabsForGrouping.length >= 2 && targetGroupForAdding === null;
    const canAddToGroup = selectedTabsForGrouping.length >= 1 && targetGroupForAdding !== null;

    return (
        <div className="flex flex-col">
            {isGroupSelectionMode && (
                <div className="relative z-20 p-2 text-center bg-accent/20 border-b border-accent/30 text-accent-light text-sm animate-fade-in">
                    {targetGroupForAdding !== null ? "Select tabs to add to the highlighted group." : "Select tabs to group, or select a group to add to."}
                </div>
            )}
            <div className="relative z-10 flex items-center">
                 <div ref={scrollContainerRef} className="flex-1 flex items-end overflow-x-auto scroll-smooth" onDragOver={handleDragOver} onDrop={handleDropOnContainer} style={{ scrollbarWidth: 'none' }}>
                    {studies.map((study, index) => {
                        const isGroup = 'isGroup' in study;
                        const isExpanded = isGroup && expandedGroupId === study.id;
                        const isSelectedForGrouping = selectedTabsForGrouping.includes(index);
                        const isTargetForAdding = isGroup && targetGroupForAdding === index;

                        const isDraggedTopLevel = draggedItem?.type === 'tab' && draggedItem.index === index;
                        const isGroupingTarget = groupingTarget?.type === 'tab' && groupingTarget.index === index;
                        
                        let tabClassName = `flex-shrink-0 flex items-center gap-2 py-2 pl-4 pr-3 rounded-t-lg transition-all duration-150 group relative focus:outline-none `;
                        if (isGroupSelectionMode) {
                            if (isGroup) {
                                tabClassName += `cursor-pointer ${isTargetForAdding ? 'add-to-group-glow' : 'hover:bg-primary/80'}`;
                            } else {
                                tabClassName += `cursor-pointer ${isSelectedForGrouping ? 'ring-2 ring-accent ring-offset-2 ring-offset-primary' : 'hover:bg-primary/80'}`;
                            }
                        } else {
                             tabClassName += `cursor-pointer focus:ring-2 focus:ring-accent ${activeTabIndex === index ? 'bg-secondary/50 text-text-main -mb-px' : 'bg-primary/50 text-text-muted hover:bg-secondary/40'} ${isDraggedTopLevel ? 'opacity-30' : ''} ${isGroupingTarget ? 'scale-110 z-20 group-target-glow' : ''}`;
                        }

                        return (
                            <div key={isGroup ? study.id : generateStudyKey(study, language)} className="flex items-end" onDragLeave={handleDragLeave}>
                                <div className="relative">
                                    <div
                                        draggable={!isGroupSelectionMode}
                                        onDragStart={(e) => handleDragStart(e, { type: 'tab', index })}
                                        onDragEnter={(e) => handleDragEnter(e, { type: 'tab', index })}
                                        onDrop={(e) => handleDrop(e, { type: 'tab', index })}
                                        onDragEnd={handleDragEnd}
                                        onClick={() => {
                                            if (isGroupSelectionMode) {
                                                if (isGroup) {
                                                    toggleGroupForTargeting(index);
                                                } else {
                                                    toggleTabForGrouping(index);
                                                }
                                            } else {
                                                if (isGroup) setExpandedGroupId(isExpanded ? null : study.id);
                                                setActiveTab(index, 0);
                                            }
                                        }}
                                        onContextMenu={(e) => handleContextMenu(e, index)}
                                        className={tabClassName}
                                    >
                                        {isGroup && (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" /></svg>)}
                                        <span className="text-sm font-medium truncate pointer-events-none">{getStudyTitle(study, language)}</span>
                                        {isGroup && <span className="text-xs bg-gray-700 text-gray-300 rounded-full px-1.5 py-0.5">{study.items.length}</span>}
                                        {!isGroupSelectionMode && (
                                            <button onClick={(e) => { e.stopPropagation(); handleCloseTab(index); }} className="p-1.5 rounded-full text-gray-500 group-hover:text-gray-300 group-hover:bg-gray-600/50 transition-colors" aria-label={`Close tab for ${getStudyTitle(study, language)}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                                            </button>
                                        )}
                                        {activeTabIndex !== index && <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-700/50"></div>}
                                    </div>
                                    {isSelectedForGrouping && (
                                        <div className="absolute top-1 right-1 bg-accent rounded-full text-white pointer-events-none p-0.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                                        </div>
                                    )}
                                </div>
                                {isExpanded && !isGroupSelectionMode && (
                                    <div className="flex items-end -ml-2 pl-2 border-l-2 border-accent/50">
                                        {study.items.map((subStudy, subIndex) => (
                                            <Tab 
                                              key={generateStudyKey(subStudy, language)} 
                                              study={subStudy} 
                                              isActive={activeTabIndex === index && activeSubTabIndex === subIndex} 
                                              onClick={() => setActiveTab(index, subIndex)} 
                                              onClose={() => handleCloseTab(index, subIndex)} 
                                              onContextMenu={(e) => handleContextMenu(e, index, subIndex)}
                                              onDragStart={(e) => handleDragStart(e, { type: 'sub-tab', groupIndex: index, subIndex })}
                                              onDrop={(e) => handleDrop(e, { type: 'sub-tab', groupIndex: index, subIndex })}
                                              onDragEnter={(e) => handleDragEnter(e, { type: 'sub-tab', groupIndex: index, subIndex })}
                                              isGroupingTarget={groupingTarget?.type === 'sub-tab' && groupingTarget.groupIndex === index && groupingTarget.subIndex === subIndex}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                {isOverflowing && (
                    <>
                        <button onClick={() => handleScroll('left')} disabled={!canScrollLeft} className="absolute left-0 top-0 bottom-0 z-10 p-2 disabled:opacity-0"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg></button>
                        <button onClick={() => handleScroll('right')} disabled={!canScrollRight} className="absolute right-0 top-0 bottom-0 z-10 p-2 disabled:opacity-0"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg></button>
                    </>
                )}
                <div className="pl-2 flex-shrink-0">
                    {isGroupSelectionMode ? (
                        <button onClick={cancelGroupSelectionMode} className="p-2.5 rounded-lg bg-red-800/50 text-red-300 hover:bg-red-800/80 transition-colors" title="Cancel Grouping">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                        </button>
                    ) : (
                        <button onClick={() => startGroupSelectionMode()} className="p-2.5 rounded-lg bg-primary/50 text-text-muted hover:bg-secondary/80 hover:text-white transition-colors" title="Group Tabs">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z" /></svg>
                        </button>
                    )}
                </div>
            </div>
            {isGroupSelectionMode && (canCreateGroup || canAddToGroup) && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 animate-fade-in">
                    <button
                        onClick={canAddToGroup ? handleAddToGroupFromSelection : handleCreateGroupFromSelection}
                        className="flex items-center gap-2 bg-gradient-to-r from-accent to-secondary-accent text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-accent/30 transition-all hover:scale-105"
                    >
                        {canAddToGroup ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                                Add {selectedTabsForGrouping.length} Tab(s) to Group
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z" /></svg>
                                Create Group ({selectedTabsForGrouping.length})
                            </>
                        )}
                    </button>
                </div>
            )}
            <div className="relative z-0">
                {renderActiveTabContent()}
            </div>
            {contextMenu && (
                <TabContextMenu 
                    x={contextMenu.x} 
                    y={contextMenu.y} 
                    tabIndex={contextMenu.tabIndex} 
                    subTabIndex={contextMenu.subTabIndex} 
                    isGroup={'isGroup' in studies[contextMenu.tabIndex] && contextMenu.subTabIndex === undefined} 
                    isLastTab={contextMenu.tabIndex === studies.length - 1} 
                    onClose={() => setContextMenu(null)} 
                    onCloseTab={() => handleCloseTab(contextMenu.tabIndex, contextMenu.subTabIndex)} 
                    onCloseOthers={() => handleCloseOtherTabs(contextMenu.tabIndex, contextMenu.subTabIndex)} 
                    onCloseRight={() => handleCloseTabsToRight(contextMenu.tabIndex)} 
                    onCloseAll={handleCloseAllTabs} 
                    onRename={handleRename} 
                    onUngroup={() => handleUngroupTab(contextMenu.tabIndex)}
                    onRemoveFromGroup={contextMenu.subTabIndex !== undefined ? () => handleRemoveFromGroup(contextMenu.tabIndex, contextMenu.subTabIndex) : undefined}
                />
            )}
        </div>
    );
};
