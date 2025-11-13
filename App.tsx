import React, { useState } from 'react';
import AIAssistantPanel from './components/AIAssistantPanel';
import MainPanel from './components/MainPanel';
import StatusBar from './components/StatusBar';
import ActivityBar from './components/ActivityBar';
import Sidebar from './components/Sidebar';
import BottomPanel from './components/BottomPanel';
import { Plugin, ChatMessage, LogEntry, AgentTask, Tab } from './types';
import { INITIAL_PLUGINS, INITIAL_CHAT, INITIAL_LOGS, INITIAL_TABS } from './constants';
import { createAgentPlan } from './services/agentService';

const App: React.FC = () => {
  const [plugins, setPlugins] = useState<Plugin[]>(INITIAL_PLUGINS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [systemLogs, setSystemLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  
  const [activeView, setActiveView] = useState('plugins');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [openTabs, setOpenTabs] = useState<Tab[]>(INITIAL_TABS);
  const [activeTabId, setActiveTabId] = useState<string>(INITIAL_TABS[0].id);
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(false);

  const handleActivityBarClick = (view: string) => {
    if (activeView === view && isSidebarOpen) {
      setIsSidebarOpen(false);
    } else {
      setActiveView(view);
      setIsSidebarOpen(true);
    }
  };

  const addLog = (log: Omit<LogEntry, 'id' | 'timestamp'>) => {
    setSystemLogs(prev => [...prev, {
      ...log,
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString(),
    }]);
  };

  const addChatMessage = (message: Omit<ChatMessage, 'id'>) => {
    setChatMessages(prev => [...prev, {
      ...message,
      id: `chat-${Date.now()}-${Math.random()}`,
    }]);
  };

  const handleSelectPlugin = (plugin: Plugin) => {
    const tabId = `tab-plugin-${plugin.id}`;
    const existingTab = openTabs.find(tab => tab.id === tabId);
    if (!existingTab) {
        const newTab: Tab = {
            id: tabId,
            title: plugin.name,
            type: 'plugin',
            pluginId: plugin.id,
            icon: plugin.icon,
        }
        setOpenTabs(prev => [...prev, newTab]);
    }
    setActiveTabId(tabId);
  };

  const handleCloseTab = (tabId: string) => {
    const tabIndex = openTabs.findIndex(tab => tab.id === tabId);
    const newTabs = openTabs.filter(tab => tab.id !== tabId);
    setOpenTabs(newTabs);

    if (activeTabId === tabId) {
        if (newTabs.length > 0) {
            const newActiveIndex = Math.max(0, tabIndex - 1);
            setActiveTabId(newTabs[newActiveIndex].id);
        } else {
            setActiveTabId('');
        }
    }
  };

  const handleSendMessage = async (message: string) => {
    addChatMessage({ sender: 'user', text: message });
    setIsThinking(true);
    setTasks([]);
    setIsBottomPanelOpen(true);
    addLog({ text: `User request received: "${message}"`, status: 'info' });
    addLog({ text: "Contacting AI agent...", status: 'info' });

    const fullChatHistory: ChatMessage[] = [...chatMessages, { id: `temp-${Date.now()}`, sender: 'user', text: message }];
    const response = await createAgentPlan(fullChatHistory, plugins);

    if (!response) {
      const replyText = "I'm sorry, I encountered an error and couldn't process your request. Please try rephrasing, or check the system logs for more details.";
      addLog({ text: "Agent failed to generate a valid response.", status: 'error' });
      addChatMessage({ sender: 'agent', text: replyText });
      setIsThinking(false);
      return;
    }

    if (response.action === 'CHAT') {
        addLog({ text: "Agent responded in CHAT mode.", status: 'info' });
        addChatMessage({ sender: 'agent', text: response.chatReply || "I'm not sure how to respond to that." });
        setIsThinking(false);
        return;
    }

    if (response.action === 'BUILD' && response.plan) {
      const plan = response.plan;
      addLog({ text: "Agent responded in BUILD mode. Plan received successfully.", status: 'success' });
      addChatMessage({ sender: 'agent', text: plan.initialChatReply });

      const initialTasks: AgentTask[] = plan.tasks.map((task, index) => ({
        ...task,
        id: `task-${Date.now()}-${index}`,
        status: 'pending',
      }));
      setTasks(initialTasks);

      for (let i = 0; i < initialTasks.length; i++) {
        const currentTaskId = initialTasks[i].id;
        
        setTasks(prev => prev.map(t => t.id === currentTaskId ? { ...t, status: 'in-progress' } : t));
        await new Promise(res => setTimeout(res, 300));

        const logsForCurrentTask = plan.logsForTasks[i] || [];
        for (const log of logsForCurrentTask) {
          addLog(log);
          await new Promise(res => setTimeout(res, 200 + Math.random() * 200));
        }

        setTasks(prev => prev.map(t => t.id === currentTaskId ? { ...t, status: 'completed' } : t));
        await new Promise(res => setTimeout(res, 300));
      }

      if (plan.newPlugin) {
        setPlugins(prev => [...prev, plan.newPlugin!]);
        if (plan.newPlugin.generatedCode) {
          addChatMessage({
            sender: 'agent',
            text: `Here is the source code for the new '${plan.newPlugin.name}' plugin. I've opened its detail page for you.`,
            code: {
              language: 'tsx',
              content: plan.newPlugin.generatedCode,
            }
          });
        }
        handleSelectPlugin(plan.newPlugin);
      }
      
      addChatMessage({ sender: 'agent', text: plan.finalChatReply });
      
      setTimeout(() => {
          setTasks([]);
          setIsThinking(false);
      }, 2500);
      return;
    }

    // Fallback for unexpected response structure
    const fallbackText = "I seem to have gotten confused. Could you try rephrasing your request?";
    addLog({ text: "Agent response was invalid.", status: 'error' });
    addChatMessage({ sender: 'agent', text: fallbackText });
    setIsThinking(false);
  };

  const agentStatus = isThinking ? 'Agent is working...' : tasks.length > 0 ? 'Task completed' : 'Agent is idle';

  return (
    <div className="flex h-screen bg-slate-800 text-white overflow-hidden">
      <ActivityBar activeView={activeView} onSetActiveView={handleActivityBarClick} />
      {isSidebarOpen && <Sidebar activeView={activeView} plugins={plugins} onSelectPlugin={handleSelectPlugin} />}
      <div className="flex flex-col flex-1 min-w-0"> {/* min-w-0 is crucial for flexbox to allow shrinking */}
        <MainPanel
          tabs={openTabs}
          activeTabId={activeTabId}
          plugins={plugins}
          onTabClick={setActiveTabId}
          onTabClose={handleCloseTab}
          onQuickAction={handleSendMessage}
        />
        <BottomPanel isOpen={isBottomPanelOpen} tasks={tasks} logs={systemLogs} />
        <StatusBar agentStatus={agentStatus} onTogglePanel={() => setIsBottomPanelOpen(!isBottomPanelOpen)} />
      </div>
      <AIAssistantPanel messages={chatMessages} onSendMessage={handleSendMessage} isThinking={isThinking} />
    </div>
  );
};

export default App;
