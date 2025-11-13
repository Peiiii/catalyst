import { Plugin, ChatMessage, LogEntry, Tab } from './types';

export const INITIAL_PLUGINS: Plugin[] = [
  {
    id: 'plugin-0',
    name: 'Plugin Registry',
    icon: 'RegistryIcon',
    description: 'Manages and exposes all installed plugins and their APIs.',
    color: 'bg-sky-500',
  },
  {
    id: 'plugin-1',
    name: 'Communication Bus',
    icon: 'BusIcon',
    description: 'Provides a secure way for plugins to communicate with each other.',
    color: 'bg-indigo-500',
  },
];

export const INITIAL_CHAT: ChatMessage[] = [
    {
        id: 'chat-1',
        sender: 'agent',
        text: "Welcome to your new application. I am your AI assistant. Tell me what you want to build, and I will create it for you, one plugin at a time. What's our first feature?"
    }
];

export const INITIAL_LOGS: LogEntry[] = [
    {
        id: 'log-1',
        timestamp: new Date().toLocaleTimeString(),
        text: 'System initialized. Awaiting user input.',
        status: 'success'
    }
];

export const INITIAL_TABS: Tab[] = [
    {
        id: 'tab-welcome',
        title: 'Welcome',
        type: 'welcome',
        icon: 'BeakerIcon',
    }
];
