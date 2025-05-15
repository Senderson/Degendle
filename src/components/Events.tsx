import React, { useState, useEffect } from 'react';
import { Rocket, X, Coins } from 'lucide-react';

interface Props {
  onOpenTrade: (coin: string, size: number) => void;
  maxSize: number;
  progress: number;
  tradingMood?: 'fomo' | 'insider' | 'fader' | 'grass' | 'smart';
}

export const Events: React.FC<Props> = ({ onOpenTrade, maxSize, progress, tradingMood }) => {
  const [showAlpha, setShowAlpha] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [hasShownTodayAlpha, setHasShownTodayAlpha] = useState(false);
  const [alphaCount, setAlphaCount] = useState(0);

  useEffect(() => {
    // Reset for new day
    if (progress === 0) {
      setHasShownTodayAlpha(false);
      setAlphaCount(0);
      return;
    }

    // Skip alpha calls if touching grass
    if (tradingMood === 'grass') {
      return;
    }

    // Determine max alpha calls based on mood
    const maxAlphaCalls = tradingMood === 'insider' ? 2 : 1;

    // Show alpha call at random time during the day (between 20% and 80% of the day)
    if (!hasShownTodayAlpha && progress > 0.2 && progress < 0.8 && alphaCount < maxAlphaCalls) {
      const shouldShowNow = Math.random() < 0.01; // Small chance each tick to show alpha
      
      if (shouldShowNow) {
        setShowAlpha(true);
        setShowActions(true);
        setAlphaCount(prev => prev + 1);
        
        if (alphaCount + 1 >= maxAlphaCalls) {
          setHasShownTodayAlpha(true);
        }

        // Hide actions after 10 seconds
        setTimeout(() => {
          setShowActions(false);
          setShowAlpha(false);
        }, 10000);
      }
    }
  }, [progress, hasShownTodayAlpha, alphaCount, tradingMood]);

  const handleAction = (action: 'ape' | 'fade' | 'fullport') => {
    if (action === 'fade') {
      setShowActions(false);
      setShowAlpha(false);
      return;
    }

    let size = maxSize * 0.1; // Default 10% of balance

    // Modify size based on trading mood and action
    switch (tradingMood) {
      case 'fomo':
        size *= 1.5; // FOMO traders use 50% more size
        break;
      case 'fader':
        size *= 0.7; // Faders use 30% less size
        break;
    }

    // Further modify size based on action type
    switch (action) {
      case 'ape':
        size = maxSize * 0.2; // 20% of balance
        if (tradingMood === 'fomo') size *= 1.5;
        if (tradingMood === 'fader') size *= 0.7;
        break;
      case 'fullport':
        size = maxSize * 0.5; // 50% of balance
        if (tradingMood === 'fomo') size *= 1.5;
        if (tradingMood === 'fader') size *= 0.7;
        break;
    }

    onOpenTrade('ALPHA', size);
    setShowActions(false);
    setShowAlpha(false);
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-bold mb-4 text-center">Events</h2>

      {showAlpha ? (
        <div className="flex-1 flex flex-col">
          <div className="pixel-box bg-gray-800 p-3 rounded mb-4 animate-pulse">
            <div className="flex items-center justify-center gap-2">
              <Rocket className="w-4 h-4 text-yellow-400" />
              <span className="font-bold text-yellow-400">New Alpha!</span>
            </div>
          </div>

          {showActions && (
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => handleAction('ape')}
                className="pixel-box bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded flex items-center justify-center gap-2 transition-colors text-sm"
              >
                <Rocket className="w-3 h-3" />
                Ape (20%{tradingMood === 'fomo' ? ' +50%' : tradingMood === 'fader' ? ' -30%' : ''})
              </button>
              
              <button
                onClick={() => handleAction('fade')}
                className="pixel-box bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded flex items-center justify-center gap-2 transition-colors text-sm"
              >
                <X className="w-3 h-3" />
                Fade
              </button>
              
              <button
                onClick={() => handleAction('fullport')}
                className="pixel-box bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded flex items-center justify-center gap-2 transition-colors text-sm"
              >
                <Coins className="w-3 h-3" />
                Full Port (50%{tradingMood === 'fomo' ? ' +50%' : tradingMood === 'fader' ? ' -30%' : ''})
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
          {tradingMood === 'grass' ? (
            'Touching grass today...'
          ) : (
            `Waiting for ${tradingMood === 'insider' ? 'insider alpha' : 'events'}...`
          )}
        </div>
      )}
    </div>
  );
};