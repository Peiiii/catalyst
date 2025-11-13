import React from 'react';
import { BeakerIcon } from './icons';

interface WelcomeTabProps {
    onQuickAction: (prompt: string) => void;
}

const WelcomeTab: React.FC<WelcomeTabProps> = ({ onQuickAction }) => {
    const quickActions = [
        "Create a to-do list plugin",
        "Build a simple notes widget",
        "Generate a random number utility",
    ];

    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
            <BeakerIcon className="w-16 h-16 text-cyan-500 mb-4" />
            <h1 className="text-3xl font-bold text-slate-200 mb-2">Welcome to Catalyst</h1>
            <p className="max-w-md mb-6">
                This is a blank canvas for your ideas. Use the AI Assistant on the right to start building,
                or try one of the suggestions below.
            </p>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 text-left text-sm w-full max-w-md">
                <p className="font-semibold text-slate-300 mb-3 text-center">Try a Quick Start:</p>
                <div className="flex flex-col space-y-2">
                    {quickActions.map((prompt, index) => (
                        <button
                            key={index}
                            onClick={() => onQuickAction(prompt)}
                            className="w-full text-left p-3 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all duration-200 transform hover:scale-105"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WelcomeTab;