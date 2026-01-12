import React, { useState } from 'react';
import type { VerseAnalysis } from '../types';
import { WordAnalysis } from './WordAnalysis';
import { ContextAnalysis } from './ContextAnalysis';
import { StructuralAnalysis } from './StructuralAnalysis';
import { CommentaryAnalysis } from './CommentaryAnalysis';
import { CrossReferenceAnalysis } from './CrossReferenceAnalysis';
import { GospelHarmonyDisplay } from './GospelHarmonyDisplay';
import { TextualCriticismDisplay } from './TextualCriticismDisplay';
import { ProverbialConnections } from './ProverbialConnections';
import { PropheticFulfillment } from './PropheticFulfillment';
import { CovenantalAnalysis } from './CovenantalAnalysis';
import { HistoricalCharacterAnalysis } from './HistoricalCharacterAnalysis';
import { EpistolaryAnalysis } from './EpistolaryAnalysis';
import { SymbolismAnalysis } from './SymbolismAnalysis';
import { TypologyAnalysis } from './TypologyAnalysis';
import { ApocalypticSymbolism } from './ApocalypticSymbolism';
import { ConnectionsDisplay } from './ConnectionsDisplay';
import { SectionSpinner } from './SectionSpinner';

interface AnalysisTabsProps {
  analysis: VerseAnalysis;
  onReferenceSelect: (reference: string) => void;
  onDoctrineSelect: (doctrine: string) => void;
  onStoryArcSelect: (arcName: string) => void;
  onThemeSelect: (theme: string) => void;
}

type Tab = 'connections' | 'context' | 'structural' | 'lexical' | 'harmony' | 'textual' | 'commentary' | 'crossReferences' | 'proverbial' | 'prophetic' | 'covenantal' | 'characters' | 'epistolary' | 'symbolism' | 'typology' | 'apocalyptic';

