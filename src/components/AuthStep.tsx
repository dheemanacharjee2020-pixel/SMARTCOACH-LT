import React, { useState } from 'react';
import { UserProfile, CandidateTrack } from '../types';
import { CANDIDATE_TRACKS } from '../utils/tracks';
import { safeFetchJson } from '../utils/api';
import { ThemeToggle } from './ThemeToggle';
import { 
  LogIn, 
  Bot, 
  GraduationCap, 
  Briefcase, 
  FlaskConical, 
  Code2,
  CheckCircle2
} from 'lucide-react';

interface AuthStepProps {
  onLoginSuccess: (user: UserProfile, isReturning: boolean, track?: CandidateTrack) => void;
  currentUser: UserProfile | null;
  candidateTrack: CandidateTrack;
  onSelectCandidateTrack: (track: CandidateTrack) => void;
}

export const AuthStep: React.FC<AuthStepProps> = ({ 
  onLoginSuccess, 
  candidateTrack,
  onSelectCandidateTrack
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTrackIcon = (id: CandidateTrack) => {
    switch (id) {
      case 'undergraduate':
        return GraduationCap;
      case 'postgraduate_mba':
        return Briefcase;
      case 'research_phd':
        return FlaskConical;
      case 'experienced_pro':
      default:
        return Code2;
    }
  };

  const handleCustomAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const endpoint = isRegisterMode ? '/api/auth/register' : '/api/auth/login';
      const { success, data, error: fetchErr } = await safeFetchJson<{ success: boolean; user?: UserProfile; error?: string }>(
        endpoint,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email, 
            name: name || email.split('@')[0],
            candidateTrack
          })
        }
      );
      if (success && data?.user) {
        onLoginSuccess(data.user, Boolean(data.user.isReturningUser), data.user.candidateTrack || candidateTrack);
      } else {
        setError(fetchErr || data?.error || 'Authentication failed. Please try again.');
      }
    } catch (err: any) {
      setError('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-screen" className="max-w-4xl mx-auto py-5 px-4 flex flex-col items-center relative">
      {/* Top right theme switcher */}
      <div className="w-full flex justify-end mb-2">
        <ThemeToggle variant="pill" />
      </div>

      {/* Title & Persona Banner */}
      <div className="w-full text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-900/20 border border-blue-500/30 text-blue-400 text-[10px] font-mono uppercase tracking-widest mb-3">
          <Bot className="w-3.5 h-3.5 text-blue-400" />
          <span>Stage 1: Candidate Verification & Track Calibration</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight mb-2">
          SmartCoach LT
        </h1>
        <p className="text-slate-400 text-xs max-w-xl mx-auto leading-relaxed">
          The demanding, honest AI interview coach calibrated for strict STAR analysis, acoustic metrics, and specific candidate career stages.
        </p>
      </div>

      {/* Track Selection Matrix */}
      <div className="w-full max-w-3xl mb-6">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <label className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span>Select Your Interview Track</span>
            <span className="text-[10px] text-blue-400 font-normal">
              (Calibrates question difficulty & STAR evaluation bar)
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CANDIDATE_TRACKS.map((t) => {
            const Icon = getTrackIcon(t.id);
            const isSelected = candidateTrack === t.id;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectCandidateTrack(t.id)}
                className={`p-3.5 rounded border text-left cursor-pointer transition-all duration-150 relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-950/40 border-blue-500/80 shadow-md ring-1 ring-blue-500/40'
                    : 'bg-[#161B29] border-slate-800 hover:border-slate-700 hover:bg-[#1A2234]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded ${isSelected ? 'bg-blue-600/30 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-100">{t.label}</span>
                    </div>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                      isSelected
                        ? 'bg-blue-900/50 text-blue-300 border border-blue-700/60'
                        : 'bg-[#0B0F1A] text-slate-500 border border-slate-800'
                    }`}>
                      {t.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                    {t.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span className="truncate max-w-[200px]">Focus: {t.targetFocus.split(',')[0]}</span>
                  {isSelected && (
                    <span className="text-blue-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active Track
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Standard Form Login / Register */}
      <div className="w-full max-w-3xl bg-[#161B29] border border-slate-800 rounded p-5">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">
            {isRegisterMode ? 'Create New Account with Selected Track' : 'Direct Email Sign In'}
          </h3>
          <button
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="text-[11px] text-blue-400 hover:underline cursor-pointer font-mono"
          >
            {isRegisterMode ? 'Switch to Sign In' : 'Need an account? Register'}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/10 border border-red-900/30 rounded text-xs text-red-400 font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleCustomAuth} className="space-y-3.5">
          {isRegisterMode && (
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase tracking-wider font-bold">
                Full Name
              </label>
              <input
                id="input-auth-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                className="w-full px-3 py-2 bg-[#0B0F1A] border border-slate-800 focus:border-blue-500 rounded text-xs text-slate-100 placeholder-slate-600 outline-none transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase tracking-wider font-bold">
              Email Address
            </label>
            <input
              id="input-auth-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="candidate@example.com"
              className="w-full px-3 py-2 bg-[#0B0F1A] border border-slate-800 focus:border-blue-500 rounded text-xs text-slate-100 placeholder-slate-600 outline-none transition-colors"
            />
          </div>

          <button
            id="btn-auth-submit"
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50 shadow-md"
          >
            {loading ? (
              <span className="font-mono text-xs animate-pulse">CALIBRATING CANDIDATE ROOM...</span>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5" />
                <span>{isRegisterMode ? 'Complete Registration' : 'Sign In to SmartCoach'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

