import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface AIAssistantPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isThinking: boolean;
}

const CodeBlock: React.FC<{ code: { language: string, content: string } }> = ({ code }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-slate-900/50 rounded-md mt-2 border border-slate-600">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full text-left p-2 text-xs text-slate-400 hover:bg-slate-700/50 flex justify-between items-center"
            >
                <span>{isExpanded ? 'Hide' : 'Show'} Source Code ({code.language})</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </button>
            {isExpanded && (
                <pre className="p-3 text-xs text-slate-300 overflow-x-auto bg-slate-900 rounded-b-md max-h-48">
                    <code>{code.content}</code>
                </pre>
            )}
        </div>
    )
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ messages, onSendMessage, isThinking }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isThinking) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="w-[350px] bg-slate-800 border-l border-slate-700 flex flex-col h-full flex-shrink-0">
      <h2 className="text-lg font-bold text-slate-200 p-3 border-b border-slate-700 flex-shrink-0">AI Assistant</h2>
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg px-3 py-2 max-w-xs ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-slate-200'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                 {msg.code && <CodeBlock code={msg.code} />}
              </div>
            </div>
          ))}
          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-slate-700 text-slate-200 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-3 border-t border-slate-700 flex-shrink-0">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center bg-slate-700 rounded-lg">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., 'Create a to-do list'"
              className="w-full bg-transparent p-2 text-slate-200 placeholder-slate-500 focus:outline-none text-sm"
              disabled={isThinking}
            />
            <button
              type="submit"
              disabled={isThinking || !input.trim()}
              className="p-2 text-slate-400 hover:text-indigo-400 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAssistantPanel;
