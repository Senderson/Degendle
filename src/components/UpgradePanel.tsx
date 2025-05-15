import React from 'react';
import { Twitter, X, Dice6 } from 'lucide-react';
import { PlayerStats } from '../types';

interface Props {
  stats: PlayerStats;
  onClose: () => void;
  onUpgrade: (upgrade: string) => void;
}

export const UpgradePanel: React.FC<Props> = ({ stats, onClose, onUpgrade }) => {
  const canCreateTwitter = !stats.hasTwitter;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 p-6 rounded-lg pixel-borders max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue-400">Upgrades Available</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className={`pixel-box ${canCreateTwitter ? 'bg-gray-700' : 'bg-gray-800'} p-4 rounded`}>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <Twitter className={`w-8 h-8 ${canCreateTwitter ? 'text-blue-400' : 'text-gray-600'}`} />
              </div>
              <div className="flex-grow">
                <h3 className="font-bold text-lg mb-1">Create Twitter Account</h3>
                <p className="text-sm text-gray-400">Start building your social presence</p>
                <ul className="mt-2 text-sm text-gray-300 list-disc list-inside">
                  <li>Unlock follower growth mechanics</li>
                  <li>Gain trading insights from your network</li>
                  <li>Increase your influence in the market</li>
                </ul>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-[#00ff00] font-mono mb-2">FREE</div>
                <button
                  onClick={() => onUpgrade('twitter')}
                  className={`pixel-box px-4 py-2 rounded text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer`}
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>

          {!stats.canGamble && (
            <div className={`pixel-box ${
              stats.tradingSkill >= 3 && stats.sol >= 2 ? 'bg-gray-700' : 'bg-gray-800'
            } p-4 rounded`}>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <Dice6 className={`w-8 h-8 ${
                    stats.tradingSkill >= 3 && stats.sol >= 2 ? 'text-[#00ff00]' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-lg mb-1">Auto Gambling Mode</h3>
                  <p className="text-sm text-gray-400">
                    {stats.tradingSkill >= 3 
                      ? 'Unlock automated trading for passive gains' 
                      : `Requires Trading Level 3 (Current: ${stats.tradingSkill})`
                    }
                  </p>
                  <ul className="mt-2 text-sm text-gray-300 list-disc list-inside">
                    <li>Automated trading system</li>
                    <li>High risk, high reward</li>
                    <li>Passive income potential</li>
                  </ul>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-yellow-400 font-mono mb-2">2.0 SOL</div>
                  <button
                    onClick={() => onUpgrade('gambling')}
                    disabled={stats.sol < 2 || stats.tradingSkill < 3}
                    title={stats.tradingSkill < 3 ? "Reach Trading Level 3 to unlock Auto Gambling Mode" : ""}
                    className={`pixel-box px-4 py-2 rounded text-sm font-bold 
                      ${stats.tradingSkill >= 3 && stats.sol >= 2
                        ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
                  >
                    {stats.tradingSkill >= 3 ? 'Unlock Mode' : 'Level 3 Required'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};