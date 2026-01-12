import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { INVALID_SEARCH_TOPICS } from '../constants';

interface ChatPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (subject: string) => void;
}

const suggestions = [
  'The Trinity',
  'The Covenants',
  'Parables of Jesus',
  'The Nature of Grace'
];

export const ChatPromptModal: React.FC<ChatPromptModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [subject, setSubject] = useState('');

  if (!isOpen) return null;

  const isSubjectValid = () => {
    const trimmed = subject.trim();
    if (trimmed.length < 2) return false;
    if (INVALID_SEARCH_TOPICS.has(trimmed.toLowerCase())) return false;
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubjectValid()) {
      onSubmit(subject.trim());
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div 
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div className="relative bg-secondary/95 backdrop-blur-xl border border-gray-700/60 rounded-xl shadow-2xl w-full max-w-lg p-8">
        
        <div className="flex items-center gap-4 mb-6">
            <div className="flex-shrink-0 bg-accent/20 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-accent-light">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-accent-light">Start a New Chat</h2>
              <p className="text-text-muted text-sm mt-1">What topic would you like to discuss?</p>
            </div>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., The role of faith and works"
            className="w-full bg-primary/50 border border-gray-600 rounded-lg px-4 py-2.5 text-text-main focus:ring-2 focus:ring-accent focus:border-accent transition text-base"
            autoFocus
          />

          <div className="mt-4">
            <p className="text-xs text-text-muted mb-2">Or, start with a suggestion:</p>
            <div className="flex flex-wrap gap-2">
                {suggestions.map(suggestion => (
                    <button
                        key={suggestion}
                        type="button"
                        onClick={() => setSubject(suggestion)}
                        className="px-3 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 bg-primary/50 text-text-muted hover:bg-secondary/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary/95 focus:ring-accent-light"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-primary/50 text-text-main hover:bg-primary/80 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isSubjectValid()}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-accent to-secondary-accent text-white font-semibold transition-colors disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-accent/20"
            >
              Start Chat
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
