import React, { useState } from 'react';
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
            className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-700/50 cursor-pointer transition-colors"
        >
            <Icon className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <div className="overflow-hidden">
              <p className="text-sm text-slate-200 truncate">{plugin.name}</p>
              <p className="text-xs text-slate-500 truncate">{plugin.description}</p>
            </div>
        </li>
    )
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, plugins, onSelectPlugin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  if (!activeView) return null;

  const filteredPlugins = plugins.filter(plugin =>
    plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plugin.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 p-2 flex flex-col flex-shrink-0">
      {activeView === 'plugins' && (
        <>
          <div className="p-2 flex-shrink-0">
            <input
              type="text"
              placeholder="Search Plugins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-700/50 p-2 rounded-md text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="flex-grow overflow-y-auto mt-2">
            <h2 className="text-xs font-bold uppercase text-slate-500 p-2">Installed</h2>
            <ul>
              {filteredPlugins.map(plugin => (
                  <PluginListItem key={plugin.id} plugin={plugin} onSelect={() => onSelectPlugin(plugin)} />
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