export const AnalysisTabs: React.FC<AnalysisTabsProps> = ({ analysis, onReferenceSelect, onDoctrineSelect, onStoryArcSelect, onThemeSelect }) => {
  const [activeTab, setActiveTab] = useState<Tab>('connections');

  const tabClasses = (tabName: Tab) => 
    `px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
      activeTab === tabName
        ? 'bg-accent text-white shadow-lg shadow-accent/20 transform scale-105'
        : 'text-text-muted hover:text-white hover:bg-white/5 bg-primary/30 border border-transparent hover:border-gray-600'
    }`;
    
  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'connections': return analysis.connections ? <ConnectionsDisplay analysis={analysis} onStoryArcSelect={onStoryArcSelect} onThemeSelect={onThemeSelect} onSwitchTab={switchTab}/> : <SectionSpinner />;
      case 'context': return analysis.contextAnalysis ? <ContextAnalysis data={analysis.contextAnalysis} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} /> : <SectionSpinner />;
      case 'structural': return analysis.structuralAnalysis ? <StructuralAnalysis data={analysis.structuralAnalysis} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} /> : <SectionSpinner />;
      case 'lexical': return analysis.wordAnalysis ? <WordAnalysis data={analysis.wordAnalysis} onThemeSelect={onThemeSelect} /> : <SectionSpinner />;
      case 'apocalyptic': return analysis.apocalypticSymbolism ? <ApocalypticSymbolism data={analysis.apocalypticSymbolism} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} /> : <SectionSpinner />;
      case 'covenantal': return analysis.covenantalAnalysis ? <CovenantalAnalysis data={analysis.covenantalAnalysis} onReferenceSelect={onReferenceSelect} /> : <SectionSpinner />;
      case 'characters': return analysis.historicalCharacterAnalysis ? <HistoricalCharacterAnalysis data={analysis.historicalCharacterAnalysis} onReferenceSelect={onReferenceSelect} /> : <SectionSpinner />;
      case 'epistolary': return analysis.epistolaryAnalysis ? <EpistolaryAnalysis data={analysis.epistolaryAnalysis} onDoctrineSelect={onDoctrineSelect} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} /> : <SectionSpinner />;
      case 'symbolism': return analysis.symbolismAnalysis ? <SymbolismAnalysis data={analysis.symbolismAnalysis} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} /> : <SectionSpinner />;
      case 'typology': return analysis.typologyAnalysis ? <TypologyAnalysis data={analysis.typologyAnalysis} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} /> : <SectionSpinner />;
      case 'proverbial': return analysis.proverbialConnections ? <ProverbialConnections data={analysis.proverbialConnections} onReferenceSelect={onReferenceSelect} /> : <SectionSpinner />;
      case 'prophetic': return analysis.propheticFulfillment ? <PropheticFulfillment data={analysis.propheticFulfillment} onReferenceSelect={onReferenceSelect} /> : <SectionSpinner />;
      case 'harmony': return analysis.gospelHarmony ? <GospelHarmonyDisplay data={analysis.gospelHarmony} onReferenceSelect={onReferenceSelect} /> : <SectionSpinner />;
      case 'textual': return analysis.textualCriticism ? <TextualCriticismDisplay data={analysis.textualCriticism} onReferenceSelect={onReferenceSelect} /> : <SectionSpinner />;
      case 'commentary': return analysis.commentaryAnalysis ? <CommentaryAnalysis analysis={analysis} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} /> : <SectionSpinner />;
      case 'crossReferences': return analysis.crossReferenceAnalysis ? <CrossReferenceAnalysis data={analysis.crossReferenceAnalysis} onReferenceSelect={onReferenceSelect} /> : <SectionSpinner />;
      default: return <SectionSpinner />;
    }
  };


  return (
    <div className="bg-secondary/50 border border-gray-700/50 rounded-xl shadow-lg mt-6">
      <div className="p-4 border-b border-gray-700/50">
        <nav className="flex flex-wrap gap-2" aria-label="Analysis Sections">
          <button onClick={() => setActiveTab('connections')} className={tabClasses('connections')}>
            Connections
          </button>
          <button onClick={() => setActiveTab('context')} className={tabClasses('context')}>
            Historical Context
          </button>
          <button onClick={() => setActiveTab('structural')} className={tabClasses('structural')}>
            Literary & Structure
          </button>
           <button onClick={() => setActiveTab('lexical')} className={tabClasses('lexical')}>
            Key Words
          </button>
          {analysis.apocalypticSymbolism?.hasSymbols && (
             <button onClick={() => setActiveTab('apocalyptic')} className={tabClasses('apocalyptic')}>
                Apocalyptic Symbolism
            </button>
          )}
          {analysis.covenantalAnalysis?.hasCovenantLink && (
             <button onClick={() => setActiveTab('covenantal')} className={tabClasses('covenantal')}>
                Covenant Links
            </button>
          )}
          {analysis.historicalCharacterAnalysis?.hasCharacters && (
             <button onClick={() => setActiveTab('characters')} className={tabClasses('characters')}>
                Key Figures
            </button>
          )}
          {analysis.epistolaryAnalysis?.isEpistle && (
             <button onClick={() => setActiveTab('epistolary')} className={tabClasses('epistolary')}>
                Epistle Structure
            </button>
          )}
           {analysis.symbolismAnalysis?.hasSymbols && (
             <button onClick={() => setActiveTab('symbolism')} className={tabClasses('symbolism')}>
                Symbolism
            </button>
          )}
          {analysis.typologyAnalysis?.hasTypology && (
             <button onClick={() => setActiveTab('typology')} className={tabClasses('typology')}>
                Typology
            </button>
          )}
          {analysis.proverbialConnections && analysis.proverbialConnections.length > 0 && (
             <button onClick={() => setActiveTab('proverbial')} className={tabClasses('proverbial')}>
                Proverbial Connections
            </button>
          )}
          {analysis.propheticFulfillment && analysis.propheticFulfillment.length > 0 && (
             <button onClick={() => setActiveTab('prophetic')} className={tabClasses('prophetic')}>
                Prophetic Fulfillment
            </button>
          )}
          {analysis.gospelHarmony?.isGospel && (
             <button onClick={() => setActiveTab('harmony')} className={tabClasses('harmony')}>
                Gospel Harmony
            </button>
          )}
          {analysis.textualCriticism?.hasVariants && (
             <button onClick={() => setActiveTab('textual')} className={tabClasses('textual')}>
                Textual Criticism
            </button>
          )}
           <button onClick={() => setActiveTab('commentary')} className={tabClasses('commentary')}>
            Commentary
          </button>
          <button onClick={() => setActiveTab('crossReferences')} className={tabClasses('crossReferences')}>
            Related Verses
          </button>
        </nav>
      </div>
      <div className="p-6 min-h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  );
};