import React from 'react';
import { Plugin } from '../types';
import { getIcon } from './icons';

interface SidebarProps {
  activeView: string;
  plugins: Plugin[];
  onSelectPlugin: (plugin: Plugin) => void;
}

const PluginListItem: React.FC<{plugin: Plugin, onSelect: () => void}> = ({ plugin, onSelect }) => {
    const Icon = getIcon(plugin.icon);
    return (
        <li
            onClick={onSelect}
            className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-700 cursor-pointer transition-colors"
        >
            <Icon className="w-5 h-5 text-slate-400" />
            <span className="text-sm text-slate-200">{plugin.name}</span>
        </li>
    )
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, plugins, onSelectPlugin }) => {
  if (!activeView) return null;

  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 p-2 flex-shrink-0">
      {activeView === 'plugins' && (
        <div>
          <h2 className="text-xs font-bold uppercase text-slate-500 p-2">Plugins</h2>
          <ul>
            {plugins.map(plugin => (
                <PluginListItem key={plugin.id} plugin={plugin} onSelect={() => onSelectPlugin(plugin)} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;