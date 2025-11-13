import React, { useRef, useEffect } from 'react';
import { LogEntry } from '../types';

interface SystemLogProps {
  logs: LogEntry[];
}

const statusClasses = {
  info: 'text-sky-400',
  success: 'text-green-400',
  warning: 'text-yellow-400',
  error: 'text-red-400',
};

const SystemLog: React.FC<SystemLogProps> = ({ logs }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);
  
  return (
    <div className="flex-1 bg-slate-900 flex flex-col h-full">
      <h2 className="text-sm font-semibold p-2 border-b border-slate-700 text-slate-300 flex-shrink-0">System Log</h2>
      <div ref={logContainerRef} className="flex-1 p-3 overflow-y-auto font-mono text-xs">
        {logs.map(log => (
            <div key={log.id} className="flex">
                <span className="text-slate-500 mr-3">{log.timestamp}</span>
                <span className={`${statusClasses[log.status]} mr-2`}>[{log.status.toUpperCase()}]</span>
                <span className="text-slate-400 flex-1">{log.text}</span>
            </div>
        ))}
      </div>
    </div>
  );
};

export default SystemLog;
