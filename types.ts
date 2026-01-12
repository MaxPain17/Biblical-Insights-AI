
import type { FunctionCall } from '@google/genai';

export type AnalysisMode = 'reference' | 'topic' | 'qa' | 'event' | 'storyArc' | 'chat' | 'systematic';
export type KnowledgeLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type FontSize = 'sm' | 'base' | 'lg';


// --- History Item Types ---
export type HistoryReferenceItem = { mode: 'reference'; book: string; chapter: number; startVerse: number; endVerse: number; };
export type HistoryTopicItem = { mode: 'topic'; topic: string; };
export type HistoryQaItem = { mode: 'qa'; question: string; };
export type HistoryEventItem = { mode: 'event'; event: string; };
export type HistoryStoryArcItem = { mode: 'storyArc'; storyArc: string; };
export type HistoryChatItem = { mode: 'chat'; subject: string; contextKey?: string; };
export type HistorySystematicItem = { mode: 'systematic'; level: KnowledgeLevel; topic: string; };
export type HistoryItem = HistoryReferenceItem | HistoryTopicItem | HistoryQaItem | HistoryEventItem | HistoryStoryArcItem | HistoryChatItem | HistorySystematicItem;

// --- Tab & Grouping Types ---
export interface TabGroup {
  id: string;
  name: string;
  items: HistoryItem[];
  isGroup: true;
}
export type TabItem = HistoryItem | TabGroup;

export interface WordAnalysisItem {
  word: string;
  original: string;
  transliteration: string;
  strongs: string;
  meaning: string;
  grammar: string;
  translationJourney: string;
}

export interface PassageOutlineItem {
    point: string;
    verses: string;
}

export interface AnalysisSection {
    content: string;
    relevance: string;
}

export interface FigureOfSpeechItem {
    figure: string;
    example: string;
    explanation: string;
}

export interface NarrativeFlowCharacter {
    name: string;
    role: string;
}

export interface NarrativeFlowAnalysis {
    isNarrative: boolean;
    setting: string;
    characters: NarrativeFlowCharacter[];
    plotSummary: string;
    narrativeTechnique: string;
    thematicDevelopment: string;
}

export interface StructuralAnalysisData {
  literaryGenre: AnalysisSection;
  narrativeFlow?: NarrativeFlowAnalysis;
  literaryDevices: { items: string[]; relevance: string; };
  figuresOfSpeech?: FigureOfSpeechItem[];
  passageOutline: { items: PassageOutlineItem[]; relevance: string; };
  discourseAnalysis: AnalysisSection;
  grammaticalHighlights: AnalysisSection;
}

export interface ContextAnalysisData {
  historicalAndCultural: AnalysisSection;
  originalAudience: AnalysisSection;
  authorialIntent: AnalysisSection;
  canonicalContext: AnalysisSection;
  thematicConnections: AnalysisSection;
}

export interface SourceItem {
  name: string;
}

export interface PerspectiveItem {
    viewpoint: string;
    description: string;
}

export interface CommentaryAnalysisData {
  bookSummary: string;
  chapterContext: string;
  passageCommentary: string;
  theologicalPerspectives: PerspectiveItem[];
  practicalApplication: string[];
  devotionalThought: string;
  sources: SourceItem[];
}

export interface CrossReferenceItem {
  reference: string;
  verseText: string;
  explanation: string;
}

export interface ProverbialConnectionItem {
  reference: string;
  verseText: string;
  connection: string;
}

export interface PropheticFulfillmentItem {
  reference: string;
  verseText: string;
  explanation: string;
  type: 'Prophecy' | 'Fulfillment';
}

export interface VerseText {
  KJV: string;
}

export interface Verse {
  verse: number;
  text: string;
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

export interface GroundingMetadata {
  groundingChunks: GroundingChunk[];
}

export interface GospelParallel {
  reference: string;
  text: string;
}

export interface GospelHarmonyData {
  isGospel: boolean;
  parallels: GospelParallel[];
  uniqueFeatures: string;
  synopticComparison: string;
}

export interface TextualVariant {
  verse: string;
  variantText: string;
  manuscripts: string;
  significance: string;
}

export interface TextualCriticismData {
  hasVariants: boolean;
  variants: TextualVariant[];
  manuscriptReliability: string;
}

// --- New Genre-Specific Types ---

export interface CovenantalLink {
    covenant: string;
    connection: string;
    significance: string;
}
export interface CovenantalAnalysis {
    hasCovenantLink: boolean;
    links: CovenantalLink[];
}

export interface HistoricalCharacter {
    name: string;
    role: string;
    significance: string;
}
export interface HistoricalCharacterAnalysis {
    hasCharacters: boolean;
    characters: HistoricalCharacter[];
}

export interface EpistolaryAnalysis {
    isEpistle: boolean;
    argumentStructure: string;
    keyDoctrines: string[];
    originalApplication: string;
}

export interface SymbolItem {
    symbol: string;
    meaning: string;
    significance: string;
}
export interface SymbolismAnalysis {
    hasSymbols: boolean;
    symbols: SymbolItem[];
}

export interface TypologyItem {
    type: string;
    antitype: string;
    explanation: string;
}

export interface TypologyAnalysis {
    hasTypology: boolean;
    connections: TypologyItem[];
}

export interface ApocalypticSymbolItem {
    symbol: string;
    otBackground: string;
    symbolicMeaning: string;
    crossReferences: string[];
}

export interface ApocalypticSymbolismAnalysis {
    hasSymbols: boolean;
    symbols: ApocalypticSymbolItem[];
}

export type ConnectionType = 'Story Arc' | 'Key Theme' | 'Key Figure' | 'Key Doctrine' | 'Symbol' | 'Typology' | 'Prophetic Link' | 'Covenant';

export interface ConnectionItem {
    type: ConnectionType;
    title: string;
    description: string;
}


export interface VerseAnalysis {
  connections?: ConnectionItem[];
  verseText?: VerseText;
  verses?: Verse[];
  wordAnalysis?: WordAnalysisItem[];
  structuralAnalysis?: StructuralAnalysisData;
  contextAnalysis?: ContextAnalysisData;
  commentaryAnalysis?: CommentaryAnalysisData;
  crossReferenceAnalysis?: CrossReferenceItem[];
  
