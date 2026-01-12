import React from 'react';

interface SectionProps {
  title: string;
  tooltipText: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  relevance?: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, tooltipText, icon, children, relevance }) => (
    <div className="relative pl-11 pb-6 last:pb-0">
        <div className="absolute left-3 top-0 flex items-center justify-center h-6 w-6 rounded-full bg-secondary ring-1 ring-gray-700">
             {icon}
        </div>
        <div className="absolute left-[21px] top-6 bottom-0 w-px bg-gradient-to-b from-slate-600 to-transparent last:hidden"></div>
        <div className="flex items-center gap-2 mb-2">
            <h4 className="text-xl font-semibold text-accent-light">{title}</h4>
            {/* Assuming Tooltip component is globally available or passed as prop */}
            {/* For this example, let's just render the icon that would trigger it */}
            <div className="relative group">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-text-muted cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg>
                <div className="absolute bottom-full mb-2 w-72 bg-primary p-3 rounded-lg text-sm text-text-main shadow-lg border border-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none transform -translate-x-1/2 left-1/2 z-10">
                    {tooltipText}
                    <svg className="absolute text-primary h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                        <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
                    </svg>
                </div>
            </div>
        </div>
        <div>
            <div className="text-text-main leading-relaxed">{children}</div>
             {relevance && (
                <div className="mt-3 bg-accent/5 border-l-2 border-accent p-3 rounded-r-md">
                     <p className="text-sm text-text-muted font-medium uppercase tracking-wide mb-1">Relevance</p>
                     <div className="text-sm text-gray-300 italic">{relevance}</div>
                </div>
            )}
        </div>
    </div>
);
