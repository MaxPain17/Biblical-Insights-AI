import { BIBLE_DATA } from './bibleData';

export const BIBLE_BOOKS = Object.keys(BIBLE_DATA);

export const OLD_TESTAMENT_BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", 
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", 
  "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", 
  "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", 
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"
];

export const NEW_TESTAMENT_BOOKS = [
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", 
  "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", 
  "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter", 
  "1 John", "2 John", "3 John", "Jude", "Revelation"
];

// --- Categorized Book Lists ---
export const OLD_TESTAMENT_CATEGORIES = [
    {
        category: "The Law (Pentateuch)",
        key: "pentateuch",
        books: ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy"],
        color: "border-rose-400"
    },
    {
        category: "History",
        key: "historyCat",
        books: ["Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther"],
        color: "border-amber-400"
    },
    {
        category: "Wisdom & Poetry",
        key: "wisdomPoetry",
        books: ["Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon"],
        color: "border-sky-400"
    },
    {
        category: "Major Prophets",
        key: "majorProphets",
        books: ["Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel"],
        color: "border-indigo-400"
    },
    {
        category: "Minor Prophets",
        key: "minorProphets",
        books: ["Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"],
        color: "border-purple-400"
    }
];

export const NEW_TESTAMENT_CATEGORIES = [
    {
        category: "Gospels & Acts",
        key: "gospelsActs",
        books: ["Matthew", "Mark", "Luke", "John", "Acts"],
        color: "border-lime-400"
    },
    {
        category: "Pauline Epistles",
        key: "paulineEpistles",
        books: ["Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon"],
        color: "border-cyan-400"
    },
    {
        category: "General Epistles",
        key: "generalEpistles",
        books: ["Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude"],
        color: "border-violet-400"
    },
    {
        category: "Apocalyptic",
        key: "apocalyptic",
        books: ["Revelation"],
        color: "border-fuchsia-400"
    }
];