  // Advanced Fields
  gospelHarmony?: GospelHarmonyData;
  textualCriticism?: TextualCriticismData;
  proverbialConnections?: ProverbialConnectionItem[];
  propheticFulfillment?: PropheticFulfillmentItem[];
  
  // New Genre-Specific Fields
  covenantalAnalysis?: CovenantalAnalysis;
  historicalCharacterAnalysis?: HistoricalCharacterAnalysis;
  epistolaryAnalysis?: EpistolaryAnalysis;
  symbolismAnalysis?: SymbolismAnalysis;
  typologyAnalysis?: TypologyAnalysis;
  apocalypticSymbolism?: ApocalypticSymbolismAnalysis;
  
  storyArcConnection?: {
    name: string;
    relevance: string;
  } | null;
  
  groundingMetadata?: GroundingMetadata;
}

export interface ThematicAnalysisItem {
  reference: string;
  verseText: string;
  explanation: string;
}

export interface KeyConcept {
    concept: string;
    definition: string;
}

export interface MisconceptionItem {
    misconception: string;
    correction: string;
}

export interface ThematicKeyWord {
  word: string;
  original: string;
  transliteration: string;
  strongs: string;
  briefMeaning: string;
}

export interface ThematicAnalysis {
    topic?: string;
    summary?: string;
    historicalContext?: string;
    otFoundation?: string;
    ntFulfillment?: string;
    christologicalConnection?: string;
    creedalDevelopment?: string;
    keyWords?: ThematicKeyWord[];
    diversePerspectives?: PerspectiveItem[];
    commonMisconceptions?: MisconceptionItem[];
    keyConcepts?: KeyConcept[];
    practicalApplication?: string[];
    relatedThemes?: string[];
    keyVerses?: ThematicAnalysisItem[];
}

export interface PrincipleItem {
    principle: string;
    explanation: string;
}

export interface ContradictionItem {
    apparentContradiction: string;
    resolution: string;
}

export interface QaAnalysis {
  question?: string;
  foundationalPrinciples?: PrincipleItem[];
  answer?: string;
  addressingContradictions?: ContradictionItem[];
  historicalContext?: string;
  theologicalPerspectives?: string;
  keyConcepts?: KeyConcept[];
  reflectionPoints?: string[];
  supportingVerses?: CrossReferenceItem[];
}

export interface CharacterOrSymbol {
    name: string;
    description: string;
}

export interface EventAnalysis {
    title?: string;
    passageReference?: string;
    passageText?: string;
    summary?: string;
    charactersAndSymbolism?: CharacterOrSymbol[];
    historicalContext?: string;
    originalAudienceInterpretation?: string;
    primaryMessage?: string;
    secondaryThemes?: string[];
    reflectionPoints?: string[];
    keyWordAnalysis?: WordAnalysisItem[];
    relatedVerses?: CrossReferenceItem[];
}

export interface PassageReference {
    book: string;
    chapter: number;
    startVerse: number;
    endVerse: number;
}

export interface PassageAnalysisResult {
    passage: PassageReference;
    analysis: VerseAnalysis;
}

// --- Story Arc Analysis Types ---
export interface TimelineEvent {
    title: string;
    reference: string;
    summary: string;
}

export interface CharacterArc {
    name: string;
    development: string;
}

export interface StoryArcAnalysis {
    arcName?: string;
    summary?: string;
    timeline?: TimelineEvent[];
    characterDevelopment?: CharacterArc[];
    thematicSignificance?: string;
    christologicalConnection?: string;
    redemptiveHistoricalSignificance?: string;
    principlesForToday?: {
        principle: string;
        explanation: string;
    }[];
}

// --- Chat Analysis Types ---
export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  text: string;
}

export interface ChatAnalysis {
  subject: string;
  messages: ChatMessage[];
  contextKey?: string;
}

// --- Systematic Topic Analysis Types ---
export interface SystematicTopicAnalysis {
    level: KnowledgeLevel;
    topic: string;
    explanation: string;
    keyVerses: {
        reference: string;
        verseText: string;
        explanation: string;
    }[];
    reflectionQuestions: string[];
    connectionsToOtherDoctrines: {
        doctrine: string;
        explanation: string;
    }[];
    historicalDevelopment: string;
}

// --- Systematic Study Plan Types ---
export interface StudyStep {
    step: number;
    topic: string;
    explanation: string;
    keyConcepts: KeyConcept[];
    commonMisconceptions: MisconceptionItem[];
    historicalDevelopment: string;
    keyVerses: {
        reference: string;
        verseText: string;
        explanation: string;
    }[];
    reflectionQuestions: string[];
    nextStepSuggestion: string;
}

export interface StudySession {
    session: number;
    title: string;
    introduction: string;
    steps: StudyStep[];
}

export interface SystematicAnalysis {
    level: KnowledgeLevel;
    introduction: string;
    sessions: StudySession[];
}

export interface SelectionToolbarState {
  visible: boolean;
  text: string;
  top: number;
  left: number;
}


// --- Union Types ---
export type AnalysisResult = VerseAnalysis | ThematicAnalysis | QaAnalysis | EventAnalysis | StoryArcAnalysis | ChatAnalysis | SystematicTopicAnalysis | SystematicAnalysis | null;