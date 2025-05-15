import React from 'react';
import { Sun, SunIcon, Coins } from 'lucide-react';
import { TradingPanel } from './TradingPanel';
import { Events } from './Events';
import { MemecoinPanel } from './MemecoinPanel';
import { ActiveTrade, MemecoinConfig } from '../types';
import { MemecoinChart } from './MemecoinChart';

interface Props {
  progress: number;
  activeTrade: ActiveTrade | null;
  onOpenTrade: (coin: string, size: number) => void;
  onCloseTrade: () => void;
  maxSize: number;
  canCreateMemecoins?: boolean;
  activeMemecoin?: {
    name: string;
    trend: string;
    liquidity: number;
    price: number;
    holders: number;
    launchTime: number;
    isRugPull: boolean;
  };
  onLaunchMemecoin: (config: MemecoinConfig) => void;
  onRugMemecoin: () => void;
  hasCreatedMemecoinToday?: boolean;
  stats: {
    sol: number;
    activeMemecoin?: {
      name: string;
      trend: string;
      liquidity: number;
      price: number;
      holders: number;
      launchTime: number;
    };
    gamblingMode: boolean;
    equipment: {
      computer: number;
      internet: number;
      desk: number;
      chair: number;
    };
    followers?: {
      count: number;
    };
    tradingSkill: number;
    memecoinLaunchesToday: number;
  };
  setStats: React.Dispatch<React.SetStateAction<{
    sol: number;
    activeMemecoin?: {
      name: string;
      trend: string;
      liquidity: number;
      price: number;
      holders: number;
      launchTime: number;
    };
    gamblingMode: boolean;
    equipment: {
      computer: number;
      internet: number;
      desk: number;
      chair: number;
    };
    followers?: {
      count: number;
    };
  }>>;
}

const getSetupImage = (equipmentLevel: number) => {
  switch (equipmentLevel) {
    case 3:
      return "/Sprite-0003.gif";
    case 2:
      return "/Sprite-0002.gif";
    default:
      return "/Sprite-0001.gif";
  }
};

