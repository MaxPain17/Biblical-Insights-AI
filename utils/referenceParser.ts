import { BIBLE_DATA } from '../bibleData';
import { BOOK_ALIASES } from '../constants';

const allBookNames = Object.keys(BIBLE_DATA);
const canonicalBookNameMap: Map<string, string> = new Map();
allBookNames.forEach(book => {
    canonicalBookNameMap.set(book.toLowerCase().replace(/\s+/g, ''), book);
});
Object.entries(BOOK_ALIASES).forEach(([alias, book]) => {
    canonicalBookNameMap.set(alias.toLowerCase(), book);
});

const bookAndAliasList = [...allBookNames, ...Object.keys(BOOK_ALIASES)]
    .sort((a, b) => b.length - a.length)
    .map(name => name.replace(/\s+/g, ' ?'));

const bookRegexString = `(${bookAndAliasList.join('|')})`;

// Regex to find references within a block of text
export const referenceRegex = new RegExp(
  `\\b${bookRegexString}\\s+(\\d{1,3}):(\\d{1,3})(?:\\s*-\\s*(\\d{1,3}))?\\b`, 'gi'
);

// Stricter regex for parsing a single, isolated reference string
const singleReferenceRegex = new RegExp(
  `^\\s*${bookRegexString}\\s*(\\d+)(?:[:.](\\d+))?(?:\\s*-\\s*(\\d+))?\\s*$`, 'i'
);

/**
 * Parses a single reference string into its components.
 * Handles formats like "John 3:16", "1 Sam 1", "Gen 1:1-5".
 * @param query The string to parse.
 * @returns A structured reference object or null if parsing fails.
 */
export const parseReference = (query: string) => {
    const match = query.match(singleReferenceRegex);
    if (!match) {
        // Fallback for simple "Book C:V" format from AI responses
        const simpleMatch = query.match(/^((\d\s)?[a-zA-Z\s]+)\s(\d+):(\d+)(?:-(\d+))?/);
        if(!simpleMatch) return null;
        
        const [, book, , chapterStr, startVerseStr, endVerseStr] = simpleMatch;
        const bookName = book.trim();

        if (!allBookNames.includes(bookName)) return null;

        const chapter = parseInt(chapterStr, 10);
        const startVerse = parseInt(startVerseStr, 10);
        const endVerse = endVerseStr ? parseInt(endVerseStr, 10) : startVerse;
        return { book: bookName, chapter, startVerse, endVerse };
    }

    const [, bookAlias, chapterStr, startVerseStr, endVerseStr] = match;

    const bookKey = bookAlias.toLowerCase().replace(/\s/g, '');
    const bookName = canonicalBookNameMap.get(bookKey);

    if (!bookName) return null;

    const chapter = parseInt(chapterStr, 10);
    const bookData = BIBLE_DATA[bookName];
    if (!bookData || chapter < 1 || chapter > bookData.length) {
        return null;
    }

    const maxVerse = bookData[chapter - 1];
    let startVerse = startVerseStr ? parseInt(startVerseStr, 10) : 1;
    let endVerse = endVerseStr ? parseInt(endVerseStr, 10) : (startVerseStr ? startVerse : maxVerse);

    if (startVerse < 1 || startVerse > maxVerse || endVerse < 1 || endVerse > maxVerse || startVerse > endVerse) {
        return null;
    }

    return {
        book: bookName,
        chapter,
        startVerse,
        endVerse,
    };
};

export const getCanonicalBookName = (name: string): string | undefined => {
    const key = name.toLowerCase().replace(/\s+/g, '');
    return canonicalBookNameMap.get(key);
}
