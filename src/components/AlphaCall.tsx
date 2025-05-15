import React from 'react';
import { Rocket, Skull, ChevronDown, Coins } from 'lucide-react';

interface Props {
  onClose: () => void;
  onAction: (action: 'ape' | 'fade' | 'fullport') => void;
}

export const AlphaCall: React.FC<Props> = ({ onClose, onAction }) => {
  const alphaNames = [
    "MEV Frontrun Opportunity",
    "Insider NFT Mint",
    "Whale Accumulation",
    "DEX Exploit",
    "Token Migration Play",
    "Airdrop Farming Setup",
    "Governance Attack",
    "Liquidation Cascade"
  ];

  const randomAlpha = alphaNames[Math.floor(Math.random() * alphaNames.length)];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 p-6 rounded-lg pixel-borders max-w-md w-full animate-bounce-in">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Rocket className="w-6 h-6 text-yellow-400 animate-pulse" />
          <h2 className="text-2xl font-bold text-center text-yellow-400">Alpha Call!</h2>
        </div>
        
        <div className="pixel-box bg-gray-700 p-4 rounded mb-6">
          <p className="text-center text-lg font-bold text-white">{randomAlpha}</p>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => onAction('ape')}
            className="pixel-box bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors"
          >
            <Rocket className="w-4 h-4" />
            Ape
          </button>
          
          <button
            onClick={() => onAction('fade')}
            className="pixel-box bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
            Fade
          </button>
          
          <button
            onClick={() => onAction('fullport')}
            className="pixel-box bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors"
          >
            <Coins className="w-4 h-4" />
            Full Port
          </button>
        </div>
      </div>
    </div>
  );
};