
import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAppContext } from '../context/AppContext';

interface TabContextMenuProps {
  x: number;
  y: number;
  tabIndex: number;
  subTabIndex?: number;
  isGroup: boolean;
  isLastTab: boolean;
  onClose: () => void; // Closes the context menu itself
  onCloseTab: () => void;
  onCloseOthers: () => void;
  onCloseRight: () => void;
  onCloseAll: () => void;
  onRename?: () => void;
  onUngroup?: () => void;
  onRemoveFromGroup?: () => void;
}

export const TabContextMenu: React.FC<TabContextMenuProps> = ({
  x, y, tabIndex, subTabIndex, isGroup, isLastTab, onClose, onCloseTab,
  onCloseOthers, onCloseRight, onCloseAll, onRename, onUngroup, onRemoveFromGroup
}) => {
  const { startGroupSelectionMode, activeStudies } = useAppContext();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const individualTabItems = [
    { 
      label: 'Select to Group', 
      action: () => startGroupSelectionMode(tabIndex), 
      disabled: activeStudies.length < 2,
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z" /></svg> 
    },
  ];

  const subTabItems = [
      { label: 'Remove from Group', action: onRemoveFromGroup, disabled: !onRemoveFromGroup, icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg> },
  ];

  const groupMenuItems = [
    { label: 'Rename Group', action: onRename, disabled: !onRename, icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg> },
    { label: 'Ungroup', action: onUngroup, disabled: !onUngroup, icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg> },
  ];

  const commonMenuItems = [
    { label: isGroup ? 'Close Group' : 'Close Tab', action: onCloseTab, disabled: false, icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg> },
    { label: 'Close Other Tabs', action: onCloseOthers, disabled: activeStudies.length <= 1, icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" /></svg> },
    { label: 'Close Tabs to the Right', action: onCloseRight, disabled: isLastTab, icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg> },
    { label: 'Close All Tabs', action: onCloseAll, disabled: false, icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" /></svg> },
  ];

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-[101] bg-secondary border border-gray-600 rounded-md shadow-2xl w-56 p-1 animate-fade-in"
      style={{ top: `${y}px`, left: `${x}px` }}
    >
      <ul className="space-y-1">
        {!isGroup && subTabIndex === undefined && individualTabItems.map((item, index) => (
          <li key={`individual-${index}`}>
            <button
              onClick={() => { item.action?.(); onClose(); }}
              disabled={item.disabled}
              className="w-full flex items-center text-left px-3 py-1.5 text-sm rounded text-text-main hover:bg-accent hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-text-main"
            >
              {item.icon}
              {item.label}
            </button>
          </li>
        ))}
        {subTabIndex !== undefined && subTabItems.map((item, index) => (
            <li key={`subtab-${index}`}>
                <button
                    onClick={() => { item.action?.(); onClose(); }}
                    disabled={item.disabled}
                    className="w-full flex items-center text-left px-3 py-1.5 text-sm rounded text-text-main hover:bg-accent hover:text-white disabled:opacity-50"
                >
                    {item.icon}
                    {item.label}
                </button>
            </li>
        ))}
         {isGroup && groupMenuItems.map((item, index) => (
          <li key={`group-${index}`}>
            <button
              onClick={() => { item.action?.(); onClose(); }}
              disabled={item.disabled}
              className="w-full flex items-center text-left px-3 py-1.5 text-sm rounded text-text-main hover:bg-accent hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-text-main"
            >
              {item.icon}
              {item.label}
            </button>
          </li>
        ))}
        <div className="h-px bg-gray-600 my-1"></div>
        {commonMenuItems.map((item, index) => (
          <li key={`common-${index}`}>
            <button
              onClick={() => { item.action?.(); onClose(); }}
              disabled={item.disabled}
              className="w-full flex items-center text-left px-3 py-1.5 text-sm rounded text-text-main hover:bg-accent hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-text-main"
            >
              {item.icon}
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>,
    document.body
  );
};
