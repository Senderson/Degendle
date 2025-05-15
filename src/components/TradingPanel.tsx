import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, X, Coins } from 'lucide-react';
import { ActiveTrade } from '../types';
import { generateRandomTicker } from '../utils/tickerGenerator';

interface Props {
  activeTrade: ActiveTrade | null;
  onOpenTrade: (coin: string, size: number) => void;
  onCloseTrade: () => void;
  maxSize: number;
  tradingMood?: 'fomo' | 'insider' | 'fader' | 'grass' | 'smart';
  tradingSkill: number;
}

export const TradingPanel: React.FC<Props> = ({ 
  activeTrade, 
  onOpenTrade, 
  onCloseTrade, 
  maxSize,
  tradingMood,
  tradingSkill
}) => {
  const [showTickerSelection, setShowTickerSelection] = useState(false);
  const [randomTickers, setRandomTickers] = useState<string[]>([]);

  const handleNewTrade = () => {
    // Generate 2 random unique tickers
    const tickers = new Set<string>();
    while (tickers.size < 2) {
      tickers.add(generateRandomTicker());
    }
    setRandomTickers(Array.from(tickers));
    setShowTickerSelection(true);
  };

  const handleSelectTicker = (ticker: string) => {
    let size = maxSize * 0.1; // Default 10% of balance

    // Modify size based on trading mood
    switch (tradingMood) {
      case 'fomo':
        size *= 1.5; // FOMO traders use 50% more size
        break;
      case 'fader':
        size *= 0.7; // Faders use 30% less size
        break;
    }

    // Determine rug pull probability
    const baseRugPullChance = 0.1; // Base 10% chance
    const rugPullChance = tradingSkill < 3 ? baseRugPullChance * 1.5 : baseRugPullChance;

    // Simulate trade with rug pull chance
    const isRugPull = Math.random() < rugPullChance;
    if (isRugPull) {
      console.log('Rug pull occurred!');
      // Handle rug pull logic here
    } else {
      onOpenTrade(ticker, size);
    }

    setShowTickerSelection(false);
  };

  useEffect(() => {
    if (!activeTrade) return;
    
    const interval = setInterval(() => {
      // If there's no defined ATH or no active trade, do basic logic
      if (!activeTrade.ath) {
        // your existing price-change logic
        const priceChange = Math.random() * 0.02 - 0.01;
        const decayFactor = 0.99; // Decay factor to simulate return to zero
        let newPrice = activeTrade.currentPrice * (1 + priceChange) * decayFactor;

        // Check if price is close to zero
        if (newPrice < 0.0001) {
          console.log('Price returned to zero');
          clearInterval(interval);
          return;
        }

        // Update trade with new price
        activeTrade.currentPrice = newPrice;
        activeTrade.pnl = (newPrice - activeTrade.entryPrice) * activeTrade.size;
      } else {
        // If we do have an ATH:
        // small random step, allowing up or down
        const priceFluctuation = Math.random() * 0.04 - 0.02; 
        // This means somewhere between -2% and +2% each tick

        // Update price
        let newPrice = activeTrade.currentPrice * (1 + priceFluctuation);

        // Price cannot exceed the ATH
        newPrice = Math.min(newPrice, activeTrade.ath);

        // Price shouldn't drop below zero
        if (newPrice < 0) newPrice = 0.000001;

        // Update trade with new price
        activeTrade.currentPrice = newPrice;
        activeTrade.pnl = (newPrice - activeTrade.entryPrice) * activeTrade.size;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTrade]);

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-bold mb-4 text-center">Memecoin Trading</h2>
      
      {activeTrade ? (
        <div className="space-y-4 flex-1">
          <div className="pixel-box bg-[#0a0a16] p-3 rounded">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#ffff00]">${activeTrade.coin}</span>
                <span className="text-xs text-gray-400">
                  {(activeTrade.currentPrice / activeTrade.entryPrice - 1) * 100 > 50 ? '🚀' : ''}
                </span>
              </div>
              <button
                onClick={onCloseTrade}
                className="hover:text-[#ff0066] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Entry:</span>
                <span className="font-mono">${activeTrade.entryPrice.toFixed(8)}</span>
              </div>
              <div className="flex justify-between">
                <span>Current:</span>
                <span className="font-mono">${activeTrade.currentPrice.toFixed(8)}</span>
              </div>
              <div className="flex justify-between">
                <span>Size:</span>
                <span className="font-mono">{activeTrade.size.toFixed(2)} SOL</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>PnL:</span>
                <span className={`font-mono ${
                  activeTrade.pnl >= 0 ? 'text-[#00ff00]' : 'text-[#ff0066]'
                }`}>
                  {activeTrade.pnl >= 0 ? '+' : ''}{activeTrade.pnl.toFixed(2)} SOL
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={onCloseTrade}
            className="w-full pixel-box bg-[#ff0066] hover:bg-[#ff1a75] text-white px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors"
          >
            <TrendingDown className="w-4 h-4" />
            Close Position
          </button>
        </div>
      ) : showTickerSelection ? (
        <div className="flex-1 flex flex-col">
          <div className="text-center mb-4 text-[#00ff00]">Select a Token</div>
          <div className="grid grid-cols-2 gap-2">
            {randomTickers.map((ticker) => (
              <button
                key={ticker}
                onClick={() => handleSelectTicker(ticker)}
                className="pixel-box bg-[#1a1a3a] hover:bg-[#2a2a4a] text-[#00ff00] p-3 rounded flex items-center justify-center transition-colors"
              >
                <span className="font-bold">${ticker}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center">
          <button
            onClick={handleNewTrade}
            className="w-full pixel-box bg-[#00ff00] hover:bg-[#00cc00] text-black px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors font-bold"
          >
            <TrendingUp className="w-4 h-4" />
            Open Trade {tradingMood === 'fomo' ? '(+50% size)' : tradingMood === 'fader' ? '(-30% size)' : ''}
          </button>
        </div>
      )}
      
      <div className="mt-4 pixel-box bg-[#0a0a16] p-2 rounded">
        <div className="flex items-center justify-center gap-2 text-sm">
          <Coins className="w-4 h-4 text-[#ffff00]" />
          <span>{maxSize.toFixed(2)} SOL Available</span>
        </div>
      </div>
    </div>
  );
};