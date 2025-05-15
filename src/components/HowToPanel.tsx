import React from 'react';

interface Props {
  onClose: () => void;
}

export const HowToPanel: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
      <div className="bg-[#1a1a3a] p-6 rounded-lg pixel-borders max-w-xl w-full">
        <h2 className="text-2xl font-bold text-center mb-4 text-[#00ff00]">How to Play</h2>
        <div className="space-y-4 text-sm text-white">
          <div className="pixel-box bg-[#0a0a16] p-3 rounded">
            <h3 className="text-[#00ff00] font-bold mb-2">1. Trading Moods</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong className="text-green-400">FOMO Trader:</strong> High-risk, high-reward. 50% larger position sizes.</li>
              <li><strong className="text-purple-400">Insider Trader:</strong> Access to privileged information. Better win rates.</li>
              <li><strong className="text-blue-400">Fader:</strong> Counter-trend trader. 30% smaller, safer positions.</li>
              <li><strong className="text-yellow-400">Grass Toucher:</strong> Balanced approach. Steady gains.</li>
            </ul>
          </div>
          
          <div className="pixel-box bg-[#0a0a16] p-3 rounded">
            <h3 className="text-[#00ff00] font-bold mb-2">2. Core Mechanics</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Trading:</strong> Open positions to earn SOL and gain XP</li>
              <li><strong>Level Up:</strong> Higher levels unlock better opportunities</li>
              <li><strong>Health:</strong> Manage your trader health to avoid burnout</li>
              <li><strong>Equipment:</strong> Upgrade your setup for better performance</li>
            </ul>
          </div>
          
          <div className="pixel-box bg-[#0a0a16] p-3 rounded">
            <h3 className="text-[#00ff00] font-bold mb-2">3. Advanced Features</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Twitter:</strong> Build following for market influence</li>
              <li><strong>Memecoins:</strong> Launch your own tokens (unlocked at Day 2)</li>
              <li><strong>Upgrades:</strong> Trendscope, Bundler, and more (from Day 4)</li>
              <li><strong>Referral Farming:</strong> Earn passive income (Level 3+)</li>
            </ul>
          </div>
          
          <div className="pixel-box bg-[#0a0a16] p-3 rounded">
            <h3 className="text-[#00ff00] font-bold mb-2">🎯 Goal</h3>
            <p className="pl-4">Become a Tier 1 Key Opinion Leader: Build your influence, accumulate wealth, and collect those sweet Lambos!</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full pixel-box bg-[#00ff00] hover:bg-[#00cc00] text-black font-bold py-3 rounded transition-colors text-lg"
        >
          Start Your Trading Journey 🚀
        </button>
      </div>
    </div>
  );
}; 