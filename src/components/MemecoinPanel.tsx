import React, { useState } from 'react';
import { Coins } from 'lucide-react';
import { MemecoinCreator } from './MemecoinCreator';
import { MemecoinChart } from './MemecoinChart';
import { MemecoinConfig } from '../types';

interface Props {
  maxSize: number;
  canCreate: boolean;
  activeMemecoin?: {
    name: string;
    trend: string;
    liquidity: number;
    price: number;
    holders: number;
    launchTime: number;
    isRugPull: boolean;
  };
  onLaunch: (config: MemecoinConfig) => void;
  onRug: () => void;
  stats: {
    tradingSkill: number;
    memecoinLaunchesToday: number;
  };
}

export const MemecoinPanel: React.FC<Props> = ({ 
  maxSize, 
  canCreate, 
  activeMemecoin,
  onLaunch,
  onRug,
  stats
}) => {
  const [showCreator, setShowCreator] = useState(false);
  const maxDailyLaunches = stats.tradingSkill >= 3 ? 2 : 1;
  const remainingLaunches = maxDailyLaunches - stats.memecoinLaunchesToday;

  const handleLaunch = (config: MemecoinConfig) => {
    onLaunch(config);
    setShowCreator(false);
  };

  if (!canCreate) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center p-4">
        <Coins className="w-8 h-8 mb-2 opacity-50" />
        <p>Learn memecoin creation to unlock this feature</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Memecoin Factory</h2>
        <span className="text-sm text-gray-400">
          Launches: {remainingLaunches}/{maxDailyLaunches}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {activeMemecoin ? (
          <MemecoinChart
            memecoin={activeMemecoin}
            onRug={onRug}
          />
        ) : (
          <button
            onClick={() => setShowCreator(true)}
            disabled={remainingLaunches === 0}
            className={`pixel-box px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors
              ${remainingLaunches === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-[#ffff00] hover:bg-[#e6e600] text-black'}`}
          >
            <Coins className="w-4 h-4" />
            {remainingLaunches === 0 ? 'No Launches Left Today' : 'Create Memecoin'}
          </button>
        )}
      </div>

      {showCreator && !activeMemecoin && remainingLaunches > 0 && (
        <MemecoinCreator
          onClose={() => setShowCreator(false)}
          maxSize={maxSize}
          onLaunch={handleLaunch}
        />
      )}
    </div>
  );
};