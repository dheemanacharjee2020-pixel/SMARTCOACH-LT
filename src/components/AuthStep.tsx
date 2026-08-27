import React, { useState } from 'react';
import { UserProfile } from '../types';
import { LogIn, UserPlus, Sparkles, ShieldCheck, ArrowRight, UserCheck, Bot, FileText, CheckCircle2 } from 'lucide-react';
import { SAMPLE_RESUMES } from '../data/sampleData';

interface AuthStepProps {
  onLoginSuccess: (user: UserProfile, isReturning: boolean) => void;
  currentUser: UserProfile | null;
}

export const AuthStep: React.FC<AuthStepProps> = ({ onLoginSuccess, currentUser }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: name || email.split('@')[0] })
      });
      const data = await res.json();
      if (data.success && data.user) {
        onLoginSuccess(data.user, Boolean(data.user.isReturningUser));
      } else {
        setError(data.error || 'Authentication failed. Please try again.');
      }
    } catch (err: any) {
      setError('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (type: 'new' | 'returning') => {
    setLoading(true);
    setError(null);
    try {
      const userId = type === 'new' ? 'demo-new' : 'demo-returning';
      const email = type === 'new' ? 'jordan.miller@example.com' : 'alex.chen@example.com';
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email })
      });
      const data = await res.json();
      if (data.success && data.user) {
        onLoginSuccess(data.user, type === 'returning');
      }
    } catch (err) {
      setError('Failed to initiate demo session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-screen" className="max-w-4xl mx-auto py-4 px-2 flex flex-col items-center">
      {/* Title & Persona Banner */}
      <div className="w-full text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-900/20 border border-blue-500/30 text-blue-400 text-[10px] font-mono uppercase tracking-widest mb-3">
          <Bot className="w-3.5 h-3.5 text-blue-400" />
          <span>Stage 1: Candidate Verification & Entry</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight mb-2">
          SmartCoach LT
        </h1>
        <p className="text-slate-400 text-xs max-w-xl mx-auto leading-relaxed">
          The demanding, honest AI interview coach. Calibrated for strict STAR analysis, company-verified intelligence, and speech acoustics.
        </p>
      </div>

      {/* Core AI Persona Agreement Card */}
      <div className="w-full max-w-2xl bg-[#161B29] border border-slate-800 rounded p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded bg-red-900/10 border border-red-900/30 text-red-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-400 mb-0.5">
              Coach Persona: Objective Rigor (Zero Flattery)
            </div>
            <p className="text-xs text-slate-400 leading-relaxed italic">
              "You will receive feedback the way a demanding bar-raiser thinks: constructive, STAR-structured, pointing out every missing element. Success probability is strictly estimated with uncertainty bounds — never guaranteed."
            </p>
          </div>
        </div>
      </div>

      {/* Quick-Start Demo Switches */}
      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Option 1: New User */}
        <button
          id="btn-demo-new-user"
          onClick={() => handleDemoLogin('new')}
          disabled={loading}
          className="group text-left p-4 bg-[#161B29] hover:bg-slate-800/60 border border-slate-800 hover:border-blue-500 rounded transition-all duration-150 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-green-400 bg-green-900/20 px-2 py-0.5 rounded border border-green-900/40 uppercase font-bold tracking-wider">
                1st-Time User Flow
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-transform group-hover:translate-x-1" />
            </div>
            <h4 className="text-sm font-semibold text-slate-100 mb-1">
              Jordan Miller (New Candidate)
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Start with minimal onboarding: upload resume & enter company name from scratch.
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] text-blue-400 font-mono flex items-center gap-1.5 uppercase tracking-wider">
            <span>Explore full multi-step sequence</span>
          </div>
        </button>

        {/* Option 2: Returning User */}
        <button
          id="btn-demo-returning-user"
          onClick={() => handleDemoLogin('returning')}
          disabled={loading}
          className="group text-left p-4 bg-[#161B29] hover:bg-slate-800/60 border border-slate-800 hover:border-green-500 rounded transition-all duration-150 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-yellow-400 bg-yellow-900/20 px-2 py-0.5 rounded border border-yellow-900/40 uppercase font-bold tracking-wider">
                2nd+ Login Flow
              </span>
              <UserCheck className="w-3.5 h-3.5 text-slate-500 group-hover:text-green-400 transition-transform group-hover:scale-110" />
            </div>
            <h4 className="text-sm font-semibold text-slate-100 mb-1">
              Alex Chen (Returning Staff Eng)
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Has saved Stripe resume. Triggers shortcut focus question and skips upload.
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] text-green-400 font-mono flex items-center gap-1.5 uppercase tracking-wider">
            <span>Fast-track to focus drill</span>
          </div>
        </button>
      </div>

      {/* Standard Form Login / Register */}
      <div className="w-full max-w-2xl bg-[#161B29] border border-slate-800 rounded p-5">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">
            {isRegisterMode ? 'Create New Account' : 'Direct Email Sign In'}
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
                placeholder="e.g. Priya Sharma"
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
              <span className="font-mono text-xs animate-pulse">AUTHENTICATING...</span>
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

