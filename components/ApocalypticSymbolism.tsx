import React from 'react';
import type { ApocalypticSymbolismAnalysis } from '../types';
import { ClickableText } from './ClickableText';

interface ApocalypticSymbolismProps {
  data: ApocalypticSymbolismAnalysis;
  onReferenceSelect: (reference: string) => void;
  onThemeSelect: (theme: string) => void;
}

export const ApocalypticSymbolism: React.FC<ApocalypticSymbolismProps> = ({ data, onReferenceSelect, onThemeSelect }) => {
  if (!data || !data.hasSymbols || data.symbols.length === 0) {
    return <p className="text-text-muted">No specific apocalyptic symbols were identified for analysis in this passage.</p>;
  }

  return (
    <div className="space-y-6">
        <div className="bg-fuchsia-900/10 border-l-4 border-fuchsia-500 p-4 rounded-r-lg">
            <h3 className="font-bold text-fuchsia-300">A Note on Apocalyptic Literature</h3>
            <p className="text-sm text-fuchsia-200/80 mt-1">
                The book of Revelation uses highly symbolic language common in ancient apocalyptic texts. To avoid misinterpretation, it's crucial to understand that these symbols are not meant to be taken literally. Their meaning is almost always rooted in Old Testament imagery and first-century cultural contexts.
            </p>
        </div>
      {data.symbols.map((item, index) => (
        <div key={index} className="bg-primary/40 p-4 rounded-lg border border-gray-700">
          <h4 className="text-xl font-bold text-accent-light mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-fuchsia-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a15.018 15.018 0 0 1-6.75 0" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            {item.symbol}
          </h4>
          <div className="space-y-4 pl-8">
            <div>
              <p className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-1">Old Testament Background</p>
              <ClickableText text={item.otBackground} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} className="text-text-main" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-1">Symbolic Meaning in Revelation</p>
              <ClickableText text={item.symbolicMeaning} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} className="text-text-main" />
            </div>
            {item.crossReferences && item.crossReferences.length > 0 && (
                <div>
                    <p className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">Key Cross-References</p>
                    <div className="flex flex-wrap gap-2">
                        {item.crossReferences.map((ref, i) => (
                             <button 
                                key={i}
                                onClick={() => onReferenceSelect(ref)}
                                className="py-1 px-2.5 rounded-full text-xs bg-sky-500/10 text-sky-300 border border-sky-500/30 hover:bg-sky-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary/40 focus:ring-sky-400"
                            >
                                {ref}
                            </button>
                        ))}
                    </div>
                </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};