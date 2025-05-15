import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Skull } from 'lucide-react';

interface PnLPopup {
  id: number;
  amount: number;
  type?: 'rug_pull';
}

interface Props {
  popups: PnLPopup[];
}

const cashSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2058/2058-preview.mp3');
const rugPullSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2940/2940-preview.mp3');

export const PnLAnimation: React.FC<Props> = ({ popups }) => {
  // Play sound for each new popup
  useEffect(() => {
    if (popups.length > 0) {
      const latestPopup = popups[popups.length - 1];
      if (latestPopup.type === 'rug_pull') {
        rugPullSound.currentTime = 0;
        rugPullSound.play().catch(() => {
          // Ignore errors - some browsers block autoplay
        });
      } else {
        cashSound.currentTime = 0;
        cashSound.play().catch(() => {
          // Ignore errors - some browsers block autoplay
        });
      }
    }
  }, [popups.length]);

  return (
    <div className="fixed right-8 top-24 pointer-events-none">
      <div className="relative w-48 h-96 overflow-hidden">
        {popups.map((popup) => (
          <div
            key={popup.id}
            className="absolute inset-x-0 transition-all duration-1000"
            style={{
              animation: popup.type === 'rug_pull' ? 'float-up 2s ease-out forwards' : 'float-up 1s ease-out forwards'
            }}
          >
            {popup.type === 'rug_pull' ? (
              <div className="flex flex-col items-center text-red-500 animate-pulse">
                <Skull className="w-12 h-12 mb-2" />
                <div className="text-2xl font-bold mb-1">RUG PULL!</div>
                <div className="font-mono text-lg">
                  {popup.amount.toFixed(3)} SOL
                </div>
                <div className="text-sm mt-1 text-red-400">
                  You got rugged ser...
                </div>
              </div>
            ) : (
              <div className={`flex items-center justify-center gap-1 font-mono text-lg font-bold
                ${popup.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}
              >
                {popup.amount >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {popup.amount.toFixed(3)} SOL
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}