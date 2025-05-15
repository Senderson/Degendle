import React from 'react';
import { Rocket, Skull, PartyPopper, TrendingDown } from 'lucide-react';

interface Props {
  result: {
    type: 'success' | 'loss' | 'rekt' | 'jackpot';
    amount: number;
  };
  onClose: () => void;
}

export const ResultModal: React.FC<Props> = ({ result, onClose }) => {
  const getIcon = () => {
    switch (result.type) {
      case 'jackpot':
        return <PartyPopper className="w-8 h-8 text-yellow-400" />;
      case 'success':
        return <Rocket className="w-8 h-8 text-green-400" />;
      case 'loss':
        return <TrendingDown className="w-8 h-8 text-red-400" />;
      case 'rekt':
        return <Skull className="w-8 h-8 text-red-600" />;
    }
  };

  const getMessage = () => {
    switch (result.type) {
      case 'jackpot':
        return "HOLY SHIT! TO THE MOON! 🚀";
      case 'success':
        return "Nice trade! Keep grinding! 📈";
      case 'loss':
        return "Tough luck... Maybe next time 📉";
      case 'rekt':
        return "ABSOLUTELY REKT! 💀";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 p-6 rounded-lg pixel-borders max-w-md w-full">
        <div className="flex flex-col items-center gap-4 mb-6">
          {getIcon()}
          <h2 className="text-2xl font-bold text-center">{getMessage()}</h2>
        </div>
        
        <div className="pixel-box bg-gray-700 p-4 rounded mb-6">
          <p className={`text-center text-2xl font-bold ${
            result.amount >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {result.amount >= 0 ? '+' : ''}{result.amount.toFixed(2)} SOL
          </p>
        </div>
        
        <div className="text-center">
          <button
            onClick={onClose}
            className="pixel-box bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
          >
            Continue Trading
          </button>
        </div>
      </div>
    </div>
  );
};