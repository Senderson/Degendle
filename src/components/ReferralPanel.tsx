import React, { useEffect } from 'react';
import { Users, Coins } from 'lucide-react';
import { PlayerStats } from '../types';

interface Props {
  stats: PlayerStats;
  setStats: (stats: PlayerStats) => void;
}

export const ReferralPanel: React.FC<Props> = ({ stats, setStats }) => {
  useEffect(() => {
    if (stats.referralFarming) {
      const interval = setInterval(() => {
        const baseEarnings = 0.01; // Base earnings per referral per interval
        const totalEarnings = (stats.referrals.count / 100) * baseEarnings;
        
        setStats(prev => ({
          ...prev,
          sol: prev.sol + totalEarnings,
          referralEarnings: (prev.referralEarnings || 0) + totalEarnings,
          referrals: {
            ...prev.referrals,
            count: prev.referrals.count + Math.floor(Math.random() * 2) // Slow growth
          }
        }));
      }, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, [stats.referralFarming, stats.referrals.count]);

  if (!stats.referralFarming) return null;

  const dailyEstimate = (stats.referrals.count * 0.01 * 17.28).toFixed(2); // 17.28 represents number of 5-second intervals in a day

  return (
    <div className="pixel-box bg-[#1a1a3a] p-4 rounded">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#00ff00]" />
          <h3 className="font-bold text-[#00ff00]">Referral Farming</h3>
        </div>
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-400">{stats.referralEarnings?.toFixed(2) || '0.00'} SOL</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="pixel-box bg-[#0a0a16] p-3 rounded">
          <div className="text-sm text-gray-400 mb-1">Active Referrals</div>
          <div className="font-mono font-bold text-[#00ff00]">{stats.referrals.count}</div>
        </div>
        <div className="pixel-box bg-[#0a0a16] p-3 rounded">
          <div className="text-sm text-gray-400 mb-1">Daily Estimate</div>
          <div className="font-mono font-bold text-[#00ff00]">{dailyEstimate} SOL</div>
        </div>
      </div>
    </div>
  );
}; 