import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '../context/ThemeContext';
import { CoachRigor, SpeechEngine } from '../types';
import { 
  Settings, 
  X, 
  Bot, 
  Mic, 
  Clock, 
  Sliders, 
  Sparkles, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Check, 
  Trash2, 
  Download, 
  ShieldCheck, 
  Sun, 
  Moon,
  Gauge,
  Activity,
  Waves
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    resetSettings, 
    isSettingsOpen, 
    closeSettings 
  } = useSettings();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'coach' | 'audio' | 'flow' | 'data'>('coach');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  if (!isSettingsOpen) return null;

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 2500);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your local interview session history? This cannot be undone.')) {
      try {
        localStorage.removeItem('smartcoach_history');
        localStorage.removeItem('smartcoach_user');
      } catch (e) {
        console.warn(e);
      }
      triggerToast('Local cache & session history cleared.');
    }
  };

  const handleExportData = () => {
    try {
      const history = localStorage.getItem('smartcoach_history') || '[]';
      const blob = new Blob([history], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smartcoach_history_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      triggerToast('Transcripts exported successfully.');
    } catch (e) {
      triggerToast('Unable to export session data.');
    }
  };

  return (
    <div 
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeSettings();
      }}
    >
      <div 
        id="settings-modal-card"
        className="w-full max-w-2xl bg-[#161B29] border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B0F1A]/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider">
                Application Settings
              </h2>
              <p className="text-[11px] text-slate-400">
                Calibrate AI rigor, speech recognition, timer thresholds, and session preferences
              </p>
            </div>
          </div>
          <button
            id="btn-close-settings"
            onClick={closeSettings}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-800 bg-[#0B0F1A]/50 px-6 gap-2 pt-2">
          {[
            { id: 'coach', label: 'AI Rigor & Persona', icon: Bot },
            { id: 'audio', label: 'Speech & Audio', icon: Mic },
            { id: 'flow', label: 'Interview Flow & Timers', icon: Clock },
            { id: 'data', label: 'Appearance & Data', icon: Sliders }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2.5 px-3 text-xs font-mono font-medium flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-blue-500 text-blue-400 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: AI Rigor & Persona */}
          {activeTab === 'coach' && (
            <div className="space-y-5">
              {/* Coach Rigor */}
              <div>
                <label className="block text-xs font-bold text-slate-200 font-mono uppercase tracking-wider mb-1">
                  Interviewer Bar-Raiser Rigor
                </label>
                <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                  Controls how strictly the AI evaluates STAR responses, pushes for metrics, and assesses offer likelihood.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    {
                      id: 'strict',
                      label: 'Strict Bar-Raiser',
                      badge: 'FAANG / Tier 1',
                      desc: 'Penalizes missing metric impact and passive "we" phrasing heavily.'
                    },
                    {
                      id: 'balanced',
                      label: 'Balanced Coach',
                      badge: 'Industry Standard',
                      desc: 'Evaluates thoroughness while providing constructive, measured critiques.'
                    },
                    {
                      id: 'supportive',
                      label: 'Supportive Mentor',
                      badge: 'Practice & Warmup',
                      desc: 'Focuses on building confidence and early STAR structuring.'
                    }
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => updateSettings({ coachRigor: r.id as CoachRigor })}
                      className={`p-3 rounded border text-left cursor-pointer transition-all ${
                        settings.coachRigor === r.id
                          ? 'bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                          : 'bg-[#0B0F1A] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-100">{r.label}</span>
                        {settings.coachRigor === r.id && <Check className="w-3.5 h-3.5 text-blue-400" />}
                      </div>
                      <span className="text-[9px] font-mono text-blue-400 block mb-1.5">{r.badge}</span>
                      <p className="text-[10px] text-slate-400 leading-relaxed">{r.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Strict STAR Metrics Toggle */}
              <div className="p-3.5 bg-[#0B0F1A] border border-slate-800 rounded flex items-center justify-between">
                <div className="space-y-0.5 pr-4">
                  <span className="text-xs font-bold text-slate-200 block">
                    Strict Result Metrics Enforcement
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Flag an answer as Weak or Incomplete if the candidate describes actions without quantifying business, latency, or customer outcomes.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.strictStarScoring}
                  onChange={(e) => updateSettings({ strictStarScoring: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded bg-slate-900 border-slate-700 cursor-pointer accent-blue-600"
                />
              </div>

              {/* Follow-up Probing Toggle */}
              <div className="p-3.5 bg-[#0B0F1A] border border-slate-800 rounded flex items-center justify-between">
                <div className="space-y-0.5 pr-4">
                  <span className="text-xs font-bold text-slate-200 block">
                    Active Follow-Up Probing
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Generate personalized follow-up challenge questions when an answer contains vague ownership or missing Task details.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.followupProbing}
                  onChange={(e) => updateSettings({ followupProbing: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded bg-slate-900 border-slate-700 cursor-pointer accent-blue-600"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Speech & Audio */}
          {activeTab === 'audio' && (
            <div className="space-y-5">
              {/* Speech Recognition Engine */}
              <div>
                <label className="block text-xs font-bold text-slate-200 font-mono uppercase tracking-wider mb-1">
                  Speech Recognition Pipeline
                </label>
                <p className="text-[11px] text-slate-400 mb-3">
                  Choose how your spoken answers are transcribed into text.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => updateSettings({ speechEngine: 'web_speech' })}
                    className={`p-3.5 rounded border text-left cursor-pointer transition-all ${
                      settings.speechEngine === 'web_speech'
                        ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500/50'
                        : 'bg-[#0B0F1A] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-100">Browser Web Speech API</span>
                      {settings.speechEngine === 'web_speech' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    </div>
                    <span className="text-[10px] font-mono text-green-400 block mb-1">Zero Latency (Real-Time)</span>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Instant client-side stream transcription. Best for fast speaking exercises.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSettings({ speechEngine: 'gemini_transcription' })}
                    className={`p-3.5 rounded border text-left cursor-pointer transition-all ${
                      settings.speechEngine === 'gemini_transcription'
                        ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500/50'
                        : 'bg-[#0B0F1A] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-100">Server Audio Model</span>
                      {settings.speechEngine === 'gemini_transcription' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    </div>
                    <span className="text-[10px] font-mono text-blue-400 block mb-1">High Acoustic Precision</span>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Processes microphone audio blob on completion with exact technical vocabulary recognition.
                    </p>
                  </button>
                </div>
              </div>

              {/* Target Speech Pace (WPM) */}
              <div className="p-3.5 bg-[#0B0F1A] border border-slate-800 rounded space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-200 block">
                      Target Speaking Cadence (WPM)
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Standard executive pace is 130–150 words per minute.
                    </p>
                  </div>
                  <span className="text-sm font-bold font-mono text-blue-400 bg-blue-950/40 px-2 py-1 rounded border border-blue-800/40">
                    {settings.targetWpm} WPM
                  </span>
                </div>

                <input
                  type="range"
                  min={110}
                  max={180}
                  step={5}
                  value={settings.targetWpm}
                  onChange={(e) => updateSettings({ targetWpm: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>110 WPM (Deliberate)</span>
                  <span>140 WPM (Optimal)</span>
                  <span>180 WPM (Rapid)</span>
                </div>
              </div>

              {/* Question Narration TTS Toggle */}
              <div className="p-3.5 bg-[#0B0F1A] border border-slate-800 rounded flex items-center justify-between">
                <div className="space-y-0.5 pr-4">
                  <span className="text-xs font-bold text-slate-200 block flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>AI Voice Question Narration</span>
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Have the AI interviewer read each interview question out loud using speech synthesis.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableTtsQuestionAudio}
                  onChange={(e) => updateSettings({ enableTtsQuestionAudio: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded bg-slate-900 border-slate-700 cursor-pointer accent-blue-600"
                />
              </div>

              {/* Microphone Noise Suppression Toggle */}
              <div className="p-3.5 bg-[#0B0F1A] border border-slate-800 rounded flex items-center justify-between">
                <div className="space-y-0.5 pr-4">
                  <span className="text-xs font-bold text-slate-200 block">
                    Microphone Echo Cancellation & Noise Filtering
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Enable browser audio track constraints for noise suppression.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.noiseSuppression}
                  onChange={(e) => updateSettings({ noiseSuppression: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded bg-slate-900 border-slate-700 cursor-pointer accent-blue-600"
                />
              </div>

              {/* Visual Waveform Animation Toggle (Accessibility & Low-Bandwidth Option) */}
              <div className="p-3.5 bg-[#0B0F1A] border border-slate-800 rounded flex items-center justify-between">
                <div className="space-y-0.5 pr-4">
                  <span className="text-xs font-bold text-slate-200 block flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-400" />
                    <span>Visual Waveform Animations</span>
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Renders dynamic oscillating waveform bars and motion effects during microphone capture. Disable to reduce motion for accessibility preferences or conserve CPU/bandwidth in resource-constrained environments.
                  </p>
                </div>
                <input
                  id="toggle-waveform-animation"
                  type="checkbox"
                  checked={settings.enableWaveformAnimation}
                  onChange={(e) => updateSettings({ enableWaveformAnimation: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded bg-slate-900 border-slate-700 cursor-pointer accent-blue-600"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Interview Flow & Timers */}
          {activeTab === 'flow' && (
            <div className="space-y-5">
              {/* Answer Countdown Timer */}
              <div className="p-3.5 bg-[#0B0F1A] border border-slate-800 rounded space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-200 block">
                      Answer Time Boundary Display
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Displays live countdown timer to train behavioral conciseness.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showCountdownTimer}
                    onChange={(e) => updateSettings({ showCountdownTimer: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded bg-slate-900 border-slate-700 cursor-pointer accent-blue-600"
                  />
                </div>

                {settings.showCountdownTimer && (
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-2">
                      Timer Duration Limit:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { sec: 90, label: '90s (Elevator / Concise)' },
                        { sec: 120, label: '120s (Standard STAR)' },
                        { sec: 180, label: '180s (Deep Architecture)' }
                      ].map((t) => (
                        <button
                          key={t.sec}
                          type="button"
                          onClick={() => updateSettings({ timerDurationSeconds: t.sec })}
                          className={`py-1.5 px-2 rounded text-[11px] font-mono text-center cursor-pointer transition-colors ${
                            settings.timerDurationSeconds === t.sec
                              ? 'bg-blue-600 text-white font-bold'
                              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Show Real-time Transcript */}
              <div className="p-3.5 bg-[#0B0F1A] border border-slate-800 rounded flex items-center justify-between">
                <div className="space-y-0.5 pr-4">
                  <span className="text-xs font-bold text-slate-200 block">
                    Show Live Real-Time Transcript Stream
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Render live words as you speak during mic recording.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showLiveTranscript}
                  onChange={(e) => updateSettings({ showLiveTranscript: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded bg-slate-900 border-slate-700 cursor-pointer accent-blue-600"
                />
              </div>

              {/* Auto Advance */}
              <div className="p-3.5 bg-[#0B0F1A] border border-slate-800 rounded flex items-center justify-between">
                <div className="space-y-0.5 pr-4">
                  <span className="text-xs font-bold text-slate-200 block">
                    Auto-Advance to Next Question
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Automatically proceed to next question after reviewing STAR critique instead of requiring manual click.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoAdvanceQuestions}
                  onChange={(e) => updateSettings({ autoAdvanceQuestions: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded bg-slate-900 border-slate-700 cursor-pointer accent-blue-600"
                />
              </div>
            </div>
          )}

          {/* TAB 4: Appearance & Data */}
          {activeTab === 'data' && (
            <div className="space-y-5">
              {/* Theme Selector */}
              <div className="p-3.5 bg-[#0B0F1A] border border-slate-800 rounded space-y-2.5">
                <span className="text-xs font-bold text-slate-200 block">
                  Interface Theme
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`py-2 px-3 rounded text-xs font-mono flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      theme === 'dark'
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dark Cockpit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`py-2 px-3 rounded text-xs font-mono flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      theme === 'light'
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Crisp Light Mode</span>
                  </button>
                </div>
              </div>

              {/* Export Data */}
              <div className="p-3.5 bg-[#0B0F1A] border border-slate-800 rounded flex items-center justify-between">
                <div className="space-y-0.5 pr-4">
                  <span className="text-xs font-bold text-slate-200 block">
                    Export Session Transcripts & Analytics
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Download complete question histories and STAR critique breakdowns as a JSON file.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportData}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded text-xs font-mono flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              </div>

              {/* Clear History */}
              <div className="p-3.5 bg-red-950/20 border border-red-900/30 rounded flex items-center justify-between">
                <div className="space-y-0.5 pr-4">
                  <span className="text-xs font-bold text-red-400 block">
                    Clear Local Session History & Reset
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Wipes stored practice sessions, speech pace telemetry, and candidate cache.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="px-3 py-1.5 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-800/40 rounded text-xs font-mono flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear History</span>
                </button>
              </div>

              {/* Reset to Defaults */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    resetSettings();
                    triggerToast('All settings reset to default.');
                  }}
                  className="text-slate-500 hover:text-slate-300 text-[11px] font-mono flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All Settings to Factory Default</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#0B0F1A]/80 flex items-center justify-between">
          <div className="text-[11px] font-mono text-green-400">
            {saveToast && <span className="animate-pulse flex items-center gap-1"><Check className="w-3 h-3" /> {saveToast}</span>}
          </div>
          <button
            id="btn-settings-done"
            onClick={closeSettings}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono text-xs uppercase tracking-wider rounded transition-colors cursor-pointer shadow-sm"
          >
            Done & Apply
          </button>
        </div>
      </div>
    </div>
  );
};
