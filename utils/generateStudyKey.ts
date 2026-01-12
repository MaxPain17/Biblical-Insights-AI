import type { HistoryItem, KnowledgeLevel, TabItem } from '../types';
import { bookTranslations } from './translations';

type Language = 'en' | 'tl';

export const generateSystematicPlanKey = (level: KnowledgeLevel, language: Language): string => {
    return `${language}-systematic-${level.toLowerCase()}`;
};

export const generateStudyKey = (item: HistoryItem, language: Language): string => {
    const langPrefix = `${language}-`;
    switch (item.mode) {
        case 'reference':
            return `${langPrefix}reference-${item.book}-${item.chapter}-${item.startVerse}-${item.endVerse}`;
        case 'topic':
            return `${langPrefix}topic-${item.topic.toLowerCase().trim()}`;
        case 'qa':
            return `${langPrefix}qa-${item.question.toLowerCase().trim()}`;
        case 'event':
            return `${langPrefix}event-${item.event.toLowerCase().trim()}`;
        case 'storyArc':
            return `${langPrefix}storyarc-${item.storyArc.toLowerCase().trim()}`;
        case 'chat':
            return `${langPrefix}chat-${item.subject.toLowerCase().trim()}-${item.contextKey || 'none'}`;
        case 'systematic':
            // The key for a tab must be unique per topic
            return `${langPrefix}systematic-${item.level.toLowerCase()}-${item.topic.toLowerCase().trim()}`;
        default:
            return `${langPrefix}unknown-${Date.now()}`;
    }
};

export const getStudyTitle = (item: TabItem, language: Language): string => {
    if ('isGroup' in item) {
        return item.name;
    }

    switch(item.mode) {
        case 'reference': {
            const bookName = bookTranslations[language]?.[item.book] || item.book;
            return item.startVerse === item.endVerse 
                ? `${bookName} ${item.chapter}:${item.startVerse}`
                : `${bookName} ${item.chapter}:${item.startVerse}-${item.endVerse}`;
        }
        case 'topic':
            return item.topic;
        case 'qa':
            return `Q: ${item.question.substring(0, 20)}...`;
        case 'event':
            return item.event;
        case 'storyArc':
            return item.storyArc;
        case 'chat':
            return `Chat: ${item.subject.substring(0, 20)}...`;
        case 'systematic':
            const title = item.topic === 'Full Study Plan' ? `${item.level} Plan` : `${item.level}: ${item.topic}`;
            return title.length > 30 ? `${title.substring(0, 27)}...` : title;
        default:
            return 'New Study';
    }
}