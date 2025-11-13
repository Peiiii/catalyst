
import React from 'react';
import { Plugin } from '../types';
import PluginCard from './PluginCard';

interface CanvasPanelProps {
  plugins: Plugin[];
  onPluginClick: (plugin: Plugin) => void;
}

const CanvasPanel: React.FC<CanvasPanelProps> = ({ plugins, onPluginClick }) => {
  return (
    <div className="flex-1 bg-slate-900/50 p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">Application Canvas</h2>
      {plugins.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plugins.map((plugin) => (
            <PluginCard key={plugin.id} plugin={plugin} onClick={() => onPluginClick(plugin)} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-slate-500">The canvas is empty. Ask the agent to build something!</p>
        </div>
      )}
    </div>
  );
};

export default CanvasPanel;