// --- Single Source of Truth for Book Aliases ---
export const BOOK_ALIASES: Record<string, string> = {
    // Pentateuch
    'gen': 'Genesis', 'ge': 'Genesis', 'gn': 'Genesis',
    'exo': 'Exodus', 'ex': 'Exodus',
    'lev': 'Leviticus', 'le': 'Leviticus', 'lv': 'Leviticus',
    'num': 'Numbers', 'nu': 'Numbers', 'nm': 'Numbers',
    'deut': 'Deuteronomy', 'de': 'Deuteronomy', 'dt': 'Deuteronomy',
    // History
    'josh': 'Joshua', 'jos': 'Joshua',
    'judg': 'Judges', 'jdg': 'Judges',
    'ruth': 'Ruth', 'ru': 'Ruth',
    '1sam': '1 Samuel', '1sa': '1 Samuel',
    '2sam': '2 Samuel', '2sa': '2 Samuel',
    '1kgs': '1 Kings', '1ki': '1 Kings',
    '2kgs': '2 Kings', '2ki': '2 Kings',
    '1chr': '1 Chronicles', '1ch': '1 Chronicles',
    '2chr': '2 Chronicles', '2ch': '2 Chronicles',
    'ezra': 'Ezra', 'ezr': 'Ezra',
    'neh': 'Nehemiah', 'ne': 'Nehemiah',
    'esth': 'Esther', 'es': 'Esther',
    // Wisdom
    'job': 'Job', 'jb': 'Job',
    'psa': 'Psalms', 'ps': 'Psalms',
    'prov': 'Proverbs', 'pr': 'Proverbs',
    'eccl': 'Ecclesiastes', 'ec': 'Ecclesiastes',
    'song': 'Song of Solomon', 'sos': 'Song of Solomon', 'song of songs': 'Song of Solomon',
    // Prophets
    'isa': 'Isaiah', 'is': 'Isaiah',
    'jer': 'Jeremiah', 'je': 'Jeremiah',
    'lam': 'Lamentations', 'la': 'Lamentations',
    'ezek': 'Ezekiel', 'eze': 'Ezekiel',
    'dan': 'Daniel', 'da': 'Daniel',
    'hos': 'Hosea', 'ho': 'Hosea',
    'joel': 'Joel', 'jl': 'Joel',
    'amos': 'Amos', 'am': 'Amos',
    'obad': 'Obadiah', 'ob': 'Obadiah',
    'jonah': 'Jonah', 'jon': 'Jonah',
    'mic': 'Micah', 'mi': 'Micah',
    'nah': 'Nahum', 'na': 'Nahum',
    'hab': 'Habakkuk',
    'zeph': 'Zephaniah', 'zep': 'Zephaniah',
    'hag': 'Haggai', 'hg': 'Haggai',
    'zech': 'Zechariah', 'zec': 'Zechariah',
    'mal': 'Malachi', 'ml': 'Malachi',
    // Gospels
    'matt': 'Matthew', 'mt': 'Matthew',
    'mark': 'Mark', 'mk': 'Mark', 'mrk': 'Mark',
    'luke': 'Luke', 'lk': 'Luke',
    'john': 'John', 'jn': 'John',
    'acts': 'Acts', 'ac': 'Acts',
    // Epistles
    'rom': 'Romans', 'ro': 'Romans',
    '1cor': '1 Corinthians', '1co': '1 Corinthians',
    '2cor': '2 Corinthians', '2co': '2 Corinthians',
    'gal': 'Galatians', 'ga': 'Galatians',
    'eph': 'Ephesians', 'ep': 'Ephesians',
    'phil': 'Philippians', 'php': 'Philippians',
    'col': 'Colossians', 'co': 'Colossians',
    '1thess': '1 Thessalonians', '1th': '1 Thessalonians',
    '2thess': '2 Thessalonians', '2th': '2 Thessalonians',
    '1tim': '1 Timothy', '1ti': '1 Timothy',
    '2tim': '2 Timothy', '2ti': '2 Timothy',
    'titus': 'Titus', 'ti': 'Titus',
    'philem': 'Philemon', 'phm': 'Philemon',
    'heb': 'Hebrews', 'he': 'Hebrews',
    'james': 'James', 'jas': 'James',
    '1pet': '1 Peter', '1pe': '1 Peter',
    '2pet': '2 Peter', '2pe': '2 Peter',
    '1john': '1 John', '1jn': '1 John',
    '2john': '2 John', '2jn': '2 John',
    '3john': '3 John', '3jn': '3 John',
    'jude': 'Jude',
    'rev': 'Revelation', 're': 'Revelation',

    // Tagalog Aliases
    "henesis": "Genesis", "exodo": "Exodus", "levitico": "Leviticus", "mga bilang": "Numbers", "deuteronomio": "Deuteronomy", "josue": "Joshua", "mga hukom": "Judges", "1 samuel": "1 Samuel", "2 samuel": "2 Samuel", "1 mga hari": "1 Kings", "2 mga hari": "2 Kings", "1 mga cronica": "1 Chronicles", "2 mga cronica": "2 Chronicles", "nehemias": "Nehemiah", "ester": "Esther", "mga awit": "Psalms", "mga kawikaan": "Proverbs", "eclesiastes": "Ecclesiastes", "ang awit ni solomon": "Song of Solomon", "isaias": "Isaiah", "jeremias": "Jeremiah", "mga panaghoy": "Lamentations", "oseas": "Hosea", "obadias": "Obadiah", "jonas": "Jonah", "mikas": "Micah", "habacuc": "Habakkuk", "zefanias": "Zephaniah", "hagai": "Haggai", "zacarias": "Zechariah", "malakias": "Malachi",
    "mateo": "Matthew", "marcos": "Mark", "lucas": "Luke", "juan": "John", "mga gawa": "Acts", "mga taga-roma": "Romans", "1 mga taga-corinto": "1 Corinthians", "2 mga taga-corinto": "2 Corinthians", "mga taga-galacia": "Galatians", "mga taga-efeso": "Ephesians", "mga taga-filipos": "Philippians", "mga taga-colosas": "Colossians", "1 mga taga-tesalonica": "1 Thessalonians", "2 mga taga-tesalonica": "2 Thessalonians", "1 timoteo": "1 Timothy", "2 timoteo": "2 Timothy", "tito": "Titus", "filemon": "Philemon", "mga hebreo": "Hebrews", "santiago": "James", "1 pedro": "1 Peter", "2 pedro": "2 Peter", "1 juan": "1 John", "2 juan": "2 John", "3 juan": "3 John", "judas": "Jude", "pahayag": "Revelation"
};

// Words that are too generic to be a standalone search topic.
export const INVALID_SEARCH_TOPICS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'for', 'nor', 'yet', 'so',
  'of', 'in', 'on', 'at', 'to', 'from', 'by', 'with', 'is', 'be', 'as'
]);
