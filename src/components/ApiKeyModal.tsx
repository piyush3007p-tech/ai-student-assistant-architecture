import React, { useState } from 'react';
import { Key, CheckCircle, AlertCircle, X, HelpCircle } from 'lucide-react';
import { getOpenAIKey, setOpenAIKey, clearOpenAIKey, hasOpenAIKey } from '../utils/openai';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: () => void;
}

export default function ApiKeyModal({ isOpen, onClose, onKeySaved }: ApiKeyModalProps) {
  const [keyInput, setKeyInput] = useState(getOpenAIKey());
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showExplanation, setShowExplanation] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyInput.trim().startsWith('sk-') || keyInput.trim() === '') {
      if (keyInput.trim() === '') {
        clearOpenAIKey();
      } else {
        setOpenAIKey(keyInput.trim());
      }
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        onKeySaved();
        onClose();
      }, 1000);
    } else {
      setStatus('error');
    }
  };

  const handleClear = () => {
    clearOpenAIKey();
    setKeyInput('');
    setStatus('success');
    setTimeout(() => {
      setStatus('idle');
      onKeySaved();
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        {/* Glow decoration */}
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-violet-600/20 blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-indigo-600/20 blur-2xl"></div>

        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">OpenAI API Connection</h3>
              <p className="text-xs text-slate-400">Connect your live API account</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800/60">
            <p className="text-xs text-slate-300 leading-relaxed">
              💡 <span className="font-medium text-violet-400">Pro-Tip:</span> If you don't enter a key, this app uses our **Intelligent Educational Simulator** so you can test all features (chatting, code debugging, quiz-taking, notes summarizing) for free!
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Your OpenAI API Key
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="sk-proj-..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-3 pr-10 text-sm text-slate-100 placeholder-slate-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
              {hasOpenAIKey() && (
                <div className="absolute right-3 top-3 text-emerald-400">
                  <CheckCircle className="h-4 w-4" />
                </div>
              )}
            </div>
            <p className="mt-1.5 text-[10px] text-slate-500">
              Your key is saved locally in your browser storage and never sent to any server except directly to <span className="text-slate-400">api.openai.com</span>.
            </p>
          </div>

          {status === 'success' && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-400 border border-emerald-500/20">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>API Connection settings updated successfully!</span>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-400 border border-rose-500/20">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Invalid key format! OpenAI keys usually start with <code className="bg-rose-950/40 px-1 text-white">sk-</code>.</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-violet-400 font-medium pt-1">
            <button
              type="button"
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center gap-1 hover:text-violet-300 transition-colors cursor-pointer"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              How do I get an API key?
            </button>
            {getOpenAIKey() && (
              <button
                type="button"
                onClick={handleClear}
                className="text-rose-400 hover:text-rose-300 transition-colors"
              >
                Clear Saved Key
              </button>
            )}
          </div>

          {showExplanation && (
            <div className="rounded-lg bg-slate-950 p-3 text-xs text-slate-400 border border-slate-800 space-y-1.5 animate-slide-down">
              <p>1. Go to <a href="https://platform.openai.com" target="_blank" rel="noreferrer" className="text-violet-400 underline hover:text-violet-300">platform.openai.com</a>.</p>
              <p>2. Create an account and log in.</p>
              <p>3. Navigate to **API Keys** on the sidebar.</p>
              <p>4. Click **Create new secret key**, copy it, and paste it here!</p>
            </div>
          )}

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 rounded-lg bg-slate-800 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 py-2 text-sm font-semibold text-white hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-violet-900/30"
            >
              Save & Test Connection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
