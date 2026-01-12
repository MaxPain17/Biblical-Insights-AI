
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { BIBLE_DATA } from '../bibleData';
import { OLD_TESTAMENT_CATEGORIES, NEW_TESTAMENT_CATEGORIES } from '../constants';
import { parseReference } from '../utils/referenceParser';
import { useAppContext } from '../context/AppContext';
import { bookTranslations } from '../utils/translations';

interface NumberGridProps {
    options: number[];
    startVerse: number;
    endVerse: number;
    onSelect: (value: number) => void;
    hoveredVerse: number | null;
    setHoveredVerse: (value: number | null) => void;
}

const NumberGrid: React.FC<NumberGridProps> = ({ 
    options, 
    startVerse, 
    endVerse, 
    onSelect,
    hoveredVerse,
    setHoveredVerse
}) => {
    const gridColsClass = options.length > 50 ? 'grid-cols-8 md:grid-cols-10' : 'grid-cols-6 md:grid-cols-8';
    
    const getVerseClasses = (verse: number) => {
        const isSelectedStart = verse === startVerse;
        const isSelectedEnd = verse === endVerse;
        const isExactSelection = isSelectedStart || isSelectedEnd;
        
        const inSelectedRange = verse > Math.min(startVerse, endVerse) && verse < Math.max(startVerse, endVerse);

        let inPreviewRange = false;
        if (hoveredVerse !== null && startVerse === endVerse && hoveredVerse !== startVerse) {
             const min = Math.min(startVerse, hoveredVerse);
             const max = Math.max(startVerse, hoveredVerse);
             inPreviewRange = verse >= min && verse <= max;
        }

        let classes = "flex items-center justify-center p-2 text-sm font-medium rounded-md transition-all duration-150 ";

        if (isExactSelection) {
            classes += "bg-accent text-white shadow-md transform scale-105 z-10 ";
        } else if (inPreviewRange) {
             classes += "bg-accent/40 text-white border border-accent/50 ";
        } else if (inSelectedRange) {
            classes += "bg-accent/20 text-text-main ";
        } else {
            classes += "bg-secondary/40 text-text-muted hover:bg-primary/80 hover:text-text-main ";
        }

        return classes;
    };

    return (
        <div 
            className={`grid ${gridColsClass} gap-1.5`}
            onMouseLeave={() => setHoveredVerse(null)}
        >
            {options.map(option => (
                <button
                    key={option}
                    onClick={() => onSelect(option)}
                    onMouseEnter={() => setHoveredVerse(option)}
                    className={getVerseClasses(option)}
                >
                    {option}
                </button>
            ))}
        </div>
    );
};


interface ReferenceSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (selection: { book: string; chapter: number; startVerse: number; endVerse: number; }) => void;
}

