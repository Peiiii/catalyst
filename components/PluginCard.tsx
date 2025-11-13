
import React from 'react';
import { Plugin } from '../types';
import { getIcon } from './icons';

interface PluginCardProps {
  plugin: Plugin;
  onClick: () => void;
}

const PluginCard: React.FC<PluginCardProps> = ({ plugin, onClick }) => {
  const Icon = getIcon(plugin.icon);

  return (
    <div 
      className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col items-start shadow-lg hover:shadow-cyan-500/10 hover:border-cyan-500 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      <div className={`p-2 rounded-md ${plugin.color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold mt-3 text-slate-100">{plugin.name}</h3>
      <p className="text-sm text-slate-400 mt-1 flex-grow">{plugin.description}</p>
      <div className="mt-4 flex space-x-2">
        <button onClick={(e) => { e.stopPropagation(); onClick(); }} className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded-md transition-colors">API</button>
        <button onClick={(e) => { e.stopPropagation(); onClick(); }} className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded-md transition-colors">Docs</button>
      </div>
    </div>
  );
};

export default PluginCard;