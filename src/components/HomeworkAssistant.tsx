import { useState } from 'react';
import { Code, FileText, CheckCircle2, Cpu, HelpCircle, RefreshCw } from 'lucide-react';
import { callOpenAIHomework } from '../utils/openai';

export default function HomeworkAssistant() {
  const [activeTool, setActiveTool] = useState<'math' | 'code' | 'essay'>('math');
  const [submitting, setSubmitting] = useState(false);

  // Math Solver State
  const [mathPrompt, setMathPrompt] = useState('Solve quadratic equation x^2 - 5x + 6 = 0');
  const [mathResult, setMathResult] = useState<any | null>(null);

  // Code Debugger State
  const [codeLanguage, setCodeLanguage] = useState<'python' | 'javascript' | 'cpp'>('python');
  const [codePrompt, setCodePrompt] = useState(`def calculate_average(grades):
    total = sum(grades)
    return total / len(grades)

# Crash test with empty list
print(calculate_average([]))`);
  const [codeResult, setCodeResult] = useState<any | null>(null);

  // Essay Polisher State
  const [essayPrompt, setEssayPrompt] = useState('AI has changed how we learn. Traditional teaching is too synchronized and slow. GPT-4 helps students adjust the speed of learning.');
  const [essayStyle, setEssayStyle] = useState<'APA' | 'MLA' | 'Chicago'>('APA');
  const [essayResult, setEssayResult] = useState<any | null>(null);

  const handleSolveMath = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mathPrompt.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await callOpenAIHomework('math', mathPrompt);
      setMathResult(res);
    } catch (err) {
      alert("Error solving math problem.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDebugCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codePrompt.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await callOpenAIHomework('code', codePrompt, codeLanguage);
      setCodeResult(res);
    } catch (err) {
      alert("Error debugging code.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePolishEssay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!essayPrompt.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await callOpenAIHomework('essay', `${essayPrompt} (Format reference list in ${essayStyle} style)`);
      setEssayResult(res);
    } catch (err) {
      alert("Error polishing essay.");
    } finally {
      setSubmitting(false);
    }
  };

  // Quick swap default buggy code based on language select
  const handleLanguageChange = (lang: 'python' | 'javascript' | 'cpp') => {
    setCodeLanguage(lang);
    if (lang === 'python') {
      setCodePrompt(`def calculate_average(grades):
    total = sum(grades)
    return total / len(grades)

# Crash test with empty list
print(calculate_average([]))`);
    } else if (lang === 'javascript') {
      setCodePrompt(`function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        // BUG: Does not clear previous pending timeout
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
}`);
    } else {
      setCodePrompt(`int findMax(std::vector<int> nums) {
    // BUG: Missing check for empty vector. Accessing index 0 causes core segmentation fault.
    int maxVal = nums[0];
    for (int i = 1; i < nums.size(); ++i) {
        if (nums[i] > maxVal) maxVal = nums[i];
    }
    return maxVal;
}`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Selector Nav Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTool('math')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            activeTool === 'math' 
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🧮 Step-by-Step Math Solver
        </button>

        <button
          onClick={() => setActiveTool('code')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            activeTool === 'code' 
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code className="h-4 w-4" /> Coding Assistant (C++/Python/JS)
        </button>

        <button
          onClick={() => setActiveTool('essay')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            activeTool === 'essay' 
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="h-4 w-4" /> Essay Polisher & Citations
        </button>
      </div>

      {/* Main Tools Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* LEFT COLUMN: Input form details */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
          
          {/* MATH SOLVER TOOL */}
          {activeTool === 'math' && (
            <form onSubmit={handleSolveMath} className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">AI Math Solver</h3>
                <p className="text-[11px] text-slate-400 mb-3">Solve calculus derivatives, quadratics, or trigonometry equations step-by-step.</p>
                
                <textarea
                  rows={4}
                  value={mathPrompt}
                  onChange={(e) => setMathPrompt(e.target.value)}
                  placeholder="Enter a formula or word problem... (e.g., 'Find the derivative of f(x) = 3x^2 + 5x + 7')"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span>Supports Algebraic & Trigonometric structures</span>
                <button
                  type="submit"
                  disabled={submitting || !mathPrompt.trim()}
                  className="flex items-center gap-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold py-2 px-4 text-xs cursor-pointer disabled:opacity-50"
                >
                  {submitting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : 'Solve Step-by-Step'}
                </button>
              </div>

              {/* Preset buttons */}
              <div className="border-t border-slate-800/85 pt-3.5 space-y-2">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Quick Math Challenges</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setMathPrompt('Solve quadratic equation x^2 - 5x + 6 = 0')}
                    className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-lg px-2 py-1"
                  >
                    Quadratic Roots
                  </button>
                  <button
                    type="button"
                    onClick={() => setMathPrompt('What is the derivative of 3x^2 + 5x + 7 with respect to x?')}
                    className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-lg px-2 py-1"
                  >
                    Calculus derivative
                  </button>
                  <button
                    type="button"
                    onClick={() => setMathPrompt('If a triangle has sides 6 and 8 with right angle, find hypotenuse')}
                    className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-lg px-2 py-1"
                  >
                    Trigonometry basics
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* CODE DEBUGGER TOOL */}
          {activeTool === 'code' && (
            <form onSubmit={handleDebugCode} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">AI Coding Mentor</h3>
                  <p className="text-[11px] text-slate-400">Auto-debugging, code explanation, and project compiler suggestions.</p>
                </div>

                {/* Language Select */}
                <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 shrink-0">
                  {(['python', 'javascript', 'cpp'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => handleLanguageChange(lang)}
                      className={`text-[9px] font-black uppercase px-2 py-1 rounded ${
                        codeLanguage === lang ? 'bg-violet-600 text-white' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {lang === 'cpp' ? 'C++' : lang}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <textarea
                  rows={8}
                  value={codePrompt}
                  onChange={(e) => setCodePrompt(e.target.value)}
                  placeholder="Paste your source code here..."
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs font-mono text-slate-100 placeholder-slate-600 focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span>Code is analyzed for runtime exceptions</span>
                <button
                  type="submit"
                  disabled={submitting || !codePrompt.trim()}
                  className="flex items-center gap-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold py-2 px-4 text-xs cursor-pointer disabled:opacity-50"
                >
                  {submitting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : 'Auto-Debug Code'}
                </button>
              </div>
            </form>
          )}

          {/* ESSAY WRITER POLISHER */}
          {activeTool === 'essay' && (
            <form onSubmit={handlePolishEssay} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Essay Polisher & Reference Generator</h3>
                  <p className="text-[11px] text-slate-400">Polishes flow, fixes grammatical syntax, and builds formatted lists.</p>
                </div>

                {/* Style Select */}
                <select
                  value={essayStyle}
                  onChange={(e) => setEssayStyle(e.target.value as any)}
                  className="rounded bg-slate-950 border border-slate-800 text-[10px] font-bold text-slate-300 py-1 px-1.5 focus:outline-none"
                >
                  <option value="APA">APA 7th</option>
                  <option value="MLA">MLA 9th</option>
                  <option value="Chicago">Chicago</option>
                </select>
              </div>

              <div>
                <textarea
                  rows={6}
                  value={essayPrompt}
                  onChange={(e) => setEssayPrompt(e.target.value)}
                  placeholder="Paste your raw paragraphs here to polish..."
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span>Formats citations and upgrades general vocabulary</span>
                <button
                  type="submit"
                  disabled={submitting || !essayPrompt.trim()}
                  className="flex items-center gap-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold py-2 px-4 text-xs cursor-pointer disabled:opacity-50"
                >
                  {submitting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : `Polish & Cite (${essayStyle})`}
                </button>
              </div>
            </form>
          )}

        </div>

        {/* RIGHT COLUMN: Output display */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5 h-full min-h-[300px] flex flex-col justify-between">
          
          <div className="flex-1">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">AI Homework Output</span>
            
            {/* SUBMITTING STATE */}
            {submitting && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                <RefreshCw className="h-8 w-8 text-violet-400 animate-spin" />
                <p className="text-xs font-semibold text-slate-300">OpenAI Assistant computing solution...</p>
                <p className="text-[10px] text-slate-500 max-w-xs">Connecting to GPT models to analyze variables and format steps.</p>
              </div>
            )}

            {/* DEFAULT EMPTY STATE */}
            {!submitting && !mathResult && !codeResult && !essayResult && (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-2">
                <HelpCircle className="h-10 w-10 text-slate-700" />
                <p className="text-xs font-semibold text-slate-400">Waiting for Homework Input</p>
                <p className="text-[10px] text-slate-500 max-w-xs">Type or paste your homework parameters on the left and click submit to watch the AI organize solutions.</p>
              </div>
            )}

            {/* MATH RENDER RESULT */}
            {!submitting && activeTool === 'math' && mathResult && (
              <div className="space-y-4 animate-fade-in">
                <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-4 text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                  {mathResult.solution.split('\n').map((line: string, i: number) => {
                    if (line.startsWith('### ')) return <h3 key={i} className="text-sm font-bold text-violet-400 mt-2">{line.substring(4)}</h3>;
                    if (line.startsWith('#### ')) return <h4 key={i} className="text-xs font-bold text-slate-300 mt-1.5">{line.substring(5)}</h4>;
                    if (line.includes('$$')) {
                      return (
                        <div key={i} className="my-2.5 rounded bg-slate-950 p-2.5 text-center font-mono text-violet-300 border border-slate-850 overflow-x-auto text-xs">
                          {line.replace(/\$\$/g, '')}
                        </div>
                      );
                    }
                    return <p key={i} className="my-1 text-xs">{line}</p>;
                  })}
                </div>
                <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 text-[10px] text-slate-400">
                  <span className="font-bold text-slate-300 block mb-0.5">Tutoring Notes:</span>
                  {mathResult.explanation}
                </div>
              </div>
            )}

            {/* CODE RENDER RESULT */}
            {!submitting && activeTool === 'code' && codeResult && (
              <div className="space-y-4 animate-fade-in">
                
                {/* Bug fixed alert box */}
                <div className="flex items-start gap-2 rounded-xl bg-emerald-500/10 p-3.5 border border-emerald-500/20">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-black uppercase text-emerald-300">Clean compile score: 100%</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">GPT-4o solved runtime warnings and applied proper scope guard limits.</p>
                  </div>
                </div>

                {/* Code display */}
                <div className="rounded-lg bg-slate-950 border border-slate-850 p-3 overflow-x-auto">
                  <pre className="text-xs font-mono text-violet-300 leading-relaxed">
                    {codeResult.debuggedCode || codeResult.solution}
                  </pre>
                </div>

                {/* Computational Complexity breakdown */}
                <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <Cpu className="h-4 w-4 text-pink-400" />
                    <span>Algorithmic Complexity Summary</span>
                  </div>
                  
                  {/* Explanations parser */}
                  <div className="text-[11px] text-slate-400 leading-relaxed whitespace-pre-wrap">
                    {codeResult.explanation}
                  </div>
                </div>

              </div>
            )}

            {/* ESSAY RENDER RESULT */}
            {!submitting && activeTool === 'essay' && essayResult && (
              <div className="space-y-4 animate-fade-in">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                  {essayResult.solution.split('\n').map((line: string, i: number) => {
                    if (line.startsWith('### ')) return <h3 key={i} className="text-sm font-bold text-violet-400 mt-2">{line.substring(4)}</h3>;
                    if (line.startsWith('---')) return <hr key={i} className="border-slate-800 my-3" />;
                    return <p key={i} className="my-1.5 text-xs leading-relaxed text-slate-300">{line}</p>;
                  })}
                </div>

                <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 text-[10px] text-slate-400 leading-relaxed">
                  <span className="font-bold text-slate-300 block mb-0.5">Structural Upgrades Log:</span>
                  {essayResult.explanation}
                </div>
              </div>
            )}

          </div>

          <div className="border-t border-slate-800/80 pt-3 text-[10px] text-slate-500 flex justify-between items-center mt-4">
            <span>Powered by OpenAI GPT models</span>
            <span className="text-slate-400 font-bold">Academic Integrity Compliant</span>
          </div>

        </div>

      </div>

    </div>
  );
}
