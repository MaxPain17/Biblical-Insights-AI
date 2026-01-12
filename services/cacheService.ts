
import type { VerseAnalysis, ThematicAnalysis, QaAnalysis, EventAnalysis, StoryArcAnalysis, SystematicTopicAnalysis, ChatAnalysis, SystematicAnalysis } from '../types';

type CacheableItem = VerseAnalysis | ThematicAnalysis | QaAnalysis | EventAnalysis | StoryArcAnalysis | SystematicTopicAnalysis | ChatAnalysis | SystematicAnalysis;

const CACHE_KEY = 'bibleAnalysisCache';
const MAX_CACHE_SIZE = 50; // Store the 50 most recent items

// The cache will be stored as an array of [key, value] pairs,
// which preserves insertion order for easy LRU-style eviction.
type CacheStore = [string, CacheableItem][];

const getCache = (): CacheStore => {
    try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            return JSON.parse(cachedData);
        }
    } catch (error) {
        console.error("Could not read from cache", error);
    }
    return [];
};

const saveCache = (cache: CacheStore) => {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
        console.error("Could not save to cache", error);
    }
};

export const getItem = (key: string): CacheableItem | null => {
    const cache = getCache();
    const item = cache.find(([cacheKey]) => cacheKey === key);
    return item ? item[1] : null;
};

export const setItem = (key: string, value: CacheableItem) => {
    let cache = getCache();
    
    // Remove existing item if it exists to move it to the front.
    const existingIndex = cache.findIndex(([cacheKey]) => cacheKey === key);
    if (existingIndex > -1) {
        cache.splice(existingIndex, 1);
    }

    // Add new item to the front (most recent).
    cache.unshift([key, value]);
    
    // Enforce max size by removing the oldest item(s).
    if (cache.length > MAX_CACHE_SIZE) {
        cache = cache.slice(0, MAX_CACHE_SIZE);
    }
    
    saveCache(cache);
};

export const clearCache = () => {
    try {
        localStorage.removeItem(CACHE_KEY);
    } catch (error) {
        console.error("Could not clear cache", error);
    }
};