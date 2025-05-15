import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Skull, Users } from 'lucide-react';

interface Props {
  memecoin: {
    name: string;
    trend: string;
    liquidity: number;
    price: number;
    holders: number;
    launchTime: number;
    isRugPull: boolean;
  };
  onRug: () => void;
  onPriceChange?: (newPrice: number) => void;
}

export const MemecoinChart: React.FC<Props> = ({ memecoin, onRug, onPriceChange }) => {
  const [price, setPrice] = useState(0.000002); // Start price at $0.000002
  const [priceChange, setPriceChange] = useState(0); // Start percentage change at 0%
  const [initialDevBuy, setInitialDevBuy] = useState(memecoin.liquidity); // Track initial dev buy

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate price change
      const change = Math.random() * 0.000001; // Random small change
      const newPrice = Math.max(price + change, 0.000002); // Ensure price doesn't go below $0.000002

      setPrice(newPrice);
      setPriceChange(((newPrice - 0.000002) / 0.000002) * 100); // Calculate percentage change from initial price

      if (onPriceChange) {
        onPriceChange(newPrice);
      }
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [price, onPriceChange]);

  // Calculate current value based on price change
  const currentValue = initialDevBuy * price;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 p-6 rounded-lg pixel-borders max-w-2xl w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">${memecoin.name}</h2>
            <p className="text-sm text-gray-400">Trend: {memecoin.trend}</p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${price.toFixed(4)}
            </div>
            <div className={`flex items-center gap-1 justify-end ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="pixel-box bg-gray-900 p-4 rounded mb-6 aspect-[2/1] relative overflow-hidden">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            {Array.from({ length: 5 }, (_, i) => (
              <line
                key={i}
                x1="0"
                y1={i * 25}
                x2="100"
                y2={i * 25}
                stroke="#2D3748"
                strokeWidth="0.5"
              />
            ))}
            {Array.from({ length: 5 }, (_, i) => (
              <line
                key={i}
                x1={i * 25}
                y1="0"
                x2={i * 25}
                y2="100"
                stroke="#2D3748"
                strokeWidth="0.5"
              />
            ))}

            {/* Price line */}
            <polyline
              points={`0,50 100,${50 - priceChange}`} // Adjust points based on price change
              fill="none"
              stroke={priceChange >= 0 ? '#48BB78' : '#F56565'}
              strokeWidth="2"
              className="drop-shadow-lg"
            />
          </svg>

          {/* Time indicator */}
          <div className="absolute bottom-2 right-2 bg-gray-800 bg-opacity-50 px-2 py-1 rounded text-sm">
            {Math.floor((Date.now() - memecoin.launchTime) / 1000)}s
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="pixel-box bg-gray-700 p-3 rounded">
            <div className="text-sm text-gray-400 mb-1">Initial Dev Buy</div>
            <div className="font-mono font-bold">{initialDevBuy.toFixed(2)} SOL</div>
          </div>
          <div className="pixel-box bg-gray-700 p-3 rounded">
            <div className="text-sm text-gray-400 mb-1">Current Value</div>
            <div className="font-mono font-bold">{currentValue.toFixed(2)} SOL</div>
          </div>
          <div className="pixel-box bg-gray-700 p-3 rounded">
            <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
              <Users className="w-4 h-4" />
              Holders
            </div>
            <div className="font-mono font-bold">{memecoin.holders.toLocaleString()}</div>
          </div>
        </div>

        {/* Rug Pull Button */}
        {memecoin.isRugPull && (
          <button
            onClick={onRug}
            className="w-full pixel-box bg-[#ff0066] hover:bg-[#ff1a75] text-white px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors"
          >
            <Skull className="w-4 h-4" />
            Execute Rug Pull
          </button>
        )}
      </div>
    </div>
  );
};