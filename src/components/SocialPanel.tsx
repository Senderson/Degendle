import React from 'react';
import { Twitter } from 'lucide-react';
import { PlayerStats } from '../types';

interface Props {
  stats: PlayerStats;
}

export const SocialPanel: React.FC<Props> = ({ stats }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(0);
  };

  if (!stats.hasTwitter) {
    return (
      <div className="pixel-box bg-[#0a0a16] p-4 rounded flex flex-col items-center justify-center h-24">
        <Twitter className="w-12 h-12 text-gray-600 mb-4" />
        <p className="text-gray-500 text-center">Create a Twitter account to unlock social features</p>
      </div>
    );
  }

  return (
    <div className="pixel-box bg-[#0a0a16] p-4 rounded">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#1DA1F2] rounded-full flex items-center justify-center pixel-box">
          <Twitter className="w-6 h-6 text-white" />
        </div>
        <div className="flex-grow">
          <div className="font-bold text-[#00ff00]">@{stats.twitterUsername}</div>
          <div className="text-sm text-[#66ff66]">Crypto Trader</div>
        </div>
        <div className="text-right">
          <div className="text-[#00ff00] font-bold">{formatNumber(stats.followers.count)}</div>
          <div className="text-xs text-[#66ff66]">Followers</div>
        </div>
      </div>
    </div>
  );
};