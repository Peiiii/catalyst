import React from 'react';
import { AgentTask } from '../types';
import { CheckCircleIcon, SpinnerIcon, PendingCircleIcon, ErrorIcon } from './icons';

interface AgentStatusPanelProps {
  tasks: AgentTask[];
}

const StatusIcon: React.FC<{ status: AgentTask['status'] }> = ({ status }) => {
  switch (status) {
    case 'completed':
      return <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0" />;
    case 'in-progress':
      return <SpinnerIcon className="w-5 h-5 text-sky-400 animate-spin flex-shrink-0" />;
    case 'error':
      return <ErrorIcon className="w-5 h-5 text-red-400 flex-shrink-0" />;
    case 'pending':
    default:
      return <PendingCircleIcon className="w-5 h-5 text-slate-500 flex-shrink-0" />;
  }
};

const AgentStatusPanel: React.FC<AgentStatusPanelProps> = ({ tasks }) => {
  return (
    <div className="flex-1 bg-slate-900 flex flex-col h-full">
      <h2 className="text-sm font-semibold p-2 border-b border-slate-700 text-slate-300 flex-shrink-0">
        Agent Execution Plan
      </h2>
      <div className="flex-1 p-3 overflow-y-auto font-sans text-sm">
        {tasks.length > 0 ? (
          <ul>
            {tasks.map(task => (
              <li
                key={task.id}
                className={`flex items-center space-x-3 mb-2 transition-all duration-300 ${
                  task.status === 'pending' ? 'text-slate-500' : 'text-slate-200'
                }`}
              >
                <StatusIcon status={task.status} />
                <span>{task.description}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500 text-xs">
            No active agent tasks.
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentStatusPanel;
