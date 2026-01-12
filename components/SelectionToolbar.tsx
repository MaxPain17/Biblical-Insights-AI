import React from 'react';
import { createPortal } from 'react-dom';
import { useAppContext } from '../context/AppContext';

export const SelectionToolbar: React.FC = () => {
  const { selectionToolbarState, setSelectionToolbarState, handleNewStudy, showToast } = useAppContext();
  const { visible, text, top, left } = selectionToolbarState;

  if (!visible) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard');
      setSelectionToolbarState({ visible: false, text: '', top: 0, left: 0 });
    });
  };

  const handleDiscuss = () => {
    handleNewStudy({ mode: 'chat', subject: `Regarding the text: "${text}"` });
    setSelectionToolbarState({ visible: false, text: '', top: 0, left: 0 });
  };

  return createPortal(
    <div
      className="absolute z-[100] bg-secondary/90 backdrop-blur-md border border-gray-600 rounded-lg shadow-2xl flex items-center gap-1 p-1"
      style={{
        top: `${top}px`,
        left: `${left}px`,
        transform: 'translate(-50%, -125%)',
      }}
      data-selection-toolbar
    >
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md text-text-main hover:bg-primary/80 transition-colors"
        title="Copy"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v3.043m-7.416 0v3.043c0 .212.03.418.084.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
        </svg>
        <span>Copy</span>
      </button>
      <div className="w-px h-5 bg-gray-600"></div>
      <button
        onClick={handleDiscuss}
        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md text-text-main hover:bg-primary/80 transition-colors"
        title="Discuss"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.53-0.481M21 12a9.753 9.753 0 0 0-4.722-8.37l-1.028.917A48.455 48.455 0 0 0 12 4.5c-2.131 0-4.16.6-5.902 1.634l-1.028-.917A9.753 9.753 0 0 0 3 12m0 0a9.753 9.753 0 0 0 4.722 8.37l1.028-.917a48.455 48.455 0 0 0 5.902 1.634c.537.043 1.07.065 1.616.065 4.97 0 9-3.694 9-8.25Z" />
        </svg>
        <span>Discuss</span>
      </button>
    </div>,
    document.body
  );
};
