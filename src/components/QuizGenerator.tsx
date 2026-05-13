import { useState } from 'react';
import { Sparkles, RefreshCw, Trophy, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { MOCK_QUIZZES, MockQuiz } from '../utils/mockData';
import { callOpenAIQuizGenerator } from '../utils/openai';

export default function QuizGenerator() {
  const [quizState, setQuizState] = useState<'setup' | 'playing' | 'score'>('setup');
  
  // Setup Parameters
  const [selectedTopicSource, setSelectedTopicSource] = useState<'bio' | 'phys' | 'cs' | 'custom'>('bio');
  const [customContent, setCustomContent] = useState('');
  const [quizType, setQuizType] = useState<'mcq' | 'tf'>('mcq');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [generating, setGenerating] = useState(false);

  // Playing parameters
  const [activeQuiz, setActiveQuiz] = useState<MockQuiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const handleStartQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    try {
      if (selectedTopicSource === 'custom') {
        if (!customContent.trim()) {
          alert("Please paste some study guide notes first!");
          setGenerating(false);
          return;
        }
        
        // Generate via OpenAI / Mock parser
        const customRes = await callOpenAIQuizGenerator(customContent, quizType, difficulty);
        
        const newQuiz: MockQuiz = {
          id: 'q_custom_' + Date.now(),
          title: 'Your Custom AI Generated Quiz',
          subject: 'Custom Topic Note',
          difficulty: difficulty,
          questions: customRes.questions
        };

        setActiveQuiz(newQuiz);
      } else {
        // Load high-quality preloaded quizzes
        const matched = MOCK_QUIZZES.find(q => {
          if (selectedTopicSource === 'bio' && q.id === 'q1') return true;
          if (selectedTopicSource === 'phys' && q.id === 'q2') return true;
          if (selectedTopicSource === 'cs' && q.id === 'q3') return true;
          return false;
        });

        if (matched) {
          setActiveQuiz(matched);
        } else {
          setActiveQuiz(MOCK_QUIZZES[0]);
        }
      }

      // Initialize game loop
      setCurrentQuestionIndex(0);
      setSelectedAnswerIndex(null);
      setCorrectCount(0);
      setQuizState('playing');

    } catch (err) {
      alert("Error generating quiz. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectAnswer = (idx: number) => {
    if (selectedAnswerIndex !== null) return; // Prevent multiple clicks on same question

    setSelectedAnswerIndex(idx);

    const isCorrect = idx === activeQuiz?.questions[currentQuestionIndex].correctAnswerIndex;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!activeQuiz) return;

    if (currentQuestionIndex + 1 < activeQuiz.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswerIndex(null); // Reset for next
    } else {
      setQuizState('score');
    }
  };

  const handleRestart = () => {
    setQuizState('setup');
    setSelectedAnswerIndex(null);
    setActiveQuiz(null);
  };

  const currentQuestion = activeQuiz?.questions[currentQuestionIndex];
  const scorePercentage = activeQuiz ? Math.round((correctCount / activeQuiz.questions.length) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          🧠 AI Quiz Generator & Sandbox
        </h2>
        <p className="text-xs text-slate-400">
          Transform raw text, PDFs, or subject notes into interactive Multiple Choice & True/False tests to strengthen active recall.
        </p>
      </div>

      {/* SETUP SCREEN */}
      {quizState === 'setup' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Main setup form */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              🔧 Customize Test Parameters
            </h3>

            <form onSubmit={handleStartQuiz} className="space-y-4">
              {/* Select Source Topic */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                  Select Target Content Source
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTopicSource('bio')}
                    className={`rounded-xl border p-3 text-xs font-semibold text-center transition-all cursor-pointer ${
                      selectedTopicSource === 'bio'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🌱 Biology (Photosynthesis)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTopicSource('phys')}
                    className={`rounded-xl border p-3 text-xs font-semibold text-center transition-all cursor-pointer ${
                      selectedTopicSource === 'phys'
                        ? 'border-violet-500 bg-violet-500/10 text-violet-300'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🚀 Physics AP (Kinematics)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTopicSource('cs')}
                    className={`rounded-xl border p-3 text-xs font-semibold text-center transition-all cursor-pointer ${
                      selectedTopicSource === 'cs'
                        ? 'border-sky-500 bg-sky-500/10 text-sky-300'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    💻 CompSci (Sorting)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTopicSource('custom')}
                    className={`rounded-xl border p-3 text-xs font-semibold text-center transition-all cursor-pointer ${
                      selectedTopicSource === 'custom'
                        ? 'border-pink-500 bg-pink-500/10 text-pink-300'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ✍️ Paste Custom Text Notes
                  </button>
                </div>
              </div>

              {/* Custom Text input if custom selected */}
              {selectedTopicSource === 'custom' && (
                <div className="animate-slide-down">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                    Paste Lecture notes / Article content (At least 1 paragraph)
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Paste textbook sections, notes, or essays here. OpenAI will read it and instantly draft a customized 3-question MCQ quiz..."
                    value={customContent}
                    onChange={(e) => setCustomContent(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:border-violet-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Grid: Type and difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                    Question Format
                  </label>
                  <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setQuizType('mcq')}
                      className={`w-1/2 rounded-lg py-1.5 text-xs font-bold text-center transition-all cursor-pointer ${
                        quizType === 'mcq' ? 'bg-violet-600 text-white' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      Multiple Choice (MCQ)
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuizType('tf')}
                      className={`w-1/2 rounded-lg py-1.5 text-xs font-bold text-center transition-all cursor-pointer ${
                        quizType === 'tf' ? 'bg-violet-600 text-white' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      True / False
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                    Difficulty Scale
                  </label>
                  <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                    {(['Easy', 'Medium', 'Hard'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setDifficulty(lvl)}
                        className={`w-1/3 rounded-lg py-1.5 text-xs font-bold text-center transition-all cursor-pointer ${
                          difficulty === lvl ? 'bg-violet-600 text-white' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={generating}
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 py-2.5 text-xs font-bold text-white shadow-lg disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {generating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    OpenAI Compiling Exam Questions...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate & Start Practice Quiz
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Active Recall details */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Why Quiz Yourself?</h3>
            <div className="space-y-3.5">
              <div className="flex gap-2 items-start">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-violet-500/10 text-violet-400 font-bold text-xs border border-violet-500/15">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Bypasses Passive Fluency</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Simply reading notes creates an illusion of competence. Testing reveals exact logical blanks.</p>
                </div>
              </div>

              <div className="flex gap-2 items-start">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-violet-500/10 text-violet-400 font-bold text-xs border border-violet-500/15">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Step-by-Step Explanations</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Every question generated provides detailed conceptual reasoning immediately upon answering.</p>
                </div>
              </div>

              <div className="flex gap-2 items-start">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-violet-500/10 text-violet-400 font-bold text-xs border border-violet-500/15">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Custom Syllabus Target</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Difficulty levels adjust the syntactic depth of GPT models to mimic professional university AP midterm standards.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* QUIZ TAKING GAME SCREEN */}
      {quizState === 'playing' && activeQuiz && currentQuestion && (
        <div className="max-w-3xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-6">
          
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                {activeQuiz.subject} (Level: {activeQuiz.difficulty})
              </span>
              <span className="text-slate-300 font-bold">
                Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
              </span>
            </div>

            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all"
                style={{ width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Text block */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-850">
            <h3 className="text-sm sm:text-base font-bold text-slate-100 font-sans leading-relaxed">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswerIndex === idx;
              const isCorrect = idx === currentQuestion.correctAnswerIndex;
              const hasAnswered = selectedAnswerIndex !== null;

              let btnStyle = 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:text-white';
              
              if (hasAnswered) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold';
                } else if (isSelected) {
                  btnStyle = 'border-rose-500 bg-rose-500/10 text-rose-300 font-bold';
                } else {
                  btnStyle = 'border-slate-800 bg-slate-950/20 text-slate-600 cursor-not-allowed';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectAnswer(idx)}
                  disabled={hasAnswered}
                  className={`w-full rounded-xl border p-4 text-xs sm:text-sm text-left transition-all flex items-center justify-between gap-3 ${btnStyle} ${
                    !hasAnswered ? 'cursor-pointer' : ''
                  }`}
                >
                  <span className="font-medium">{option}</span>
                  {hasAnswered && (
                    <div className="shrink-0">
                      {isCorrect && <CheckCircle className="h-5 w-5 text-emerald-400" />}
                      {isSelected && !isCorrect && <XCircle className="h-5 w-5 text-rose-400" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Detailed explanation block - slides down upon answer selection */}
          {selectedAnswerIndex !== null && (
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 space-y-2 animate-slide-down">
              <span className="text-[9px] font-black uppercase text-violet-400 tracking-wider">AI Tutor Solution Guide</span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {currentQuestion.explanation}
              </p>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNextQuestion}
                  className="rounded-xl bg-violet-600 hover:bg-violet-500 px-4 py-2 text-xs font-bold text-white flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                >
                  {currentQuestionIndex + 1 === activeQuiz.questions.length ? 'See Final Score' : 'Next Question'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* QUIZ SCORE OVERVIEW SCREEN */}
      {quizState === 'score' && activeQuiz && (
        <div className="max-w-md mx-auto rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-center space-y-6 animate-scale-up">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <Trophy className="h-8 w-8 text-amber-400" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">Quiz Completed!</h3>
            <p className="text-xs text-slate-400 mt-1">Excellent practice. Passive study is officially defeated.</p>
          </div>

          {/* Large percentage display */}
          <div className="py-4 bg-slate-950/60 rounded-2xl border border-slate-850">
            <h4 className="text-4xl font-black text-white">{scorePercentage}%</h4>
            <div className="flex justify-center gap-4 text-xs mt-2 text-slate-400 font-semibold">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle className="h-3.5 w-3.5" /> {correctCount} Correct
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-rose-400">
                <XCircle className="h-3.5 w-3.5" /> {activeQuiz.questions.length - correctCount} Incorrect
              </span>
            </div>
          </div>

          {/* Motivational comment */}
          <div className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
            {scorePercentage === 100 ? (
              <p className="text-emerald-300 font-bold">✨ Masterful Performance! You have 100% conceptual clarity. Keep doing active recalls before midterm.</p>
            ) : scorePercentage >= 70 ? (
              <p className="text-violet-300 font-bold">👍 Strong Result! You have a solid grasp on most areas, but review the explanations to fix minor gaps.</p>
            ) : (
              <p className="text-amber-300 font-bold">💡 Learning Opportunity. Go to the "Smart Chat Tutor" and ask to "Explain {activeQuiz.subject} simply" for targeted coaching.</p>
            )}
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              onClick={handleRestart}
              className="w-1/2 rounded-xl bg-slate-850 hover:bg-slate-800 py-2.5 text-xs font-bold text-slate-300 cursor-pointer"
            >
              Try Another Quiz
            </button>
            <button
              onClick={() => {
                // Play same quiz again
                setCurrentQuestionIndex(0);
                setSelectedAnswerIndex(null);
                setCorrectCount(0);
                setQuizState('playing');
              }}
              className="w-1/2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 py-2.5 text-xs font-bold text-white cursor-pointer"
            >
              Retake This Quiz
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
