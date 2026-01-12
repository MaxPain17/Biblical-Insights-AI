
import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { ALL_STORIES } from '../parablesAndMiracles';

interface EventSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (event: string) => void;
}

export const EventSelectorModal: React.FC<EventSelectorModalProps> = ({ isOpen, onClose, onSelect }) => {
    const storyPopupRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" onClick={onClose}></div>
            <div ref={storyPopupRef} className="relative bg-secondary/95 backdrop-blur-xl border-t md:border border-gray-700/60 rounded-t-2xl md:rounded-xl shadow-2xl w-full md:w-[800px] flex flex-col max-h-[90vh] md:h-[700px] transition-transform duration-300 ease-out transform translate-y-0">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-600 rounded-full md:hidden"></div>
                <div className="flex justify-between items-center p-4 pt-6 md:pt-4 border-b border-gray-700 flex-shrink-0">
                    <h2 className="text-lg font-bold text-accent-light">Select an Event or Story</h2>
                    <button onClick={onClose} className="text-text-muted hover:text-white bg-primary/50 p-1.5 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="overflow-y-auto custom-scrollbar p-4">
                    {ALL_STORIES.map((superCategory) => (
                        <div key={superCategory.title} className="mb-8">
                            <h2 className={`text-2xl font-bold text-text-main mb-4 pl-4 border-l-4 ${superCategory.color}`}>{superCategory.title}</h2>
                            {superCategory.subCategories.map((subCategory) => (
                                <div key={subCategory.title} className="mb-6 pl-4">
                                    <h3 className="text-md font-semibold text-text-muted uppercase tracking-wider mb-3 border-b border-gray-700 pb-2">{subCategory.title}</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {subCategory.stories.map(story => (
                                            <button 
                                                key={story}
                                                onClick={() => onSelect(story)}
                                                className="w-full text-left text-sm p-2 rounded-md transition-colors text-text-main hover:bg-primary/60 focus:outline-none focus:ring-2 focus:ring-accent"
                                            >
                                                {story}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>,
        document.body
    );
};
