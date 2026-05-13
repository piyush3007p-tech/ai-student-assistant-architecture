import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Mic, FileText, CheckCircle2, Search, RefreshCw, Languages, HelpCircle } from 'lucide-react';
import { callOpenAITutor } from '../utils/openai';
import { MOCK_CHATS } from '../utils/mockData';

interface ChatTutorProps {
  currentSubject: string;
  onSubjectChange: (subj: string) => void;
  onNavigate: (tab: string) => void;
}

export default function ChatTutor({
  currentSubject,
  onSubjectChange,
  onNavigate
}: ChatTutorProps) {
  const [messages, setMessages] = useState<any[]>(MOCK_CHATS);
  const [inputText, setInputText] = useState('');
  const [searching, setSearching] = useState('');
  const [aiThinkingText, setAiThinkingText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const subjects = [
    { id: 'all', name: 'General Assistant', color: 'border-slate-800 bg-slate-900/60 text-slate-300' },
    { id: 'bio', name: 'Biology & Life', color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' },
    { id: 'phys', name: 'Physics AP', color: 'border-violet-500/30 bg-violet-500/10 text-violet-400' },
    { id: 'chem', name: 'Organic Chemistry', color: 'border-amber-500/30 bg-amber-500/10 text-amber-400' },
    { id: 'cs', name: 'Computer Science', color: 'border-sky-500/30 bg-sky-500/10 text-sky-400' }
  ];

  const quickActions = [
    { label: 'Explain photosynthesis simply', icon: Sparkles, color: 'text-emerald-400 hover:bg-emerald-500/10' },
    { label: 'Summarize latest CS notes', icon: FileText, color: 'text-sky-400 hover:bg-sky-500/10' },
    { label: 'Translate key terms to Spanish', icon: Languages, color: 'text-pink-400 hover:bg-pink-500/10' },
    { label: 'Help me with Physics SUVAT', icon: HelpCircle, color: 'text-violet-400 hover:bg-violet-500/10' }
  ];

  const filteredQuickActions = quickActions.filter(act => 
    act.label.toLowerCase().includes(searching.toLowerCase())
  );

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isThinking) return;

    const userMessage = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsThinking(true);

    try {
      // Direct call to OpenAI utility with stream progress updates
      const reply = await callOpenAITutor(
        textToSend, 
        currentSubject === 'all' ? 'General Academic Topics' : currentSubject,
        (progressText) => setAiThinkingText(progressText)
      );
      
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (error: any) {
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: `⚠️ Oops! I couldn't reach the tutoring engine. Error: ${error?.message || error}. Please verify your API Key and connection.` 
      }]);
    } finally {
      setIsThinking(false);
      setAiThinkingText('');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden backdrop-blur-md">
      
      {/* Subject selector & Search bar combined */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shrink-0">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">Subject Scope:</span>
          {subjects.map((sub) => (
            <button
              key={sub.id}
              onClick={() => onSubjectChange(sub.id)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
                currentSubject === sub.id 
                  ? 'bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-600/25' 
                  : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>

        {/* Quick search actions inside subject panel */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search quick actions..."
            value={searching}
            onChange={(e) => setSearching(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-800 bg-slate-950 py-1.5 pl-8 pr-3 text-slate-100 placeholder-slate-600 focus:border-violet-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Quick Action prompts */}
      {filteredQuickActions.length > 0 && messages.length <= 1 && (
        <div className="p-3 bg-slate-950/40 border-b border-slate-800/60 shrink-0">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">Quick Action Triggers</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {filteredQuickActions.map((act, index) => {
              const Icon = act.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleSendMessage(act.label)}
                  className={`flex items-center gap-2 rounded-xl border border-slate-800/80 bg-slate-950/60 p-2.5 text-xs font-medium text-slate-300 transition-all text-left group cursor-pointer ${act.color}`}
                >
                  <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span className="truncate">{act.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Chat Messages Panel */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 max-w-3xl animate-fade-in ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            {/* User/AI Icon */}
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${
              msg.role === 'user' 
                ? 'bg-slate-950 border-slate-800 text-slate-300' 
                : 'bg-violet-600/10 border-violet-500/20 text-violet-400'
            }`}>
              {msg.role === 'user' ? 'ME' : 'AI'}
            </div>

            {/* Bubble content */}
            <div className={`rounded-2xl p-4 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/20'
                : 'bg-slate-950/60 border border-slate-800/80 text-slate-100'
            }`}>
              {/* Complex Rendering Helper (Markdown parser support simulation) */}
              <div className="space-y-3 whitespace-pre-wrap font-sans">
                {msg.content.split('\n').map((line: string, i: number) => {
                  // Headers
                  if (line.startsWith('### ')) {
                    return <h3 key={i} className="text-base font-extrabold text-violet-300 mt-2">{line.substring(4)}</h3>;
                  }
                  if (line.startsWith('#### ')) {
                    return <h4 key={i} className="text-sm font-bold text-slate-200 mt-1.5">{line.substring(5)}</h4>;
                  }
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={i} className="font-bold text-slate-100">{line.replace(/\*\*/g, '')}</p>;
                  }
                  // Code block start/end
                  if (line.startsWith('```')) {
                    return null; // Skip markdown block backticks for cleaner display
                  }
                  // Equation lines
                  if (line.includes('$$')) {
                    return (
                      <div key={i} className="my-2.5 rounded-lg bg-slate-950 border border-slate-800/80 p-2.5 text-center font-mono text-xs overflow-x-auto text-violet-300">
                        {line.replace(/\$\$/g, '')}
                      </div>
                    );
                  }
                  // Key point list lines
                  if (line.trim().startsWith('- ')) {
                    return <div key={i} className="pl-4 flex items-start gap-1.5 text-slate-300 text-xs py-0.5">
                      <span className="text-violet-400 mt-1 shrink-0">•</span>
                      <span>{line.substring(2)}</span>
                    </div>;
                  }
                  return <p key={i} className="text-xs sm:text-sm text-slate-300">{line}</p>;
                })}
              </div>
            </div>
          </div>
        ))}

        {/* AI Thinking indicator */}
        {isThinking && (
          <div className="flex gap-3 max-w-3xl animate-pulse">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600/10 border border-violet-500/20 text-xs text-violet-400">
              <RefreshCw className="h-4 w-4 animate-spin" />
            </div>
            <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4 text-xs font-semibold text-slate-400">
              <span className="text-violet-400 font-extrabold">OpenAI:</span> {aiThinkingText || "Drafting explanation..."}
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Chat input box at Bottom */}
      <form onSubmit={handleFormSubmit} className="p-3 bg-slate-900/60 border-t border-slate-800 shrink-0">
        <div className="relative flex items-center gap-2">
          
          {/* File Summarize Shortcut Button */}
          <button
            type="button"
            onClick={() => onNavigate('notes')}
            title="Upload notes to AI Summarizer"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <FileText className="h-5 w-5" />
          </button>

          <input
            type="text"
            placeholder={`Ask anything about ${currentSubject === 'all' ? 'any subject' : currentSubject}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isThinking}
            className="w-full h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />

          {/* Voice assistant shortcut mic */}
          <button
            type="button"
            onClick={() => onNavigate('voice')}
            title="Open Voice Assistant"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Mic className="h-5 w-5" />
          </button>

          {/* Send message */}
          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Send className="h-4.5 w-4.5" />
          </button>

        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2 px-1">
          <span>🛡️ Verified Safe by Safe-Guard AI</span>
          <span className="flex items-center gap-0.5 text-violet-400 font-medium">
            <CheckCircle2 className="h-3 w-3" /> Step-by-step active recall ready
          </span>
        </div>
      </form>

    </div>
  );
}
