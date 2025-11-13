import { Plugin, ChatMessage, LogEntry, Tab } from './types';

const TODO_PLUGIN_CODE = `
// This is a self-contained function that renders a to-do list into a container element.
(container) => {
  // --- STATE ---
  let tasks = [
    { id: 1, text: 'Analyze user feedback', completed: true },
    { id: 2, text: 'Design new plugin architecture', completed: false },
    { id: 3, text: 'Implement real-time component rendering', completed: false },
  ];

  // --- STYLES ---
  const styles = {
    container: \`font-family: sans-serif; color: #E2E8F0; padding: 16px; height: 100%; display: flex; flex-direction: column; background-color: #1E293B;\`,
    form: \`display: flex; margin-bottom: 16px;\`,
    input: \`flex-grow: 1; padding: 8px; border: 1px solid #475569; border-radius: 4px 0 0 4px; background-color: #334155; color: #E2E8F0; outline: none; font-size: 14px;\`,
    button: \`padding: 8px 12px; border: 1px solid #38BDF8; background-color: #38BDF8; color: #0F172A; border-radius: 0 4px 4px 0; cursor: pointer; font-weight: bold;\`,
    ul: \`list-style: none; padding: 0; margin: 0; overflow-y: auto; flex-grow: 1;\`,
    li: \`display: flex; align-items: center; padding: 12px; background-color: #334155; border-radius: 4px; margin-bottom: 8px;\`,
    checkbox: \`margin-right: 12px; cursor: pointer; width: 16px; height: 16px; accent-color: #38BDF8;\`,
    span: \`flex-grow: 1; font-size: 14px;\`,
    spanCompleted: \`text-decoration: line-through; color: #94A3B8;\`,
    deleteButton: \`background: none; border: none; color: #94A3B8; cursor: pointer; font-size: 18px; line-height: 1; padding: 0 4px;\`,
  };

  // --- RENDER LOGIC ---
  const render = () => {
    container.innerHTML = '';
    container.style.cssText = styles.container;

    const form = document.createElement('form');
    form.style.cssText = styles.form;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Add a new task...';
    input.style.cssText = styles.input;

    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = 'Add';
    button.style.cssText = styles.button;

    form.appendChild(input);
    form.appendChild(button);
    container.appendChild(form);

    const ul = document.createElement('ul');
    ul.style.cssText = styles.ul;
    
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.style.cssText = styles.li;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.style.cssText = styles.checkbox;
      checkbox.onchange = () => toggleTask(task.id);

      const span = document.createElement('span');
      span.textContent = task.text;
      span.style.cssText = styles.span + (task.completed ? styles.spanCompleted : '');

      const deleteBtn = document.createElement('button');
      deleteBtn.innerHTML = '&times;';
      deleteBtn.style.cssText = styles.deleteButton;
      deleteBtn.onclick = () => deleteTask(task.id);

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(deleteBtn);
      ul.appendChild(li);
    });

    container.appendChild(ul);

    form.onsubmit = (e) => {
      e.preventDefault();
      if (input.value.trim()) {
        addTask(input.value.trim());
        input.value = '';
      }
    };
  };

  // --- STATE MANIPULATION ---
  const addTask = (text) => {
    tasks.push({ id: Date.now(), text, completed: false });
    render();
  };

  const toggleTask = (id) => {
    tasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    render();
  };

  const deleteTask = (id) => {
    tasks = tasks.filter(task => task.id !== id);
    render();
  };

  // Initial render
  render();
};
`;

export const INITIAL_PLUGINS: Plugin[] = [
  {
    id: 'plugin-todo-list',
    name: 'To-Do List',
    icon: 'TaskIcon',
    description: 'A simple to-do list manager that runs in a custom sidebar view.',
    color: 'bg-sky-500',
    generatedCode: TODO_PLUGIN_CODE,
    apiEndpoints: [
      { path: 'GET /api/tasks', description: 'Retrieve the list of tasks.' },
      { path: 'POST /api/tasks', description: 'Create a new task.' }
    ],
    customView: {
      id: 'view-todo-list',
      name: 'To-Do List',
      icon: 'TaskIcon'
    }
  }
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'chat-1',
    sender: 'agent',
    text: "Welcome to Catalyst! I'm your AI assistant. I can build new plugins for this application based on your requests. What would you like to build first? You can also try the pre-installed 'To-Do List' plugin by clicking its icon on the far left.",
  }
];

export const INITIAL_LOGS: LogEntry[] = [
    {
        id: 'log-1',
        timestamp: new Date().toLocaleTimeString(),
        text: 'Catalyst environment initialized.',
        status: 'info',
    },
    {
        id: 'log-2',
        timestamp: new Date().toLocaleTimeString(),
        text: 'AI Agent is online and awaiting instructions.',
        status: 'success',
    }
];

export const INITIAL_TABS: Tab[] = [
    {
        id: 'tab-welcome',
        title: 'Welcome',
        type: 'welcome',
        icon: 'BeakerIcon',
    }
]
