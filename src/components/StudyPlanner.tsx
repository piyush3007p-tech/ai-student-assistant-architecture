import { useState } from 'react';
import { ListTodo, Sparkles, RefreshCw, Trophy, Clock, CheckCircle } from 'lucide-react';
import { Subject, StudyPlanItem } from '../utils/mockData';
import { callOpenAIPlanner } from '../utils/openai';

interface StudyPlannerProps {
  subjects: Subject[];
  studyPlan: StudyPlanItem[];
  onToggleTodo: (id: string) => void;
  onSetNewPlan: (newPlan: StudyPlanItem[]) => void;
}

export default function StudyPlanner({
  subjects,
  studyPlan,
  onToggleTodo,
  onSetNewPlan
}: StudyPlannerProps) {
  const [studyHabits, setStudyHabits] = useState('I usually study 30 minutes before bed. I get easily distracted by notifications, and struggle with active formula memorization.');
  const [targetGoals, setTargetGoals] = useState('Ace my upcoming AP Biology midterm and score above 90% in Physics SUVAT exams.');
  const [analyzing, setAnalyzing] = useState(false);
  const [advisorRecommendation, setAdvisorRecommendation] = useState<string>(
    `Based on your active syllabus concept bars, your primary target is Rotational Kinetic Energy (Physics progress: 72%) and Photosynthesis dark cycles (Biology progress: 88%). We recommend dedicating a structured 45-minute daily block using active recall flashcards combined with a 25-minute Pomodoro timer to prevent distraction fatigue.`
  );

  const handleGenerateAIPlanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (analyzing) return;
    setAnalyzing(true);

    try {
      // Map simplified subject stats for OpenAI
      const stats = subjects.map(s => ({
        subject: s.name,
        grade: s.grade,
        progress: s.progress,
        weakTopic: s.weakTopic
      }));

      const response = await callOpenAIPlanner(stats, studyHabits, targetGoals);
      
      setAdvisorRecommendation(response.recommendation);
      if (response.calendar && response.calendar.length > 0) {
        onSetNewPlan(response.calendar);
      }
    } catch (err) {
      alert("Error generating plan. Using simulated customized study planner.");
    } finally {
      setAnalyzing(false);
    }
  };

  const completedCount = studyPlan.filter(i => i.completed).length;
  const progressPct = studyPlan.length > 0 ? Math.round((completedCount / studyPlan.length) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          🎯 AI Personalized Study Planner
        </h2>
        <p className="text-xs text-slate-400">
          OpenAI analyzes your current study habits, grade trends, and weak topic concepts to construct daily high-yield schedules and smart revision timers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column (1/3): Study Habits Profiler Form */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            🧑‍🎓 Study Profiler Input
          </h3>

          <form onSubmit={handleGenerateAIPlanner} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                Describe your current study habits
              </label>
              <textarea
                rows={4}
                value={studyHabits}
                onChange={(e) => setStudyHabits(e.target.value)}
                placeholder="What distracts you? How many hours do you study? Do you cram or study daily?"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                What are your main target goals / upcoming exams?
              </label>
              <textarea
                rows={3}
                value={targetGoals}
                onChange={(e) => setTargetGoals(e.target.value)}
                placeholder="List major exams, due dates, or GPA goals..."
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={analyzing}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 py-2.5 text-xs font-bold text-white shadow-lg disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Analyzing Performance Vectors...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate AI Study Schedule
                </>
              )}
            </button>
          </form>

          {/* Profile overview summary */}
          <div className="border-t border-slate-800/80 pt-4 space-y-2.5">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Weekly Goal Status</span>
            
            <div className="flex justify-between text-xs text-slate-300">
              <span>Schedule Completion</span>
              <span className="font-bold">{progressPct}%</span>
            </div>

            {/* Completion indicator */}
            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
                style={{ width: `${progressPct}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center bg-slate-950/60 rounded-lg p-2.5 border border-slate-850">
              <div className="flex items-center gap-1.5">
                <Trophy className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="text-[10px] font-bold text-slate-300">Study Habit Level</span>
              </div>
              <span className="rounded bg-violet-500/10 border border-violet-500/20 text-violet-400 px-2 py-0.5 text-[9px] font-black">
                LEVEL 12 (Pro)
              </span>
            </div>
          </div>
        </div>

        {/* Right Columns (2/3): AI Recommendations & Interactive Calendar Checklist */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Recommendation panel */}
          <div className="rounded-2xl border border-violet-500/30 bg-violet-500/5 p-5">
            <h3 className="text-sm font-bold text-violet-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              💡 OpenAI Coach Recommendation
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {advisorRecommendation}
            </p>
          </div>

          {/* Interactive Checklist Calendar */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ListTodo className="h-4.5 w-4.5 text-emerald-400" />
                  Your Customized Study blocks
                </h3>
                <p className="text-[10px] text-slate-500">Tick items off as you finish them to grow your streak!</p>
              </div>

              <span className="rounded-lg bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
                {completedCount} / {studyPlan.length} Done
              </span>
            </div>

            <div className="space-y-3">
              {studyPlan.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onToggleTodo(item.id)}
                  className={`group rounded-xl p-3.5 border transition-all cursor-pointer flex items-center gap-4 justify-between text-left ${
                    item.completed
                      ? 'bg-emerald-500/5 border-emerald-500/20 opacity-70'
                      : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-md border transition-all ${
                      item.completed 
                        ? 'bg-emerald-500 border-emerald-400 text-white' 
                        : 'border-slate-700 bg-slate-950 group-hover:border-violet-500'
                    }`}>
                      {item.completed && <CheckCircle className="h-3.5 w-3.5 text-slate-950" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                          {item.topic}
                        </span>
                        
                        {/* Type Tag */}
                        <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                          item.type === 'quiz' 
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' 
                            : item.type === 'exercise'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                            : item.type === 'lecture'
                            ? 'bg-sky-500/15 text-sky-400 border border-sky-500/20'
                            : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                        }`}>
                          {item.type}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                        <span className="font-semibold text-slate-400">{item.subject}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" /> {item.time} ({item.duration})</span>
                        <span>•</span>
                        <span className="text-violet-400 font-bold">{item.day}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black uppercase shrink-0 ${
                    item.completed ? 'text-emerald-400' : 'text-slate-500 group-hover:text-violet-400'
                  }`}>
                    {item.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
