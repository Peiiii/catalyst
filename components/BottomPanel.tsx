import React, { useState } from 'react';
import { AgentTask, LogEntry } from '../types';
import AgentStatusPanel from './AgentStatusPanel';
import SystemLog from './SystemLog';

interface BottomPanelProps {
    isOpen: boolean;
    tasks: AgentTask[];
    logs: LogEntry[];
}

const BottomPanel: React.FC<BottomPanelProps> = ({ isOpen, tasks, logs }) => {
    const [activeTab, setActiveTab] = useState('agent');

    if (!isOpen) {
        return null;
    }

    return (
        <div className="h-48 bg-slate-800 border-t border-slate-700 flex flex-col flex-shrink-0">
            <div className="flex-shrink-0 border-b border-slate-700">
                <nav className="flex space-x-2 px-2">
                    <button onClick={() => setActiveTab('agent')} className={`py-1 px-2 font-medium text-xs transition-colors ${activeTab === 'agent' ? 'border-b-2 border-cyan-400 text-slate-100' : 'text-slate-400 hover:text-slate-200'}`}>Agent Plan</button>
                    <button onClick={() => setActiveTab('logs')} className={`py-1 px-2 font-medium text-xs transition-colors ${activeTab === 'logs' ? 'border-b-2 border-cyan-400 text-slate-100' : 'text-slate-400 hover:text-slate-200'}`}>System Log</button>
                </nav>
            </div>
            <div className="flex-1 overflow-hidden">
                {activeTab === 'agent' && <AgentStatusPanel tasks={tasks} />}
                {activeTab === 'logs' && <SystemLog logs={logs} />}
            </div>
        </div>
    );
};

export default BottomPanel;
