import React, { useState, useMemo, Component, ErrorInfo, ReactNode } from 'react';
import { Plugin } from '../types';
import { getIcon } from './icons';

// --- ErrorBoundary Component (merged) ---
interface EBProps {
  children: ReactNode;
}
interface EBState {
  hasError: boolean;
  error: Error | null;
}
class ErrorBoundary extends Component<EBProps, EBState> {
  public state: EBState;

  constructor(props: EBProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  public static getDerivedStateFromError(error: Error): EBState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in generated component:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-md">
          <h3 className="font-bold mb-2">Plugin Runtime Error</h3>
          <p className="text-sm mb-2">There was an error rendering this plugin's component.</p>
          <pre className="text-xs bg-slate-900 p-2 rounded overflow-x-auto">
            <code>{this.state.error?.toString()}</code>
          </pre>
        </div>
      );
    }
    // Fix: Using constructor for state initialization to resolve issue where this.props was not recognized.
    return this.props.children;
  }
}

// --- PluginRuntime Component (merged) ---
const PluginRuntime: React.FC<{ code?: string }> = ({ code }) => {
  const Component = useMemo(() => {
    if (!code) return null;
    try {
      const componentNameMatch = code.match(/const\s+([A-Z][a-zA-Z0-9]+)\s*=/);
      if (!componentNameMatch || !componentNameMatch[1]) {
        throw new Error("Could not find a valid component name. Expected format: 'const ComponentName = ...'");
      }
      const componentName = componentNameMatch[1];
      const factory = new Function('React', `${code}; return ${componentName};`);
      return factory(React);
    } catch (e: any) {
      console.error("Error creating component from code:", e);
      return () => (
        <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-md">
          <h3 className="font-bold mb-2">Plugin Compilation Error</h3>
          <p className="text-sm mb-2">The generated code could not be compiled into a component.</p>
          <pre className="text-xs bg-slate-900 p-2 rounded overflow-x-auto">
            <code>{e.message}</code>
          </pre>
        </div>
      );
    }
  }, [code]);

  if (!Component) {
    return <div className="text-slate-500">No source code available to render.</div>;
  }

  return (
    <ErrorBoundary>
      <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
        <Component />
      </div>
    </ErrorBoundary>
  );
};

// --- CodeBlock Component ---
const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
    <div className="bg-slate-800/50 rounded-md mt-2 border border-slate-700">
        <pre className="p-4 text-xs text-slate-300 overflow-x-auto">
            <code>{code}</code>
        </pre>
    </div>
);

// --- Main PluginView ---
interface PluginViewProps {
  plugin: Plugin | null;
}

const PluginView: React.FC<PluginViewProps> = ({ plugin }) => {
  const [activeTab, setActiveTab] = useState<'runtime' | 'details' | 'api' | 'code'>('runtime');

  if (!plugin) {
    return <div className="text-slate-500">Plugin not found.</div>;
  }
  
  const Icon = getIcon(plugin.icon);

  return (
    <div className="w-full max-w-4xl mx-auto">
        <header className="p-4 flex items-center justify-between border-b border-slate-700 mb-6">
            <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${plugin.color}`}>
                    <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-100">{plugin.name}</h2>
                    <p className="text-slate-400">{plugin.description}</p>
                </div>
            </div>
        </header>

        <div className="border-b border-slate-700 mb-6">
            <nav className="flex space-x-4 -mb-px">
                <button onClick={() => setActiveTab('runtime')} className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'runtime' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'}`}>Runtime</button>
                <button onClick={() => setActiveTab('details')} className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'details' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'}`}>Details</button>
                <button onClick={() => setActiveTab('api')} className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'api' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'}`}>API</button>
                <button onClick={() => setActiveTab('code')} className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'code' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'}`}>Source Code</button>
            </nav>
        </div>

        <div>
            {activeTab === 'runtime' && (
                 <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">Live Preview</h3>
                    <PluginRuntime code={plugin.generatedCode} />
                </div>
            )}
            {activeTab === 'details' && (
                <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">Plugin Details</h3>
                    <p className="text-slate-400">This section would contain detailed documentation, usage examples, and version history for the <strong>{plugin.name}</strong> plugin.</p>
                </div>
            )}
            {activeTab === 'api' && (
                <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">API Endpoints</h3>
                    {plugin.apiEndpoints && plugin.apiEndpoints.length > 0 ? (
                        <ul className="space-y-3">
                            {plugin.apiEndpoints.map((endpoint, i) => (
                                <li key={i} className="font-mono text-sm bg-slate-800/50 p-3 rounded-md border border-slate-700">
                                    <span className="font-bold text-sky-400 mr-4">{endpoint.path.split(' ')[0]}</span>
                                    <span className="text-slate-300">{endpoint.path.split(' ').length > 1 ? endpoint.path.split(' ')[1] : ''}</span>
                                    <p className="text-slate-400 text-xs mt-1 pl-1 font-sans">{endpoint.description}</p>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-slate-500">No API endpoints defined for this plugin.</p>}
                </div>
            )}
            {activeTab === 'code' && (
                <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">Generated Source Code</h3>
                    {plugin.generatedCode ? <CodeBlock code={plugin.generatedCode} /> : <p className="text-slate-500">No source code available for this plugin.</p>}
                </div>
            )}
        </div>
    </div>
  );
};

export default PluginView;