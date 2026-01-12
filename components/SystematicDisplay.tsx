
import React, { useState } from 'react';
import type { SystematicAnalysis, StudyStep } from '../types';
import { ClickableText } from './ClickableText';
import { exportSystematicAnalysisToDocx } from '../services/exportService';
import { ErrorDisplay } from './ErrorDisplay';
import { useAppContext } from '../context/AppContext';
import { SYSTEMATIC_STUDY_TOPICS } from '../systematicTopics';


interface SystematicDisplayProps {
  data: SystematicAnalysis;
  onReferenceSelect: (reference: string) => void;
  onThemeSelect: (theme: string) => void;
  onQuestionSelect: (question: string) => void;
  onStartChat: (subject: string) => void;
}

const SingleTopicDisplay: React.FC<{
  step: StudyStep,
  level: string,
  onBack: () => void,
  onReferenceSelect: (reference: string) => void;
  onThemeSelect: (theme: string) => void;
  onQuestionSelect: (question: string) => void;
  onNextTopic: () => void;
  nextTopicTitle?: string;
}> = ({ step, level, onBack, onReferenceSelect, onThemeSelect, onQuestionSelect, onNextTopic, nextTopicTitle }) => {
  return (
    <div className="space-y-8">
      <header className="pb-4 border-b border-slate-700">
         <button onClick={onBack} className="flex items-center gap-2 text-sm text-text-muted hover:text-accent-light mb-4 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to {level} Plan
        </button>
        <p className="text-sm uppercase tracking-wider text-text-muted">Guided Study: {level}</p>
        <h2 className="text-3xl font-bold text-accent-light">{step.topic}</h2>
      </header>

      <section>
          <h3 className="text-xl font-semibold text-accent-light mb-2">Explanation</h3>
          <ClickableText text={step.explanation} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} className="text-text-main leading-relaxed" />
      </section>

      {step.keyConcepts && step.keyConcepts.length > 0 && (
        <section className="pt-6 border-t border-slate-700">
          <h3 className="text-xl font-semibold text-accent-light mb-4">Key Concepts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {step.keyConcepts.map((item, index) => (
                  <button 
                      key={index} 
                      onClick={() => onThemeSelect(item.concept)}
                      className="bg-primary/60 p-4 rounded-lg border border-slate-600 text-left transition-colors hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                      <h4 className="font-bold text-accent-light">{item.concept}</h4>
                      <p className="text-text-muted text-sm mt-1">{item.definition}</p>
                  </button>
              ))}
          </div>
        </section>
      )}

      {step.commonMisconceptions && step.commonMisconceptions.length > 0 && (
        <section className="pt-6 border-t border-slate-700">
          <h3 className="text-xl font-semibold text-accent-light mb-4">Common Misconceptions</h3>
          <div className="space-y-4">
              {step.commonMisconceptions.map((item, index) => (
                  <div key={index} className="bg-red-900/10 p-4 rounded-lg border border-red-700/30">
                      <h5 className="font-bold text-red-400">Misconception: <span className="italic font-normal">"{item.misconception}"</span></h5>
                      <p className="text-sm text-text-main mt-2 pt-2 border-t border-red-700/20">
                          <span className="font-bold text-green-400">Correction:</span> {item.correction}
                      </p>
                  </div>
              ))}
          </div>
        </section>
      )}

      {step.historicalDevelopment && (
        <section className="pt-6 border-t border-slate-700">
          <h3 className="text-xl font-semibold text-accent-light mb-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Historical Development
          </h3>
          <ClickableText text={step.historicalDevelopment} onReferenceSelect={onReferenceSelect} onThemeSelect={onThemeSelect} className="text-text-main leading-relaxed" />
        </section>
      )}

      <section className="pt-6 border-t border-slate-700">
          <h3 className="text-xl font-semibold text-accent-light mb-4">Key Verses</h3>
          <div className="space-y-4">
            {step.keyVerses.map((verse, vIndex) => (
                <button
                key={vIndex}
                onClick={() => onReferenceSelect(verse.reference)}
                className="w-full text-left bg-primary/60 p-4 rounded-lg border border-slate-700 transition-all duration-200 hover:border-accent hover:bg-secondary/60 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
                >
                <p className="font-bold text-accent-light">{verse.reference}</p>
                <blockquote className="text-sm italic text-text-main my-1 pl-2 border-l-2 border-slate-600">"{verse.verseText}"</blockquote>
                <p className="text-xs text-text-muted mt-2">
                    <span className="font-semibold">Relevance: </span>
                    {verse.explanation}
                </p>
                </button>
            ))}
          </div>
      </section>

      {step.reflectionQuestions && step.reflectionQuestions.length > 0 && (
        <section className="pt-6 border-t border-slate-700">
            <h3 className="text-xl font-semibold text-accent-light mb-4">Reflection Questions</h3>
            <ul className="space-y-3">
            {step.reflectionQuestions.map((q, qIndex) => (
                <li key={qIndex} className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-accent flex-shrink-0 mt-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                    </svg>
                    <button onClick={() => onQuestionSelect(q)} className="text-left text-text-main hover:text-accent-light transition-colors">{q}</button>
                </li>
            ))}
            </ul>
        </section>
      )}

      <div className="pt-6 border-t border-slate-700">
        <p className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-1">Next Step</p>
        <p className="text-text-main italic">{step.nextStepSuggestion}</p>
        {nextTopicTitle && (
            <div className="mt-6 text-center">
                 <button 
                    onClick={onNextTopic}
                    className="flex items-center justify-center gap-2 bg-accent/20 hover:bg-accent/30 text-accent-light font-semibold py-3 px-6 rounded-lg transition-colors group"
                >
                    Continue to: {nextTopicTitle}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                </button>
            </div>
        )}
      </div>
    </div>
  )
};

