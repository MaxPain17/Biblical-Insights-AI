import React from 'react';

export const SectionSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[200px] text-text-muted animate-fade-in">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-sm font-semibold">Loading analysis...</p>
    </div>
  );
};