export const ReferenceSelectorModal: React.FC<ReferenceSelectorModalProps> = ({ isOpen, onClose, onSelect }) => {
    const { 
        selectedBook: initialBook, 
        selectedChapter: initialChapter, 
        startVerse: initialStartVerse, 
        endVerse: initialEndVerse,
        language,
        t
    } = useAppContext();

    const [book, setBook] = useState(initialBook);
    const [chapter, setChapter] = useState(initialChapter);
    const [startVerse, setStartVerse] = useState(initialStartVerse);
    const [endVerse, setEndVerse] = useState(initialEndVerse);

    const [previewBook, setPreviewBook] = useState(initialBook);
    const [hoveredVerse, setHoveredVerse] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [parsedReference, setParsedReference] = useState<ReturnType<typeof parseReference>>(null);

    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setBook(initialBook);
            setChapter(initialChapter);
            setStartVerse(initialStartVerse);
            setEndVerse(initialEndVerse);
            setPreviewBook(initialBook);
            setSearchQuery('');
            setHoveredVerse(null);
        }
    }, [isOpen, initialBook, initialChapter, initialStartVerse, initialEndVerse]);
    
    useEffect(() => {
        const result = parseReference(searchQuery);
        setParsedReference(result);
    }, [searchQuery]);

    const getReferenceString = () => {
        const bookName = bookTranslations[language]?.[book] || book;
        if (startVerse === endVerse) {
            return `${bookName} ${chapter}:${startVerse}`;
        }
        return `${bookName} ${chapter}:${startVerse}-${endVerse}`;
    };

    const handleBookSelect = (bookKey: string) => {
        setPreviewBook(bookKey);
        setBook(bookKey);
        setChapter(1);
        setStartVerse(1);
        setEndVerse(1);
    };

    const handleVerseSelect = (verse: number) => {
        if (startVerse === endVerse) {
            const newStart = Math.min(startVerse, verse);
            const newEnd = Math.max(startVerse, verse);
            setStartVerse(newStart);
            setEndVerse(newEnd);
        } else {
            setStartVerse(verse);
            setEndVerse(verse);
        }
    };
    
    const handleGoToReference = () => {
        if (parsedReference) {
            setBook(parsedReference.book);
            setPreviewBook(parsedReference.book);
            setChapter(parsedReference.chapter);
            setStartVerse(parsedReference.startVerse);
            setEndVerse(parsedReference.endVerse);
            setSearchQuery('');
        }
    };

    const handleSelectAndClose = () => {
        onSelect({ book, chapter, startVerse, endVerse });
    };

    const getSelectionStatus = () => {
        if (startVerse === endVerse) {
            return "Click another verse to select a range";
        }
        return "Range selected. Click any verse to reset.";
    };

    const filterCategories = (categories: typeof OLD_TESTAMENT_CATEGORIES) => {
        if (!searchQuery.trim() || parsedReference) {
            return categories.map(cat => ({
                ...cat,
                books: cat.books.map(b => ({ key: b, name: bookTranslations[language][b] || b }))
            }));
        }
        const lowercasedQuery = searchQuery.toLowerCase();
        return categories
            .map(category => ({
                ...category,
                books: category.books.map(b => ({ key: b, name: bookTranslations[language][b] || b })).filter(b => b.name.toLowerCase().includes(lowercasedQuery)),
            }))
            .filter(category => category.books.length > 0);
    };

    const filteredOldTestament = useMemo(() => filterCategories(OLD_TESTAMENT_CATEGORIES), [searchQuery, parsedReference, language]);
    const filteredNewTestament = useMemo(() => filterCategories(NEW_TESTAMENT_CATEGORIES), [searchQuery, parsedReference, language]);

    const bookData = BIBLE_DATA[previewBook];
    const chapterOptions = bookData ? Array.from({ length: bookData.length }, (_, i) => i + 1) : [];
    const verseOptions = bookData && chapter > 0 && chapter <= bookData.length ? Array.from({ length: bookData[chapter - 1] }, (_, i) => i + 1) : [];

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" onClick={onClose}></div>
            <div ref={popupRef} className="relative bg-secondary/95 backdrop-blur-xl border-t md:border border-gray-700/60 rounded-t-2xl md:rounded-xl shadow-2xl w-full md:w-[700px] flex flex-col max-h-[90vh] md:max-h-[600px] transition-transform duration-300 ease-out transform translate-y-0">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-600 rounded-full md:hidden"></div>
                <div className="flex justify-between items-center p-4 pt-6 md:pt-4 border-b border-gray-700 bg-secondary/95 rounded-t-2xl md:rounded-t-xl flex-shrink-0">
                    <div>
                        <h3 className="text-lg font-bold text-text-main">Select Passage</h3>
                        <p className="text-sm text-accent-light mt-0.5">{getReferenceString()}</p>
                    </div>
                    <button onClick={onClose} className="text-text-muted hover:text-white bg-primary/50 p-1.5 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                    <div className="w-full md:w-1/3 border-r border-gray-700 overflow-y-auto custom-scrollbar bg-primary/30">
                        <div className="p-2">
                            <h3 className="text-lg font-bold text-accent-light px-2 mt-2 mb-2">Old Testament</h3>
                            {filteredOldTestament.map(({ category, books, color }, index) => (
                                <div key={category} className={`border-l-4 ${color} pl-4 pt-2 ${index < filteredOldTestament.length - 1 ? 'pb-4 mb-2 border-b border-dashed border-gray-700/60' : 'pb-2'}`}>
                                    <h4 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">{category}</h4>
                                    <div className="space-y-0.5">
                                        {books.map(b => (
                                            <button key={b.key} onClick={() => handleBookSelect(b.key)} className={`w-full text-left text-sm px-2 py-1 rounded-md transition-colors ${previewBook === b.key ? 'bg-accent text-white font-medium' : 'text-text-main hover:bg-white/5'}`}>
                                                {b.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <h3 className="text-lg font-bold text-accent-light px-2 mt-4 pt-2 mb-2 border-t border-gray-700">New Testament</h3>
                            {filteredNewTestament.map(({ category, books, color }, index) => (
                                <div key={category} className={`border-l-4 ${color} pl-4 pt-2 ${index < filteredNewTestament.length - 1 ? 'pb-4 mb-2 border-b border-dashed border-gray-700/60' : 'pb-2'}`}>
                                    <h4 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">{category}</h4>
                                    <div className="space-y-0.5">
                                        {books.map(b => (
                                            <button key={b.key} onClick={() => handleBookSelect(b.key)} className={`w-full text-left text-sm px-2 py-1 rounded-md transition-colors ${previewBook === b.key ? 'bg-accent text-white font-medium' : 'text-text-main hover:bg-white/5'}`}>
                                                {b.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-full md:w-2/3 flex flex-col overflow-hidden bg-secondary">
                        <div className="p-4 border-b border-gray-700">
                            <div className="relative">
                                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search books or enter reference (e.g. John 3:16)" className="w-full bg-primary/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-text-main focus:ring-2 focus:ring-accent focus:border-accent transition" />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-text-muted"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                                </div>
                            </div>
                            {parsedReference && (
                                <button onClick={handleGoToReference} className="w-full mt-2 bg-accent/20 hover:bg-accent/40 text-accent-light font-semibold py-2 px-3 rounded-lg text-sm transition-colors">
                                    Go to {parsedReference.book} {parsedReference.chapter}:{parsedReference.startVerse}{parsedReference.startVerse !== parsedReference.endVerse ? `-${parsedReference.endVerse}`: ''}
                                </button>
                            )}
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                            <div className="mb-6">
                                <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3">Select Chapter</h3>
                                <div className="grid grid-cols-6 md:grid-cols-8 gap-2">
                                    {chapterOptions.map(opt => (<button key={opt} onClick={() => setChapter(opt)} className={`p-2 text-sm rounded-md transition-colors ${chapter === opt ? 'bg-accent text-white font-bold shadow' : 'bg-primary/40 text-text-muted hover:bg-primary/80 hover:text-text-main'}`}>{opt}</button>))}
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-end mb-3 sticky top-0 bg-secondary/95 backdrop-blur py-2 z-10 border-b border-gray-700/50 -mx-4 px-4">
                                     <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">Select Verses</h3>
                                     <span className="text-sm text-accent-light animate-pulse">{getSelectionStatus()}</span>
                                </div>
                                <NumberGrid options={verseOptions} startVerse={startVerse} endVerse={endVerse} onSelect={handleVerseSelect} hoveredVerse={hoveredVerse} setHoveredVerse={setHoveredVerse} />
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-700 bg-secondary flex-shrink-0">
                            <button onClick={handleSelectAndClose} className="w-full bg-accent hover:bg-accent-light text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                                <span>Select {getReferenceString()}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
