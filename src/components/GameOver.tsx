import React from 'react';
import { Skull, Trophy, Calendar, Users, Coins } from 'lucide-react';
import { PlayerStats } from '../types';

interface Props {
  score: number;
  onRestart: () => void;
  stats: PlayerStats;
}

export const GameOver: React.FC<Props> = ({ score, onRestart, stats }) => {
  return (
    <div className="min-h-screen bg-[#0a0a16] text-white font-mono relative overflow-hidden">
      {/* Retro grid background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#2020ff 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="inline-block pixel-box bg-[#1a1a3a] p-8 animate-bounce-in">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Skull className="w-12 h-12 text-[#ff0066]" />
                <h1 className="text-4xl font-bold text-[#ff0066]">GAME OVER</h1>
                <Skull className="w-12 h-12 text-[#ff0066]" />
              </div>
              <p className="text-[#66ff66] text-xl">You lost all your SOL!</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="pixel-box bg-[#1a1a3a] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-6 h-6 text-[#ffff00]" />
                <h2 className="text-xl font-bold text-[#ffff00]">FINAL SCORE</h2>
              </div>
              <div className="text-4xl font-bold text-[#00ff00]">{score.toLocaleString()}</div>
            </div>

            <div className="pixel-box bg-[#1a1a3a] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-6 h-6 text-[#00ff00]" />
                <h2 className="text-xl font-bold text-[#00ff00]">DAYS SURVIVED</h2>
              </div>
              <div className="text-4xl font-bold text-[#00ff00]">{stats.day}</div>
            </div>

            <div className="pixel-box bg-[#1a1a3a] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-6 h-6 text-[#ff00ff]" />
                <h2 className="text-xl font-bold text-[#ff00ff]">FOLLOWERS</h2>
              </div>
              <div className="text-4xl font-bold text-[#00ff00]">
                {stats.followers.count.toLocaleString()}
              </div>
            </div>

            <div className="pixel-box bg-[#1a1a3a] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-6 h-6 text-[#ffff00]" />
                <h2 className="text-xl font-bold text-[#ffff00]">TOTAL TRADES</h2>
              </div>
              <div className="text-4xl font-bold text-[#00ff00]">
                {stats.dailyProfits.length}
              </div>
            </div>
          </div>

          {/* Restart Button */}
          <div className="text-center">
            <button
              onClick={onRestart}
              className="pixel-box bg-[#ff0066] hover:bg-[#ff1a75] text-white px-8 py-4 text-xl font-bold inline-block"
            >
              PLAY AGAIN
            </button>
          </div>

          {/* Tips */}
          <div className="mt-8 text-center pixel-box bg-[#1a1a3a] p-4">
            <h3 className="text-[#00ff00] mb-2">TIPS FOR NEXT RUN:</h3>
            <ul className="text-[#66ff66] space-y-1">
              <li>🎯 Diversify your trading strategy</li>
              <li>🌱 Take breaks by touching grass</li>
              <li>🐋 Build your Twitter following</li>
              <li>🎲 Be careful with gambling mode</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};