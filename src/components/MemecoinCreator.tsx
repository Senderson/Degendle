import React, { useState } from 'react';
import { Coins, Rocket, Skull } from 'lucide-react';

interface Props {
  onClose: () => void;
  maxSize: number;
  onLaunch: (config: {
    name: string;
    trend: string;
    initialLiquidity: number;
    isRugPull: boolean;
    useBundler: boolean;
  }) => void;
  trendscopeActive?: boolean;
  sniperUnlocked: boolean;
}

const TRENDS = [
  { id: 'trump', name: 'Trump', description: 'Political memes are so hot right now' },
  { id: 'dog', name: 'Dog', description: 'Everyone loves cute dogs' },
  { id: 'cat', name: 'Cat', description: 'Meow meow to the moon' },
  { id: 'elon', name: 'Elon', description: 'Tesla CEO tweets move markets' },
] as const;

export const MemecoinCreator: React.FC<Props> = ({ onClose, maxSize, onLaunch, trendscopeActive, sniperUnlocked }) => {
  const [selectedTrend, setSelectedTrend] = useState<string | null>(null);
  const [tokenName, setTokenName] = useState('');
  const [initialLiquidity, setInitialLiquidity] = useState(maxSize * 0.1);
  const [useBundler, setUseBundler] = useState(false);
  const [step, setStep] = useState<'trend' | 'config' | 'confirm'>('trend');

  const handleLaunch = () => {
    if (!selectedTrend || !tokenName) return;

    onLaunch({
      name: tokenName,
      trend: selectedTrend,
      initialLiquidity,
      isRugPull: false,
      useBundler
    });
    onClose();
  };

  const renderTrendSelection = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold mb-4">Select Trend</h3>
      <div className="grid grid-cols-2 gap-4">
        {TRENDS.map((trend) => (
          <button
            key={trend.id}
            onClick={() => setSelectedTrend(trend.id)}
            className={`pixel-box p-4 rounded text-left transition-colors ${
              selectedTrend === trend.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <h4 className="font-bold mb-1">{trend.name}</h4>
            <p className="text-sm opacity-80">{trend.description}</p>
          </button>
        ))}
      </div>
      <button
        onClick={() => setStep('config')}
        disabled={!selectedTrend}
        className={`w-full pixel-box mt-4 py-2 px-4 rounded font-bold
          ${selectedTrend
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
      >
        Next
      </button>
    </div>
  );

  const renderConfig = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold mb-4">Configure Your Memecoin</h3>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-400">Token Name:</label>
          <input
            type="text"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            className="pixel-box bg-[#1a1a3a] text-white p-2 rounded"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-400">Initial Dev Buy:</label>
          <input
            type="number"
            value={initialLiquidity}
            onChange={(e) => setInitialLiquidity(Number(e.target.value))}
            className="pixel-box bg-[#1a1a3a] text-white p-2 rounded"
          />
        </div>
        {sniperUnlocked && (
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-400">Use Bundler Sniper:</label>
            <input
              type="checkbox"
              checked={useBundler}
              onChange={(e) => setUseBundler(e.target.checked)}
              className="pixel-box bg-[#1a1a3a] text-white p-2 rounded"
            />
          </div>
        )}
      </div>
      <button
        onClick={() => setStep('confirm')}
        className="w-full pixel-box bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-bold"
      >
        Confirm
      </button>
    </div>
  );

  const renderConfirm = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold mb-4">Confirm Launch</h3>
      
      <div className="pixel-box bg-gray-700 p-4 rounded space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-400">Token Name:</span>
          <span className="font-bold">{tokenName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Trend:</span>
          <span className="font-bold">{TRENDS.find(t => t.id === selectedTrend)?.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Dev Wallet Buy:</span>
          <span className="font-bold">{initialLiquidity.toFixed(2)} SOL</span>
        </div>
      </div>

      {initialLiquidity > 1.5 && (
        <div className="bg-red-900 bg-opacity-50 p-2 rounded text-center text-red-300">
          Warning: Dev Wallet Buy above 1.5 SOL will result in a loss; no one will buy your memecoin!
        </div>
      )}
      
      <div className="flex gap-2">
        <button
          onClick={() => setStep('config')}
          className="flex-1 pixel-box bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded font-bold"
        >
          Back
        </button>
        <button
          onClick={handleLaunch}
          disabled={initialLiquidity > 1.5}
          className={`flex-1 pixel-box py-2 px-4 rounded font-bold flex items-center justify-center gap-2 ${
            initialLiquidity > 1.5
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <Rocket className="w-4 h-4" />
          Fair Launch
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 p-6 rounded-lg pixel-borders max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Coins className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold">Create Memecoin</h2>
          </div>
        </div>
        {trendscopeActive && selectedTrend && (
          <div className="mb-4 text-center text-lg text-blue-400">
            Trend Revealed: {TRENDS.find(trend => trend.id === selectedTrend)?.name}
          </div>
        )}

        {step === 'trend' && renderTrendSelection()}
        {step === 'config' && renderConfig()}
        {step === 'confirm' && renderConfirm()}
      </div>
    </div>
  );
};