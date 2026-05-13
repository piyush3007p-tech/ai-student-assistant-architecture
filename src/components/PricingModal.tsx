import { X, Check, Star, Zap, Volume2, Award, Sparkles, BookOpen } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPremium: boolean;
  onUpgrade: (status: boolean) => void;
}

export default function PricingModal({ isOpen, onClose, isPremium, onUpgrade }: PricingModalProps) {
  if (!isOpen) return null;

  const handleUpgradeToggle = () => {
    onUpgrade(!isPremium);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl"></div>

        {/* Modal Header */}
        <div className="flex justify-between p-6 border-b border-slate-800">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-300">
              <Sparkles className="h-3 w-3" /> Monetization Strategy
            </span>
            <h3 className="mt-2 text-2xl font-bold text-white">Unlock Your Academic Potential</h3>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors h-10 w-10 flex items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Two Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          
          {/* Free Plan */}
          <div className="relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-5 hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400">Basic Tier</span>
                { !isPremium && (
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">Active</span>
                )}
              </div>
              <div className="mt-2 flex items-baseline text-white">
                <span className="text-3xl font-extrabold tracking-tight">$0</span>
                <span className="ml-1 text-xs text-slate-500">/ forever free</span>
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Essential tools for students getting started with smart study notes.
              </p>

              <ul className="mt-5 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-slate-500 shrink-0" />
                  <span>15 AI Tutor Chat messages / day</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-slate-500 shrink-0" />
                  <span>Basic Chapter Summaries</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-slate-500 shrink-0" />
                  <span>Up to 4 Saved Notes in folder</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-slate-500 shrink-0" />
                  <span>Standard coding debugger tools</span>
                </li>
              </ul>
            </div>

            {isPremium ? (
              <button
                onClick={handleUpgradeToggle}
                className="mt-6 w-full rounded-xl border border-slate-800 py-2.5 text-xs font-semibold text-slate-400 hover:bg-slate-900 transition-all cursor-pointer"
              >
                Downgrade to Free
              </button>
            ) : (
              <div className="mt-6 text-center text-xs font-medium text-slate-500 py-2.5">
                Current Active Plan
              </div>
            )}
          </div>

          {/* Premium Plan */}
          <div className="relative flex flex-col justify-between rounded-2xl border border-violet-500/30 bg-gradient-to-b from-violet-950/20 to-slate-950 p-5 shadow-xl shadow-violet-950/10">
            {/* Best Value Ribbon */}
            <div className="absolute -top-3 right-4 flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
              <Zap className="h-3 w-3 fill-current" /> Recommended
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-violet-400">Pro Scholar</span>
                { isPremium && (
                  <span className="rounded bg-violet-500/20 px-2 py-0.5 text-[10px] font-extrabold text-violet-300 border border-violet-500/20">Active</span>
                )}
              </div>
              <div className="mt-2 flex items-baseline text-white">
                <span className="text-3xl font-extrabold tracking-tight">$9.99</span>
                <span className="ml-1 text-xs text-slate-400">/ month</span>
              </div>
              <p className="mt-3 text-xs text-slate-300">
                Empower your research, essays, and physics/math grades with full AI autonomy.
              </p>

              <ul className="mt-5 space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-violet-400 shrink-0" />
                  <span className="font-medium text-white">Unlimited GPT-4o AI Tutor</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-violet-400 shrink-0" />
                  <span className="flex items-center gap-1.5 font-medium">
                    <Volume2 className="h-3.5 w-3.5 text-pink-400" />
                    AI Voice Speech Assistant (TTS/STT)
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-violet-400 shrink-0" />
                  <span>Unlimited note summarizer & folder systems</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-violet-400 shrink-0" />
                  <span className="flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-amber-400" />
                    Premium exam preparation analytics
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-violet-400 shrink-0" />
                  <span>Real-time custom study plan generators</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleUpgradeToggle}
              className={`mt-6 w-full rounded-xl py-2.5 text-xs font-black uppercase tracking-wider text-white transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-lg ${
                isPremium 
                  ? 'bg-slate-800 hover:bg-slate-700' 
                  : 'bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 shadow-violet-500/20'
              }`}
            >
              {isPremium ? 'Switch Back to Basic' : 'Activate Premium Pro (Free Simulation)'}
            </button>
          </div>

        </div>

        {/* Feature comparison banner */}
        <div className="bg-slate-950/80 p-5 border-t border-slate-800 text-center">
          <div className="flex justify-center gap-6 text-[10px] text-slate-500">
            <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> 256-Bit SSL Encrypted</span>
            <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5" /> Cancel anytime with 1 click</span>
            <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5" /> Over 15,000+ Students active</span>
          </div>
        </div>

      </div>
    </div>
  );
}
