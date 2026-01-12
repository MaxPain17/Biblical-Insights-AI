
import React from 'react';
import { createPortal } from 'react-dom';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div 
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div className="relative bg-secondary/95 backdrop-blur-xl border border-gray-700/60 rounded-xl shadow-2xl w-full max-w-2xl p-8 animate-fade-in">
        
        <div className="flex items-center gap-4 mb-6">
            <div className="flex-shrink-0 bg-accent/20 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-accent-light">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-accent-light">About Biblical Insights AI</h2>
              <p className="text-text-muted mt-1">Understanding the 'How' Behind the Answers</p>
            </div>
        </div>
        
        <div className="space-y-6 text-text-main max-h-[60vh] overflow-y-auto custom-scrollbar pr-4 -mr-4">
            <div>
                <h3 className="font-bold text-lg text-accent-light mb-2">Our Goal</h3>
                <p>This tool is designed to be a powerful, scripture-focused study assistant. Our goal is to help you explore the depths of the Bible by providing rich context, lexical insights, and theological connections, ultimately fostering a deeper love and understanding of God's Word.</p>
            </div>

            <div>
                <h3 className="font-bold text-lg text-accent-light mb-2">How the AI Works</h3>
                <ul className="space-y-4 pl-5 list-disc">
                    <li>
                        <strong className="text-text-main">Sola Scriptura (Bible as Final Authority):</strong> The AI's primary and ultimate source of truth is the Holy Bible. It is explicitly instructed to anchor all theological explanations, definitions, and answers directly in Scripture. The goal is to let the Bible speak for itself, serving as the final authority on all matters of faith and practice.
                    </li>
                    <li>
                        <strong className="text-text-main">Objective Presentation of Views:</strong> To avoid doctrinal bias, the AI is instructed not to favor any single denominational or theological system. When discussing topics with multiple orthodox interpretations (e.g., eschatology, modes of baptism), its role is to present these different views fairly and to explain the scriptural support cited for each perspective, allowing you to weigh the evidence for yourself.
                    </li>
                    <li>
                        <strong className="text-text-main">Scholarly Methods:</strong> It employs digital versions of traditional study methods, including lexical analysis of original Hebrew and Greek words, extensive cross-referencing, and analysis of historical and literary contexts to illuminate the text's intended meaning.
                    </li>
                    <li>
                        <strong className="text-text-main">Your Study Assistant, Not an Authority:</strong> This AI is a powerful assistant, not an infallible authority. It is designed to accelerate your research and provide insights, but it can make mistakes. Like any commentary or study guide, its output should be thoughtfully compared with Scripture under the guidance of the Holy Spirit.
                    </li>
                </ul>
            </div>
            
             <div>
                <h3 className="font-bold text-lg text-accent-light mb-2">An Encouragement</h3>
                <p className="italic">We encourage you to use this tool with the spirit of the Bereans (Acts 17:11), who "received the word with all readiness, and searched the Scriptures daily to find out whether these things were so." May this tool aid you in that noble endeavor.</p>
            </div>
        </div>

        <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-8 py-2 rounded-lg bg-accent text-white font-semibold transition-colors hover:bg-accent-light"
            >
              Got it
            </button>
        </div>

      </div>
    </div>,
    document.body
  );
};
