
import React from 'react';
import { Plugin } from '../types';
import { getIcon, CodeBracketSquareIcon } from './icons';

interface ActivityBarProps {
    activeView: string;
    onSetActiveView: (view: string) => void;
    plugins: Plugin[];
}

const ActivityBar: React.FC<ActivityBarProps> = ({ activeView, onSetActiveView, plugins }) => {
    const defaultViews = [
        { id: 'plugins', name: 'Plugins', icon: CodeBracketSquareIcon },
    ];

    const customViews = plugins
        .filter(p => p.customView)
        .map(p => ({
            id: p.customView!.id,
            name: p.customView!.name,
            icon: getIcon(p.customView!.icon),
        }));

    const allViews = [...defaultViews, ...customViews];

    return (
        <div className="w-12 bg-slate-900 border-r border-slate-700 flex flex-col items-center py-4 space-y-4 flex-shrink-0">
            {allViews.map(view => {
                const Icon = view.icon;
                return (
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
                        <Icon className="w-6 h-6" />
                    </button>
                )
            })}
        </div>
    );
};

export default ActivityBar;