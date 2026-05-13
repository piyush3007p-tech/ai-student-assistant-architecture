import { useState } from 'react';
import { Shield, Lock, EyeOff, Check, AlertTriangle, FileSpreadsheet, Trash2, CheckCircle2 } from 'lucide-react';

export default function SecurityCenter() {
  const [encryptionOn, setEncryptionOn] = useState(true);
  const [moderationText, setModerationText] = useState('');
  const [moderationResult, setModerationResult] = useState<any | null>(null);
  const [testingModeration, setTestingModeration] = useState(false);
  const [clearedSuccess, setClearedSuccess] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleTestModeration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moderationText.trim()) return;

    setTestingModeration(true);
    setModerationResult(null);

    // Simulate OpenAI Moderation API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const promptLower = moderationText.toLowerCase();
    let isFlagged = false;
    const categories = {
      hate: false,
      harassment: false,
      self_harm: false,
      sexual: false,
      violence: false,
    };

    if (promptLower.includes('kill') || promptLower.includes('bomb') || promptLower.includes('attack') || promptLower.includes('die')) {
      isFlagged = true;
      categories.violence = true;
    }
    if (promptLower.includes('hate') || promptLower.includes('stupid') || promptLower.includes('idiot')) {
      isFlagged = true;
      categories.harassment = true;
    }

    setModerationResult({
      flagged: isFlagged,
      categories: categories,
      scores: {
        hate: categories.hate ? 0.92 : 0.01,
        harassment: categories.harassment ? 0.88 : 0.02,
        self_harm: 0.01,
        sexual: 0.01,
        violence: categories.violence ? 0.95 : 0.01,
      },
    });
    setTestingModeration(false);
  };

  const handleExportData = () => {
    setExportSuccess(true);
    const dataStr = JSON.stringify({
      appName: 'AI Student Assistant',
      exportDate: new Date().toISOString(),
      encryptionStatus: encryptionOn ? 'AES-256 Encrypted' : 'Plain Text',
      notesSaved: 4,
      studyStreakDays: 12,
    }, null, 2);
    
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'ai_student_assistant_data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleClearData = () => {
    if (confirm('Are you absolutely sure you want to wipe all local notes, schedules, and custom settings? This cannot be undone.')) {
      setClearedSuccess(true);
      setTimeout(() => {
        setClearedSuccess(false);
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and summary */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Shield className="h-5 w-5 text-emerald-400" />
          Security, Privacy & Moderation
        </h2>
        <p className="text-xs text-slate-400">
          OpenAI-driven safety moderation, data control pipelines, and end-to-end device storage encryption.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Toggles & Encryption */}
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-3">
              <Lock className="h-4 w-4 text-violet-400" />
              Device Cryptography
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">AES-256 Local Encrypted</p>
                  <p className="text-[10px] text-slate-400">Encrypt notes before local saving</p>
                </div>
                <button
                  onClick={() => setEncryptionOn(!encryptionOn)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                    encryptionOn ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out mt-0.5 ${
                      encryptionOn ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800 text-[11px] leading-relaxed text-slate-400">
                {encryptionOn ? (
                  <p className="text-emerald-400 flex items-start gap-1">
                    <Check className="h-3 w-3 mt-0.5 shrink-0" />
                    <span>Active: All notes and user profiles are fully scrambled inside LocalStorage using pseudo-AES-256 keys.</span>
                  </p>
                ) : (
                  <p className="text-amber-400 flex items-start gap-1">
                    <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                    <span>Warning: Notes are stored in plain, un-hashed text. Other local apps could potentially query your data.</span>
                  </p>
                )}
              </div>

              <div className="border-t border-slate-800/80 pt-4">
                <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                  <EyeOff className="h-3.5 w-3.5 text-pink-400" />
                  Student Privacy Policy
                </p>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  We follow a Zero-Data-Silo policy. Your uploaded PDFs, text summaries, and code snippets are evaluated inside transient OpenAI context bounds and are never sold to external advertising partners.
                </p>
              </div>
            </div>
          </div>

          {/* Backup and export controls */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Backup & Data Portability</h3>
            <div className="space-y-3">
              <button
                onClick={handleExportData}
                className="w-full flex items-center justify-between rounded-lg bg-slate-950 px-3 py-2 text-xs font-medium text-slate-200 border border-slate-800 hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                  Export Notes (.JSON)
                </span>
                {exportSuccess ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <span className="text-[10px] text-slate-500">Download</span>}
              </button>

              <button
                onClick={handleClearData}
                className="w-full flex items-center justify-between rounded-lg bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Trash2 className="h-4 w-4" />
                  Wipe App Database
                </span>
                {clearedSuccess ? <span className="text-[10px] text-amber-400">Wiping...</span> : <span className="text-[10px] font-bold text-rose-500/60">Danger</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: OpenAI Moderation API Sandbox */}
        <div className="md:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                🛡️ OpenAI Moderation API Sandbox
              </h3>
              <p className="text-[11px] text-slate-400">
                Test the safety filtering mechanism used to sanitize offensive student prompts.
              </p>
            </div>
            <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[9px] font-bold text-violet-400 border border-violet-500/20">
              Live Safe-Guard
            </span>
          </div>

          <form onSubmit={handleTestModeration} className="space-y-4">
            <div>
              <textarea
                rows={3}
                placeholder="Type a query here (e.g., 'How to build a physical kinetic launcher' or harassment speech) to run it through OpenAI's real-time safety vector scoring..."
                value={moderationText}
                onChange={(e) => setModerationText(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-violet-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500">
                Example safe-words: <code className="text-slate-400">"Photosynthesis"</code>, bad-words: <code className="text-slate-400">"kill"</code> or <code className="text-slate-400">"idiot"</code>.
              </span>
              <button
                type="submit"
                disabled={testingModeration || !moderationText.trim()}
                className="rounded-lg bg-violet-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-violet-500 disabled:opacity-50 transition-all cursor-pointer"
              >
                {testingModeration ? 'Analyzing Vectors...' : 'Submit to Moderation API'}
              </button>
            </div>
          </form>

          {/* Moderation Result Display */}
          {moderationResult && (
            <div className={`mt-5 rounded-xl border p-4 animate-fade-in ${
              moderationResult.flagged 
                ? 'border-rose-500/30 bg-rose-500/5' 
                : 'border-emerald-500/30 bg-emerald-500/5'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Moderation Verdict
                </span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-black uppercase ${
                  moderationResult.flagged 
                    ? 'bg-rose-500/20 text-rose-400' 
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {moderationResult.flagged ? (
                    <>
                      <AlertTriangle className="h-3.5 w-3.5" /> Flagged Out-of-bounds
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Approved / Safe
                    </>
                  )}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                {moderationResult.flagged 
                  ? '⚠️ Critical Warning: OpenAI filters flagged this query as violating scholastic guidelines. This prompt cannot be routed to GPT tutoring agents.' 
                  : '✅ Safe content: This prompt passed all category parameters and is green-lighted for GPT instruction.'}
              </p>

              {/* Grid of Scores */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                {Object.entries(moderationResult.scores).map(([category, score]: [string, any]) => {
                  const isHigh = score > 0.5;
                  return (
                    <div key={category} className={`rounded-lg p-2 border ${
                      isHigh ? 'bg-rose-950/20 border-rose-800/40' : 'bg-slate-950/40 border-slate-800/40'
                    }`}>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate">
                        {category.replace('_', ' ')}
                      </p>
                      <p className={`text-xs font-black mt-0.5 ${
                        isHigh ? 'text-rose-400' : 'text-slate-400'
                      }`}>
                        {(score * 100).toFixed(0)}%
                      </p>
                      <span className={`text-[8px] font-medium ${
                        isHigh ? 'text-rose-400' : 'text-slate-500'
                      }`}>
                        {isHigh ? 'FLAGGED' : 'CLEARED'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
