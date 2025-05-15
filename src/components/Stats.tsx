import React from 'react';
import { PlayerStats } from '../types';
import { Cpu, Wifi, TrendingUp as ArrowTrendingUp, Rocket, Brain, TrendingDown, Flower2, Dice1 as Dice, Users } from 'lucide-react';
import { HealthGauge } from './HealthGauge';
import { getPlayerTitle } from '../utils/playerTitles';

interface Props {
  stats: PlayerStats;
  onToggleGambling: () => void;
}

export const Stats: React.FC<Props> = ({ stats, onToggleGambling }) => {
  const getMoodIcon = () => {
    if (!stats.tradingMood) return null;
    
    switch (stats.tradingMood) {
      case 'fomo':
        return <Rocket className="w-4 h-4 text-green-400" />;
      case 'insider':
        return <Brain className="w-4 h-4 text-purple-400" />;
      case 'fader':
        return <TrendingDown className="w-4 h-4 text-blue-400" />;
      case 'grass':
        return <Flower2 className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getMoodColor = () => {
    if (!stats.tradingMood) return '';
    
    switch (stats.tradingMood) {
      case 'fomo':
        return 'text-green-400';
      case 'insider':
        return 'text-purple-400';
      case 'fader':
        return 'text-blue-400';
      case 'grass':
        return 'text-emerald-400';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <HealthGauge health={stats.health} />
        <div className="relative group">
          {!stats.canGamble && (
            <div className="absolute invisible group-hover:visible 
              bg-black text-white text-xs px-2 py-1 rounded
              -top-8 left-1/2 transform -translate-x-1/2
              whitespace-nowrap z-50 border border-gray-700">
              Unlock at Level 3
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2
                border-4 border-transparent border-t-black"></div>
            </div>
          )}
          <button
            onClick={onToggleGambling}
            className={`pixel-box ${
              !stats.canGamble 
                ? 'bg-gray-700 cursor-not-allowed' 
                : stats.gamblingMode 
                  ? 'bg-green-600 hover:bg-blue-700' 
                  : 'bg-gray-600 hover:bg-gray-400'
            } text-white py-1 px-3 rounded text-sm`}
            disabled={!stats.canGamble}
          >
            {!stats.canGamble 
              ? 'Auto Gambling Mode: Locked' 
              : stats.gamblingMode 
                ? 'Auto Gambling Mode: On' 
                : 'Auto Gambling Mode: Off'
            }
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="pixel-box bg-[#1a1a3a] p-2 rounded flex items-center gap-2">
          <span className="text-[#ffff00]">SOL:</span>
          <span className="font-mono text-[#00ff00]">{stats.sol.toFixed(2)}</span>
        </div>
        <div className="pixel-box bg-[#1a1a3a] p-2 rounded flex items-center gap-2">
          <span className="text-[#00ff00]">DAY:</span>
          <span className="font-mono text-[#00ff00]">{stats.day}</span>
        </div>
        <div className="pixel-box bg-[#1a1a3a] p-2 rounded flex items-center gap-2 flex-col col-span-2">
          <div className="flex items-center gap-2 w-full justify-between">
            <div className="flex items-center gap-2">
              <ArrowTrendingUp className="w-4 h-4 text-[#00ff00]" />
              <span className="font-mono text-[#00ff00]">LEVEL {stats.tradingSkill}</span>
            </div>
            <span className="text-yellow-400 text-sm font-bold">
              {getPlayerTitle(stats.tradingSkill)}
            </span>
          </div>
          <div className="w-full mt-2">
            <div className="h-2 bg-gray-700 rounded-full">
              <div
                className="h-2 bg-blue-500 rounded-full"
                style={{ width: `${(stats.xp / (stats.tradingSkill * 100)) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-center text-gray-300 mt-1">
              {stats.xp} / {stats.tradingSkill * 100} XP
            </div>
          </div>
        </div>
      </div>

      {stats.tradingMood && (
        <div className="pixel-box bg-[#1a1a3a] p-2 rounded flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getMoodIcon()}
            <span className={`font-bold uppercase ${getMoodColor()}`}>
              {stats.tradingMood === 'grass' ? 'TOUCHING GRASS' : `${stats.tradingMood} TRADER`}
            </span>
          </div>
          <div className="text-xs text-[#66ff66]">
            TODAY'S MOOD
          </div>
        </div>
      )}
    </div>
  );
};