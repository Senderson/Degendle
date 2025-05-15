import React from 'react';
import { Coins, Moon, Sun, Twitter, MessageCircle } from 'lucide-react';

interface Props {
  day: number;
  sol: number;
}

export const Header: React.FC<Props> = ({ day, sol }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a16] border-b-2 border-[#1a1a3a] pixel-box">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-10 h-10" />
          <h1 className="text-2xl font-bold text-[#00ff00]">MEMDLE</h1>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            {day % 2 === 0 ? (
              <Moon className="w-5 h-5 text-[#ffff00]" />
            ) : (
              <Sun className="w-5 h-5 text-[#ffff00]" />
            )}
            <span className="text-[#00ff00] font-mono">DAY {day}</span>
          </div>
          
          <div className="pixel-box bg-[#1a1a3a] px-3 py-1 flex items-center gap-2">
            <Coins className="w-4 h-4 text-[#ffff00]" />
            <span className="text-[#00ff00] font-mono">{sol.toFixed(2)} SOL</span>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4">
          <a
            href="https://x.com/memdlesol"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1DA1F2] hover:text-[#0d8ecf] transition-colors"
          >
            <Twitter className="w-6 h-6" />
          </a>
          <a
            href="https://t.me/MEMDLE_portal"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0088cc] hover:text-[#0077b5] transition-colors"
          >
            <MessageCircle className="w-6 h-6" />
          </a>
        </div>
      </div>
    </header>
  );
};