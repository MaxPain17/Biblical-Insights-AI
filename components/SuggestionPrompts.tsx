import React from 'react';

interface SuggestionPromptsProps {
  onSelect: (prompt: string) => void;
  prompts: string[];
  isLoading: boolean;
}

export const SuggestionPrompts: React.FC<SuggestionPromptsProps> = ({ onSelect, prompts, isLoading }) => {
    if (isLoading) {
        return (
            <div className="flex justify-start">
                <div className="max-w-xl p-3">
                    <p className="text-sm font-semibold text-text-muted mb-3 animate-pulse">Generating suggestions...</p>
                    <div className="flex flex-wrap gap-2">
                        {[...Array(2)].map((_, index) => (
                             <div key={index} className="h-9 w-48 bg-primary/50 rounded-full animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (prompts.length === 0) return null;

    return (
        <div className="flex justify-start">
             <div className="max-w-xl p-3">
                <p className="text-sm font-semibold text-text-muted mb-3">Try one of these prompts:</p>
                <div className="flex flex-wrap gap-2">
                    {prompts.map((prompt, index) => (
                        <button
                            key={index}
                            onClick={() => onSelect(prompt)}
                            className="px-3 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 bg-primary/50 text-text-muted hover:bg-secondary/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary/50 focus:ring-accent-light"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};