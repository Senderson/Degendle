import React from 'react';

interface Props {
  onClose: () => void;
}

export const NightModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-[#1a1a3a] p-6 rounded-lg pixel-borders max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-[#00ff00] mb-4">Night Time</h2>
        <p className="text-white mb-6">The night is passing...</p>
        <button
          onClick={onClose}
          className="pixel-box bg-[#00ff00] hover:bg-[#00cc00] text-black font-bold py-2 px-4 rounded transition-colors"
        >
          Wake Up
        </button>
      </div>
    </div>
  );
}; 