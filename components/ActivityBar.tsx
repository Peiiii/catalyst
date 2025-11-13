import React from 'react';
import { CodeBracketSquareIcon, ChatBubbleLeftRightIcon } from './icons';

interface ActivityBarProps {
    activeView: string;
    onSetActiveView: (view: string) => void;
}

const ActivityBar: React.FC<ActivityBarProps> = ({ activeView, onSetActiveView }) => {
    const views = [
        { id: 'plugins', name: 'Plugins', icon: CodeBracketSquareIcon },
    ];

    return (
        <div className="w-12 bg-slate-900 border-r border-slate-700 flex flex-col items-center py-4 space-y-4 flex-shrink-0">
            {views.map(view => (
                <button
                    key={view.id}
                    title={view.name}
                    onClick={() => onSetActiveView(view.id)}
                    className={`p-2 rounded-md transition-colors ${
                        activeView === view.id
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                    }`}
                >
                    <view.icon className="w-6 h-6" />
                </button>
            ))}
        </div>
    );
};

export default ActivityBar;