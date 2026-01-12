import React, { useState, useRef, useEffect } from 'react';
import type { ChatAnalysis, ChatMessage } from '../types';
import { ClickableText } from './ClickableText';
import { SuggestionPrompts } from './SuggestionPrompts';
import { exportSingleChatMessageToDocx } from '../services/exportService';

interface ChatDisplayProps {
  data: ChatAnalysis;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onReferenceSelect: (reference: string) => void;
  onThemeSelect: (theme: string) => void;
}

const InteractiveText: React.FC<{
  text: string;
  onReferenceSelect: (reference: string) => void;
  onThemeSelect: (theme: string) => void;
}> = ({ text, onReferenceSelect, onThemeSelect }) => {
  if (!text) return null;

  const parseRecursive = (textPart: string): React.ReactNode[] => {
    // Base case: no markdown
    if (!textPart.includes('**') && !textPart.includes('*')) {
      return [<ClickableText key={textPart} text={textPart} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} as="span" />];
    }

    const boldRegex = /\*\*(.*?)\*\*/;
    const italicRegex = /\*(.*?)\*/;

    const boldMatch = textPart.match(boldRegex);
    const italicMatch = textPart.match(italicRegex);

    let firstMatch: RegExpMatchArray | null = null;
    let isBold = false;

    if (boldMatch && italicMatch) {
        if (boldMatch.index! < italicMatch.index!) {
            firstMatch = boldMatch;
            isBold = true;
        } else {
            firstMatch = italicMatch;
        }
    } else if (boldMatch) {
        firstMatch = boldMatch;
        isBold = true;
    } else {
        firstMatch = italicMatch;
    }

    if (!firstMatch) {
        return [<ClickableText key={textPart} text={textPart} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} as="span" />];
    }

    const before = textPart.substring(0, firstMatch.index!);
    const inside = firstMatch[1];
    const after = textPart.substring(firstMatch.index! + firstMatch[0].length);

    const Tag = isBold ? 'strong' : 'em';

    const result: React.ReactNode[] = [];
    if (before) {
        result.push(<ClickableText key={before} text={before} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} as="span" />);
    }
    result.push(<Tag key={firstMatch.index}>{parseRecursive(inside)}</Tag>);
    if (after) {
        result.push(...parseRecursive(after));
    }
    
    return result;
  };
  
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: React.ReactNode[] } | null = null;

  const flushList = () => {
    if (currentList) {
      const ListComponent = currentList.type;
      const listClassName = ListComponent === 'ul' ? "list-disc space-y-1 my-2 pl-5" : "list-decimal space-y-1 my-2 pl-5";
      elements.push(
        <ListComponent key={`list-${elements.length}`} className={listClassName}>
          {currentList.items}
        </ListComponent>
      );
      currentList = null;
    }
  };

  lines.forEach((line, index) => {
    if (line.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={index} className="text-xl font-bold mt-4 mb-2">{parseRecursive(line.substring(4))}</h3>);
      return;
    }
    
    if (line.startsWith('* ') || line.startsWith('- ')) {
      if (currentList?.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(<li key={index}>{parseRecursive(line.substring(2))}</li>);
      return;
    }
    
    const orderedMatch = line.match(/^\d+\.\s/);
    if (orderedMatch) {
      if (currentList?.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(<li key={index}>{parseRecursive(line.substring(orderedMatch[0].length))}</li>);
      return;
    }

    flushList();
    if (line.trim() !== '') {
        elements.push(<p key={index} className="my-2">{parseRecursive(line)}</p>);
    }
  });

  flushList();

  return <>{elements}</>;
};

const CHAT_SUGGESTION_PROMPTS = [
    "Can you explain that in simpler terms?",
    "What's the historical context for this?",
    "How does this relate to the New Testament?",
    "Give me some related verses."
];

export const ChatDisplay: React.FC<ChatDisplayProps> = ({ data, onSendMessage, isLoading, onReferenceSelect, onThemeSelect }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [data.messages, isLoading]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && !isLoading) {
            onSendMessage(newMessage.trim());
            setNewMessage('');
        }
    };

    return (
        <div className="bg-secondary/50 border border-slate-700 rounded-xl shadow-lg flex flex-col h-[calc(100vh-250px)] max-h-[800px]">
            <header className="p-4 border-b border-slate-700 flex-shrink-0">
                <p className="text-sm uppercase tracking-wider text-text-muted">Conversational Study</p>
                <h2 className="text-xl font-bold text-accent-light">Chat about {data.subject}</h2>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
                {data.messages.map((message, index) => {
                    if (message.role === 'system') {
                        return (
                            <div key={index} className="flex items-center justify-center gap-2 text-xs text-text-muted italic my-4">
                                <div className="flex-grow h-px bg-gray-700/50"></div>
                                <span className="flex-shrink-0 flex items-center gap-2 px-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                    </svg>
                                    {message.text}
                                </span>
                                <div className="flex-grow h-px bg-gray-700/50"></div>
                            </div>
                        );
                    }
                    if (message.role === 'model') {
                        const isLastMessage = index === data.messages.length - 1;
                        const showDots = isLoading && isLastMessage && !message.text;

                        return (
                            <div key={index} className="flex gap-3 justify-start">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-secondary-accent flex items-center justify-center flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                                    </svg>
                                </div>
                                <div className="relative group max-w-xl">
                                    <div className={`p-3 rounded-lg bg-primary/50 text-text-main`}>
                                        {showDots ? (
                                            <div className="flex items-center gap-2">
                                                 <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                                 <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                                 <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce"></div>
                                            </div>
                                        ) : (
                                            <InteractiveText
                                                text={message.text}
                                                onReferenceSelect={onReferenceSelect}
                                                onThemeSelect={onThemeSelect}
                                            />
                                        )}
                                    </div>
                                    {message.text && (
                                        <button
                                            onClick={() => exportSingleChatMessageToDocx(data.subject, message)}
                                            className="absolute top-0 right-0 -mt-2 -mr-2 p-1.5 bg-secondary border border-gray-600 rounded-full text-text-muted opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 hover:text-white"
                                            aria-label="Export this message"
                                            title="Export this message"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    }
                    return (
                        <div key={index} className="flex gap-3 justify-end">
                            <div className="relative group max-w-xl">
                                <div className="p-3 rounded-lg bg-accent text-white">
                                    <InteractiveText
                                        text={message.text}
                                        onReferenceSelect={onReferenceSelect}
                                        onThemeSelect={onThemeSelect}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Show suggestions only after the first introductory message */}
                {data.messages.length === 1 && data.messages[0].role === 'model' && !isLoading && (
                    <SuggestionPrompts onSelect={onSendMessage} prompts={CHAT_SUGGESTION_PROMPTS} isLoading={isLoading} />
                )}
                
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-slate-700 flex-shrink-0 flex items-center gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ask a follow-up question..."
                    className="w-full bg-primary/50 border border-gray-600 rounded-lg p-2.5 text-text-main focus:ring-2 focus:ring-accent focus:border-accent transition"
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !newMessage.trim()} className="bg-accent text-white p-2.5 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                </button>
            </form>
        </div>
    );
};
