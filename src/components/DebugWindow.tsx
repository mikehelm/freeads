import React, { useState, useEffect } from 'react';
import { logger } from '../utils/logger';

interface DebugMessage {
  timestamp: string;
  level: string;
  message: string;
  data?: any;
}

interface Props {
  isVisible?: boolean;
}

export function DebugWindow({ isVisible = false }: Props) {
  const [messages, setMessages] = useState<DebugMessage[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleLog = (level: string, message: string, data?: any) => {
      setMessages(prev => [
        {
          timestamp: new Date().toISOString(),
          level,
          message,
          data
        },
        ...prev.slice(0, 99) // Keep last 100 messages
      ]);
    };

    // Subscribe to logger events
    logger.subscribe(handleLog);

    return () => {
      // Cleanup subscription
      logger.unsubscribe(handleLog);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 right-0 w-96 bg-gray-900 text-white opacity-90 transition-all duration-300 ease-in-out"
         style={{ height: isExpanded ? '400px' : '32px' }}>
      <div className="flex items-center justify-between p-1 bg-gray-800 cursor-pointer"
           onClick={() => setIsExpanded(!isExpanded)}>
        <span className="text-sm font-mono">Debug Console {messages.length > 0 ? `(${messages.length})` : ''}</span>
        <button className="px-2 hover:bg-gray-700 rounded">
          {isExpanded ? '▼' : '▲'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="overflow-auto p-2 h-[calc(100%-32px)] font-mono text-xs">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-1 ${
              msg.level === 'error' ? 'text-red-400' :
              msg.level === 'warn' ? 'text-yellow-400' :
              'text-green-400'
            }`}>
              <span className="text-gray-400">{msg.timestamp.split('T')[1].split('.')[0]}</span>
              {' '}
              <span className="uppercase">[{msg.level}]</span>
              {' '}
              {msg.message}
              {msg.data && (
                <pre className="ml-4 text-gray-400 whitespace-pre-wrap">
                  {JSON.stringify(msg.data, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
