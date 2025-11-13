import React from 'react';
import { Tab, Plugin } from '../types';
import { getIcon } from './icons';
import PluginView from './PluginView';
import WelcomeTab from './WelcomeTab';

interface MainPanelProps {
  tabs: Tab[];
  activeTabId: string;
  plugins: Plugin[];
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onQuickAction: (prompt: string) => void;
}

const MainPanel: React.FC<MainPanelProps> = ({ tabs, activeTabId, plugins, onTabClick, onTabClose, onQuickAction }) => {
  const activeTab = tabs.find(tab => tab.id === activeTabId);

  return (
    <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
      {/* Tabs Header */}
      <div className="flex-shrink-0 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center overflow-x-auto">
          {tabs.map(tab => {
            const Icon = getIcon(tab.icon);
            return (
              <div
                key={tab.id}
                onClick={() => onTabClick(tab.id)}
                className={`flex items-center p-2 px-4 cursor-pointer border-r border-slate-700 flex-shrink-0 whitespace-nowrap ${
                  activeTabId === tab.id ? 'bg-slate-900 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm truncate">{tab.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabClose(tab.id);
                  }}
                  className="ml-4 text-slate-500 hover:text-white flex-shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab?.type === 'welcome' && <WelcomeTab onQuickAction={onQuickAction} />}
        {activeTab?.type === 'plugin' && (
          <PluginView plugin={plugins.find(p => p.id === activeTab.pluginId) ?? null} />
        )}
        {!activeTab && (
             <div className="flex items-center justify-center h-full">
                <p className="text-slate-500">No active tab. Select a plugin from the sidebar to view its details.</p>
             </div>
        )}
      </div>
    </div>
  );
};

export default MainPanel;