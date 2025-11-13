import React from 'react';
import { SpinnerIcon } from './icons';

interface StatusBarProps {
    agentStatus: string;
    onTogglePanel: () => void;
}

const StatusBar: React.FC<StatusBarProps> = ({ agentStatus, onTogglePanel }) => {
    return (
        <div className="h-6 bg-slate-700 border-t border-slate-600 flex items-center justify-between px-4 text-xs text-slate-400 flex-shrink-0">
           <button onClick={onTogglePanel} className="flex items-center space-x-2 hover:bg-slate-600/50 rounded px-2">
                {agentStatus.includes('working') && <SpinnerIcon className="w-3 h-3 animate-spin" />}
                <span>{agentStatus}</span>
           </button>
           <div className="flex items-center space-x-4">
            <span>Spaces: 2</span>
            <span>UTF-8</span>
            <span>v1.0.0</span>
           </div>
        </div>
    );
};

export default StatusBar;