export const SystematicDisplay: React.FC<SystematicDisplayProps> = ({ data, onReferenceSelect, onThemeSelect, onQuestionSelect, onStartChat }) => {
  const { isLoading, handleContinueSystematicStudy } = useAppContext();
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [openSession, setOpenSession] = useState<number>(1);
  const [isExporting, setIsExporting] = useState(false);
  const { level, introduction, sessions } = data;
  
  if (!sessions || sessions.length === 0) {
      return <ErrorDisplay message="No study plan data is available. Please try starting the study again." />;
  }
  
  const handleExport = () => {
      setIsExporting(true);
      try {
          exportSystematicAnalysisToDocx(data);
      } catch (e) {
          console.error("Export failed", e);
      } finally {
          setTimeout(() => setIsExporting(false), 1000);
      }
  };

  const findStep = (topic: string): StudyStep | null => {
    for (const session of sessions) {
      const foundStep = session.steps.find(s => s.topic === topic);
      if (foundStep) return foundStep;
    }
    return null;
  };
  
  if (currentTopic) {
    const targetStep = findStep(currentTopic);

    let nextStep: StudyStep | undefined;
    const currentSession = sessions.find(session => 
        session.steps.some(step => step.topic === currentTopic)
    );
    
    if (currentSession) {
        const currentStepIndex = currentSession.steps.findIndex(step => 
            step.topic === currentTopic
        );

        if (currentStepIndex !== -1 && currentStepIndex < currentSession.steps.length - 1) {
            nextStep = currentSession.steps[currentStepIndex + 1];
        }
    }
    
    const handleNextTopic = () => {
        if (nextStep) {
            setCurrentTopic(nextStep.topic);
        }
    };

    return (
        <div className="bg-secondary/50 border border-slate-700 p-6 rounded-xl shadow-lg">
            {targetStep ? (
                <SingleTopicDisplay
                    step={targetStep}
                    level={data.level}
                    onReferenceSelect={onReferenceSelect}
                    onThemeSelect={onThemeSelect}
                    onQuestionSelect={onQuestionSelect}
                    onBack={() => setCurrentTopic(null)}
                    onNextTopic={handleNextTopic}
                    nextTopicTitle={nextStep?.topic}
                />
            ) : (
                <ErrorDisplay message={`The topic "${currentTopic}" could not be found in the ${data.level} study plan.`} />
            )}
        </div>
    );
  }

  const planConfig = SYSTEMATIC_STUDY_TOPICS.find(p => p.level === level);
  const hasMoreSessions = planConfig && sessions.length < planConfig.sessions.length;
  const chatSubject = `Systematic Study: ${level}`;

  return (
    <div className="bg-secondary/50 border border-slate-700 p-6 rounded-xl shadow-lg space-y-8">
        <header className="pb-4 border-b border-slate-700 flex justify-between items-start">
            <div>
                <p className="text-sm uppercase tracking-wider text-text-muted">Systematic Study</p>
                <h2 className="text-3xl font-bold text-accent-light">Study Plan: {level}</h2>
            </div>
            <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 text-sm font-medium flex-shrink-0 bg-primary/50 text-text-muted hover:bg-primary/80 hover:text-text-main px-3 py-2 rounded-lg border border-slate-600 transition-colors disabled:opacity-50 disabled:cursor-wait"
                aria-label="Export to Word document"
            >
                {isExporting ? (
                    <svg className="animate-spin h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                )}
                <span>{isExporting ? 'Exporting...' : 'Export'}</span>
            </button>
        </header>

        <section className="bg-primary/30 p-4 rounded-lg border border-slate-600">
            <h3 className="text-xl font-semibold text-accent-light mb-2">Introduction</h3>
            <p className="text-text-main leading-relaxed">{introduction}</p>
        </section>

        <section>
            <h3 className="text-2xl font-semibold text-accent-light mb-4">Your Study Path</h3>
            <div className="space-y-2">
                {sessions.map((session) => (
                    <div key={session.session} className="bg-primary/40 rounded-lg border border-gray-700 overflow-hidden transition-all duration-300">
                        <button
                            onClick={() => setOpenSession(openSession === session.session ? null : session.session)}
                            className="w-full flex justify-between items-center p-4 text-left hover:bg-primary/60"
                            aria-expanded={openSession === session.session}
                        >
                            <h4 className="text-lg font-bold text-accent-light">{`Session ${session.session}: ${session.title}`}</h4>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 text-text-muted transition-transform duration-300 ${openSession === session.session ? 'rotate-180' : ''}`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                        <div className={`transition-all duration-500 ease-in-out grid ${openSession === session.session ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                            <div className="overflow-hidden">
                                <div className="p-4 border-t border-gray-600">
                                    <p className="text-text-muted mb-4 text-sm">{session.introduction}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {session.steps.map((step) => (
                                            <button
                                                key={step.step}
                                                onClick={() => setCurrentTopic(step.topic)}
                                                className="w-full text-left p-3 rounded-md transition-colors text-text-main bg-secondary/40 hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-accent flex justify-between items-center group"
                                            >
                                                <span><span className="font-bold text-accent mr-2">{step.step}.</span>{step.topic}</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {hasMoreSessions && (
            <section className="pt-6 border-t border-slate-700 text-center">
                 <button 
                    onClick={() => handleContinueSystematicStudy()} 
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 bg-accent/20 hover:bg-accent/30 text-accent-light font-semibold py-3 px-6 rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Loading Next Session...
                        </>
                    ) : (
                        <>
                            Continue to Session {sessions.length + 1}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </>
                    )}
                </button>
            </section>
        )}

        <section className="pt-8 border-t border-slate-700">
            <button
                onClick={() => onStartChat(chatSubject)}
                className="w-full flex items-center justify-center gap-2 bg-accent/20 hover:bg-accent/30 text-accent-light font-semibold py-3 px-4 rounded-lg transition-colors group"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 transition-transform group-hover:scale-110">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.53-0.481M21 12a9.753 9.753 0 0 0-4.722-8.37l-1.028.917A48.455 48.455 0 0 0 12 4.5c-2.131 0-4.16.6-5.902 1.634l-1.028-.917A9.753 9.753 0 0 0 3 12m0 0a9.753 9.753 0 0 0 4.722 8.37l1.028-.917a48.455 48.455 0 0 0 5.902 1.634c.537.043 1.07.065 1.616.065 4.97 0 9-3.694 9-8.25Z" />
                </svg>
                Discuss this study plan
            </button>
        </section>
    </div>
  );
};
