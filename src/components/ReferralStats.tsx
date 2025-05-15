import React from 'react';
import { Users, DollarSign } from 'lucide-react';
import { PlayerStats } from '../types';

interface Props {
  stats: PlayerStats;
}

export const ReferralStats: React.FC<Props> = ({ stats }) => {
  if (!stats.referralFarming) return null;

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
    <div className="pixel-box bg-[#1a1a3a] p-4 rounded">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#00ff00]" />
            <div>
              <div className="text-sm text-gray-400">Referrals</div>
              <div className="font-mono text-[#00ff00]">
                {formatNumber(stats.referrals.count)}
              </div>
            </div>
          </div>
          <div className="w-px h-8 bg-gray-700" /> {/* Vertical divider */}
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-sm text-gray-400">Earnings</div>
              <div className="font-mono text-yellow-400">
                {stats.referralEarnings.toFixed(2)} SOL
              </div>
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          +{((stats.referrals.count * 0.1) * 0.01 * 17.28).toFixed(2)} SOL/day
        </div>
      </div>
    </div>
  );
}; 