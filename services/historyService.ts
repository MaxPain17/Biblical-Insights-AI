
import type { HistoryItem } from '../types';
import { isEqual } from 'lodash-es';

const HISTORY_KEY = 'bibleAnalysisHistory';
const MAX_HISTORY_SIZE = 50;

type HistoryStore = HistoryItem[];

export const getHistory = (): HistoryStore => {
    try {
        const storedData = localStorage.getItem(HISTORY_KEY);
        if (storedData) {
            return JSON.parse(storedData);
        }
    } catch (error) {
        console.error("Could not read from history", error);
    }
    return [];
};

const saveHistory = (history: HistoryStore) => {
    try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
        console.error("Could not save to history", error);
    }
};

export const addHistoryItem = (item: HistoryItem): HistoryStore => {
    let history = getHistory();
    
    // Remove identical existing item to move it to the front.
    const existingIndex = history.findIndex(historyItem => isEqual(historyItem, item));
    if (existingIndex > -1) {
        history.splice(existingIndex, 1);
    }

    // Add new item to the front (most recent).
    history.unshift(item);
    
    // Enforce max size by removing the oldest item(s).
    if (history.length > MAX_HISTORY_SIZE) {
        history = history.slice(0, MAX_HISTORY_SIZE);
    }
    
    saveHistory(history);
    return history;
};

export const clearHistory = () => {
    try {
        localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
        console.error("Could not clear history", error);
    }
};
