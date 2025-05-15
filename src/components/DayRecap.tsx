import React, { useState } from 'react';
import { PlayerStats } from '../types';
import { TrendingUp, TrendingDown, Users, Twitter, Coins, ArrowRight } from 'lucide-react';

interface Props {
  stats: PlayerStats;
  onSleep: () => void;
  onUpgrade: (upgrade: string, username?: string) => void;
}

export const DayRecap: React.FC<Props> = ({ stats, onSleep, onUpgrade }) => {
  const [username, setUsername] = useState('');
  const [showUsernameError, setShowUsernameError] = useState(false);
  
  // Today's profit is the last recorded daily profit, if any.
  const todayProfit = stats.dailyProfits.length > 0 ? stats.dailyProfits[stats.dailyProfits.length - 1] : 0;
  const formattedPnL = `${todayProfit >= 0 ? '+' : ''}${todayProfit.toFixed(2)}`;
  const followerGrowth = stats.followers.count - (stats.followers.lastGrowth || 0);
  const referralProfit = stats.referralFarming ? 
    ((stats.followers.count * 0.1) * 0.01 * 17.28) : 0; // Calculate daily referral earnings
  const canCreateTwitter = !stats.hasTwitter;
  const canLearnMemecoins = stats.day >= 2 && !stats.canCreateMemecoins && stats.sol >= 0.5;

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(0);
  };

  const handleTwitterCreate = () => {
    if (!username.trim()) {
      setShowUsernameError(true);
      return;
    }
    setShowUsernameError(false);
    onUpgrade('twitter', username.trim());
  };

  // Add this helper function to calculate equipment upgrade cost
  const getEquipmentCost = () => {
    const computerCost = stats.equipment.computer * 0.5;
    const internetCost = stats.equipment.internet * 0.5;
    const deskCost = stats.equipment.desk * 0.5;
    const chairCost = stats.equipment.chair * 0.5;
    return computerCost + internetCost + deskCost + chairCost;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 p-6 rounded-lg pixel-borders max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Day {stats.day} Recap</h2>
        
        <div className="space-y-4">
          {/* Trading Results */}
          <div className="pixel-box bg-gray-700 p-4 rounded">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Trading P&L</span>
              <div className={`flex items-center gap-2 ${todayProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {todayProfit >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {formattedPnL} SOL
              </div>
            </div>
          </div>

          {/* Follower Growth */}
          <div className="pixel-box bg-gray-700 p-4 rounded">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">New Followers</span>
              <div className="flex items-center gap-2 text-blue-400">
                <Users className="w-4 h-4" />
                +{followerGrowth}
              </div>
            </div>
          </div>

          {/* Referral Earnings - Only show if referralFarming is enabled */}
          {stats.referralFarming && (
            <div className="pixel-box bg-gray-700 p-4 rounded">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Referral Earnings</span>
                <div className="flex items-center gap-2 text-yellow-400">
                  <Coins className="w-4 h-4" />
                  +{referralProfit.toFixed(2)} SOL
                </div>
              </div>
            </div>
          )}

          {/* Total Balance */}
          <div className="pixel-box bg-gray-900 p-4 rounded mt-6">
            <div className="flex items-center justify-between font-bold">
              <span>Total Balance</span>
              <span>{stats.sol.toFixed(2)} SOL</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            onClick={() => onUpgrade('show_upgrades')}
            className="pixel-box bg-blue-600 hover:bg-blue-500 text-white py-3 rounded flex items-center justify-center gap-2"
          >
            View Upgrades
          </button>
          <button
            onClick={onSleep}
            className="pixel-box bg-green-600 hover:bg-green-500 text-white py-3 rounded flex items-center justify-center gap-2"
          >
            Sleep <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};