import React, { useState, useEffect, useRef } from 'react';
import { InterviewQuestion, LanguageCode, SpeechMetrics, AnswerCritique } from '../types';
import { 
  SpeechRecognitionService, 
  AudioVisualizerService, 
  calculateSpeechMetrics, 
  LANGUAGE_LOCALES,
  SpeechDiagnosticLog,
  subscribeToSpeechDiagnostics,
  logSpeechDiagnostic
} from '../utils/speech';
import { StarCritiqueModal } from './StarCritiqueModal';
import { useSettings } from '../context/SettingsContext';
import { 
  Mic, 
  Square, 
  Sparkles, 
  Send,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Trash2,
  Radio,
  Volume2,
  Terminal,
  Activity,
  Waves,
  ChevronDown,
  ChevronUp,
  X,
  Keyboard,
  Command,
  CornerDownLeft,
  Settings
} from 'lucide-react';

interface InterviewStepProps {
  questions: InterviewQuestion[];
  companyName: string;
  onFinishInterview: (answers: AnswerCritique[]) => void;
}

export const InterviewStep: React.FC<InterviewStepProps> = ({
  questions,
  companyName,
  onFinishInterview
}) => {
  const { settings, updateSettings, openSettings } = useSettings();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('en');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  
  // Real-time voice signal detection & status
  const [isVoiceDetected, setIsVoiceDetected] = useState<boolean>(false);
  const [peakAudioLevel, setPeakAudioLevel] = useState<number>(0);
  const [audioPermissionError, setAudioPermissionError] = useState<string | null>(null);
  const [isTranscribingAudio, setIsTranscribingAudio] = useState<boolean>(false);
  const [transcriptionSuccessNotice, setTranscriptionSuccessNotice] = useState<string | null>(null);

  // Real-time speech diagnostics state
  const [diagnosticLogs, setDiagnosticLogs] = useState<SpeechDiagnosticLog[]>([]);
  const [showDiagnostics, setShowDiagnostics] = useState<boolean>(false);

  // Real-time speech metrics
  const [metrics, setMetrics] = useState<SpeechMetrics>({
    wpm: 130,
    paceStatus: 'Optimal',
    confidenceScore: 88,
    clarityScore: 92,
    fillerWordsCount: 0,
    fillerWordsList: [],
    durationSeconds: 0,
    pauseCount: 0
  });

  // 14 Waveform bar heights (percentages)
  const [waveformBars, setWaveformBars] = useState<number[]>([
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15
  ]);

  // Evaluated answers collection
  const [evaluatedAnswers, setEvaluatedAnswers] = useState<AnswerCritique[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeCritique, setActiveCritique] = useState<AnswerCritique | null>(null);

  // Keyboard shortcut feedback toast
  const [shortcutNotice, setShortcutNotice] = useState<string | null>(null);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState<boolean>(false);

  const speechServiceRef = useRef<SpeechRecognitionService | null>(null);
  const visualizerRef = useRef<AudioVisualizerService | null>(null);
  const timerRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const diagnosticsEndRef = useRef<HTMLDivElement | null>(null);

  const currentQuestion = questions[currentIndex] || questions[0];

  const showShortcutFeedback = (msg: string) => {
    setShortcutNotice(msg);
    setTimeout(() => {
      setShortcutNotice(prev => (prev === msg ? null : prev));
    }, 2800);
  };

  // Subscribe to live diagnostics stream
  useEffect(() => {
    logSpeechDiagnostic('PERMISSION', 'info', `Interview session initialized for Question ${currentIndex + 1}/${questions.length}`);

    const unsubscribe = subscribeToSpeechDiagnostics((newLog) => {
      setDiagnosticLogs(prev => [...prev.slice(-99), newLog]);
    });

    speechServiceRef.current = new SpeechRecognitionService();
    visualizerRef.current = new AudioVisualizerService();

    return () => {
      unsubscribe();
      speechServiceRef.current?.stop();
      visualizerRef.current?.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, questions.length]);

  // Auto-scroll diagnostics when open
  useEffect(() => {
    if (showDiagnostics && diagnosticsEndRef.current) {
      diagnosticsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [diagnosticLogs, showDiagnostics]);

  // Update language in service
  useEffect(() => {
    speechServiceRef.current?.setLanguage(selectedLang);
  }, [selectedLang]);

  // Timer loop when recording
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => {
          const next = prev + 1;
          // Dynamically compute speech metrics
          if (transcript.length > 0) {
            const updated = calculateSpeechMetrics(transcript, next);
            setMetrics(updated);
          }
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, transcript]);

  // Helper to transcribe audio using backend Gemini Audio AI
  const transcribeCapturedAudio = async (base64Audio: string, mimeType: string) => {
    if (!base64Audio || base64Audio.length < 50) return;
    setIsTranscribingAudio(true);
    setTranscriptionSuccessNotice(null);
    logSpeechDiagnostic('GEMINI_AI', 'info', `Sending audio stream to Gemini Audio AI for transcription (language: ${selectedLang}, mime: ${mimeType})...`);

    try {
      const res = await fetch('/api/interview/transcribe-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioData: base64Audio,
          mimeType,
          language: selectedLang
        })
      });

      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        const errorText = await res.text();
        logSpeechDiagnostic(
          'GEMINI_AI',
          'warn',
          `Gemini Audio AI non-JSON response (HTTP ${res.status}): ${errorText.substring(0, 100)}`
        );
        return;
      }

      const data = await res.json();
      if (data.success && data.transcript && data.transcript.trim()) {
        const cleanText = data.transcript.trim();
        logSpeechDiagnostic(
          'GEMINI_AI',
          'success',
          `Gemini Audio AI transcribed ${data.wordCount} words: "${cleanText.substring(0, 80)}${cleanText.length > 80 ? '...' : ''}"`,
          { transcript: cleanText, wordCount: data.wordCount }
        );

        setTranscript(prev => {
          if (!prev.trim() || prev.trim().length < 15) {
            return cleanText;
          }
          if (cleanText.toLowerCase().includes(prev.trim().toLowerCase())) {
            return cleanText;
          }
          return `${prev.trim()} ${cleanText}`;
        });

        // Recalculate speech metrics
        const updated = calculateSpeechMetrics(cleanText, Math.max(1, recordingSeconds));
        setMetrics(updated);
        setTranscriptionSuccessNotice(`Transcribed ${data.wordCount} words via Gemini Audio AI`);
        setTimeout(() => setTranscriptionSuccessNotice(null), 5000);
      } else {
        logSpeechDiagnostic('GEMINI_AI', 'warn', data.error ? `Gemini Audio AI notice: ${data.error}` : 'Gemini Audio AI returned no words for this recording.', data);
      }
    } catch (err: any) {
      logSpeechDiagnostic('GEMINI_AI', 'error', `Gemini transcription request failed: ${err?.message || err}`);
      console.warn('Audio transcription failed:', err);
    } finally {
      setIsTranscribingAudio(false);
    }
  };

  const handleStartRecording = async () => {
    logSpeechDiagnostic('PERMISSION', 'info', 'User initiated Start Voice Recording session.');
    setAudioPermissionError(null);
    setTranscriptionSuccessNotice(null);
    setIsRecording(true);
    setIsVoiceDetected(false);
    setPeakAudioLevel(0);

    // 1. Start Audio Capture, Waveform, and MediaRecorder
    if (visualizerRef.current) {
      await visualizerRef.current.start(
        (levels, detected, peak) => {
          if (settings.enableWaveformAnimation) {
            setWaveformBars(levels);
          }
          setIsVoiceDetected(detected);
          setPeakAudioLevel(peak);
        },
        (err, isPerm) => {
          console.warn('Audio capture notice:', err);
          if (isPerm) {
            setAudioPermissionError('Microphone access was denied. Please allow microphone permissions in your browser or type your response directly in the text box.');
            setIsRecording(false);
          } else {
            setAudioPermissionError('No microphone hardware detected. You can type or paste your response directly into the text box below.');
          }
        }
      );
    }

    // 2. Start Web Speech Recognition for instant on-the-fly streaming text
    if (speechServiceRef.current) {
      speechServiceRef.current.start(
        (newTranscript) => {
          if (newTranscript && newTranscript.trim()) {
            setTranscript(newTranscript);
            const updated = calculateSpeechMetrics(newTranscript, Math.max(1, recordingSeconds));
            setMetrics(updated);
          }
        },
        (errMessage, isPerm) => {
          console.warn('Speech Recognition notice:', errMessage);
          if (isPerm) {
            setAudioPermissionError(errMessage);
          }
        },
        transcript
      );
    }
  };

  const handleStopRecording = async () => {
    logSpeechDiagnostic('PERMISSION', 'info', `User stopped voice recording after ${recordingSeconds}s.`);
    setIsRecording(false);
    setIsVoiceDetected(false);
    setPeakAudioLevel(0);
    setWaveformBars([15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15]);

    if (speechServiceRef.current) {
      speechServiceRef.current.stop();
    }

    // Capture recorded audio payload and run Gemini audio transcription
    if (visualizerRef.current) {
      const { base64Audio, mimeType } = await visualizerRef.current.stop();
      if (base64Audio) {
        await transcribeCapturedAudio(base64Audio, mimeType);
      }
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const handleManualTranscribeCurrentAudio = async () => {
    logSpeechDiagnostic('GEMINI_AI', 'info', 'Manual Re-Transcribe Audio triggered by user.');
    if (visualizerRef.current) {
      const { base64Audio, mimeType } = await visualizerRef.current.getRecordedAudioPayload();
      if (base64Audio) {
        await transcribeCapturedAudio(base64Audio, mimeType);
      } else {
        logSpeechDiagnostic('GEMINI_AI', 'warn', 'No audio chunks available in memory buffer to re-transcribe.');
      }
    }
  };

  const handleSubmitAnswer = async () => {
    if (!transcript.trim()) return;
    if (isRecording) {
      await handleStopRecording();
    }
    setIsSubmitting(true);
    logSpeechDiagnostic('SPEECH_RECOGNITION', 'info', `Submitting STAR Answer for evaluation (${wordCount} words)...`);

    try {
      const res = await fetch('/api/interview/critique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion,
          userTranscript: transcript,
          speechMetrics: metrics,
          language: selectedLang,
          companyName
        })
      });

      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        const errorText = await res.text();
        throw new Error(`Server returned HTTP ${res.status}: ${errorText.substring(0, 100)}`);
      }

      const data = await res.json();
      if (data.success && data.critique) {
        const critique = data.critique;
        logSpeechDiagnostic('SPEECH_RECOGNITION', 'success', `STAR Critique generated successfully. Overall score: ${critique.score}/100`);
        setEvaluatedAnswers(prev => [...prev, critique]);
        setActiveCritique(critique);
      }
    } catch (err: any) {
      logSpeechDiagnostic('SPEECH_RECOGNITION', 'error', `Critique submission failed: ${err?.message || err}`);
      console.error('Error submitting answer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearBuffer = () => {
    logSpeechDiagnostic('SPEECH_RECOGNITION', 'info', 'User cleared response text buffer.');
    setTranscript('');
    if (speechServiceRef.current) speechServiceRef.current.setBaseTranscript('');
    setMetrics({
      wpm: 0,
      paceStatus: 'Optimal',
      confidenceScore: 88,
      clarityScore: 92,
      fillerWordsCount: 0,
      fillerWordsList: [],
      durationSeconds: 0,
      pauseCount: 0
    });
  };

  // Global Accessible Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If modal is open, let StarCritiqueModal handle its own keys
      if (activeCritique) return;

      const isTextareaFocused = document.activeElement === textareaRef.current;
      const targetTag = (document.activeElement?.tagName || '').toUpperCase();
      const isInputFocused = targetTag === 'INPUT' || targetTag === 'TEXTAREA' || targetTag === 'SELECT';

      // 1. Submit Answer:
      // - Ctrl+Enter or Cmd+Enter from anywhere (including when typing in the textarea)
      // - Enter when NOT focused inside textarea or input
      if ((e.key === 'Enter' && (e.ctrlKey || e.metaKey)) || (e.key === 'Enter' && !isTextareaFocused && !isInputFocused)) {
        if (transcript.trim() && !isSubmitting && !isTranscribingAudio) {
          e.preventDefault();
          showShortcutFeedback('⌨️ Ctrl+Enter: Submitting STAR response...');
          handleSubmitAnswer();
        }
        return;
      }

      // 2. Toggle Recording (Spacebar accessibility):
      // - Spacebar when focus is NOT inside an active text/input field
      // - Ctrl+Space or Alt+Space from anywhere (even when inside textarea)
      if ((e.code === 'Space' || e.key === ' ') && (e.ctrlKey || e.altKey)) {
        e.preventDefault();
        showShortcutFeedback(isRecording ? '⌨️ Ctrl+Space: Stopping voice recording' : '⌨️ Ctrl+Space: Starting voice recording');
        handleToggleRecording();
        return;
      }

      if ((e.code === 'Space' || e.key === ' ') && !isInputFocused) {
        e.preventDefault();
        showShortcutFeedback(isRecording ? '⌨️ Space: Stopping voice recording' : '⌨️ Space: Starting voice recording');
        handleToggleRecording();
        return;
      }

      // 3. Alt+T: Force Gemini Audio Re-transcribe
      if ((e.key === 't' || e.key === 'T') && e.altKey) {
        if (!isRecording && !isTranscribingAudio) {
          e.preventDefault();
          showShortcutFeedback('⌨️ Alt+T: Triggering Gemini Audio re-transcription');
          handleManualTranscribeCurrentAudio();
        }
        return;
      }

      // 4. Alt+C: Clear Buffer
      if ((e.key === 'c' || e.key === 'C') && e.altKey) {
        if (transcript) {
          e.preventDefault();
          showShortcutFeedback('⌨️ Alt+C: Response buffer cleared');
          handleClearBuffer();
        }
        return;
      }

      // 5. Alt+D: Toggle Audio Diagnostics
      if ((e.key === 'd' || e.key === 'D') && (e.altKey || e.ctrlKey)) {
        e.preventDefault();
        setShowDiagnostics(prev => {
          showShortcutFeedback(!prev ? '⌨️ Alt+D: Opened Audio Diagnostics' : '⌨️ Alt+D: Closed Audio Diagnostics');
          return !prev;
        });
        return;
      }

      // 6. Escape: Close Diagnostics or shortcuts helper
      if (e.key === 'Escape') {
        if (showDiagnostics) {
          setShowDiagnostics(false);
          showShortcutFeedback('⌨️ Esc: Closed Diagnostics');
        } else if (showShortcutsHelp) {
          setShowShortcutsHelp(false);
        } else if (isTextareaFocused) {
          textareaRef.current?.blur();
        }
      }

      // 7. Alt+/ or ?: Toggle Shortcuts Help
      if ((e.key === '?' || (e.key === '/' && e.altKey)) && !isTextareaFocused) {
        e.preventDefault();
        setShowShortcutsHelp(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activeCritique,
    isRecording,
    transcript,
    isSubmitting,
    isTranscribingAudio,
    showDiagnostics,
    showShortcutsHelp,
    currentQuestion,
    selectedLang,
    companyName,
    recordingSeconds
  ]);

  const handleContinueFromCritique = () => {
    setActiveCritique(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setTranscript('');
      setRecordingSeconds(0);
      setAudioPermissionError(null);
      setTranscriptionSuccessNotice(null);
      setMetrics({
        wpm: 130,
        paceStatus: 'Optimal',
        confidenceScore: 88,
        clarityScore: 92,
        fillerWordsCount: 0,
        fillerWordsList: [],
        durationSeconds: 0,
        pauseCount: 0
      });
    } else {
      onFinishInterview(evaluatedAnswers);
    }
  };

  const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div id="interview-session-screen" className="flex-1 flex flex-col h-full relative overflow-y-auto bg-[#0B0F1A] min-h-[calc(100vh-60px)] md:min-h-screen pb-12">
      {/* Top Status & Controls Header */}
      <div className="w-full max-w-4xl mx-auto pt-6 px-4 flex flex-wrap items-center justify-between gap-3 z-30">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-blue-400 uppercase tracking-wider">
            QUESTION {currentIndex + 1} OF {questions.length}
          </span>
          <span className="text-slate-600">•</span>
          <span className="font-mono text-xs text-slate-400">
            {companyName} Interview Rubric
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Keyboard Shortcuts Reference Toggle */}
          <button
            id="btn-toggle-shortcuts"
            onClick={() => setShowShortcutsHelp(!showShortcutsHelp)}
            className={`font-mono text-[10px] uppercase px-2.5 py-1 rounded border flex items-center gap-1.5 cursor-pointer transition-colors ${
              showShortcutsHelp
                ? 'bg-blue-900/40 border-blue-500 text-blue-300 shadow-sm'
                : 'bg-[#161B29] border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="View accessible keyboard shortcuts (Space, Ctrl+Enter, Alt+T, Alt+C, Alt+D)"
          >
            <Keyboard className="w-3 h-3 text-blue-400" />
            <span>Shortcuts</span>
            <kbd className="text-[9px] bg-slate-900 border border-slate-700 px-1 rounded text-slate-400">?</kbd>
          </button>

          {/* Diagnostics Inspector Toggle */}
          <button
            id="btn-toggle-diagnostics"
            onClick={() => setShowDiagnostics(!showDiagnostics)}
            className={`font-mono text-[10px] uppercase px-2.5 py-1 rounded border flex items-center gap-1.5 cursor-pointer transition-colors ${
              showDiagnostics
                ? 'bg-blue-900/40 border-blue-500 text-blue-300 shadow-sm'
                : 'bg-[#161B29] border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Inspect audio permissions, Web Speech API events & AudioContext pipeline logs (Alt+D)"
          >
            <Terminal className="w-3 h-3 text-blue-400" />
            <span>Audio Diagnostics</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          </button>

          {/* Language selector */}
          <div className="bg-[#161B29] px-1.5 py-1 rounded border border-slate-800 flex items-center gap-1">
            {(['en', 'hi', 'bn'] as LanguageCode[]).map(lang => (
              <button
                key={lang}
                onClick={() => {
                  setSelectedLang(lang);
                  if (speechServiceRef.current) speechServiceRef.current.setLanguage(lang);
                }}
                className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  selectedLang === lang
                    ? 'text-white bg-blue-600 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {LANGUAGE_LOCALES[lang].label}
              </button>
            ))}
          </div>

          {/* Real-time Voice Detection Badge */}
          <div className={`font-mono text-[10px] uppercase font-bold px-2.5 py-1 rounded border flex items-center gap-1.5 transition-all ${
            isRecording
              ? isVoiceDetected 
                ? 'text-green-300 bg-green-950/40 border-green-500/60 shadow-[0_0_10px_rgba(34,197,94,0.25)]'
                : 'text-yellow-300 bg-yellow-950/30 border-yellow-500/50'
              : 'text-slate-500 bg-[#161B29] border-slate-800'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              isRecording 
                ? isVoiceDetected 
                  ? 'bg-green-400 animate-ping' 
                  : 'bg-yellow-400 animate-pulse'
                : 'bg-slate-600'
            }`} />
            <span>
              {isRecording 
                ? isVoiceDetected 
                  ? `Voice Active (${recordingSeconds}s)` 
                  : `Listening... (${recordingSeconds}s)` 
                : 'Mic Ready'}
            </span>
          </div>
        </div>
      </div>

      {/* Diagnostics Telemetry Panel */}
      {showDiagnostics && (
        <div className="w-full max-w-4xl mx-auto mt-3 px-4 z-40">
          <div className="bg-[#090D16] border border-blue-800/60 rounded-lg p-3 shadow-xl flex flex-col font-mono text-[11px]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-blue-300 font-bold">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span>MICROPHONE & WEB SPEECH API REAL-TIME AUDIT LOGS</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDiagnosticLogs([])}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] cursor-pointer"
                >
                  Clear Logs
                </button>
                <button
                  onClick={() => setShowDiagnostics(false)}
                  className="text-slate-400 hover:text-slate-200 cursor-pointer p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="max-h-56 overflow-y-auto py-2 flex flex-col gap-1.5">
              {diagnosticLogs.length === 0 ? (
                <div className="text-slate-500 py-3 text-center">
                  Click the microphone button to see real-time permission grants, audio context frames, and speech recognition events.
                </div>
              ) : (
                diagnosticLogs.map(log => {
                  let badgeColor = 'bg-slate-800 text-slate-300';
                  if (log.category === 'PERMISSION') badgeColor = 'bg-emerald-950/80 border border-emerald-700/60 text-emerald-300';
                  else if (log.category === 'AUDIO_CONTEXT') badgeColor = 'bg-cyan-950/80 border border-cyan-700/60 text-cyan-300';
                  else if (log.category === 'SPEECH_RECOGNITION') badgeColor = 'bg-purple-950/80 border border-purple-700/60 text-purple-300';
                  else if (log.category === 'RECORDER') badgeColor = 'bg-amber-950/80 border border-amber-700/60 text-amber-300';
                  else if (log.category === 'GEMINI_AI') badgeColor = 'bg-indigo-950/80 border border-indigo-700/60 text-indigo-300';

                  let textColor = 'text-slate-300';
                  if (log.level === 'error') textColor = 'text-red-400 font-bold';
                  else if (log.level === 'warn') textColor = 'text-yellow-300';
                  else if (log.level === 'success') textColor = 'text-green-300';

                  return (
                    <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-slate-500 shrink-0 select-none">[{log.timestamp}]</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase shrink-0 ${badgeColor}`}>
                        {log.category}
                      </span>
                      <span className={`flex-1 break-words ${textColor}`}>
                        {log.message}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={diagnosticsEndRef} />
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
              <span>All events are simultaneously output to browser console with styled markers.</span>
              <span className="text-blue-400">AudioContext + Web Speech API + Gemini AI</span>
            </div>
          </div>
        </div>
      )}

      {/* Accessible Keyboard Shortcuts Quick Reference Panel */}
      {showShortcutsHelp && (
        <div className="w-full max-w-4xl mx-auto mt-3 px-4 z-40">
          <div className="bg-[#090E1B] border border-blue-500/50 rounded-lg p-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-300">
                <Keyboard className="w-4 h-4 text-blue-400" />
                <span>ACCESSIBLE KEYBOARD SHORTCUTS</span>
              </div>
              <button
                onClick={() => setShowShortcutsHelp(false)}
                className="text-slate-500 hover:text-slate-300 p-0.5 cursor-pointer"
                aria-label="Close shortcuts guide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-2.5 text-xs font-mono">
              <div className="p-2.5 rounded bg-[#111827] border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Record / Stop Mic</span>
                <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-slate-200 font-bold text-[10px]">
                  Space / Ctrl+Space
                </kbd>
              </div>
              <div className="p-2.5 rounded bg-[#111827] border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Submit Answer</span>
                <kbd className="px-1.5 py-0.5 bg-blue-900/60 border border-blue-500 rounded text-blue-100 font-bold text-[10px]">
                  Ctrl+Enter ↵
                </kbd>
              </div>
              <div className="p-2.5 rounded bg-[#111827] border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Re-Transcribe AI</span>
                <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-slate-200 font-bold text-[10px]">
                  Alt+T
                </kbd>
              </div>
              <div className="p-2.5 rounded bg-[#111827] border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Clear Buffer</span>
                <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-slate-200 font-bold text-[10px]">
                  Alt+C
                </kbd>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permission Alert (if browser blocked mic) */}
      {audioPermissionError && (
        <div className="w-full max-w-4xl mx-auto mt-3 px-4 z-40">
          <div className="bg-amber-950/40 border border-amber-800/60 rounded p-3 text-amber-200 text-xs flex items-start gap-3 shadow-md">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-bold text-amber-300 font-mono text-[11px] mb-0.5">
                MICROPHONE STATUS
              </div>
              <p className="text-[11px] leading-relaxed text-amber-200/90 mb-2">
                {audioPermissionError}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartRecording}
                  className="px-2.5 py-1 bg-amber-700 hover:bg-amber-600 text-white font-mono text-[10px] uppercase font-bold rounded cursor-pointer transition-colors"
                >
                  Retry Microphone
                </button>
                <button
                  onClick={() => textareaRef.current?.focus()}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[10px] uppercase rounded cursor-pointer transition-colors"
                >
                  Focus Text Box Below
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Question Card */}
      <div className="w-full max-w-4xl mx-auto mt-3 px-4">
        <div className="bg-[#161B29] border border-slate-800 rounded-lg p-5 shadow-lg">
          <h1 className="text-lg md:text-xl font-bold text-slate-100 leading-snug tracking-tight">
            "{currentQuestion.questionText}"
          </h1>
          {currentQuestion.contextOrGoal && (
            <p className="text-xs text-blue-300/90 mt-2 font-mono flex items-center gap-1.5">
              <span className="text-slate-500 font-bold uppercase">Focus Area:</span>
              <span>{currentQuestion.contextOrGoal}</span>
            </p>
          )}
        </div>
      </div>

      {/* Center Stage: Audio Controls & Visualizer */}
      <div className="w-full max-w-4xl mx-auto px-4 mt-4 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#111827]/80 border border-slate-800/80 rounded-lg p-4">
        {/* Left: Giant Push-to-Talk / Mic Button */}
        <div className="flex items-center gap-4">
          <button
            id="btn-toggle-mic"
            onClick={handleToggleRecording}
            className="relative group cursor-pointer active:scale-95 transition-transform duration-150"
            aria-label={isRecording ? 'Stop Recording' : 'Start Voice Recording'}
          >
            <div className={`absolute inset-0 rounded-full blur-md transition-all ${
              isRecording 
                ? isVoiceDetected
                  ? 'bg-green-500/40 scale-110'
                  : 'bg-yellow-500/30 scale-105'
                : 'bg-blue-500/20 group-hover:bg-blue-500/30'
            }`} />
            
            <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center relative z-10 transition-all ${
              isRecording 
                ? isVoiceDetected
                  ? 'bg-[#161B29] border-green-400 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                  : 'bg-[#161B29] border-yellow-400 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                : 'bg-[#161B29] border-slate-700 text-blue-400 hover:border-blue-500'
            }`}>
              {isRecording ? (
                <Square className="w-6 h-6 animate-pulse" />
              ) : (
                <Mic className="w-7 h-7" />
              )}
            </div>
          </button>

          <div>
            <div className="text-xs font-bold font-mono text-slate-200">
              {isRecording 
                ? isVoiceDetected 
                  ? 'Active voice input detected • Click square when done' 
                  : 'Microphone listening • Speak your response now' 
                : 'Click Microphone to start speaking'}
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
              <span>Locale: {LANGUAGE_LOCALES[selectedLang].name}</span>
              <kbd className="px-1.5 py-0.5 rounded bg-[#0B0F1A] border border-slate-700 text-[10px] text-slate-300 font-mono inline-flex items-center gap-1">
                <span>Press</span>
                <strong className="text-blue-400">Space</strong>
                <span>to {isRecording ? 'Stop' : 'Record'}</span>
              </kbd>
              {isRecording && (
                <span className="text-yellow-400 font-bold">• Elapsed: {recordingSeconds}s</span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Waveform Bars & Decibel Signal */}
        <div className="flex flex-col items-center md:items-end gap-1.5 w-full md:w-auto">
          {/* Waveform Visualization or Low-Motion Mode */}
          {settings.enableWaveformAnimation ? (
            <div 
              className="flex items-center h-8 gap-1 opacity-90 cursor-pointer"
              onClick={() => updateSettings({ enableWaveformAnimation: false })}
              title="Click to disable waveform animation (Reduced Motion / Low-Bandwidth Mode)"
            >
              {waveformBars.map((height, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full transition-all duration-75"
                  style={{
                    height: isRecording ? `${height}%` : '15%',
                    backgroundColor: isRecording 
                      ? isVoiceDetected 
                        ? (i % 2 === 0 ? '#3b82f6' : '#22c55e') 
                        : '#eab308'
                      : '#334155'
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="h-8 flex items-center gap-2 px-2.5 py-1 rounded bg-[#0B0F1A] border border-slate-800 text-[11px] font-mono">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Audio:</span>
              <span className={`inline-flex items-center gap-1.5 font-bold ${
                isRecording 
                  ? isVoiceDetected 
                    ? 'text-green-400' 
                    : 'text-yellow-400' 
                  : 'text-slate-400'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  isRecording 
                    ? isVoiceDetected 
                      ? 'bg-green-400' 
                      : 'bg-yellow-400' 
                    : 'bg-slate-600'
                }`} />
                <span>
                  {isRecording 
                    ? isVoiceDetected 
                      ? 'Voice Active' 
                      : 'Listening...' 
                    : 'Static Mode (Reduced Motion)'}
                </span>
              </span>
              <button
                type="button"
                onClick={() => updateSettings({ enableWaveformAnimation: true })}
                className="ml-1 text-[10px] text-blue-400 hover:text-blue-300 underline cursor-pointer"
                title="Enable animated visual waveform"
              >
                Enable Waveform
              </button>
            </div>
          )}

          {/* Decibel Signal meter */}
          <div className="flex items-center gap-2">
            <Radio className={`w-3 h-3 ${isRecording && isVoiceDetected && settings.enableWaveformAnimation ? 'text-green-400 animate-pulse' : isRecording && isVoiceDetected ? 'text-green-400' : 'text-slate-500'}`} />
            <span className="font-mono text-[10px] text-slate-400">
              Hardware Signal: <strong className={isVoiceDetected ? 'text-green-400' : 'text-slate-300'}>{isRecording ? `${peakAudioLevel}%` : '0%'}</strong>
            </span>
            <div className="w-20 bg-[#0B0F1A] h-1.5 rounded-full overflow-hidden border border-slate-800">
              <div 
                className={`h-full rounded-full transition-all duration-75 ${isVoiceDetected ? 'bg-green-400' : 'bg-yellow-500'}`}
                style={{ width: `${isRecording ? peakAudioLevel : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Candidate STAR Response Buffer / Text Box */}
      <div className="w-full max-w-4xl mx-auto px-4 mt-4">
        <div className="bg-[#161B29] border border-slate-800 rounded-lg p-4 shadow-lg flex flex-col">
          {/* Textbox Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>CANDIDATE STAR RESPONSE BUFFER</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-[#0B0F1A] border border-slate-800 font-mono text-[10px] text-blue-400 font-bold">
                {wordCount} words
              </span>
            </div>

            {/* Status Notices & Quick Actions */}
            <div className="flex items-center gap-2">
              {isTranscribingAudio && (
                <div className="px-2.5 py-0.5 rounded bg-blue-950/60 border border-blue-700/60 text-blue-300 font-mono text-[10px] flex items-center gap-1.5 animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Transcribing Audio with Gemini AI...</span>
                </div>
              )}

              {transcriptionSuccessNotice && (
                <div className="px-2.5 py-0.5 rounded bg-green-950/60 border border-green-700/60 text-green-300 font-mono text-[10px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                  <span>{transcriptionSuccessNotice}</span>
                </div>
              )}

              <button
                onClick={handleManualTranscribeCurrentAudio}
                disabled={isTranscribingAudio || isRecording}
                title="Force transcribe recorded mic audio with Gemini Audio AI (Alt+T)"
                className="px-2.5 py-1 rounded bg-[#0B0F1A] hover:bg-slate-800 disabled:opacity-40 border border-slate-800 text-slate-300 font-mono text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Sparkles className="w-3 h-3 text-yellow-400" />
                <span>Re-Transcribe Audio</span>
                <kbd className="text-[9px] bg-slate-900 border border-slate-700 text-slate-400 px-1 py-0.2 rounded font-mono">
                  Alt+T
                </kbd>
              </button>

              {transcript && (
                <button
                  onClick={handleClearBuffer}
                  title="Clear text buffer (Alt+C)"
                  className="px-2 py-1 rounded bg-[#0B0F1A] hover:bg-red-950/40 border border-slate-800 hover:border-red-800 text-slate-400 hover:text-red-300 font-mono text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                  <kbd className="text-[9px] bg-slate-900 border border-slate-700 text-slate-400 px-1 py-0.2 rounded font-mono">
                    Alt+C
                  </kbd>
                </button>
              )}
            </div>
          </div>

          {/* Actual Live Textarea */}
          <div className="pt-3">
            <textarea
              id="interview-transcript-box"
              ref={textareaRef}
              rows={5}
              value={transcript}
              onChange={(e) => {
                const val = e.target.value;
                setTranscript(val);
                if (speechServiceRef.current) speechServiceRef.current.setBaseTranscript(val);
                const updated = calculateSpeechMetrics(val, Math.max(1, recordingSeconds));
                setMetrics(updated);
              }}
              placeholder="Your spoken words will appear here in real-time as you speak into the microphone. You can also type, edit, or paste your STAR response directly at any time..."
              className="w-full p-3 bg-[#0B0F1A] border border-slate-800 rounded-md text-slate-100 text-sm font-sans leading-relaxed focus:outline-none focus:border-blue-500 transition-colors resize-y min-h-[120px]"
            />
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 gap-2">
            <span>
              💡 Tip: Structure response with <strong className="text-slate-300">STAR</strong> • Submit with <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-300 font-mono">Ctrl+Enter ↵</kbd>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">
                <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-300 font-mono">Ctrl+Space</kbd> toggle mic
              </span>
              <span>
                {isRecording ? '🎙️ Mic active • recording buffer' : '✍️ Ready for review or submission'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Acoustic & STAR Meters */}
      <div className="w-full max-w-4xl mx-auto px-4 mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Pace Meter */}
        <div className="bg-[#161B29] border border-slate-800 rounded p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-1.5">
            <span className="font-mono text-[10px] uppercase font-bold text-slate-400">Pace Cadence</span>
            <span className={`font-mono text-xs font-bold ${
              metrics.paceStatus === 'Optimal' ? 'text-green-400' : metrics.paceStatus === 'Slow' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {metrics.wpm} WPM ({metrics.paceStatus})
            </span>
          </div>
          <div className="w-full bg-[#0B0F1A] h-1.5 rounded-full overflow-hidden border border-slate-800">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                metrics.paceStatus === 'Optimal' ? 'bg-green-400' : metrics.paceStatus === 'Slow' ? 'bg-yellow-400' : 'bg-red-400'
              }`}
              style={{ width: `${Math.min(100, Math.max(10, (metrics.wpm / 190) * 100))}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5 font-mono text-[9px] text-slate-500">
            <span>Slow (&lt;110)</span>
            <span className="text-slate-400 font-bold">Target 125-150</span>
            <span>Fast (&gt;155)</span>
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="bg-[#161B29] border border-slate-800 rounded p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-1.5">
            <span className="font-mono text-[10px] uppercase font-bold text-slate-400">Confidence Score</span>
            <span className="font-mono text-xs font-bold text-blue-400">
              {metrics.confidenceScore}%
            </span>
          </div>
          <div className="w-full bg-[#0B0F1A] h-1.5 rounded-full overflow-hidden border border-slate-800 flex gap-1">
            <div className={`h-full flex-1 rounded-full ${metrics.confidenceScore > 20 ? 'bg-blue-500' : 'bg-slate-800'}`} />
            <div className={`h-full flex-1 rounded-full ${metrics.confidenceScore > 45 ? 'bg-blue-500' : 'bg-slate-800'}`} />
            <div className={`h-full flex-1 rounded-full ${metrics.confidenceScore > 70 ? 'bg-blue-500' : 'bg-slate-800'}`} />
            <div className={`h-full flex-1 rounded-full ${metrics.confidenceScore > 88 ? 'bg-blue-500' : 'bg-slate-800'}`} />
          </div>
          <div className="flex justify-between mt-1.5 font-mono text-[9px] text-slate-500">
            <span>Fillers: {metrics.fillerWordsCount}</span>
            <span>Pauses: {metrics.pauseCount}</span>
          </div>
        </div>

        {/* Clarity Meter */}
        <div className="bg-[#161B29] border border-slate-800 rounded p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-1.5">
            <span className="font-mono text-[10px] uppercase font-bold text-slate-400">Acoustic Clarity</span>
            <span className="font-mono text-xs font-bold text-yellow-400">
              {metrics.clarityScore}%
            </span>
          </div>
          <div className="w-full bg-[#0B0F1A] h-1.5 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="bg-yellow-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${metrics.clarityScore}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5 font-mono text-[9px] text-slate-500">
            <span>Signal Cleanliness</span>
            <span>Zero Slurs</span>
          </div>
        </div>
      </div>

      {/* Bottom Action / Submission Bar */}
      <div className="w-full max-w-4xl mx-auto px-4 mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs font-mono text-slate-400 text-center sm:text-left">
          Questions Completed: <strong className="text-slate-100">{evaluatedAnswers.length}</strong> of {questions.length}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            id="btn-submit-answer"
            onClick={handleSubmitAnswer}
            disabled={!transcript.trim() || isSubmitting || isTranscribingAudio}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2.5 cursor-pointer transition-all shadow-lg active:scale-98 group"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="font-mono text-xs">Analyzing STAR Structure...</span>
              </>
            ) : isTranscribingAudio ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="font-mono text-xs">Transcribing Audio...</span>
              </>
            ) : (
              <>
                <span>Submit Answer for STAR Critique</span>
                <kbd className="px-1.5 py-0.5 rounded bg-blue-800 border border-blue-400/40 text-[10px] font-mono text-blue-100 uppercase tracking-normal">
                  Ctrl + Enter ↵
                </kbd>
                <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Floating HUD Shortcut Toast */}
      {shortcutNotice && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-150">
          <div className="bg-slate-900/95 border border-blue-500/70 text-blue-200 px-3.5 py-2 rounded-lg shadow-2xl backdrop-blur-md flex items-center gap-2 font-mono text-xs">
            <Keyboard className="w-4 h-4 text-blue-400 animate-pulse" />
            <span>{shortcutNotice}</span>
          </div>
        </div>
      )}

      {/* STAR Critique Review Modal */}
      {activeCritique && (
        <StarCritiqueModal
          critique={activeCritique}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          onContinue={handleContinueFromCritique}
        />
      )}
    </div>
  );
};
