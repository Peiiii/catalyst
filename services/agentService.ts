
import { GoogleGenAI, Type } from "@google/genai";
import { AgentResponse, Plugin, ChatMessage } from '../types';

// This schema defines the structure the AI's response must follow.
const agentPlanSchema = {
  type: Type.OBJECT,
  properties: {
    initialChatReply: {
      type: Type.STRING,
      description: "A friendly, conversational message to the user acknowledging the build request.",
    },
    tasks: {
      type: Type.ARRAY,
      description: "A list of high-level tasks to create the plugin.",
      items: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
        },
        required: ['description'],
      },
    },
    logsForTasks: {
      type: Type.ARRAY,
      description: "An array of log arrays. Each inner array corresponds to a task and contains mock log entries for that task.",
      items: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            status: { type: Type.STRING, enum: ['info', 'success', 'warning', 'error'] },
          },
          required: ['text', 'status'],
        },
      },
    },
    finalChatReply: {
      type: Type.STRING,
      description: "A final message to the user announcing the successful creation of the plugin.",
    },
    newPlugin: {
      type: Type.OBJECT,
      description: "The details of the newly generated plugin.",
      properties: {
        id: { type: Type.STRING, description: "A placeholder identifier for the plugin. Use 'plugin-placeholder'." },
        name: { type: Type.STRING, description: "A short, descriptive name for the plugin (e.g., 'Quick Notes')." },
        icon: {
          type: Type.STRING,
          description: "The name of an icon component.",
          enum: ['TaskIcon', 'ChartIcon', 'NoteIcon', 'CodeBracketSquareIcon', 'ChatBubbleLeftRightIcon', 'BeakerIcon', 'RegistryIcon', 'BusIcon'],
        },
        description: { type: Type.STRING, description: "A one-sentence description of what the plugin does." },
        color: {
          type: Type.STRING,
          description: "A Tailwind CSS background color class for the plugin icon.",
          enum: ['bg-sky-500', 'bg-indigo-500', 'bg-green-500', 'bg-amber-500', 'bg-purple-500', 'bg-pink-500', 'bg-red-500'],
        },
        generatedCode: {
          type: Type.STRING,
          description: "The full, self-contained JavaScript code for the plugin's UI. This code MUST be a string representing an arrow function that accepts a 'container' HTMLElement as its only argument. E.g., '(container) => { ... }'. The function must use standard DOM APIs to render its UI into the container.",
        },
        apiEndpoints: {
          type: Type.ARRAY,
          description: "A list of mock API endpoints the plugin might expose.",
          items: {
            type: Type.OBJECT,
            properties: {
              path: { type: Type.STRING, description: "The API path (e.g., 'GET /api/tasks')." },
              description: { type: Type.STRING, description: "A brief description of the endpoint." },
            },
            required: ['path', 'description'],
          },
        },
        customView: {
          type: Type.OBJECT,
          description: "Optional. If the plugin provides a major, distinct functionality (like a chat client or file browser), define a custom view to be shown in the Activity Bar.",
          properties: {
            id: { type: Type.STRING, description: "A unique identifier for the view, prefixed with 'view-'. E.g., 'view-chat-client'."},
            name: { type: Type.STRING, description: "The name of the view to be shown as a tooltip. E.g., 'Chat Client'."},
            icon: {
              type: Type.STRING,
              description: "The name of an icon component for the Activity Bar.",
              enum: ['ChatBubbleLeftRightIcon', 'CodeBracketSquareIcon', 'TaskIcon', 'ChartIcon', 'NoteIcon', 'BeakerIcon'],
            }
          },
          required: ['id', 'name', 'icon']
        }
      },
      required: ['id', 'name', 'icon', 'description', 'color', 'generatedCode', 'apiEndpoints'],
    },
  },
  required: ['initialChatReply', 'tasks', 'logsForTasks', 'finalChatReply', 'newPlugin'],
};

const agentResponseSchema = {
    type: Type.OBJECT,
    properties: {
        action: {
            type: Type.STRING,
            enum: ['BUILD', 'CHAT'],
            description: "The decision on the action to take. 'BUILD' for creating a plugin, 'CHAT' for a conversational reply.",
        },
        chatReply: {
            type: Type.STRING,
            description: "The conversational reply to the user. ONLY use this field when action is 'CHAT'.",
        },
        plan: {
            ...agentPlanSchema,
            description: "The full execution plan for building the plugin. ONLY use this field when action is 'BUILD'.",
        },
    },
    required: ['action'],
}


