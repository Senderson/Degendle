import React, { useState, useEffect } from 'react';
import { Rocket, Brain, TrendingDown, Flower2, Lightbulb } from 'lucide-react';

// Define moods with their weights
const moods = [
  { type: 'smart', icon: Lightbulb, color: '#FFB800', weight: 0.31 },
  { type: 'fader', icon: TrendingDown, color: '#007AFF', weight: 0.25 },
  { type: 'fomo', icon: Rocket, color: '#FF3B30', weight: 0.25 },
  { type: 'insider', icon: Brain, color: '#34C759', weight: 0.15 },
  { type: 'grass', icon: Flower2, color: '#30D158', weight: 0.04 }
] as const;

interface Props {
  day: number;
  onSelect: (mood: 'fomo' | 'insider' | 'fader' | 'grass' | 'smart') => void;
}

export const MoodSelector: React.FC<Props> = ({ day, onSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSelecting, setIsSelecting] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [selectedMood, setSelectedMood] = useState<typeof moods[number] | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isSelecting && !selectedMood) {
      interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % moods.length);
        
        setSpeed(prev => {
          if (prev >= 500) {
            setIsSelecting(false);
            
            // Select final mood based on weights
            const random = Math.random();
            let cumulativeWeight = 0;
            let selectedIndex = 0;
            
            for (let i = 0; i < moods.length; i++) {
              cumulativeWeight += moods[i].weight;
              if (random <= cumulativeWeight) {
                selectedIndex = i;
                break;
              }
            }
            
            setCurrentIndex(selectedIndex);
            const finalMood = moods[selectedIndex];
            setSelectedMood(finalMood);
            
            // Notify parent after a brief pause
            setTimeout(() => {
              onSelect(finalMood.type);
            }, 500);
            
            return prev;
          }
          return prev * 1.2;
        });
      }, speed);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isSelecting, speed, onSelect, selectedMood]);

  const handleStart = () => {
    if (!isSelecting && !selectedMood) {
      setIsSelecting(true);
      setSpeed(100);
    }
  };

  const CurrentIcon = moods[currentIndex].icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1a1a3a] p-8 rounded-lg pixel-borders max-w-md w-full">
        <p className="text-lg font-bold text-center mb-4 text-[#00ff00]">
          Day {day}
        </p>
        <h2 className="text-2xl font-bold text-center mb-8 text-[#00ff00]">
          Select Today's Trading Mood
        </h2>
        
        <div className="relative h-48 mb-8">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-colors duration-200 pixel-box"
              style={{ backgroundColor: moods[currentIndex].color }}
            >
              <CurrentIcon className="w-12 h-12 text-white" />
            </div>
            <div className="text-2xl font-bold uppercase tracking-wider text-[#00ff00]">
              {moods[currentIndex].type}
            </div>
          </div>
        </div>

        <div className="text-center">
          {!selectedMood ? (
            <button
              onClick={handleStart}
              disabled={isSelecting}
              className={`pixel-box ${
                isSelecting 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-[#ff0066] hover:bg-[#ff1a75]'
              } text-white px-8 py-3 rounded transition-colors text-lg font-bold w-full`}
            >
              {isSelecting ? 'Selecting...' : 'Select Mood'}
            </button>
          ) : (
            <div className="animate-bounce-in">
              <p className="text-xl font-bold mb-4 text-[#00ff00]">
                You're a {selectedMood.type.toUpperCase()} trader today!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};