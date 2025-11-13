
export interface Plugin {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  generatedCode?: string;
  apiEndpoints?: { path: string; description: string; }[];
  customView?: {
    id: string;
    name: string;
    icon: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  code?: { language: string; content: string };
}

export interface LogEntry {
  id: string;
  timestamp: string;
  text: string;
  status: 'info' | 'success' | 'warning' | 'error';
}

export interface AgentTask {
  id: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
}

export interface AgentPlan {
  initialChatReply: string;
  tasks: Omit<AgentTask, 'id' | 'status'>[];
  logsForTasks: Omit<LogEntry, 'id' | 'timestamp'>[][];
  finalChatReply: string;
  newPlugin?: Plugin;
}

export interface AgentResponse {
  action: 'BUILD' | 'CHAT';
  chatReply?: string; // Used for CHAT action
  plan?: AgentPlan;    // Used for BUILD action
}


export interface Tab {
  id: string;
  title: string;
  type: 'plugin' | 'welcome';
  pluginId?: string;
  icon: string;
}