import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

interface LogEntry {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'meme';
  timestamp: number;
}

interface Props {
  entries: LogEntry[];
}

export const GameConsole: React.FC<Props> = ({ entries }) => {
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [entries]);

  const getEntryColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return 'text-[#00ff00]';
      case 'warning':
        return 'text-[#ffff00]';
      case 'error':
        return 'text-[#ff0066]';
      case 'meme':
        return 'text-[#ff00ff]';
      default:
        return 'text-[#66ff66]';
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };

  return (
    <div className="pixel-box bg-[#0a0a16] p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Terminal className="w-4 h-4 text-[#00ff00]" />
        <h3 className="text-sm font-bold text-[#00ff00]">CONSOLE</h3>
      </div>
      
      <div 
        ref={consoleRef}
        className="h-32 overflow-y-auto font-mono text-sm space-y-1 custom-scrollbar"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,255,0,0.05), rgba(0,255,0,0.02))'
        }}
      >
        {entries.map((entry, index) => (
          <div 
            key={`${entry.id}-${entry.timestamp}-${index}`}
            className={`${getEntryColor(entry.type)} opacity-80 hover:opacity-100 transition-opacity`}
          >
            <span className="text-[#4d4dff]">[{formatTime(entry.timestamp)}]</span>{' '}
            {entry.message}
          </div>
        ))}
      </div>
    </div>
  );
};