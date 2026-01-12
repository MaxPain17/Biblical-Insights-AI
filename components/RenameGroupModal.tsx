
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface RenameGroupModalProps {
  isOpen: boolean;
  currentName: string;
  onClose: () => void;
  onSave: (newName: string) => void;
}

export const RenameGroupModal: React.FC<RenameGroupModalProps> = ({ isOpen, currentName, onClose, onSave }) => {
  const [name, setName] = useState(currentName);

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
    }
  }, [isOpen, currentName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div 
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div className="relative bg-secondary/95 backdrop-blur-xl border border-gray-700/60 rounded-xl shadow-2xl w-full max-w-sm p-6">
        <h2 className="text-xl font-bold text-accent-light mb-4">Rename Group</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-primary/50 border border-gray-600 rounded-lg px-4 py-2.5 text-text-main focus:ring-2 focus:ring-accent focus:border-accent transition text-base"
            autoFocus
          />
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-primary/50 text-text-main hover:bg-primary/80 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-5 py-2 rounded-lg bg-accent text-white font-semibold transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-accent-light"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