const getSystemInstruction = (existingPlugins: Plugin[]): string => {
  const existingPluginNames = existingPlugins.map(p => p.name).join(', ') || 'none';
  return `You are an expert AI agent that responds ONLY with a single, valid JSON object that conforms to the provided schema. Do not add any other text, markdown, or explanations.

Your primary task is to decide the user's intent and set the 'action' field accordingly.

### 1. BUILD Action

**Trigger:** When the user gives a clear command to build a new plugin (e.g., "create a to-do list", "build a notes app", "开发todolist").

**Your Response:**
- You MUST set \`action\` to \`"BUILD"\`.
- You MUST provide a complete \`plan\` object. The \`plan\` object must contain ALL its required fields: \`initialChatReply\`, \`tasks\`, \`logsForTasks\`, \`finalChatReply\`, and \`newPlugin\`.
- DO NOT use the top-level \`chatReply\` field.

---

### 2. CHAT Action

**Trigger:** For ALL OTHER inputs. This includes:
- Greetings and small talk (e.g., "hello", "how are you?").
- Vague requests (e.g., "build something cool", "what can you do?"). In this case, be proactive and suggest a specific plugin idea.
- Questions about the app or your capabilities.
- Requests to build a plugin that already exists. (Existing plugins: ${existingPluginNames}).

**Your Response:**
- You MUST set \`action\` to \`"CHAT"\`.
- You MUST provide a conversational reply in the top-level \`chatReply\` field.
- DO NOT use the \`plan\` field.

---

### 3. Custom Views

- You can optionally add a \`customView\` to a \`newPlugin\`.
- **WHEN to use it:** Only for plugins that represent a major, standalone piece of functionality that would benefit from its own icon in the main Activity Bar. Good examples: a file explorer, a dedicated chat client, a debugger.
- **WHEN NOT to use it:** Do not create a custom view for simple, content-focused plugins like a 'Calculator'. These are best viewed in a normal tab. A 'To-Do List' or 'Notes App' are good candidates for a custom view if they are intended to be persistent side panels.
- If you add a \`customView\`, make sure the \`generatedCode\` is a function that makes sense to be displayed in a sidebar panel.

---

**Constraints for 'newPlugin.generatedCode':**
- The code MUST be a string containing a single, self-contained JavaScript arrow function. E.g., \`(container) => { ... }\`.
- This function accepts ONE argument: \`container\`, which is an HTMLElement.
- The function MUST use standard browser DOM manipulation APIs to build and render its UI inside the \`container\`. E.g., \`document.createElement\`, \`element.appendChild\`, \`container.innerHTML\`.
- DO NOT generate React/TSX/JSX code. DO NOT use \`React.useState\` or any React hooks.
- All state must be managed by local variables within the function's scope.
- All styling must be done using the \`element.style\` property (e.g., \`element.style.color = '#FFF'\`). DO NOT use CSS classes or \`<style>\` tags.
- The function must be fully self-contained and not rely on any external scripts or libraries.
- The UI must be clean, modern, and fit the dark theme of the application. Use dark backgrounds (e.g., '#1E293B'), light text (e.g., '#E2E8F0'), and accent colors (e.g., '#38BDF8').

**Excellent Example of a fully functional 'generatedCode' string:**

\`\`\`javascript
(container) => {
  let tasks = [
    { id: 1, text: 'Analyze user feedback', completed: true },
    { id: 2, text: 'Design new plugin architecture', completed: false },
  ];

  const styles = {
    container: 'font-family: sans-serif; color: #E2E8F0; padding: 16px; height: 100%; display: flex; flex-direction: column; background-color: #1E293B;',
    form: 'display: flex; margin-bottom: 16px;',
    input: 'flex-grow: 1; padding: 8px; border: 1px solid #475569; border-radius: 4px 0 0 4px; background-color: #334155; color: #E2E8F0; outline: none; font-size: 14px;',
    button: 'padding: 8px 12px; border: 1px solid #38BDF8; background-color: #38BDF8; color: #0F172A; border-radius: 0 4px 4px 0; cursor: pointer; font-weight: bold;',
    ul: 'list-style: none; padding: 0; margin: 0; overflow-y: auto; flex-grow: 1;',
    li: 'display: flex; align-items: center; padding: 12px; background-color: #334155; border-radius: 4px; margin-bottom: 8px;',
    checkbox: 'margin-right: 12px; cursor: pointer; width: 16px; height: 16px; accent-color: #38BDF8;',
    span: 'flex-grow: 1; font-size: 14px;',
    spanCompleted: 'text-decoration: line-through; color: #94A3B8;',
    deleteButton: 'background: none; border: none; color: #94A3B8; cursor: pointer; font-size: 18px; line-height: 1; padding: 0 4px;',
  };

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

  const addTask = (text) => {
    tasks.push({ id: Date.now(), text, completed: false });
    render();
  };
  const toggleTask = (id) => {
    tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    render();
  };
  const deleteTask = (id) => {
    tasks = tasks.filter(task => task.id !== id);
    render();
  };
  render();
}
\`\`\`

Now, analyze the latest user message in the context of the conversation history, choose the correct action, and generate the corresponding JSON object.`;
};


export const createAgentPlan = async (chatHistory: ChatMessage[], existingPlugins: Plugin[]): Promise<AgentResponse | null> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const systemInstruction = getSystemInstruction(existingPlugins);

        const contents = chatHistory.map(({ sender, text }) => ({
          role: sender === 'agent' ? 'model' : 'user',
          parts: [{ text }],
        }));

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: agentResponseSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const agentResponse = JSON.parse(jsonText) as AgentResponse;

        if (agentResponse.action === 'BUILD' && agentResponse.plan?.newPlugin) {
            // The app will assign a final robust ID.
            agentResponse.plan.newPlugin.id = `plugin-${Date.now()}`;
            return agentResponse;
        }

        if (agentResponse.action === 'CHAT' && agentResponse.chatReply) {
            return agentResponse;
        }
        
        console.error("AI response was malformed or illogical.", agentResponse);
        return null;

    } catch (error) {
        console.error("Error creating agent plan with Gemini:", error);
        return null;
    }
};