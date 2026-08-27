import React, { useState, useEffect, useRef } from 'react';
import { InterviewQuestion, LanguageCode, SpeechMetrics, AnswerCritique } from '../types';
import { SpeechRecognitionService, AudioVisualizerService, calculateSpeechMetrics, LANGUAGE_LOCALES } from '../utils/speech';
import { StarCritiqueModal } from './StarCritiqueModal';
import { 
  Mic, 
  MicOff, 
  Square, 
  Play, 
  Sparkles, 
  ArrowRight, 
  Volume2, 
  Edit3, 
  Globe, 
  RefreshCw,
  Send,
  AlertCircle
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
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('en');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [manualEditMode, setManualEditMode] = useState<boolean>(false);
  
  // Real-time speech metrics
  const [metrics, setMetrics] = useState<SpeechMetrics>({
    wpm: 125,
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
    20, 40, 60, 80, 100, 70, 90, 50, 30, 60, 40, 80, 50, 20
  ]);

  // Evaluated answers collection
  const [evaluatedAnswers, setEvaluatedAnswers] = useState<AnswerCritique[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeCritique, setActiveCritique] = useState<AnswerCritique | null>(null);

  const speechServiceRef = useRef<SpeechRecognitionService | null>(null);
  const visualizerRef = useRef<AudioVisualizerService | null>(null);
  const timerRef = useRef<any>(null);

  const currentQuestion = questions[currentIndex] || questions[0];

  // Initialize Speech and Visualizer services
  useEffect(() => {
    speechServiceRef.current = new SpeechRecognitionService();
    visualizerRef.current = new AudioVisualizerService();

    return () => {
      speechServiceRef.current?.stop();
      visualizerRef.current?.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

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

  const handleStartRecording = async () => {
    setIsRecording(true);
    setManualEditMode(false);
    
    // Start Web Speech Recognition
    speechServiceRef.current?.start(
      (newTranscript) => {
        setTranscript(newTranscript);
        const updated = calculateSpeechMetrics(newTranscript, Math.max(1, recordingSeconds));
        setMetrics(updated);
      },
      (err) => {
        console.warn('Speech Recognition notice:', err);
      }
    );

    // Start Audio Visualizer
    visualizerRef.current?.start(
      (levels) => {
        setWaveformBars(levels);
      },
      () => {
        const simulated = Array.from({ length: 14 }, () => Math.floor(Math.random() * 75) + 25);
        setWaveformBars(simulated);
      }
    );
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    speechServiceRef.current?.stop();
    visualizerRef.current?.stop();
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  // Sample prompt filler for quick testing across languages
  const handleLoadSampleSpeech = () => {
    let sample = '';
    if (selectedLang === 'en') {
      sample = "Yes, in my previous role I was tasked with leading the Q3 product launch while simultaneously managing a critical bug fix for an existing client. I triaged the bug by isolating the database lock, assigned a patch to my senior engineer, and renegotiated the sprint timeline with our VP of Product. As a result, we delivered the launch with zero downtime and improved query performance by 40%.";
    } else if (selectedLang === 'hi') {
      sample = "हाँ, मेरे पिछले प्रोजेक्ट में मुझे एक बहुत ही महत्वपूर्ण पेमेंट गेटवे माइग्रेशन का नेतृत्व करने का काम सौंपा गया था। हमने टाइमलाइन को ऑप्टिमाइज़ किया, माइक्रो-सर्विसेज को रीफैक्टर किया और बिना किसी डाउनटाइम के 99.9% अपटाइम हासिल किया।";
    } else {
      sample = "হ্যাঁ, আমার পূর্ববর্তী প্রজেক্টে আমাদের প্রধান এপিআই এর ল্যাটেন্সি কমানোর দায়িত্ব আমার ছিল। আমরা ক্যাশিং লেয়ার এবং ডেটাবেস ইনডেক্সিং অপটিমাইজ করে ল্যাটেন্সি ৩৫% হ্রাস করেছি।";
    }
    setTranscript(sample);
    const updated = calculateSpeechMetrics(sample, 45);
    setMetrics(updated);
  };

  const handleSubmitAnswer = async () => {
    if (!transcript.trim()) return;
    handleStopRecording();
    setIsSubmitting(true);

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

      const data = await res.json();
      if (data.success && data.critique) {
        const critique = data.critique;
        setEvaluatedAnswers(prev => [...prev, critique]);
        setActiveCritique(critique);
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueFromCritique = () => {
    setActiveCritique(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setTranscript('');
      setRecordingSeconds(0);
      setMetrics({
        wpm: 125,
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

  return (
    <div id="interview-session-screen" className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#0B0F1A] min-h-[calc(100vh-60px)] md:min-h-screen">
      {/* Top Right Bar: Language Switcher & Live Status */}
      <div className="absolute top-0 right-0 p-3 md:p-4 z-30 flex gap-2.5 items-center">
        {/* Language selector */}
        <div className="bg-[#161B29] px-2 py-0.5 rounded border border-slate-800 flex gap-1 shadow-sm">
          {(['en', 'hi', 'bn'] as LanguageCode[]).map(lang => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded transition-colors cursor-pointer ${
                selectedLang === lang
                  ? 'text-white bg-blue-600 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {LANGUAGE_LOCALES[lang].label}
            </button>
          ))}
        </div>

        {/* Live Recording Badge */}
        <div className={`font-mono text-[10px] uppercase font-bold px-2.5 py-1 rounded border flex items-center gap-1.5 transition-all ${
          isRecording
            ? 'text-green-400 bg-green-900/20 border-green-900/50'
            : 'text-slate-500 bg-[#161B29] border-slate-800'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isRecording ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`} />
          <span>{isRecording ? `Recording (${recordingSeconds}s)` : 'Standby'}</span>
        </div>
      </div>

      {/* Top Question Area */}
      <div className="w-full max-w-4xl mx-auto pt-10 md:pt-8 px-4 text-center z-20">
        <div className="inline-block font-mono text-[10px] text-blue-400 tracking-widest uppercase mb-1.5 font-bold">
          Question ({currentIndex + 1}/{questions.length}) • {companyName} Rubric
        </div>
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-100 leading-snug tracking-tight px-2">
          "{currentQuestion.questionText}"
        </h1>
        {currentQuestion.contextOrGoal && (
          <p className="text-[11px] text-slate-400 mt-1 max-w-2xl mx-auto italic font-mono">
            Focus: {currentQuestion.contextOrGoal}
          </p>
        )}
      </div>

      {/* Center Stage: Waveform Visualizer & Giant Mic */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-4xl mx-auto px-4 my-2">
        {/* Minimalist 14-Bar Waveform */}
        <div className="flex items-center justify-center h-20 w-full max-w-sm mb-4 opacity-90 gap-1.5">
          {waveformBars.map((height, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full transition-all duration-75"
              style={{
                height: isRecording ? `${height}%` : '15%',
                backgroundColor: isRecording ? (i % 2 === 0 ? '#3b82f6' : '#22c55e') : '#1e293b'
              }}
            />
          ))}
        </div>

        {/* Giant Mic Button */}
        <div className="flex flex-col items-center gap-3">
          <button
            id="btn-toggle-mic"
            onClick={handleToggleRecording}
            className="relative group cursor-pointer active:scale-95 transition-transform duration-150"
            aria-label={isRecording ? 'Stop Recording' : 'Start Voice Recording'}
          >
            <div className={`absolute inset-0 rounded-full blur-lg transition-all ${
              isRecording ? 'bg-blue-600/30 scale-110' : 'bg-blue-500/10 group-hover:bg-blue-500/20'
            }`} />
            
            <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full border flex items-center justify-center relative z-10 transition-all ${
              isRecording 
                ? 'bg-[#161B29] border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                : 'bg-[#161B29] border-slate-700 shadow-md hover:border-blue-500'
            }`}>
              {isRecording ? (
                <Square className="w-8 h-8 text-green-400 animate-pulse" />
              ) : (
                <Mic className="w-10 h-10 text-blue-400" />
              )}
            </div>
          </button>

          <span className="text-[11px] font-mono text-slate-400">
            {isRecording ? 'Click to pause / complete response' : 'Click microphone to begin speaking'}
          </span>
        </div>

        {/* Quick Helper Tools: Sample Speech & Manual Text Toggle */}
        <div className="mt-3 flex items-center gap-2 z-20">
          <button
            onClick={handleLoadSampleSpeech}
            className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#161B29] text-blue-400 hover:bg-slate-800 border border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>Load Exemplar Spoken Answer ({LANGUAGE_LOCALES[selectedLang].label})</span>
          </button>

          <button
            onClick={() => setManualEditMode(!manualEditMode)}
            className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#161B29] text-slate-400 hover:text-slate-200 border border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>{manualEditMode ? 'Hide Editor' : 'Edit Transcript'}</span>
          </button>
        </div>
      </div>

      {/* Manual Edit Drawer / Textarea if open */}
      {manualEditMode && (
        <div className="w-full max-w-3xl mx-auto px-4 mb-2 z-30">
          <div className="bg-[#161B29] border border-slate-800 rounded p-2.5">
            <div className="text-[10px] font-mono text-slate-400 mb-1 uppercase font-bold">
              EDIT ANSWER BUFFER ({LANGUAGE_LOCALES[selectedLang].name}):
            </div>
            <textarea
              rows={3}
              value={transcript}
              onChange={(e) => {
                setTranscript(e.target.value);
                const updated = calculateSpeechMetrics(e.target.value, Math.max(1, recordingSeconds));
                setMetrics(updated);
              }}
              className="w-full p-2 bg-[#0B0F1A] border border-slate-800 rounded text-xs text-slate-200 outline-none font-mono leading-relaxed focus:border-blue-500"
              placeholder="Type or refine your response here..."
            />
          </div>
        </div>
      )}

      {/* Live Transcript Subtitle Banner (Above meters) */}
      {!manualEditMode && (
        <div className="w-full max-w-3xl mx-auto px-4 pb-2 z-10 text-center">
          <div className="min-h-[36px] flex items-center justify-center font-sans text-xs text-slate-300 italic bg-[#161B29]/90 px-3 py-1.5 rounded border border-slate-800">
            {transcript ? (
              <p className={isRecording ? 'animate-pulse' : ''}>"{transcript}"</p>
            ) : (
              <span className="text-slate-500 text-[11px] font-mono">
                {isRecording ? 'Listening for audio stream...' : 'Mic idle. Click microphone to speak response.'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Real-time Bento-Style Meters */}
      <div className="w-full px-4 pb-4 z-20 grid grid-cols-1 md:grid-cols-3 gap-3 max-w-4xl mx-auto">
        {/* Pace Meter */}
        <div className="bg-[#161B29] border border-slate-800 rounded p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-1.5">
            <span className="font-mono text-[10px] uppercase font-bold text-slate-400">Pace</span>
            <span className="font-mono text-xs font-bold text-green-400">
              {metrics.wpm} WPM
            </span>
          </div>
          <div className="w-full bg-[#0B0F1A] h-1.5 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="bg-green-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(15, (metrics.wpm / 190) * 100))}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5 font-mono text-[9px] text-slate-500">
            <span className={metrics.paceStatus === 'Slow' ? 'text-yellow-400 font-bold' : ''}>Slow (&lt;110)</span>
            <span className={metrics.paceStatus === 'Optimal' ? 'text-green-400 font-bold' : ''}>Optimal (120-150)</span>
            <span className={metrics.paceStatus === 'Fast' ? 'text-red-400 font-bold' : ''}>Fast (&gt;155)</span>
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="bg-[#161B29] border border-slate-800 rounded p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-1.5">
            <span className="font-mono text-[10px] uppercase font-bold text-slate-400">Confidence</span>
            <span className="font-mono text-xs font-bold text-blue-400">
              {metrics.confidenceScore}%
            </span>
          </div>
          <div className="w-full bg-[#0B0F1A] h-1.5 rounded-full overflow-hidden border border-slate-800 flex gap-1">
            <div className={`h-full flex-1 rounded-full ${metrics.confidenceScore > 25 ? 'bg-blue-500' : 'bg-slate-800'}`} />
            <div className={`h-full flex-1 rounded-full ${metrics.confidenceScore > 50 ? 'bg-blue-500' : 'bg-slate-800'}`} />
            <div className={`h-full flex-1 rounded-full ${metrics.confidenceScore > 75 ? 'bg-blue-500' : 'bg-slate-800'}`} />
            <div className={`h-full flex-1 rounded-full ${metrics.confidenceScore > 90 ? 'bg-blue-500' : 'bg-slate-800'}`} />
          </div>
          <div className="flex justify-between mt-1.5 font-mono text-[9px] text-slate-500">
            <span>Fillers: {metrics.fillerWordsCount}</span>
            <span>Pauses: {metrics.pauseCount}</span>
          </div>
        </div>

        {/* Clarity Meter */}
        <div className="bg-[#161B29] border border-slate-800 rounded p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-1.5">
            <span className="font-mono text-[10px] uppercase font-bold text-slate-400">Clarity</span>
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
            <span>Articulation</span>
            <span>Acoustic Signal</span>
          </div>
        </div>
      </div>

      {/* Answer Action Bar */}
      <div className="w-full max-w-4xl mx-auto px-4 pb-4 flex items-center justify-between gap-4">
        <div className="text-[11px] font-mono text-slate-400">
          Completed: <strong className="text-slate-200">{evaluatedAnswers.length}</strong> of {questions.length} questions
        </div>

        <button
          id="btn-submit-answer"
          onClick={handleSubmitAnswer}
          disabled={!transcript.trim() || isSubmitting}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider rounded flex items-center gap-2 cursor-pointer transition-all shadow-md active:scale-98"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span className="font-mono text-xs">Critique Engine...</span>
            </>
          ) : (
            <>
              <span>Submit Answer for STAR Critique</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

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

