import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { isEqual } from 'lodash-es';
import type { FunctionCall } from '@google/genai';
import { getVerseAnalysis, getThematicAnalysis, getQaAnalysis, getEventAnalysis, getStoryArcAnalysis, getPassageReference, continueChatStream, startSystematicStudy, generateSystematicSession, isTopicBiblicallyRelevant } from '../services/geminiService';
import * as cacheService from '../services/cacheService';
import * as historyService from '../services/historyService';
import type { AnalysisResult, AnalysisMode, HistoryItem, ChatAnalysis, ChatMessage, SystematicAnalysis, SelectionToolbarState, FontSize, HistorySystematicItem, HistoryChatItem, TabItem, TabGroup } from '../types';
import { parseReference } from '../utils/referenceParser';
import { generateStudyKey, generateSystematicPlanKey, getStudyTitle } from '../utils/generateStudyKey';
import { translations } from '../utils/translations';
import { BIBLE_DATA } from '../bibleData';
import { BIBLE_BOOKS, INVALID_SEARCH_TOPICS } from '../constants';
import { SYSTEMATIC_STUDY_TOPICS } from '../systematicTopics';

type Language = 'en' | 'tl';

interface AppContextType {
    mode: AnalysisMode;
    setMode: React.Dispatch<React.SetStateAction<AnalysisMode>>;
    selectedBook: string;
    setSelectedBook: React.Dispatch<React.SetStateAction<string>>;
    selectedChapter: number;
    setSelectedChapter: React.Dispatch<React.SetStateAction<number>>;
    startVerse: number;
    setStartVerse: React.Dispatch<React.SetStateAction<number>>;
    endVerse: number;
    setEndVerse: React.Dispatch<React.SetStateAction<number>>;
    expandToPassage: boolean;
    setExpandToPassage: React.Dispatch<React.SetStateAction<boolean>>;
    topic: string;
    setTopic: React.Dispatch<React.SetStateAction<string>>;
    question: string;
    setQuestion: React.Dispatch<React.SetStateAction<string>>;
    event: string;
    setEvent: React.Dispatch<React.SetStateAction<string>>;
    storyArc: string;
    setStoryArc: React.Dispatch<React.SetStateAction<string>>;
    activeStudies: TabItem[];
    studyData: Record<string, AnalysisResult>;
    activeTabIndex: number;
    activeSubTabIndex: number;
    expandedGroupId: string | null;
    setExpandedGroupId: React.Dispatch<React.SetStateAction<string | null>>;
    setActiveTab: (tabIndex: number, subTabIndex?: number) => void;
    isLoading: boolean;
    isChatLoading: boolean;
    error: string | null;
    isHistoryOpen: boolean;
    setIsHistoryOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    studyHistory: HistoryItem[];
    toastMessage: string | null;
    showToast: (message: string) => void;
    selectionToolbarState: SelectionToolbarState;
    setSelectionToolbarState: React.Dispatch<React.SetStateAction<SelectionToolbarState>>;
    fontSize: FontSize;
    setFontSize: (size: FontSize) => void;
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof typeof translations.en) => string;
    isGroupSelectionMode: boolean;
    selectedTabsForGrouping: number[];
    targetGroupForAdding: number | null;
    renamingGroupInfo: { index: number; currentName: string; } | null;
    setRenamingGroupInfo: React.Dispatch<React.SetStateAction<{ index: number; currentName: string; } | null>>;
    startRenameGroup: (index: number) => void;
    handleNewStudy: (studyItem: HistoryItem) => Promise<void>;
    handleSendChatMessage: (newMessage: string) => Promise<void>;
    handleCrossReferenceSelect: (reference: string) => Promise<void>;
    handleReferenceSelectInChat: (reference: string) => Promise<void>;
    handleThemeSelect: (theme: string) => Promise<void>;
    handleThemeSelectInChat: (theme: string) => Promise<void>;
    handleHistorySelect: (item: HistoryItem) => Promise<void>;
    handleAnalyze: () => Promise<void>;
    handleCloseTab: (tabIndex: number, subTabIndex?: number) => void;
    handleClearHistory: () => void;
    handleReorderTabs: (dragIndex: number, dropIndex: number) => void;
    handleAnalyzeFullPassage: () => Promise<void>;
    handleAnalyzeNext: () => Promise<void>;
    handleAnalyzePrevious: () => Promise<void>;
    handleContinueSystematicStudy: () => Promise<void>;
    handleCloseOtherTabs: (indexToKeep: number, subIndexToKeep?: number) => void;
    handleCloseTabsToRight: (fromIndex: number) => void;
    handleCloseAllTabs: () => void;
    handleCreateTabGroup: (dragIndex: number, dropIndex: number) => void;
    handleAddToGroup: (dragIndex: number, groupIndex: number) => void;
    handleUngroupTab: (groupIndex: number, subIndexToRemove?: number) => void;
    handleRenameGroup: (newName: string) => void;
    startGroupSelectionMode: (initialIndex?: number) => void;
    cancelGroupSelectionMode: () => void;
    toggleTabForGrouping: (index: number) => void;
    toggleGroupForTargeting: (index: number) => void;
    handleCreateGroupFromSelection: () => void;
    handleAddToGroupFromSelection: () => void;
    handleMoveTabOutOfGroup: (sourceGroupIndex: number, sourceSubIndex: number, targetIndex: number) => void;
    handleReorderInGroup: (groupIndex: number, dragSubIndex: number, dropSubIndex: number) => void;
    handleRemoveFromGroup: (groupIndex: number, subIndex: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<AnalysisMode>('reference');
  const [selectedBook, setSelectedBook] = useState('Genesis');
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [startVerse, setStartVerse] = useState(1);
  const [endVerse, setEndVerse] = useState(1);
  const [expandToPassage, setExpandToPassage] = useState(false);
  const [topic, setTopic] = useState('');
  const [question, setQuestion] = useState('');
  const [event, setEvent] = useState('The Good Samaritan');
  const [storyArc, setStoryArc] = useState('The Life of David');
  const [activeStudies, setActiveStudies] = useState<TabItem[]>([]);
  const [studyData, setStudyData] = useState<Record<string, AnalysisResult>>({});
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [activeSubTabIndex, setActiveSubTabIndex] = useState(0);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [studyHistory, setStudyHistory] = useState<HistoryItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [fontSize, setFontSizeState] = useState<FontSize>('base');
  const [selectionToolbarState, setSelectionToolbarState] = useState<SelectionToolbarState>({
    visible: false,
    text: '',
    top: 0,
    left: 0,
  });
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language');
    return savedLang === 'tl' ? 'tl' : 'en';
  });
  const [isGroupSelectionMode, setIsGroupSelectionMode] = useState(false);
  const [selectedTabsForGrouping, setSelectedTabsForGrouping] = useState<number[]>([]);
  const [targetGroupForAdding, setTargetGroupForAdding] = useState<number | null>(null);
  const [renamingGroupInfo, setRenamingGroupInfo] = useState<{ index: number; currentName: string; } | null>(null);


  const getActiveStudy = useCallback((): HistoryItem | null => {
    const activeTab = activeStudies[activeTabIndex];
    if (!activeTab) return null;
    if ('isGroup' in activeTab) {
        return activeTab.items[activeSubTabIndex] || null;
    }
    return activeTab;
  }, [activeStudies, activeTabIndex, activeSubTabIndex]);

  const setActiveTab = (tabIndex: number, subTabIndex: number = 0) => {
    setActiveTabIndex(tabIndex);
    setActiveSubTabIndex(subTabIndex);
  }

  const setLanguage = (lang: Language) => {
    const oldLang = language;
    if (oldLang === lang) return;
    
    if (isLoading || isChatLoading) {
        showToast("Cannot change language while an operation is in progress.");
        return;
    }

    localStorage.setItem('language', lang);
    setLanguageState(lang);

    const currentStudy = getActiveStudy();
    if (currentStudy?.mode === 'chat') {
        const oldKey = generateStudyKey(currentStudy, oldLang);
        const newKey = generateStudyKey(currentStudy, lang);
        
        setStudyData(prevStudyData => {
            const oldData = prevStudyData[oldKey] as ChatAnalysis | undefined;
            const newDataExists = !!prevStudyData[newKey];

            if (oldData && !newDataExists) {
                const langName = lang === 'tl' ? 'Tagalog' : 'English';
                const systemMessage: ChatMessage = {
                    role: 'system',
                    text: `(System: Language switched to ${langName}. The conversation will now continue in this language.)`
                };
                const migratedData: ChatAnalysis = {
                    ...oldData,
                    messages: [...oldData.messages, systemMessage]
                };
                return { ...prevStudyData, [newKey]: migratedData };
            }
            return prevStudyData;
        });
    }
  };

  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key];
  };


  useEffect(() => {
    setStudyHistory(historyService.getHistory());
    const savedSize = localStorage.getItem('fontSize') as FontSize;
    if (savedSize && ['sm', 'base', 'lg'].includes(savedSize)) {
        setFontSizeState(savedSize);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (fontSize === 'sm') {
        root.style.fontSize = '14px';
    } else if (fontSize === 'lg') {
        root.style.fontSize = '18px';
    } else {
        root.style.fontSize = '16px'; // Default for 'base'
    }
  }, [fontSize]);
  
  const setFontSize = (size: FontSize) => {
    localStorage.setItem('fontSize', size);
    setFontSizeState(size);
  };

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const addAnalysisToHistory = useCallback((item: HistoryItem) => {
    const newHistory = historyService.addHistoryItem(item);
    setStudyHistory(newHistory);
  }, []);
  
  // --- Helper: Initiate Chat Study ---
  const _initiateChatStudy = async (studyItem: HistoryChatItem, key: string) => {
    setIsChatLoading(true);
    setStudyData(prevData => ({...prevData, [key]: { subject: studyItem.subject, messages: [] } }));
    try {
      const stream = continueChatStream([], studyItem.subject, language);
      let fullResponse = '';
      for await (const chunk of stream) {
        if (chunk.text) {
            fullResponse += chunk.text;
        }
        setStudyData(prevData => {
          const currentStudy = prevData[key];
          if (!currentStudy || !('messages' in currentStudy)) return prevData;
          const currentMessages = currentStudy.messages;
          let newMessages: ChatMessage[];
          if (currentMessages.length > 0 && currentMessages[currentMessages.length - 1].role === 'model') {
            const lastMessage = currentMessages[currentMessages.length - 1];
            newMessages = [...currentMessages.slice(0, -1), { ...lastMessage, text: fullResponse }];
          } else {
            newMessages = [...currentMessages, { role: 'model', text: fullResponse }];
          }
          return { ...prevData, [key]: { ...currentStudy, messages: newMessages } };
        });
      }
      const finalChatData: ChatAnalysis = { subject: studyItem.subject, messages: [{ role: 'model', text: fullResponse }] };
      cacheService.setItem(key, finalChatData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsChatLoading(false);
    }
  };

  // --- Helper: Initiate Standard API Study ---
  const _initiateApiStudy = async (studyItem: Exclude<HistoryItem, HistorySystematicItem | HistoryChatItem>, key: string) => {
    setIsLoading(true);
    setStudyData(prevData => ({ ...prevData, [key]: {} })); // Initialize with an empty object for progressive loading

    try {
        let stream;
        switch (studyItem.mode) {
            case 'reference': stream = getVerseAnalysis(studyItem.book, studyItem.chapter, studyItem.startVerse, studyItem.endVerse, language); break;
            case 'topic': stream = getThematicAnalysis(studyItem.topic, language); break;
            case 'qa': stream = getQaAnalysis(studyItem.question, language); break;
            case 'event': stream = getEventAnalysis(studyItem.event, language); break;
            case 'storyArc': stream = getStoryArcAnalysis(studyItem.storyArc, language); break;
            default: throw new Error("Unsupported study mode for streaming.");
        }
        
        let fullResult: Partial<AnalysisResult> = {};
        for await (const chunk of stream) {
            const { section, data } = chunk;
            if (section && data) {
                fullResult = { ...fullResult, [section]: data };
                setStudyData(prevData => {
                    const currentStudy = prevData[key] || {};
                    return {
                        ...prevData,
                        [key]: {
                            ...currentStudy,
                            [section]: data
                        }
                    };
                });
            }
        }
        cacheService.setItem(key, fullResult as AnalysisResult);

    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        // Clean up partial data on error
        setStudyData(prevData => {
            const newData = { ...prevData };
            delete newData[key];
            return newData;
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handleNewStudy = useCallback(async (studyItem: HistoryItem) => {
    if (isLoading || isChatLoading) {
        showToast("Please wait for the current analysis to finish loading.");
        return;
    }
    setIsMobileMenuOpen(false);
    
    // --- OPTIMIZATION STEP 1: Check if tab is already open ---
    for (let i = 0; i < activeStudies.length; i++) {
        const tab = activeStudies[i];
        if ('isGroup' in tab) {
            const subIndex = tab.items.findIndex(subItem => isEqual(subItem, studyItem));
            if (subIndex !== -1) {
                setActiveTabIndex(i);
                setActiveSubTabIndex(subIndex);
                setExpandedGroupId(tab.id);
                return;
            }
        } else {
            if (isEqual(tab, studyItem)) {
                setActiveTabIndex(i);
                setActiveSubTabIndex(0);
                return;
            }
        }
    }
    
    const key = generateStudyKey(studyItem, language);
    
    // --- OPTIMIZATION STEP 2: Check cache BEFORE any API calls ---
    const cachedResult = cacheService.getItem(key);
    if (cachedResult && Object.keys(cachedResult).length > 0) {
        addAnalysisToHistory(studyItem);
        const newStudies: TabItem[] = [...activeStudies, studyItem];
        setActiveStudies(newStudies);
        setActiveTabIndex(newStudies.length - 1);
        setActiveSubTabIndex(0);
        setStudyData(prevData => ({ ...prevData, [key]: cachedResult }));
        showToast("Analysis loaded from cache.");
        return;
    }

    // --- OPTIMIZATION STEP 3: Only run relevance check if NOT cached ---
    if (studyItem.mode === 'chat' || studyItem.mode === 'topic' || studyItem.mode === 'qa') {
        const textToCheck = studyItem.mode === 'chat' 
            ? studyItem.subject 
            : (studyItem.mode === 'topic' ? studyItem.topic : studyItem.question);

        if (!textToCheck.trim()) { return; }

        setIsLoading(true);
        let isRelevant = false;
        try {
            isRelevant = await isTopicBiblicallyRelevant(textToCheck, language);
        } catch (err) {
            console.warn("Relevance check failed, proceeding with analysis:", err);
            isRelevant = true;
        }

        if (!isRelevant) {
            showToast("Topic seems unrelated to biblical or theological study.");
            setIsLoading(false);
            return;
        }
        
        if (studyItem.mode !== 'chat') {
            setIsLoading(false); // Reset loading for non-chat modes before proceeding
        }
    }
    
    // --- Proceed with new study since it's not open and not cached ---
    addAnalysisToHistory(studyItem);
    const newStudies: TabItem[] = [...activeStudies, studyItem];
    setActiveStudies(newStudies);
    setActiveTabIndex(newStudies.length - 1);
    setActiveSubTabIndex(0);
    setError(null);

    if (studyItem.mode === 'systematic') {
      setIsLoading(true);
      setError(null);
      try {
          const initialPlan = await startSystematicStudy(studyItem.level, language);
          setStudyData(prev => ({ ...prev, [key]: initialPlan }));
          cacheService.setItem(key, initialPlan);
      } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
          setIsLoading(false);
      }
      return;
    }
    
    if (studyItem.mode === 'chat') {
      await _initiateChatStudy(studyItem, key);
    } else {
      await _initiateApiStudy(studyItem as Exclude<HistoryItem, HistoryChatItem | HistorySystematicItem>, key);
    }
  }, [activeStudies, addAnalysisToHistory, language, showToast, isLoading, isChatLoading]);

  const handleContinueSystematicStudy = async () => {
    if (isLoading || isChatLoading) {
        showToast("Please wait for the current analysis to finish loading.");
        return;
    }
    const currentStudy = getActiveStudy();
    if (currentStudy?.mode !== 'systematic') return;
  
    const key = generateStudyKey(currentStudy, language);
    const planData = studyData[key] as SystematicAnalysis | undefined;
    if (!planData) {
        setError("Could not find the current study plan to continue.");
        return;
    }
    
    const currentSessionCount = planData.sessions.length;
    const planConfig = SYSTEMATIC_STUDY_TOPICS.find(p => p.level === planData.level);
    if (!planConfig || currentSessionCount >= planConfig.sessions.length) {
        showToast("You have completed all sessions in this study plan!");
        return;
    }
  
    setIsLoading(true);
    setError(null);
    
    try {
        const nextSessionNumber = currentSessionCount + 1;
        const previousSessionTopics = planData.sessions.map(s => s.title);
        
        const newSession = await generateSystematicSession(planData.level, nextSessionNumber, language, previousSessionTopics);
        
        const updatedPlanData: SystematicAnalysis = {
            ...planData,
            sessions: [...planData.sessions, newSession]
        };
        
        setStudyData(prev => ({ ...prev, [key]: updatedPlanData }));
        cacheService.setItem(key, updatedPlanData);
  
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred while loading the next session.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleSendChatMessage = useCallback(async (newMessage: string) => {
    if (isChatLoading) {
        showToast("Please wait for the current response to finish.");
        return;
    }
    const currentStudy = getActiveStudy();
    if (currentStudy?.mode !== 'chat') return;

    const key = generateStudyKey(currentStudy, language);
    const currentChat = studyData[key] as ChatAnalysis | undefined;

    if (!currentChat) {
        showToast("Error: Could not find chat session for the current language.");
        console.error(`Chat data not found for language "${language}". Automatic migration may have failed.`);
        return;
    }

    setIsChatLoading(true);
    const updatedMessages: ChatMessage[] = [...currentChat.messages, { role: 'user', text: newMessage }];
    const thinkingMessages: ChatMessage[] = [...updatedMessages, { role: 'model', text: '' }];
    setStudyData(prev => ({...prev, [key]: {...currentChat, messages: thinkingMessages }}));

    try {
      const stream = continueChatStream(updatedMessages, currentChat.subject, language);
      let accumulatedText = '';

      for await (const chunk of stream) {
        accumulatedText += chunk.text || '';

        setStudyData(prevData => {
          const currentStudyData = prevData[key];
          if (!currentStudyData || !('messages' in currentStudyData)) return prevData;
          const currentMessages = currentStudyData.messages;
          const lastMessageIndex = currentMessages.length - 1;
          if (lastMessageIndex >= 0 && currentMessages[lastMessageIndex].role === 'model') {
            const lastMessage = currentMessages[lastMessageIndex];
            const updatedLastMessage: ChatMessage = { 
              ...lastMessage, 
              text: accumulatedText,
            };
            const updatedMessages: ChatMessage[] = [...currentMessages.slice(0, lastMessageIndex), updatedLastMessage];
            return { ...prevData, [key]: { ...currentStudyData, messages: updatedMessages } };
          }
          return prevData;
        });
      }
      const finalMessages: ChatMessage[] = [...updatedMessages, { role: 'model', text: accumulatedText }];
      const finalChatData: ChatAnalysis = { ...currentChat, messages: finalMessages };
      cacheService.setItem(key, finalChatData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsChatLoading(false);
    }
  }, [activeStudies, activeTabIndex, activeSubTabIndex, studyData, language, isChatLoading, showToast, getActiveStudy]);

  const handleReferenceSelectInChat = useCallback(async (reference: string) => {
    const parsed = parseReference(reference);
    if (!parsed) {
        showToast(`Could not parse reference: ${reference}`);
        return;
    }
    const studyItem: HistoryItem = { mode: 'reference', ...parsed };
    await handleNewStudy(studyItem);
  }, [handleNewStudy, showToast]);

  const handleThemeSelectInChat = useCallback(async (theme: string) => {
    const studyItem: HistoryItem = { mode: 'topic', topic: theme };
    await handleNewStudy(studyItem);
  }, [handleNewStudy]);

  const handleCrossReferenceSelect = useCallback(async (reference: string) => {
    const parsed = parseReference(reference);
    if (!parsed) {
      showToast(`Could not parse reference: ${reference}`);
      return;
    }
    const studyItem: HistoryItem = { mode: 'reference', ...parsed };
    await handleNewStudy(studyItem);
  }, [handleNewStudy, showToast]);
  
  const handleThemeSelect = useCallback(async (theme: string) => {
    const studyItem: HistoryItem = { mode: 'topic', topic: theme };
    await handleNewStudy(studyItem);
  }, [handleNewStudy]);

  const handleHistorySelect = async (item: HistoryItem) => {
    setIsHistoryOpen(false);
    await handleNewStudy(item);
  };
  
  const handleAnalyze = async () => {
    if (isLoading || isChatLoading) {
        showToast("Please wait for the current analysis to finish loading.");
        return;
    }
    setIsMobileMenuOpen(false);
    if (mode === 'reference' && expandToPassage && startVerse === endVerse) {
        try {
            // This API call is quick; main loading is handled by handleNewStudy.
            const passage = await getPassageReference(selectedBook, selectedChapter, startVerse);
            await handleNewStudy({ mode: 'reference', ...passage });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not expand and analyze passage.');
        }
        return;
    }

    let studyItem: HistoryItem | null = null;
    switch (mode) {
      case 'reference': studyItem = { mode, book: selectedBook, chapter: selectedChapter, startVerse, endVerse }; break;
      case 'topic': {
        const trimmedTopic = topic.trim();
        if (!trimmedTopic) { showToast("Please enter a topic."); return; }
        if (trimmedTopic.length < 2) { showToast("Search topic is too short."); return; }
        if (INVALID_SEARCH_TOPICS.has(trimmedTopic.toLowerCase())) { showToast(`'${trimmedTopic}' is too generic. Please be more specific.`); return; }
        studyItem = { mode, topic: trimmedTopic }; 
        break;
      }
      case 'qa': {
        const trimmedQuestion = question.trim();
        if (!trimmedQuestion) { showToast("Please enter a question."); return; }
        if (trimmedQuestion.length < 5) { showToast("The question is too short."); return; }
        studyItem = { mode, question: trimmedQuestion };
        break;
      }
      case 'event': studyItem = { mode, event }; break;
      case 'storyArc': studyItem = { mode, storyArc }; break;
      case 'systematic': return;
    }
    if (studyItem) await handleNewStudy(studyItem);
  };

  const handleCloseTab = (tabIndex: number, subTabIndex?: number) => {
    const newStudies = [...activeStudies];
    const newStudyData = { ...studyData };
    const tabToModify = newStudies[tabIndex];

    const removeStudyData = (item: HistoryItem) => {
        const keyEn = generateStudyKey(item, 'en');
        const keyTl = generateStudyKey(item, 'tl');
        delete newStudyData[keyEn];
        delete newStudyData[keyTl];
    };

    if ('isGroup' in tabToModify && subTabIndex !== undefined) {
        // Closing a tab within a group
        const itemToRemove = tabToModify.items.splice(subTabIndex, 1)[0];
        removeStudyData(itemToRemove);

        if (tabToModify.items.length === 1) { // Ungroup if one tab is left
            newStudies.splice(tabIndex, 1, tabToModify.items[0]);
            setExpandedGroupId(null);
        } else {
            setActiveSubTabIndex(prev => Math.max(0, prev - 1));
        }
    } else {
        // Closing a top-level tab or a whole group
        const removedItem = newStudies.splice(tabIndex, 1)[0];
        if ('isGroup' in removedItem) {
            removedItem.items.forEach(removeStudyData);
        } else {
            removeStudyData(removedItem);
        }
    }

    // Adjust active tab index
    if (activeTabIndex > tabIndex || (activeTabIndex === tabIndex && activeTabIndex === newStudies.length)) {
      setActiveTabIndex(Math.max(0, activeTabIndex - 1));
    }
    setActiveSubTabIndex(0);

    setActiveStudies(newStudies);
    setStudyData(newStudyData);
  };

  const handleClearHistory = () => {
    historyService.clearHistory();
    setStudyHistory([]);
    showToast("Study history cleared.");
  };

  const handleReorderTabs = useCallback((dragIndex: number, dropIndex: number) => {
    const activeStudy = getActiveStudy();
    const newStudies = [...activeStudies];
    const [draggedItem] = newStudies.splice(dragIndex, 1);
    newStudies.splice(dropIndex, 0, draggedItem);
    setActiveStudies(newStudies);

    // Find the new index of the previously active study
    if (activeStudy) {
        for (let i = 0; i < newStudies.length; i++) {
            const tab = newStudies[i];
            if ('isGroup' in tab) {
                const subIndex = tab.items.findIndex(subItem => isEqual(subItem, activeStudy));
                if (subIndex !== -1) {
                    setActiveTab(i, subIndex);
                    return;
                }
            } else if (isEqual(tab, activeStudy)) {
                setActiveTab(i, 0);
                return;
            }
        }
    }
  }, [activeStudies, getActiveStudy]);

  const handleAnalyzeFullPassage = useCallback(async () => {
    const currentStudy = getActiveStudy();
    if (currentStudy?.mode !== 'reference' || currentStudy.startVerse !== currentStudy.endVerse) return;

    setIsLoading(true);
    setError(null);
    try {
      const passage = await getPassageReference(currentStudy.book, currentStudy.chapter, currentStudy.startVerse);
      await handleNewStudy({ mode: 'reference', ...passage });
    } catch (err) {
      setError(err instanceof Error ? `Could not expand passage: ${err.message}` : 'An unknown error occurred while expanding passage.');
    } finally {
        setIsLoading(false);
    }
  }, [getActiveStudy, handleNewStudy]);

  const handleAnalyzeNext = useCallback(async () => {
    const currentStudy = getActiveStudy();
    if (currentStudy?.mode !== 'reference') return;

    const { book, chapter, startVerse, endVerse } = currentStudy;
    const passageLength = endVerse - startVerse + 1;
    let newStartVerse = endVerse + 1, newEndVerse = newStartVerse + passageLength - 1, newChapter = chapter, newBook = book;
    const currentBookData = BIBLE_DATA[book];
    const maxVerseInChapter = currentBookData[chapter - 1];

    if (newStartVerse > maxVerseInChapter) {
        newChapter++; newStartVerse = 1; newEndVerse = passageLength;
        if (newChapter > currentBookData.length) {
            const bookIndex = BIBLE_BOOKS.indexOf(book);
            if (bookIndex < BIBLE_BOOKS.length - 1) {
                newBook = BIBLE_BOOKS[bookIndex + 1]; newChapter = 1; newStartVerse = 1; newEndVerse = passageLength;
            } else {
                showToast("You've reached the end of the Bible."); return;
            }
        }
    }
    const newMaxVerse = BIBLE_DATA[newBook][newChapter - 1];
    if (newEndVerse > newMaxVerse) newEndVerse = newMaxVerse;
    await handleNewStudy({ mode: 'reference', book: newBook, chapter: newChapter, startVerse: newStartVerse, endVerse: newEndVerse });
  }, [getActiveStudy, handleNewStudy, showToast]);

  const handleAnalyzePrevious = useCallback(async () => {
    const currentStudy = getActiveStudy();
    if (currentStudy?.mode !== 'reference') return;

    const { book, chapter, startVerse, endVerse } = currentStudy;
    const passageLength = endVerse - startVerse + 1;
    let newEndVerse = startVerse - 1, newStartVerse = newEndVerse - passageLength + 1, newChapter = chapter, newBook = book;

    if (newEndVerse < 1) {
        newChapter--;
        if (newChapter < 1) {
            const bookIndex = BIBLE_BOOKS.indexOf(book);
            if (bookIndex > 0) {
                newBook = BIBLE_BOOKS[bookIndex - 1]; newChapter = BIBLE_DATA[newBook].length;
            } else {
                showToast("You're at the beginning of the Bible."); return;
            }
        }
        const prevChapterMaxVerse = BIBLE_DATA[newBook][newChapter - 1];
        newEndVerse = prevChapterMaxVerse; newStartVerse = newEndVerse - passageLength + 1;
    }
    if (newStartVerse < 1) newStartVerse = 1;
    await handleNewStudy({ mode: 'reference', book: newBook, chapter: newChapter, startVerse: newStartVerse, endVerse: newEndVerse });
  }, [getActiveStudy, handleNewStudy, showToast]);

  const handleCloseAllTabs = () => { setActiveStudies([]); setStudyData({}); setActiveTabIndex(0); setActiveSubTabIndex(0); };
  
  const handleCloseTabsToRight = (fromIndex: number) => {
    if (fromIndex >= activeStudies.length - 1) return;
    const studiesToKeep = activeStudies.slice(0, fromIndex + 1);
    const keysToKeep = new Set<string>();
    studiesToKeep.forEach(study => {
        if ('isGroup' in study) {
            study.items.forEach(item => {
                keysToKeep.add(generateStudyKey(item, 'en'));
                keysToKeep.add(generateStudyKey(item, 'tl'));
            });
        } else {
            keysToKeep.add(generateStudyKey(study, 'en'));
            keysToKeep.add(generateStudyKey(study, 'tl'));
        }
    });
    const newStudyData = Object.entries(studyData).reduce((acc, [key, value]) => {
        if (keysToKeep.has(key)) acc[key] = value;
        return acc;
    }, {} as Record<string, AnalysisResult>);
    setActiveStudies(studiesToKeep);
    setStudyData(newStudyData);
    if (activeTabIndex > fromIndex) setActiveTab(fromIndex);
  };
  
  const handleCloseOtherTabs = (indexToKeep: number, subIndexToKeep?: number) => {
    const studyToKeep = activeStudies[indexToKeep];
    if (!studyToKeep) return;
  
    const keysToKeep = new Set<string>();
    if ('isGroup' in studyToKeep) {
      studyToKeep.items.forEach(item => {
        keysToKeep.add(generateStudyKey(item, 'en'));
        keysToKeep.add(generateStudyKey(item, 'tl'));
      });
    } else {
      keysToKeep.add(generateStudyKey(studyToKeep, 'en'));
      keysToKeep.add(generateStudyKey(studyToKeep, 'tl'));
    }
  
    const newStudyData = Object.entries(studyData).reduce((acc, [key, value]) => {
      if (keysToKeep.has(key)) acc[key] = value;
      return acc;
    }, {} as Record<string, AnalysisResult>);
  
    setActiveStudies([studyToKeep]);
    setStudyData(newStudyData);
    setActiveTab(0, subIndexToKeep);
  };

  const handleCreateTabGroup = (dragIndex: number, dropIndex: number) => {
    if (dragIndex === dropIndex) return;
    const draggedItem = activeStudies[dragIndex];
    const dropItem = activeStudies[dropIndex];
    if ('isGroup' in draggedItem || 'isGroup' in dropItem) return;

    const newGroup: TabGroup = {
      id: `group-${Date.now()}`,
      name: 'New Group',
      isGroup: true,
      items: [draggedItem, dropItem],
    };

    const tempStudies = activeStudies.filter((_, i) => i !== dragIndex && i !== dropIndex);
    const finalDropIndex = dropIndex > dragIndex ? dropIndex - 1 : dropIndex;
    tempStudies.splice(finalDropIndex, 0, newGroup);
    
    setActiveStudies(tempStudies);
    setActiveTab(finalDropIndex, 0);
    setExpandedGroupId(newGroup.id);
  };

  const handleAddToGroup = (dragIndex: number, groupIndex: number) => {
    const draggedItem = activeStudies[dragIndex];
    const targetGroup = activeStudies[groupIndex];
    if ('isGroup' in draggedItem || !('isGroup' in targetGroup)) return;

    const newStudies = [...activeStudies];
    (newStudies[groupIndex] as TabGroup).items.push(draggedItem);
    newStudies.splice(dragIndex, 1);
    
    setActiveStudies(newStudies);
    const newGroupIndex = groupIndex > dragIndex ? groupIndex - 1 : groupIndex;
    setActiveTab(newGroupIndex, (targetGroup as TabGroup).items.length);
    setExpandedGroupId(targetGroup.id);
  };

  const handleUngroupTab = (groupIndex: number) => {
    const groupToUngroup = activeStudies[groupIndex];
    if (!('isGroup' in groupToUngroup)) return;

    const newStudies = [...activeStudies];
    newStudies.splice(groupIndex, 1, ...groupToUngroup.items);

    setActiveStudies(newStudies);
    setExpandedGroupId(null);
    setActiveTab(groupIndex, 0);
  };

  const handleRemoveFromGroup = (groupIndex: number, subIndex: number) => {
    const newStudies = JSON.parse(JSON.stringify(activeStudies));
    const group = newStudies[groupIndex] as TabGroup;
    const [removedItem] = group.items.splice(subIndex, 1);
    newStudies.splice(groupIndex + 1, 0, removedItem);
    if (group.items.length === 1) { // Auto-ungroup
      newStudies.splice(groupIndex, 1, group.items[0]);
    }
    setActiveStudies(newStudies);
    setActiveTab(groupIndex + 1);
  };

  const handleMoveTabOutOfGroup = (sourceGroupIndex: number, sourceSubIndex: number, targetIndex: number) => {
    const newStudies = JSON.parse(JSON.stringify(activeStudies));
    const sourceGroup = newStudies[sourceGroupIndex] as TabGroup;
    const [movedTab] = sourceGroup.items.splice(sourceSubIndex, 1);

    // Auto-ungroup if one is left
    if (sourceGroup.items.length === 1) {
      newStudies.splice(sourceGroupIndex, 1, sourceGroup.items[0]);
    }

    // Adjust target index if it's after the group that was modified
    const adjustedTargetIndex = sourceGroupIndex < targetIndex ? targetIndex -1 : targetIndex;
    newStudies.splice(adjustedTargetIndex, 0, movedTab);

    setActiveStudies(newStudies);
    setActiveTab(adjustedTargetIndex);
  };
  
  const handleReorderInGroup = (groupIndex: number, dragSubIndex: number, dropSubIndex: number) => {
      const newStudies = [...activeStudies];
      const group = newStudies[groupIndex] as TabGroup;
      const [draggedItem] = group.items.splice(dragSubIndex, 1);
      group.items.splice(dropSubIndex, 0, draggedItem);
      setActiveStudies(newStudies);
      setActiveTab(groupIndex, dropSubIndex);
  };

  const startRenameGroup = (index: number) => {
    const group = activeStudies[index];
    if (group && 'isGroup' in group) {
      setRenamingGroupInfo({ index, currentName: group.name });
    }
  };
  
  const handleRenameGroup = (newName: string) => {
    if (renamingGroupInfo === null) return;
    const { index } = renamingGroupInfo;

    const newStudies = activeStudies.map((study, i) => {
        if (i === index && 'isGroup' in study) {
            return { ...study, name: newName };
        }
        return study;
    });
    setActiveStudies(newStudies);
    setRenamingGroupInfo(null);
  };

  const startGroupSelectionMode = (initialIndex?: number) => {
    setIsGroupSelectionMode(true);
    if (initialIndex !== undefined) {
        setSelectedTabsForGrouping([initialIndex]);
    }
  };

  const cancelGroupSelectionMode = () => {
      setIsGroupSelectionMode(false);
      setSelectedTabsForGrouping([]);
      setTargetGroupForAdding(null);
  };

  const toggleTabForGrouping = (index: number) => {
    setSelectedTabsForGrouping(prev => {
        if (prev.includes(index)) {
            return prev.filter(i => i !== index);
        }
        return [...prev, index];
    });
  };
  
  const toggleGroupForTargeting = (index: number) => {
    setTargetGroupForAdding(prev => (prev === index ? null : index));
  };

  const handleCreateGroupFromSelection = () => {
    if (selectedTabsForGrouping.length < 2) return;

    const sortedIndices = [...selectedTabsForGrouping].sort((a, b) => a - b);
    const itemsToGroup: HistoryItem[] = [];
    
    for (const index of sortedIndices) {
        const item = activeStudies[index];
        if ('isGroup' in item) {
            showToast("Cannot include an existing group in a new group.");
            return;
        }
        itemsToGroup.push(item);
    }
    
    const newGroup: TabGroup = {
      id: `group-${Date.now()}`,
      name: 'New Group',
      isGroup: true,
      items: itemsToGroup,
    };

    const newStudies = activeStudies.filter((_, index) => !sortedIndices.includes(index));
    const firstIndex = sortedIndices[0];
    newStudies.splice(firstIndex, 0, newGroup);

    setActiveStudies(newStudies);
    setActiveTab(firstIndex, 0);
    setExpandedGroupId(newGroup.id);
    cancelGroupSelectionMode();
  };
  
  const handleAddToGroupFromSelection = () => {
    if (selectedTabsForGrouping.length === 0 || targetGroupForAdding === null) return;
    
    const targetGroup = activeStudies[targetGroupForAdding] as TabGroup;
    if (!targetGroup?.isGroup) {
         showToast("Invalid target for adding tabs.");
         return;
    }

    const itemsToAdd: HistoryItem[] = selectedTabsForGrouping.map(index => activeStudies[index] as HistoryItem);
    
    // Filter out the moved tabs
    const newStudies = activeStudies.filter((_, index) => !selectedTabsForGrouping.includes(index));

    // Find the target group in the new array and update its items
    const targetGroupIndexInNewArray = newStudies.findIndex(item => 'isGroup' in item && item.id === targetGroup.id);

    if (targetGroupIndexInNewArray !== -1) {
        const updatedGroup = newStudies[targetGroupIndexInNewArray] as TabGroup;
        updatedGroup.items.push(...itemsToAdd);
        
        setActiveStudies(newStudies);
        setActiveTab(targetGroupIndexInNewArray, updatedGroup.items.length - 1);
        setExpandedGroupId(updatedGroup.id);
        cancelGroupSelectionMode();
    } else {
        showToast("An error occurred while adding to the group.");
    }
  };


  const value: AppContextType = {
    mode, setMode, selectedBook, setSelectedBook, selectedChapter, setSelectedChapter,
    startVerse, setStartVerse, endVerse, setEndVerse, expandToPassage, setExpandToPassage,
    topic, setTopic, question, setQuestion, event, setEvent, storyArc, setStoryArc,
    activeStudies, studyData, activeTabIndex, activeSubTabIndex, expandedGroupId, setExpandedGroupId, setActiveTab,
    isLoading, isChatLoading, error, 
    isHistoryOpen, setIsHistoryOpen, isMobileMenuOpen, setIsMobileMenuOpen,
    studyHistory, toastMessage, showToast,
    selectionToolbarState, setSelectionToolbarState,
    fontSize, setFontSize, language, setLanguage, t,
    isGroupSelectionMode, selectedTabsForGrouping, targetGroupForAdding,
    renamingGroupInfo, setRenamingGroupInfo, startRenameGroup,
    handleNewStudy, handleSendChatMessage, handleCrossReferenceSelect, handleReferenceSelectInChat, handleThemeSelect, handleThemeSelectInChat,
    handleHistorySelect, handleAnalyze, handleCloseTab, handleClearHistory,
    handleReorderTabs, handleAnalyzeFullPassage, handleAnalyzeNext, handleAnalyzePrevious,
    handleContinueSystematicStudy,
    handleCloseOtherTabs, handleCloseTabsToRight, handleCloseAllTabs,
    handleCreateTabGroup, handleAddToGroup, handleUngroupTab, handleRenameGroup,
    startGroupSelectionMode, cancelGroupSelectionMode, toggleTabForGrouping, toggleGroupForTargeting,
    handleCreateGroupFromSelection, handleAddToGroupFromSelection,
    handleMoveTabOutOfGroup, handleReorderInGroup, handleRemoveFromGroup,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};