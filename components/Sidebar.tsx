import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Plugin } from '../types';
import { getIcon } from './icons';

// --- Runtime to execute plugin code ---
const PluginRuntime: React.FC<{ code?: string }> = ({ code }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.innerHTML = '';

    if (!code) {
      container.innerHTML = '<p class="text-slate-500 p-4 text-sm">No UI to render for this view.</p>';
      return;
    }

    try {
      const renderer = eval(code);
      if (typeof renderer === 'function') {
        renderer(container);
      } else {
        throw new Error('Generated code is not a function.');
      }
    } catch (e: any) {
      console.error("Error executing sidebar plugin code:", e);
      container.innerHTML = `
        <div class="p-2 m-2 bg-red-900/20 border border-red-500 text-red-300 rounded-md text-xs">
          <p class="font-bold mb-1">Runtime Error</p>
          <pre class="text-xs bg-slate-900 p-1 rounded overflow-x-auto whitespace-pre-wrap"><code>${e.message}</code></pre>
        </div>
      `;
    }
  }, [code]);

  return <div ref={containerRef} className="w-full h-full" />;
};


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
  
  const activeCustomViewPlugin = useMemo(() => {
    if (activeView === 'plugins') return null;
    return plugins.find(p => p.customView?.id === activeView);
  }, [activeView, plugins]);

  if (!activeView) return null;

  const filteredPlugins = plugins.filter(plugin =>
    plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plugin.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col flex-shrink-0">
      {activeView === 'plugins' && (
        <div className="flex flex-col h-full overflow-hidden">
          <div className="p-2 flex-shrink-0">
            <input
              type="text"
              placeholder="Search Plugins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-700/50 p-2 rounded-md text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="flex-grow overflow-y-auto mt-2 p-2">
            <h2 className="text-xs font-bold uppercase text-slate-500 px-2 pb-1">Installed</h2>
            <ul>
              {filteredPlugins.map(plugin => (
                  <PluginListItem key={plugin.id} plugin={plugin} onSelect={() => onSelectPlugin(plugin)} />
              ))}
            </ul>
          </div>
        </div>
      )}
       {activeCustomViewPlugin && (
        <div className="flex flex-col h-full overflow-hidden">
            <h2 className="text-md font-bold text-slate-200 p-2 flex-shrink-0 border-b border-slate-700">{activeCustomViewPlugin.customView?.name}</h2>
            <div className="flex-grow overflow-y-auto">
                <PluginRuntime code={activeCustomViewPlugin.generatedCode} />
            </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;