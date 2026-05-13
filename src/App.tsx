import { useState, useEffect } from 'react';
import { 
  Home, MessageSquare, FileText, Code, Mic, Calendar, Trophy, Shield, 
  Sparkles, Key, Smartphone, Laptop, Flame, GraduationCap
} from 'lucide-react';

// Subcomponents
import Dashboard from './components/Dashboard';
import ChatTutor from './components/ChatTutor';
import NotesSummarizer from './components/NotesSummarizer';
import HomeworkAssistant from './components/HomeworkAssistant';
import VoiceAssistant from './components/VoiceAssistant';
import StudyPlanner from './components/StudyPlanner';
import QuizGenerator from './components/QuizGenerator';
import SecurityCenter from './components/SecurityCenter';
import ApiKeyModal from './components/ApiKeyModal';
import PricingModal from './components/PricingModal';

// Mock Data Models
import { 
  INITIAL_SUBJECTS, INITIAL_FOLDERS, INITIAL_NOTES, INITIAL_STUDY_PLAN,
  Subject, NoteFolder, ClassNote, StudyPlanItem 
} from './utils/mockData';
import { hasOpenAIKey } from './utils/openai';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isOpenPricing, setIsOpenPricing] = useState<boolean>(false);
  const [isOpenApiKey, setIsOpenApiKey] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [isMobileMode, setIsMobileMode] = useState<boolean>(false);

  // Core Data States
  const [streak, setStreak] = useState<number>(12);
  const [subjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [notes, setNotes] = useState<ClassNote[]>(INITIAL_NOTES);
  const [folders, setFolders] = useState<NoteFolder[]>(INITIAL_FOLDERS);
  const [studyPlan, setStudyPlan] = useState<StudyPlanItem[]>(INITIAL_STUDY_PLAN);
  const [currentSubject, setCurrentSubject] = useState<string>('all');

  // Load API Key presence
  useEffect(() => {
    setHasApiKey(hasOpenAIKey());
  }, []);

  const handleKeySaved = () => {
    setHasApiKey(hasOpenAIKey());
  };

  // Callback to toggle todo completion in planner
  const handleToggleTodo = (id: string) => {
    setStudyPlan(prev => 
      prev.map(item => {
        if (item.id === id) {
          const nextCompleted = !item.completed;
          if (nextCompleted) {
            // Increase streak as reward
            setStreak(s => s + 1);
          } else {
            setStreak(s => Math.max(1, s - 1));
          }
          return { ...item, completed: nextCompleted };
        }
        return item;
      })
    );
  };

  // Add custom user-made notes
  const handleAddNote = (newNote: ClassNote) => {
    setNotes(prev => [newNote, ...prev]);
    // update folder counts
    setFolders(prev => 
      prev.map(f => f.id === newNote.folderId ? { ...f, notesCount: f.notesCount + 1 } : f)
    );
  };

  // Delete note from database
  const handleDeleteNote = (noteId: string) => {
    const targetNote = notes.find(n => n.id === noteId);
    if (!targetNote) return;

    setNotes(prev => prev.filter(n => n.id !== noteId));
    setFolders(prev => 
      prev.map(f => f.id === targetNote.folderId ? { ...f, notesCount: Math.max(0, f.notesCount - 1) } : f)
    );
  };

  // Add custom user folders
  const handleAddFolder = (newFolder: NoteFolder) => {
    setFolders(prev => [...prev, newFolder]);
  };

  // Override entire planner schedule from AI prompt
  const handleSetNewPlan = (newCalendar: any[]) => {
    const formatted: StudyPlanItem[] = newCalendar.map((item, idx) => ({
      id: item.id || `ai_sp_${idx}_${Date.now()}`,
      day: item.day,
      time: item.time,
      subject: item.subject,
      topic: item.topic,
      duration: item.duration,
      completed: false,
      type: item.type || 'review'
    }));
    setStudyPlan(formatted);
  };

  // Navigation panel items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'chat', label: 'Smart Tutor', icon: MessageSquare },
    { id: 'notes', label: 'Notes Summarizer', icon: FileText },
    { id: 'homework', label: 'Homework Help', icon: Code },
    { id: 'voice', label: 'Voice Assistant', icon: Mic },
    { id: 'planner', label: 'Study Planner', icon: Calendar },
    { id: 'quiz', label: 'Quiz Generator', icon: Trophy },
    { id: 'security', label: 'Security & Safety', icon: Shield },
  ];

  // Helper to render the active component content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            subjects={subjects}
            notes={notes}
            streak={streak}
            onNavigate={(tab) => setActiveTab(tab)}
            isPremium={isPremium}
            onOpenPricing={() => setIsOpenPricing(true)}
            onOpenApiKey={() => setIsOpenApiKey(true)}
            hasApiKey={hasApiKey}
          />
        );
      case 'chat':
        return (
          <ChatTutor 
            currentSubject={currentSubject}
            onSubjectChange={(sub) => setCurrentSubject(sub)}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );
      case 'notes':
        return (
          <NotesSummarizer 
            folders={folders}
            notes={notes}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
            onAddFolder={handleAddFolder}
          />
        );
      case 'homework':
        return <HomeworkAssistant />;
      case 'voice':
        return (
          <VoiceAssistant 
            isPremium={isPremium} 
            onOpenPricing={() => setIsOpenPricing(true)} 
          />
        );
      case 'planner':
        return (
          <StudyPlanner 
            subjects={subjects}
            studyPlan={studyPlan}
            onToggleTodo={handleToggleTodo}
            onSetNewPlan={handleSetNewPlan}
          />
        );
      case 'quiz':
        return <QuizGenerator />;
      case 'security':
        return <SecurityCenter />;
      default:
        return <div className="text-white">Coming soon!</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-violet-600/40">
      
      {/* GLOBAL HEADER */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-900 bg-slate-950/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-900/30">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="font-black text-sm tracking-wider text-white">ASTROSTUDY AI</span>
            <span className="ml-1.5 rounded-full bg-violet-500/10 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-violet-400 border border-violet-500/20">
              OpenAI Integrated
            </span>
          </div>
        </div>

        {/* Header Stats bar */}
        <div className="flex items-center gap-4">
          
          {/* Study streak badge */}
          <div className="flex items-center gap-1 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-400 border border-orange-500/15">
            <Flame className="h-3.5 w-3.5 fill-current" />
            <span>{streak} Days</span>
          </div>

          {/* Simulated view switcher */}
          <button
            onClick={() => setIsMobileMode(!isMobileMode)}
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
            title="Toggle Desktop vs Phone Layout Simulation"
          >
            {isMobileMode ? (
              <>
                <Laptop className="h-3.5 w-3.5 text-violet-400" />
                <span>Switch to Desktop View</span>
              </>
            ) : (
              <>
                <Smartphone className="h-3.5 w-3.5 text-pink-400" />
                <span>Simulate Mobile App</span>
              </>
            )}
          </button>

          {/* Upgrade Indicator */}
          <button
            onClick={() => setIsOpenPricing(true)}
            className={`hidden md:flex items-center gap-1 text-[11px] font-black uppercase rounded-lg px-2.5 py-1 ${
              isPremium 
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white' 
                : 'bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold'
            }`}
          >
            <Sparkles className="h-3 w-3" />
            {isPremium ? 'PRO Member' : 'Go Premium'}
          </button>
        </div>
      </header>

      {/* CORE WRAPPER */}
      <div className="flex min-h-[calc(100vh-56px)]">
        
        {/* DESKTOP SIDEBAR NAVIGATION (hidden if mobile simulated is ON, to showcase the smartphone look) */}
        {!isMobileMode && (
          <aside className="w-64 border-r border-slate-900 bg-slate-950 p-4 space-y-4 shrink-0 hidden md:block">
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-3.5">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Scholar Profile</span>
              <h4 className="text-xs font-bold text-slate-200 mt-1">Class of 2026</h4>
              <p className="text-[10px] text-slate-400">Aiming for High Honor Roll</p>
              
              {/* Premium indicator inside profile */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-500">Tier:</span>
                <span className={`font-black uppercase tracking-wider ${isPremium ? 'text-violet-400' : 'text-slate-400'}`}>
                  {isPremium ? '★ Premium Pro' : 'Free Trial'}
                </span>
              </div>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all text-left cursor-pointer ${
                      isActive 
                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/35' 
                        : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Quick API Key status indicator in sidebar */}
            <div className="pt-6 border-t border-slate-900">
              <button
                onClick={() => setIsOpenApiKey(true)}
                className="w-full flex items-center gap-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-900 px-3 py-2 text-[10px] font-semibold text-slate-400 text-left cursor-pointer"
              >
                <Key className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                <div className="truncate">
                  <p className="text-slate-300 truncate">OpenAI API connection</p>
                  <p className="text-[9px] text-slate-500 truncate">{hasApiKey ? 'Connected (sk-proj)' : 'Simulated (Fallback)'}</p>
                </div>
              </button>
            </div>
          </aside>
        )}

        {/* MAIN BODY PANEL */}
        <main className="flex-1 p-4 md:p-6 bg-slate-950/60 overflow-x-hidden">
          
          {isMobileMode ? (
            /* PHONE FRAME LAYOUT SIMULATOR */
            <div className="space-y-4">
              <div className="flex justify-between items-center max-w-[375px] mx-auto">
                <span className="text-xs text-pink-400 font-bold flex items-center gap-1 animate-pulse">
                  📱 Mobile Simulator Viewport
                </span>
                <button
                  onClick={() => setIsMobileMode(false)}
                  className="text-[10px] text-slate-400 hover:text-white underline"
                >
                  Switch to Fullscreen
                </button>
              </div>

              {/* Physical iPhone-style Container */}
              <div className="mx-auto max-w-[375px] h-[780px] rounded-[52px] border-[12px] border-slate-800 bg-slate-950 shadow-2xl relative overflow-hidden flex flex-col">
                
                {/* Simulated iPhone Speaker/Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-36 bg-slate-800 rounded-b-2xl z-50 flex items-center justify-center">
                  <div className="h-1.5 w-14 bg-slate-900 rounded-full"></div>
                </div>

                {/* Simulated iPhone Status Bar */}
                <div className="pt-7 px-5 pb-1.5 bg-slate-950 text-[9px] text-slate-400 font-bold flex justify-between items-center z-40 shrink-0 select-none">
                  <span>9:41 🛰️</span>
                  <div className="flex items-center gap-1 text-[8px]">
                    <span>LTE</span>
                    <span>📶</span>
                    <span>🔋 100%</span>
                  </div>
                </div>

                {/* Simulated App Title Bar */}
                <div className="px-4 py-2 bg-slate-950 border-b border-slate-900 flex justify-between items-center shrink-0">
                  <span className="text-[10px] font-black tracking-wider text-violet-400">ASTROSTUDY MOBILE</span>
                  
                  {/* Streak inside phone header */}
                  <div className="flex items-center gap-0.5 rounded-full bg-orange-500/10 px-2 py-0.5 text-[9px] font-bold text-orange-400">
                    <Flame className="h-2.5 w-2.5 fill-current" />
                    <span>{streak}d</span>
                  </div>
                </div>

                {/* Simulated Scrollable Mobile Content */}
                <div className="flex-1 overflow-y-auto p-3.5 space-y-4 pb-20 bg-slate-950">
                  {renderTabContent()}
                </div>

                {/* Simulated Smartphone bottom navigation bar (Full features) */}
                <div className="absolute bottom-0 inset-x-0 h-16 bg-slate-950/95 border-t border-slate-900 backdrop-blur-md flex items-center justify-around px-2 z-40 shrink-0">
                  {menuItems.slice(0, 5).map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex flex-col items-center gap-1 transition-all ${
                          isActive ? 'text-violet-400 scale-105 font-bold' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-[8px] truncate max-w-[50px]">{item.label}</span>
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`flex flex-col items-center gap-1 ${
                      activeTab === 'security' ? 'text-violet-400' : 'text-slate-500'
                    }`}
                  >
                    <Shield className="h-5 w-5" />
                    <span className="text-[8px]">Safety</span>
                  </button>
                </div>

                {/* Home Indicator bar */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-28 bg-slate-700 rounded-full z-50"></div>
              </div>
            </div>
          ) : (
            /* STANDARD FULL-WIDTH DESKTOP VIEWPORT */
            <div className="max-w-6xl mx-auto space-y-6">
              {renderTabContent()}
            </div>
          )}

        </main>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between gap-2.5">
        <p>© 2026 AstroStudy AI. All rights reserved. Designed to empower students with integrated OpenAI API solutions.</p>
        <div className="flex justify-center gap-4 text-slate-400">
          <button onClick={() => setIsOpenPricing(true)} className="hover:text-white transition-colors cursor-pointer">SaaS Pricing</button>
          <span>•</span>
          <button onClick={() => setIsOpenApiKey(true)} className="hover:text-white transition-colors cursor-pointer">OpenAI Keys</button>
          <span>•</span>
          <button onClick={() => setActiveTab('security')} className="hover:text-white transition-colors cursor-pointer">Safe-Guard Center</button>
        </div>
      </footer>

      {/* POPUP MODALS */}
      <ApiKeyModal 
        isOpen={isOpenApiKey}
        onClose={() => setIsOpenApiKey(false)}
        onKeySaved={handleKeySaved}
      />

      <PricingModal 
        isOpen={isOpenPricing}
        onClose={() => setIsOpenPricing(false)}
        isPremium={isPremium}
        onUpgrade={(status) => setIsPremium(status)}
      />

    </div>
  );
}
