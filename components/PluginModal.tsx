import React, { useState } from 'react';
import { Plugin } from '../types';
import { getIcon } from './icons';

interface PluginModalProps {
  plugin: Plugin | null;
  onClose: () => void;
}

const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
    return (
        <div className="bg-slate-900 rounded-md mt-2">
            <pre className="p-4 text-xs text-slate-300 overflow-x-auto">
                <code>{code}</code>
            </pre>
        </div>
    )
}

const PluginModal: React.FC<PluginModalProps> = ({ plugin, onClose }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'api' | 'code'>('details');

  if (!plugin) {
    return null;
  }
  
  const Icon = getIcon(plugin.icon);

  // Reset tab to details when a new plugin is selected
  React.useEffect(() => {
    setActiveTab('details');
  }, [plugin]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl border border-slate-700 flex flex-col max-h-full" onClick={(e) => e.stopPropagation()}>
        <header className="p-4 flex items-center justify-between border-b border-slate-700 flex-shrink-0">
            <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-md ${plugin.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-100">{plugin.name}</h2>
            </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        
        <main className="p-6 flex-grow overflow-y-auto">
          <div className="border-b border-slate-700 mb-4">
            <nav className="flex space-x-4 -mb-px">
                <button onClick={() => setActiveTab('details')} className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'details' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'}`}>Details</button>
                <button onClick={() => setActiveTab('api')} className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'api' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'}`}>API</button>
                <button onClick={() => setActiveTab('code')} className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'code' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'}`}>Source Code</button>
            </nav>
          </div>

          <div>
            {activeTab === 'details' && (
                <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">Description</h3>
                    <p className="text-slate-400">{plugin.description}</p>
                </div>
            )}
            {activeTab === 'api' && (
                <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">API Endpoints</h3>
                    {plugin.apiEndpoints && plugin.apiEndpoints.length > 0 ? (
                        <ul className="space-y-3">
                            {plugin.apiEndpoints.map((endpoint, i) => (
                                <li key={i} className="font-mono text-sm bg-slate-700/50 p-3 rounded-md">
                                    <span className="font-bold text-sky-400 mr-4">{endpoint.path.split(' ')[0]}</span>
                                    <span className="text-slate-300">{endpoint.path.split(' ').length > 1 ? endpoint.path.split(' ')[1] : ''}</span>
                                    <p className="text-slate-400 text-xs mt-1 pl-1">{endpoint.description}</p>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-slate-500">No API endpoints defined for this plugin.</p>}
                </div>
            )}
            {activeTab === 'code' && (
                <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">Generated Source Code</h3>
                    {plugin.generatedCode ? (
                        <CodeBlock code={plugin.generatedCode} />
                    ) : <p className="text-slate-500">No source code available for this plugin.</p>}
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PluginModal;