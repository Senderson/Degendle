import React, { useState, useEffect } from 'react';
import { Rocket, DollarSign, Coins, Brain, Twitter, MessageCircle } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export const LandingPage: React.FC<Props> = ({ onStart }) => {
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a16] text-white font-mono relative overflow-hidden">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a16] border-b border-[#1a1a3a] pixel-box">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10" />
            <h1 className="text-xl font-bold text-[#00ff00]">MEMDLE</h1>
          </div>
          
          {/* Contract Address */}
          <div className="hidden md:block">
            <div className="pixel-box bg-[#1a1a3a] px-4 py-1">
              <span className="text-[#66ff66]">CA: </span>
              <span className="text-[#4d4dff]">92GDqCMGcxXDNUfg6FXXKbqVxmQA3y6jfdRC2i5pump</span>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://x.com/memdlesol"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00ff00] transition-colors"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="https://t.me/MEMDLE_portal"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00ff00] transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
            </a>
          </div>
        </div>
      </nav>

      {/* Retro grid background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#2020ff 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative z-10">
        {/* Main Header */}
        <header className="pt-24 pb-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="pixel-box bg-gray-900 inline-block p-8 mb-4">
              <h1 className="text-6xl font-bold mb-2 text-yellow-400 pixel-box p-4 animate-pulse">
                MEMDLE
              </h1>
              <div className="text-xl text-[#00ff00]">THE ULTIMATE MEMECOIN LIFE SIMULATOR</div>
            </div>
          </div>
        </header>

        {/* Game Introduction */}
        <div className="max-w-4xl mx-auto px-4 mb-12">
          <div className="pixel-box bg-[#1a1a3a] p-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-[#00ff00] mb-4">WELCOME TO THE FIRST MEMECOIN TRADING IDLE GAME</h2>
              <p className="text-[#66ff66] leading-relaxed">
                START WITH 5 SOL AND BECOME THE ULTIMATE CRYPTO INFLUENCER.<br/>
                TRADE MEMECOINS, BUILD YOUR FOLLOWING, AND AVOID GETTING RUGGED.<br/>
                CAN YOU SURVIVE IN THIS WILD MARKET AND COLLECT ALL THE LAMBOS?
              </p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Press Start Button */}
          <div className="text-center mb-16">
            <button
              onClick={onStart}
              className="pixel-box bg-[#ff0066] hover:bg-[#ff1a75] text-white px-12 py-6 text-2xl font-bold relative overflow-hidden group"
            >
              <span className={`${blink ? 'opacity-100' : 'opacity-0'}`}>
                PRESS START
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000" />
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="pixel-box bg-[#1a1a3a] p-6 transform hover:scale-105 transition-transform">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#ff0066] flex items-center justify-center pixel-box">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#00ff00]">TRADING MOODS</h3>
              </div>
              <p className="text-[#66ff66]">
                FOMO: 50% LARGER POSITIONS 📈<br/>
                INSIDER: PRIVILEGED INFO 🎯<br/>
                FADER: SAFER COUNTER-TRADES 📉<br/>
                GRASS TOUCHER: STEADY GAINS 🌱
              </p>
            </div>

            <div className="pixel-box bg-[#1a1a3a] p-6 transform hover:scale-105 transition-transform">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#ff0066] flex items-center justify-center pixel-box">
                  <Coins className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#00ff00]">CORE MECHANICS</h3>
              </div>
              <p className="text-[#66ff66]">
                TRADE TO EARN SOL AND XP 💰<br/>
                LEVEL UP FOR BETTER TRADES 📊<br/>
                MANAGE TRADER HEALTH ❤️<br/>
                UPGRADE YOUR SETUP 🖥️
              </p>
            </div>

            <div className="pixel-box bg-[#1a1a3a] p-6 transform hover:scale-105 transition-transform">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#ff0066] flex items-center justify-center pixel-box">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#00ff00]">ADVANCED FEATURES</h3>
              </div>
              <p className="text-[#66ff66]">
                TWITTER INFLUENCE 🐦<br/>
                MEMECOIN CREATION (DAY 2+) 🚀<br/>
                TRENDSCOPE & BUNDLER (DAY 4+) 🔍<br/>
                REFERRAL FARMING (LVL 3+) 🌾
              </p>
            </div>

            <div className="pixel-box bg-[#1a1a3a] p-6 transform hover:scale-105 transition-transform">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#ff0066] flex items-center justify-center pixel-box">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#00ff00]">ROAD TO LAMBO</h3>
              </div>
              <p className="text-[#66ff66]">
                BECOME A TIER 1 KEY OPINION LEADER 👑<br/>
                BUILD YOUR INFLUENCE 📢<br/>
                ACCUMULATE MASSIVE WEALTH 💎<br/>
                COLLECT THOSE SWEET LAMBOS 🏎️
              </p>
            </div>
          </div>

          {/* High Scores Section */}
          <div className="pixel-box bg-[#1a1a3a] p-6 mb-8">
            <h2 className="text-center text-2xl font-bold text-[#00ff00] mb-4">HIGH SCORES</h2>
            <div className="space-y-2 text-center">
              <div className="text-[#66ff66]">ANON_WHALE .......... 1,000,000 SOL</div>
              <div className="text-[#66ff66]">PEPE_MASTER ......... 500,000 SOL</div>
              <div className="text-[#66ff66]">RUG_RUNNER .......... 250,000 SOL</div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-center text-[#4d4dff] pixel-box bg-[#1a1a3a] p-4">
            <p>THIS IS A SIMULATION GAME. NO REAL CRYPTOCURRENCIES INVOLVED.</p>
            <p className="animate-pulse">INSERT COIN TO START TRADING 🪙</p>
          </div>
        </main>
      </div>
    </div>
  );
};