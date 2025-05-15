import React, { useState } from 'react';
import { 
  X, 
  Monitor, 
  Twitter,
  Rocket,
  TrendingUp,
  Cpu,
  Users,
  Dice6
} from 'lucide-react';
import { PlayerStats } from '../types';

interface Props {
  stats: PlayerStats;
  onClose: () => void;
  onUpgrade: (type: string, username?: string) => void;
}

export const UpgradesWindow: React.FC<Props> = ({ stats, onClose, onUpgrade }) => {
  const [username, setUsername] = useState('');
  const [showUsernameError, setShowUsernameError] = useState(false);

  const getEquipmentCost = (stats: PlayerStats) => {
    const currentLevel = Math.floor(
      (stats.equipment.computer +
        stats.equipment.internet +
        stats.equipment.desk +
        stats.equipment.chair) / 4
    );
    switch (currentLevel) {
      case 1:
        return 12;
      case 2:
        return 24;
      case 3:
        return 50;
      default:
        return 999999;
    }
  };

  const handleTwitterCreate = () => {
    if (!username.trim()) {
      setShowUsernameError(true);
      return;
    }
    setShowUsernameError(false);
    onUpgrade('twitter', username.trim());
  };

  const equipmentCost = getEquipmentCost(stats);
  const currentLevel = Math.floor(
    (stats.equipment.computer +
      stats.equipment.internet +
      stats.equipment.desk +
      stats.equipment.chair) / 4
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 p-6 rounded-lg pixel-borders w-[1000px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#00ff00]">Available Upgrades</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Equipment Bundle */}
          {currentLevel < 4 && (
            <div className={`pixel-box ${stats.sol >= equipmentCost ? 'bg-[#1a1a3a]' : 'bg-gray-700'} p-6 rounded min-h-[200px] flex flex-col justify-between`}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-[#00ff00]" />
                  <span className="font-bold">Equipment Bundle</span>
                </div>
                <span className="text-yellow-400">{equipmentCost.toFixed(2)} SOL</span>
              </div>
              <p className="text-sm text-gray-400 mb-2">
                Upgrade your entire trading setup at once
              </p>
              <button
                onClick={() => onUpgrade('equipment')}
                disabled={stats.sol < equipmentCost}
                className={`w-full pixel-box ${
                  stats.sol >= equipmentCost
                    ? 'bg-blue-600 hover:bg-blue-500'
                    : 'bg-gray-600 cursor-not-allowed'
                } text-white py-2 px-4 rounded text-sm`}
              >
                Upgrade Equipment
              </button>
            </div>
          )}
          {/* Twitter Account Creation */}
          {!stats.hasTwitter && (
            <div className="pixel-box bg-[#1a1a3a] p-6 rounded mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                  <h3 className="font-bold">Create Twitter Account</h3>
                </div>
                <span className="text-[#00ff00]">FREE</span>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your Twitter handle"
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                />
                {showUsernameError && (
                  <p className="text-red-500 text-sm mt-1">Please enter a username</p>
                )}
              </div>
              <button
                onClick={handleTwitterCreate}
                className="w-full pixel-box bg-[#1DA1F2] hover:bg-[#1a91da] text-white py-2 px-4 rounded"
              >
                Create Account
              </button>
            </div>
          )}
          {/* Memecoin Launch Learning */}
          {!stats.canCreateMemecoins && stats.day >= 2 && (
            <div className={`pixel-box ${stats.sol >= 0.5 ? 'bg-[#1a1a3a]' : 'bg-gray-700'} p-4 rounded`}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-[#00ff00]" />
                  <span className="font-bold">Memecoin Launch</span>
                </div>
                <span className="text-yellow-400">0.5 SOL</span>
              </div>
              <p className="text-sm text-gray-400 mb-2">
                Learn how to launch your own memecoins and make bank 🚀
              </p>
              <button
                onClick={() => onUpgrade('memecoinLearn')}
                disabled={stats.sol < 0.5}
                className={`w-full pixel-box ${
                  stats.sol >= 0.5
                    ? 'bg-blue-600 hover:bg-blue-500'
                    : 'bg-gray-600 cursor-not-allowed'
                } text-white py-2 px-4 rounded text-sm`}
              >
                Learn Memecoin Launch
              </button>
            </div>
          )}
          {/* Trendscope */}
          {!stats.trendscope && stats.canCreateMemecoins && stats.sol >= 0.5 && (
            <div className="pixel-box bg-[#1a1a3a] p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#00ff00]" />
                  <span className="font-bold">Trendscope</span>
                </div>
                <span className="text-yellow-400">0.5 SOL</span>
              </div>
              <p className="text-sm text-gray-400 mb-2">
                Enhanced memecoin trend analysis and market insights.<br/>
                Unlocks after creating your first memecoin.
              </p>
              <button
                onClick={() => onUpgrade('trendscope')}
                className="w-full pixel-box bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded text-sm"
              >
                Purchase Trendscope
              </button>
            </div>
          )}
          {/* Twitter Giveaway */}
          {stats.day >= 4 && !stats.twitterGiveaway && stats.hasTwitter && (
            <div className={`pixel-box ${stats.sol >= 1 ? 'bg-[#1a1a3a]' : 'bg-gray-700'} p-4 rounded`}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#1DA1F2]" />
                  <span className="font-bold">Twitter Giveaway</span>
                </div>
                <span className="text-yellow-400">1.0 SOL</span>
              </div>
              <p className="text-sm text-gray-400 mb-2">
                Host a giveaway to gain 200 instant followers! 🎉
              </p>
              <button
                onClick={() => onUpgrade('twitterGiveaway')}
                disabled={stats.sol < 1}
                className={`w-full pixel-box ${
                  stats.sol >= 1
                    ? 'bg-blue-600 hover:bg-blue-500'
                    : 'bg-gray-600 cursor-not-allowed'
                } text-white py-2 px-4 rounded text-sm`}
              >
                Host Giveaway
              </button>
            </div>
          )}
          {/* MEV */}
          {stats.day >= 6 && !stats.bundler && (
            <div className={`pixel-box ${stats.sol >= 100 ? 'bg-[#1a1a3a]' : 'bg-gray-700'} p-4 rounded`}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#00ff00]" />
                  <span className="font-bold">MEV</span>
                </div>
                <span className="text-yellow-400">100 SOL</span>
              </div>
              <p className="text-sm text-gray-400 mb-2">
                Frontrun the market for better profits. Increases trade success rate by 20%!
              </p>
              <button
                onClick={() => onUpgrade('bundler')}
                disabled={stats.sol < 100}
                className={`w-full pixel-box ${
                  stats.sol >= 100
                    ? 'bg-blue-600 hover:bg-blue-500'
                    : 'bg-gray-600 cursor-not-allowed'
                } text-white py-2 px-4 rounded text-sm`}
              >
                Purchase MEV
              </button>
            </div>
          )}
          {/* Bundler Sniper */}
          {stats.day >= 5 && stats.canCreateMemecoins && !stats.sniper && (
            <div className={`pixel-box ${stats.sol >= 20 ? 'bg-[#1a1a3a]' : 'bg-gray-700'} p-4 rounded`}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#00ff00]" />
                  <span className="font-bold">Bundler Sniper</span>
                </div>
                <span className="text-yellow-400">20 SOL</span>
              </div>
              <p className="text-sm text-gray-400 mb-2">
                Allow to snipe launches with more wallets.
              </p>
              <button
                onClick={() => onUpgrade('sniper')}
                disabled={stats.sol < 20}
                className={`w-full pixel-box ${
                  stats.sol >= 20
                    ? 'bg-blue-600 hover:bg-blue-500'
                    : 'bg-gray-600 cursor-not-allowed'
                } text-white py-2 px-4 rounded text-sm`}
              >
                Purchase Sniper
              </button>
            </div>
          )}
          {/* Referral Farming */}
          {stats.tradingSkill >= 3 && !stats.referralFarming && (
            <div className="pixel-box bg-[#1a1a3a] p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#00ff00]" />
                  <span className="font-bold">Referral Farming</span>
                </div>
                <span className="text-yellow-400">FREE</span>
              </div>
              <p className="text-sm text-gray-400 mb-2">
                Earn passive income from referrals
              </p>
              <button
                onClick={() => onUpgrade('referralFarming')}
                className="w-full pixel-box bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded text-sm"
              >
                Enable Farming
              </button>
            </div>
          )}
          {/* Auto Gambling Mode */}
          {stats.tradingSkill >= 3 && !stats.canGamble && (
            <div className={`pixel-box ${stats.sol >= 2 ? 'bg-[#1a1a3a]' : 'bg-gray-700'} p-4 rounded`}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Dice6 className="w-5 h-5 text-[#00ff00]" />
                  <span className="font-bold">Auto Gambling Mode</span>
                </div>
                <span className="text-yellow-400">2.0 SOL</span>
              </div>
              <p className="text-sm text-gray-400 mb-2">
                Unlock automated trading for passive gains and losses. High risk, high reward! 🎲
              </p>
              <button
                onClick={() => onUpgrade('gambling')}
                disabled={stats.sol < 2 || stats.tradingSkill < 3}
                title={stats.tradingSkill < 3 ? "Reach Trading Level 3 to unlock Auto Gambling Mode" : ""}
                className={`w-full pixel-box ${
                  stats.sol >= 2 && stats.tradingSkill >= 3
                    ? 'bg-blue-600 hover:bg-blue-500'
                    : 'bg-gray-600 cursor-not-allowed'
                } text-white py-2 px-4 rounded text-sm`}
              >
                {stats.tradingSkill >= 3 ? 'Unlock Auto Gambling' : 'Level 3 Required'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 