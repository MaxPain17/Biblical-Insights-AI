import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ChatPromptModal } from './ChatPromptModal';

export const ChatFAB: React.FC = () => {
    const { handleNewStudy } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleChatSubmit = (subject: string) => {
        handleNewStudy({ mode: 'chat', subject: subject });
        setIsModalOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-8 right-8 bg-gradient-to-br from-accent to-secondary-accent text-white h-16 w-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-accent/50"
                aria-label="Start a new chat"
                title="Start a new chat"
            >
                <span className="font-bold text-base tracking-wider">
                    CHAT
                </span>
            </button>
            <ChatPromptModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleChatSubmit}
            />
        </>
    );
};