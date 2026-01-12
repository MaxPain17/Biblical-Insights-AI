

import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import type { FontSize } from '../types';

type Language = 'en' | 'tl';

export const SettingsControl: React.FC = () => {
    const {
        fontSize, setFontSize,
        language, setLanguage, t,
        isLoading, isChatLoading, isDrawerOpen
    } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                isOpen &&
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen]);

    const handleFontSelect = (size: FontSize) => {
        setFontSize(size);
    };

    const handleLangSelect = (lang: Language) => {
        setLanguage(lang);
    };

    const isLanguageSwitchDisabled = isLoading || isChatLoading || isDrawerOpen;
    const disabledTooltip = "Cannot change language while an operation is in progress or a drawer is open.";

    const fontOptions: { id: FontSize, label: string }[] = [
        { id: 'sm', label: 'Small' },
        { id: 'base', label: 'Medium' },
        { id: 'lg', label: 'Large' },
    ];

    const langOptions: { id: Language, label: string }[] = [
        { id: 'en', label: 'English' },
        { id: 'tl', label: 'Tagalog' },
    ];

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-transparent text-white h-10 w-10 rounded-lg flex items-center justify-center transition-colors hover:bg-accent/20 focus:outline-none focus:ring-2 focus:ring-accent/50"
                aria-label="Open settings"
                title="Settings"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-text-muted transition-colors">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.43.992a6.759 6.759 0 0 1 0 1.985c-.008.379.137.752.43.992l1.003.827c.424.35.534.954.26 1.431l-1.296 2.247a1.125 1.125 0 0 1-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.57 6.57 0 0 1-.22.127c-.332.183-.582.495-.645.87l-.213 1.281c-.09.543-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313.686-.645-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 0 1-1.37-.49l-1.296-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.759 6.759 0 0 1 0-1.985c.008-.379-.137-.752-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.431l1.296-2.247a1.125 1.125 0 0 1 1.37-.49l1.217.456c.355.133.75.072 1.075-.124.072-.044.146-.087.22-.127.332-.183.582-.495.645-.87l.213-1.281Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
            </button>
            {isOpen && (
                <div
                    ref={popoverRef}
                    className="absolute right-0 mt-2 w-56 bg-secondary border border-gray-700 rounded-lg shadow-2xl z-20"
                >
                    <div className="p-3">
                        <p className="text-xs font-semibold text-text-muted px-1 mb-2">{t('fontSize')}</p>
                        <div className="flex bg-primary/50 p-1 rounded-md">
                            {fontOptions.map(option => (
                                <button
                                    key={option.id}
                                    onClick={() => handleFontSelect(option.id)}
                                    className={`w-full text-center px-2 py-1 text-sm font-semibold rounded transition-colors ${
                                        fontSize === option.id ? 'bg-accent text-white shadow' : 'text-text-muted hover:text-white'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="p-3 border-t border-gray-700/60">
                         <p className="text-xs font-semibold text-text-muted px-1 mb-2">{t('language')}</p>
                        <div
                            className={`flex bg-primary/50 p-1 rounded-md ${isLanguageSwitchDisabled ? 'opacity-50' : ''}`}
                            title={isLanguageSwitchDisabled ? disabledTooltip : ''}
                        >
                            {langOptions.map(option => (
                                <button
                                    key={option.id}
                                    onClick={() => handleLangSelect(option.id)}
                                    disabled={isLanguageSwitchDisabled}
                                    className={`w-full text-center px-2 py-1 text-sm font-semibold rounded transition-colors ${
                                        language === option.id ? 'bg-accent text-white shadow' : 'text-text-muted hover:text-white'
                                    } ${isLanguageSwitchDisabled ? 'cursor-not-allowed' : ''}`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
