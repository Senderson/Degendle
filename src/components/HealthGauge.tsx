import React from 'react';
import { Heart } from 'lucide-react';

interface Props {
  health: number;
}

export const HealthGauge: React.FC<Props> = ({ health }) => {
  const getHealthColor = () => {
    if (health > 70) return 'bg-[#00ff00]';
    if (health > 30) return 'bg-[#ffff00]';
    return 'bg-[#ff0066]';
  };

  return (
    <div className="pixel-box bg-[#1a1a3a] p-2 rounded flex items-center gap-2">
      <Heart className={`w-4 h-4 ${health > 30 ? 'text-[#ff0066]' : 'text-red-700'}`} />
      <div className="flex-1 bg-[#0a0a16] h-4 rounded-full overflow-hidden pixel-box">
        <div 
          className={`h-full transition-all duration-300 ${getHealthColor()}`}
          style={{ width: `${health}%` }}
        />
      </div>
      <span className="font-mono text-sm min-w-[3rem] text-[#00ff00]">{Math.round(health)}%</span>
    </div>
  );
};