export const DayNightCycle: React.FC<Props> = ({ 
  progress, 
  activeTrade, 
  onOpenTrade, 
  onCloseTrade, 
  maxSize,
  canCreateMemecoins,
  activeMemecoin,
  onLaunchMemecoin,
  onRugMemecoin,
  hasCreatedMemecoinToday,
  stats,
  setStats
}) => {
  const width = 240;
  
  const getTimeString = (progress: number) => {
    const startMinutes = 6 * 60; // starting at 6:00 AM
    const dayDurationMinutes = (23 - 6) * 60; // 17 hours = 1020 minutes, ending at 23:00 (11 PM)
    const totalMinutes = startMinutes + progress * dayDurationMinutes;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const getSkyColors = (progress: number) => {
    const keyframes = [
      { pos: 0, colors: ['#FF9A8B', '#FF6A88', '#61a0ff'] },
      { pos: 0.4, colors: ['#89c4ff', '#a7d9ff', '#89c4ff'] },
      { pos: 0.76, colors: ['#6FBFFF', '#5A9BE6', '#437EC7'] },
      { pos: 1, colors: ['#0a0a16', '#0a0a16', '#0a0a16'] }
    ];

    let startFrame = keyframes[0];
    let endFrame = keyframes[1];
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (progress >= keyframes[i].pos && progress < keyframes[i + 1].pos) {
        startFrame = keyframes[i];
        endFrame = keyframes[i + 1];
        break;
      }
    }

    const frameDuration = endFrame.pos - startFrame.pos;
    const frameProgress = (progress - startFrame.pos) / frameDuration;

    const interpolateColor = (start: string, end: string, progress: number) => {
      const r1 = parseInt(start.slice(1, 3), 16);
      const g1 = parseInt(start.slice(3, 5), 16);
      const b1 = parseInt(start.slice(5, 7), 16);
      const r2 = parseInt(end.slice(1, 3), 16);
      const g2 = parseInt(end.slice(3, 5), 16);
      const b2 = parseInt(end.slice(5, 7), 16);

      const r = Math.round(r1 + (r2 - r1) * progress);
      const g = Math.round(g1 + (g2 - g1) * progress);
      const b = Math.round(b1 + (b2 - b1) * progress);

      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    return [
      interpolateColor(startFrame.colors[0], endFrame.colors[0], frameProgress),
      interpolateColor(startFrame.colors[1], endFrame.colors[1], frameProgress),
      interpolateColor(startFrame.colors[2], endFrame.colors[2], frameProgress),
    ];
  };

  const [colorTop, colorMiddle, colorBottom] = getSkyColors(progress);

  // Improved sun movement: The sun moves horizontally based on the day's progress.
  const sunStyle = {
    position: 'absolute' as const,
    left: `${progress * 100}%`, // 0% at the beginning, 100% at the end of the day
    bottom: '75%',             // adjust vertical position as needed
    transform: 'translateX(-50%)',
    transition: 'left 0.5s ease-out'
  };

  const handleMemecoinPriceChange = () => {
    if (!stats.activeMemecoin || !stats.gamblingMode) return;

    const memecoin = stats.activeMemecoin;
    const followerCount = stats.followers?.count ?? 0;
    const timeSinceLaunch = (Date.now() - memecoin.launchTime) / 1000;
    
    // Different behavior based on phase
    let priceMovement = 0;
    let newPhase = memecoin.currentPhase;

    switch(memecoin.currentPhase) {
      case 'launch':
        // Initial pump phase (first 5 minutes)
        if (timeSinceLaunch < 300) {
          priceMovement = (Math.random() * 0.2) * (followerCount / 1000);
          if (memecoin.price >= memecoin.ath * 0.5) {
            newPhase = 'pump';
          }
        } else {
          newPhase = 'pump';
        }
        break;

      case 'pump':
        // Main pump phase
        const distanceToAth = (memecoin.ath - memecoin.price) / memecoin.ath;
        const pumpStrength = Math.min(1, followerCount / 5000);
        priceMovement = (Math.random() * 0.15 - 0.05) * pumpStrength * distanceToAth;
        
        if (memecoin.price >= memecoin.ath * 0.9) {
          newPhase = 'distribution';
        }
        break;

      case 'distribution':
        // Sideways/Distribution phase
        priceMovement = (Math.random() * 0.1 - 0.05) * (1 - followerCount/10000);
        if (Math.random() < 0.1) {
          newPhase = 'decline';
        }
        break;

      case 'decline':
        // Decline phase
        priceMovement = -(Math.random() * 0.1) * (1 - followerCount/20000);
        break;
    }

    // Calculate new price
    const newPrice = Math.max(
      0.00000002,
      Math.min(
        memecoin.ath,
        memecoin.price * (1 + priceMovement)
      )
    );

    // Update holders based on price movement
    const holderChange = Math.floor(
      followerCount < 500 ? -1 :
      priceMovement > 0 
        ? Math.min(100, followerCount / 10) * priceMovement
        : Math.max(-10, followerCount / 20 * priceMovement)
    );

    // Update memecoin state
    setStats(prev => ({
      ...prev,
      activeMemecoin: {
        ...prev.activeMemecoin!,
        price: newPrice,
        holders: Math.max(1, prev.activeMemecoin!.holders + holderChange),
        currentPhase: newPhase
      }
    }));
  };

  // Calculate average equipment level
  const avgEquipmentLevel = Math.floor(
    (stats.equipment.computer + 
     stats.equipment.internet + 
     stats.equipment.desk + 
     stats.equipment.chair) / 4
  );

  return (
    <div className="bg-[#1a1a3a] p-4 rounded-lg pixel-borders">
      <div className="space-y-4">
        <div className="relative">
          <div 
            className="relative h-32 w-full overflow-hidden rounded-lg pixel-box"
            style={{
              background: `linear-gradient(to bottom, ${colorTop}, ${colorMiddle}, ${colorBottom})`,
              transition: 'background 1s linear'
            }}
          >
            {/* Sun element with updated movement */}
            <div style={sunStyle}>
              <SunIcon className="w-10 h-10 text-yellow-400" />
            </div>
          </div>
          <div className="absolute top-2 right-4 bg-[#0a0a16] bg-opacity-50 px-3 py-1 rounded pixel-box">
            <span className="font-mono text-[#00ff00]">{getTimeString(progress)}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="pixel-box bg-[#0a0a16] rounded-lg p-4">
            <TradingPanel
              activeTrade={activeTrade}
              onOpenTrade={onOpenTrade}
              onCloseTrade={onCloseTrade}
              maxSize={maxSize}
            />
          </div>

          <div className="pixel-box bg-[#0a0a16] rounded-lg p-4 col-span-2">
            <div className="flex justify-end mb-2">
              <span className="font-mono text-[#00ff00] bg-[#1a1a3a] px-2 py-1 rounded pixel-box">
                Setup Level {avgEquipmentLevel}
              </span>
            </div>
            <div className="h-full flex items-center justify-center">
              <img 
                src={getSetupImage(avgEquipmentLevel)}
                alt="Trading Setup" 
                className="h-48 object-contain"
              />
            </div>
          </div>

          <div className="pixel-box bg-[#0a0a16] rounded-lg p-4">
            <Events 
              onOpenTrade={onOpenTrade} 
              maxSize={maxSize} 
              progress={progress}
            />
          </div>
        </div>

        {canCreateMemecoins && (
          <div className="pixel-box bg-[#0a0a16] rounded-lg p-4">
            <MemecoinPanel
              maxSize={maxSize}
              canCreate={canCreateMemecoins}
              activeMemecoin={activeMemecoin}
              onLaunch={onLaunchMemecoin}
              onRug={onRugMemecoin}
              stats={{
                tradingSkill: stats.tradingSkill,
                memecoinLaunchesToday: stats.memecoinLaunchesToday
              }}
            />
          </div>
        )}

        {activeMemecoin && (
          <MemecoinChart 
            memecoin={activeMemecoin}
            onRug={onRugMemecoin}
            onPriceChange={stats.gamblingMode ? handleMemecoinPriceChange : undefined}
          />
        )}
      </div>
    </div>
  );
};