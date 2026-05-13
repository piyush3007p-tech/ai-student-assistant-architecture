import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Mic, Sparkles, RefreshCw, Play, Square, Settings, Star } from 'lucide-react';

interface VoiceAssistantProps {
  isPremium: boolean;
  onOpenPricing: () => void;
}

export default function VoiceAssistant({ isPremium, onOpenPricing }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState<'female' | 'male' | 'space_robot'>('female');
  
  const [promptText, setPromptText] = useState('Create a study plan for my physics exam');
  const [voiceResponse, setVoiceResponse] = useState<string>('');
  const [processing, setProcessing] = useState(false);

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = (text: string) => {
    if (!ttsEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // cancel current speech

    const cleanText = text.replace(/[#*$\\]/g, ''); // strip markdown
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Attempt to customize rate and pitch based on selected mock actor
    if (selectedVoice === 'space_robot') {
      utterance.pitch = 0.5;
      utterance.rate = 0.85;
    } else if (selectedVoice === 'male') {
      utterance.pitch = 0.9;
      utterance.rate = 1.0;
    } else {
      utterance.pitch = 1.15;
      utterance.rate = 1.05;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleMicToggle = () => {
    if (!isPremium) {
      onOpenPricing();
      return;
    }

    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      setVoiceResponse('');
      stopSpeaking();

      // Simulate listening and receiving speech input
      setTimeout(() => {
        setIsListening(false);
        handleSendVoicePrompt("Create a study plan for my physics exam");
      }, 3000);
    }
  };

  const handleSendVoicePrompt = async (text: string) => {
    setProcessing(true);
    setVoiceResponse('');
    stopSpeaking();

    // Simulate OpenAI API Voice response
    await new Promise(r => setTimeout(r, 1500));

    const lowercasePrompt = text.toLowerCase();
    let response = `Sure! I have received your voice request: "${text}". Let me build a custom layout for you. I suggest dedicating 40 minutes to active study, followed by a targeted quiz to check your knowledge.`;

    if (lowercasePrompt.includes('physics') || lowercasePrompt.includes('exam') || lowercasePrompt.includes('study plan')) {
      response = `Sure! I have generated your express Physics Exam study plan. Here is how we will approach your mechanical syllabus: First, spend 35 minutes reviewing kinematics formulas. Second, take a 5-question AI-generated physics quiz. Finally, focus on rotational kinetic energy to fix your weakest concept. I have updated your personalized calendar accordingly!`;
    }
    
    setVoiceResponse(response);
    setProcessing(false);

    // Automatically trigger speech synthesis
    setTimeout(() => {
      speakText(response);
    }, 200);
  };

  const handleSubmitCustomText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim() || processing) return;
    handleSendVoicePrompt(promptText);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          🎙️ Live AI Voice Speech Assistant
        </h2>
        <p className="text-xs text-slate-400">
          Powered by OpenAI Whisper (STT) and TTS models. Talk naturally to synthesize calendars, quiz notes, or solve questions on the go.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left column (1/3): Pulsing glowing microphone visualizer */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col items-center justify-center text-center space-y-6 min-h-[380px] relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-pink-500/10 blur-2xl"></div>
          
          <span className="inline-flex items-center gap-1 rounded-full bg-pink-500/10 px-2.5 py-0.5 text-[9px] font-bold text-pink-300 border border-pink-500/20">
            {isPremium ? 'PRO SPEECH ACTIVE' : 'PREMIUM TRIAL LOCK'}
          </span>

          {/* Voice Orb animation */}
          <div className="relative flex items-center justify-center h-40 w-40">
            {/* outer visualizer waves */}
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full bg-pink-500/20 animate-ping"></div>
                <div className="absolute -inset-4 rounded-full bg-violet-500/10 animate-pulse delay-75"></div>
                <div className="absolute -inset-8 rounded-full bg-indigo-500/5 animate-pulse delay-150"></div>
              </>
            )}
            {isSpeaking && (
              <>
                <div className="absolute inset-2 rounded-full border border-pink-400/40 animate-spin" style={{ animationDuration: '3s' }}></div>
                <div className="absolute inset-4 rounded-full border border-dashed border-violet-400/40 animate-spin" style={{ animationDuration: '6s' }}></div>
              </>
            )}

            {/* Glowing inner button */}
            <button
              onClick={handleMicToggle}
              className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-full shadow-2xl transition-all transform active:scale-95 cursor-pointer ${
                isListening 
                  ? 'bg-gradient-to-tr from-pink-500 to-rose-600 text-white animate-pulse' 
                  : isSpeaking
                  ? 'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-violet-900/50'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-pink-500/40'
              }`}
            >
              {isListening ? (
                <Mic className="h-10 w-10 text-white" />
              ) : isSpeaking ? (
                <Volume2 className="h-10 w-10 text-white" />
              ) : (
                <Mic className="h-10 w-10" />
              )}
            </button>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-200">
              {isListening ? 'Listening to your voice...' : isSpeaking ? 'AI Voice Response Playing' : 'Click to Speak Naturally'}
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 max-w-xs leading-relaxed">
              {isListening 
                ? 'Say: "Create a study plan for my physics exam" or ask any tutoring question now...' 
                : isSpeaking 
                ? 'Adjust sound volume, voice styles, or click Stop below to abort playback.' 
                : 'Simulate natural classroom tutoring. Tap the microphone and say your goals.'}
            </p>
          </div>

          {/* Action triggers below mic */}
          <div className="flex gap-2 w-full">
            {isSpeaking ? (
              <button
                onClick={stopSpeaking}
                className="w-full flex items-center justify-center gap-1 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 py-2 text-xs font-bold text-rose-400 cursor-pointer"
              >
                <Square className="h-3.5 w-3.5 fill-current" /> Stop Speaking
              </button>
            ) : (
              <button
                onClick={() => speakText(voiceResponse || "Hello! Try typing a custom request and click submit, then listen to my response.")}
                disabled={!voiceResponse && !promptText}
                className="w-full flex items-center justify-center gap-1 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 py-2 text-xs font-bold text-slate-300 cursor-pointer disabled:opacity-50"
              >
                <Play className="h-3.5 w-3.5 fill-current" /> Playback Voice
              </button>
            )}
          </div>

          {/* Premium Prompt Locker */}
          {!isPremium && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
              <Star className="h-8 w-8 text-amber-400 animate-pulse mb-2" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Voice Assistant Locked</h4>
              <p className="text-[10px] text-slate-400 max-w-xs mt-1.5 leading-relaxed">
                Unlock high-fidelity Text-To-Speech (TTS) models and real microphone triggers by upgrading to Premium.
              </p>
              <button
                onClick={onOpenPricing}
                className="mt-4 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-white hover:opacity-90 transition-all cursor-pointer"
              >
                Upgrade to Premium
              </button>
            </div>
          )}

        </div>

        {/* Right columns (2/3): Custom query triggers and text dialogue display */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Settings Bar */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-300">Voice Synthesis Settings</span>
            </div>

            <div className="flex items-center gap-3">
              {/* TTS Switch */}
              <div className="flex items-center gap-1.5 border-r border-slate-850 pr-3 mr-1">
                <button
                  onClick={() => setTtsEnabled(!ttsEnabled)}
                  className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white transition-all cursor-pointer"
                  title={ttsEnabled ? 'Disable Speech Output' : 'Enable Speech Output'}
                >
                  {ttsEnabled ? <Volume2 className="h-4 w-4 text-violet-400" /> : <VolumeX className="h-4 w-4 text-slate-600" />}
                </button>
                <span className="text-[10px] font-bold text-slate-400">{ttsEnabled ? 'Speech Output: ON' : 'Speech Output: OFF'}</span>
              </div>

              {/* Actor selection */}
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value as any)}
                className="rounded-lg bg-slate-950 border border-slate-850 text-[10px] font-bold text-slate-300 py-1.5 px-2.5 focus:outline-none"
              >
                <option value="female">Voice: Evelyn (Female)</option>
                <option value="male">Voice: Arthur (Male)</option>
                <option value="space_robot">Voice: Astro-Robot (Space)</option>
              </select>
            </div>
          </div>

          {/* Dialogue Form and Output Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5 flex flex-col justify-between min-h-[290px]">
            
            <form onSubmit={handleSubmitCustomText} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Natural Voice Input (Simulated Dialogue Prompt)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="e.g., 'Create a study plan for my physics exam' or ask a question..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-3 pr-24 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:border-violet-500 focus:outline-none"
                  />
                  <div className="absolute right-1.5 top-1.5 flex gap-1">
                    <button
                      type="button"
                      onClick={() => setPromptText('Create a study plan for my physics exam')}
                      className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded px-2 py-1"
                    >
                      Physics Plan
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={processing || !promptText.trim()}
                  className="rounded-xl bg-violet-600 hover:bg-violet-500 px-4 py-2 text-xs font-bold text-white shadow-md disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {processing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                  Submit Voice Command
                </button>
              </div>
            </form>

            {/* Conversation Dialog Output Bubble */}
            <div className="mt-5 border-t border-slate-800 pt-4 flex-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Transcript Reply Dialogue</span>
              
              {processing && (
                <div className="flex items-center justify-center py-8 space-y-2 flex-col">
                  <RefreshCw className="h-6 w-6 text-pink-400 animate-spin" />
                  <p className="text-[11px] text-slate-400">Whisper transcribing audio response...</p>
                </div>
              )}

              {!processing && voiceResponse && (
                <div className="mt-2.5 rounded-xl border border-slate-800 bg-slate-950/60 p-4 animate-fade-in flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pink-500/10 border border-pink-500/20 text-[10px] font-black text-pink-400">
                    AI
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400">Voice Response transcript</span>
                    <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-sans mt-1">
                      {voiceResponse}
                    </p>
                  </div>
                </div>
              )}

              {!processing && !voiceResponse && (
                <p className="text-xs text-slate-500 italic py-8 text-center">
                  Submit the Physics plan command above, or speak into the microphone to hear the vocal response play.
                </p>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
