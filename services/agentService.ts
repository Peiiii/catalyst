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
          description: "The full React/TSX source code for the plugin component. It must be a single, self-contained component definition (e.g., 'const MyComponent = () => ...;'). The UI must be clean, modern, and fit the application's dark theme. It should be functional; for example, a to-do list should manage its own state for adding/completing tasks.",
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

**Constraints for 'newPlugin.generatedCode':**
- The code must be a single, valid TSX React functional component defined as a const (e.g., \`const MyNotes = () => { ... };\`).
- The component must be self-contained. Do not assume any external state or props.
- Use only standard React hooks like \`useState\` and \`useEffect\`.
- For styling, use inline styles (\`style={{}}\`) or standard HTML elements. Do not use CSS classes.
- Ensure the UI is clean, modern, and fits the dark theme of the application. Use dark backgrounds (e.g., \`#1E293B\`), light text (e.g., \`#E2E8F0\`), and accent colors (e.g., \`#38BDF8\`).
- The component must be fully functional. For instance, a to-do list should have its own state and logic for adding, deleting, and marking tasks as complete.
- Do not import any external libraries.
- The root component must be a \`<div>\`.

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