import { Subject, ClassNote } from '../utils/mockData';
import { Sparkles, Calendar, Flame, GraduationCap, ChevronRight, CheckCircle2, TrendingUp, Compass, Key } from 'lucide-react';

interface DashboardProps {
  subjects: Subject[];
  notes: ClassNote[];
  streak: number;
  onNavigate: (tab: string) => void;
  isPremium: boolean;
  onOpenPricing: () => void;
  onOpenApiKey: () => void;
  hasApiKey: boolean;
}

export default function Dashboard({
  subjects,
  notes,
  streak,
  onNavigate,
  isPremium,
  onOpenPricing,
  onOpenApiKey,
  hasApiKey
}: DashboardProps) {
  // Urgent notifications
  const exams = [
    { id: 'e1', title: 'AP Biology: Midterm (Photosynthesis)', time: 'In 3 Days', category: 'bio', severity: 'high' },
    { id: 'e2', title: 'Physics SUVAT Homework', time: 'Tomorrow at 11:59 PM', category: 'phys', severity: 'medium' },
    { id: 'e3', title: 'CS sorting lab submission', time: 'In 5 Days', category: 'cs', severity: 'low' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Panel with Glassmorphism */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 shadow-xl">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-600/25 blur-3xl"></div>
        <div className="absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-indigo-600/20 blur-3xl"></div>
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-300 border border-violet-500/20">
              <Sparkles className="h-3 w-3 animate-pulse" /> Welcome to AstroStudy AI
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Hello, Future Scholar!
            </h1>
            <p className="text-xs text-slate-400 max-w-xl">
              Your personal OpenAI co-pilot is fully operational. Switch tabs to chat with a Tutor, summarize uploaded lectures, solve calculus equations, or test yourself.
            </p>
          </div>

          <div className="flex gap-2.5 shrink-0">
            {/* API Key Connect Button */}
            <button
              onClick={onOpenApiKey}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                hasApiKey 
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20' 
                  : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:bg-slate-800/80'
              }`}
            >
              <Key className="h-3.5 w-3.5" />
              {hasApiKey ? 'OpenAI Live Connected' : 'Connect OpenAI Key'}
            </button>

            {/* Premium Status Pill */}
            <button
              onClick={onOpenPricing}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-black uppercase tracking-wider transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md ${
                isPremium 
                  ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-violet-500/25' 
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
              }`}
            >
              <Flame className="h-3.5 w-3.5 fill-current" />
              {isPremium ? 'PRO MEMBER' : 'UPGRADE TO PRO'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Streak Counter */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4.5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Study Streak</p>
            <h4 className="text-2xl font-black text-white mt-0.5">{streak} Days</h4>
            <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> Peak momentum active!
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Flame className="h-6 w-6 fill-current" />
          </div>
        </div>

        {/* Notes catalog count */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4.5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">AI Synthesized Notes</p>
            <h4 className="text-2xl font-black text-white mt-0.5">{notes.length} Chapters</h4>
            <p className="text-[10px] text-slate-400 mt-1">Ready for summaries & test generation</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <GraduationCap className="h-6 w-6" />
          </div>
        </div>

        {/* Dynamic GPA Estimation */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4.5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Estimated Core GPA</p>
            <h4 className="text-2xl font-black text-white mt-0.5">3.86 / 4.0</h4>
            <p className="text-[10px] text-violet-400 mt-1 flex items-center gap-0.5">
              <CheckCircle2 className="h-3 w-3" /> Top 5% of class goals
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        {/* AI Quizzes completed */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4.5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Practice Quizzes Done</p>
            <h4 className="text-2xl font-black text-white mt-0.5">18 Quizzes</h4>
            <p className="text-[10px] text-slate-400 mt-1">Average performance: 86%</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* Two Columns: Left (Subjects & Recommendations), Right (Urgent Schedule & Notes) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Subjects Progress List */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Your Active Subjects</h3>
                <p className="text-[11px] text-slate-500">Academic strength vector based on quizzes</p>
              </div>
              <button
                onClick={() => onNavigate('planner')}
                className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-0.5 font-semibold"
              >
                Syllabus Planner <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjects.map((sub) => (
                <div 
                  key={sub.id} 
                  className={`rounded-xl border p-3.5 transition-all bg-slate-900/40 hover:bg-slate-900/60 ${sub.borderColor}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200">{sub.name}</span>
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${sub.bgColor} ${sub.color}`}>
                      Grade: {sub.grade}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Concept Mastery</span>
                      <span>{sub.progress}%</span>
                    </div>
                    {/* Mastery Bar */}
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                        style={{ width: `${sub.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {sub.weakTopic && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Weakest Area:</span>
                      <p className="text-[10px] font-semibold text-slate-300 mt-0.5 truncate">{sub.weakTopic}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Smart Planner Suggestions */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
              <Compass className="h-4.5 w-4.5 text-violet-400" />
              Real-time OpenAI Smart Coaching
            </h3>

            <div className="space-y-3">
              {subjects.map((sub, index) => {
                if (!sub.recommendation) return null;
                return (
                  <div key={index} className="flex gap-3 items-start p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${sub.bgColor} ${sub.color}`}>
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400">{sub.name}</span>
                        <span className="text-[9px] font-semibold text-rose-400 bg-rose-500/10 px-1 py-0.2 rounded border border-rose-500/20">Targeted Fix</span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium mt-1">
                        {sub.recommendation}
                      </p>
                      <button
                        onClick={() => {
                          if (sub.id === 'cs') onNavigate('homework');
                          else if (sub.id === 'chem') onNavigate('notes');
                          else onNavigate('chat');
                        }}
                        className="text-[10px] text-violet-400 hover:text-violet-300 font-bold mt-2 flex items-center gap-0.5 cursor-pointer"
                      >
                        Launch AI Assistant tool now <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-6">
          
          {/* Upcoming exams list */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
              <Calendar className="h-4.5 w-4.5 text-pink-400" />
              Urgent Exam Reminders
            </h3>

            <div className="space-y-3">
              {exams.map((exam) => (
                <div key={exam.id} className="rounded-xl bg-slate-950/60 border border-slate-800 p-3 flex items-start gap-3 justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 leading-tight">{exam.title}</h4>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block mt-1">
                      {exam.category === 'bio' ? 'Biology' : exam.category === 'phys' ? 'Physics' : 'Computer Sci'}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`inline-block text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                      exam.severity === 'high' 
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/25' 
                        : exam.severity === 'medium'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                        : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/25'
                    }`}>
                      {exam.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => onNavigate('quiz')}
              className="mt-4 w-full text-center rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 py-2.5 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
            >
              Test Knowledge with AI Quiz Generator
            </button>
          </div>

          {/* Quick Notes Directory summary */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Saved Notes</h3>
              <button 
                onClick={() => onNavigate('notes')}
                className="text-xs text-violet-400 hover:text-violet-300 font-semibold cursor-pointer"
              >
                View all
              </button>
            </div>

            <div className="space-y-2.5">
              {notes.slice(0, 3).map((note) => (
                <div 
                  key={note.id}
                  onClick={() => onNavigate('notes')}
                  className="group rounded-xl bg-slate-950/40 p-3 border border-slate-800/60 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="truncate pr-2">
                    <h4 className="text-xs font-semibold text-slate-200 truncate group-hover:text-white transition-colors">
                      {note.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] text-slate-500">{note.wordCount} words</span>
                      {note.summary && (
                        <span className="rounded bg-emerald-500/10 px-1 py-0.2 text-[8px] font-bold text-emerald-400 border border-emerald-500/20">
                          AI Summarized
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-slate-300 transition-all shrink-0" />
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
