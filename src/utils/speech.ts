import { LanguageCode, SpeechMetrics } from '../types';

// Declare Web Speech API window types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const LANGUAGE_LOCALES: Record<LanguageCode, { code: string; label: string; name: string }> = {
  en: { code: 'en-US', label: 'EN', name: 'English (US)' },
  hi: { code: 'hi-IN', label: 'HI', name: 'Hindi (हिन्दी)' },
  bn: { code: 'bn-IN', label: 'BN', name: 'Bengali (বাংলা)' }
};

const COMMON_FILLER_WORDS = [
  'um', 'uh', 'er', 'ah', 'like', 'you know', 'actually', 'basically',
  'literally', 'sort of', 'kind of', 'i mean', 'right', 'honestly',
  // Hindi & Hinglish fillers
  'matlab', 'toh', 'aur', 'woh', 'yaani', 'samjhe',
  // Bengali fillers
  'mane', 'aar ki', 'aar', 'sheta', 'kintu'
];

export class SpeechRecognitionService {
  private recognition: any = null;
  private isListening: boolean = false;
  private onTranscriptUpdate?: (transcript: string, isFinal: boolean) => void;
  private onErrorCallback?: (error: string) => void;
  private currentLanguage: LanguageCode = 'en';

  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece + ' ';
          } else {
            interimTranscript += transcriptPiece;
          }
        }

        const combined = (finalTranscript + interimTranscript).trim();
        if (this.onTranscriptUpdate && combined) {
          this.onTranscriptUpdate(combined, Boolean(finalTranscript));
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition event:', event.error);
        if (event.error !== 'no-speech' && this.onErrorCallback) {
          this.onErrorCallback(event.error);
        }
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          // Restart if still in listening state
          try {
            this.recognition.start();
          } catch (e) {
            // Already active or stopped
          }
        }
      };
    }
  }

  public isSupported(): boolean {
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  public setLanguage(lang: LanguageCode) {
    this.currentLanguage = lang;
    if (this.recognition) {
      this.recognition.lang = LANGUAGE_LOCALES[lang].code;
    }
  }

  public start(
    onTranscript: (transcript: string, isFinal: boolean) => void,
    onError?: (error: string) => void
  ) {
    if (!this.recognition) {
      if (onError) onError('Speech Recognition API is not supported in this browser. You can type or paste your answer directly.');
      return;
    }

    this.onTranscriptUpdate = onTranscript;
    this.onErrorCallback = onError;
    this.isListening = true;
    this.recognition.lang = LANGUAGE_LOCALES[this.currentLanguage].code;

    try {
      this.recognition.start();
    } catch (e) {
      console.warn('Recognition start exception:', e);
    }
  }

  public stop() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Safe ignore
      }
    }
  }
}

/**
 * Microphone Audio Visualizer using AudioContext AnalyserNode
 */
export class AudioVisualizerService {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private animationId: number | null = null;

  public async start(onVolumeUpdate: (volumeLevels: number[]) => void, onError?: (err: any) => void) {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      this.source = this.audioCtx.createMediaStreamSource(this.mediaStream);
      this.source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const render = () => {
        if (!this.analyser) return;
        this.analyser.getByteFrequencyData(dataArray);

        // Sample 14 discrete bars for the UI waveform
        const bars: number[] = [];
        const step = Math.max(1, Math.floor(bufferLength / 14));
        for (let i = 0; i < 14; i++) {
          const val = dataArray[i * step] || 0;
          // Scale to percentage (15% to 100%)
          const pct = Math.min(100, Math.max(15, Math.round((val / 255) * 100)));
          bars.push(pct);
        }

        onVolumeUpdate(bars);
        this.animationId = requestAnimationFrame(render);
      };

      render();
    } catch (err) {
      console.warn('Audio Visualizer error:', err);
      if (onError) onError(err);
    }
  }

  public stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
  }
}

/**
 * Calculates real-time speech analytics from transcript and elapsed time
 */
export function calculateSpeechMetrics(
  transcript: string,
  durationSeconds: number
): SpeechMetrics {
  const clean = transcript.trim();
  const words = clean.length > 0 ? clean.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;

  const effectiveDurationMinutes = Math.max(0.1, durationSeconds / 60);
  const wpm = Math.round(wordCount / effectiveDurationMinutes);

  let paceStatus: 'Slow' | 'Optimal' | 'Fast' = 'Optimal';
  if (wpm < 110) paceStatus = 'Slow';
  else if (wpm > 155) paceStatus = 'Fast';

  // Count filler words
  const lowerWords = words.map(w => w.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const detectedFillers: string[] = [];
  let fillerCount = 0;

  for (const w of lowerWords) {
    if (COMMON_FILLER_WORDS.includes(w)) {
      fillerCount++;
      if (!detectedFillers.includes(w)) {
        detectedFillers.push(w);
      }
    }
  }

  // Confidence calculation (0-100)
  // Higher confidence with good pace, low filler density, reasonable word length
  const fillerRatio = wordCount > 0 ? fillerCount / wordCount : 0;
  let confidenceScore = 88;
  if (paceStatus !== 'Optimal') confidenceScore -= 8;
  if (fillerRatio > 0.08) confidenceScore -= 15;
  else if (fillerRatio > 0.04) confidenceScore -= 7;
  if (wordCount < 20 && durationSeconds > 15) confidenceScore -= 12;
  confidenceScore = Math.max(40, Math.min(96, confidenceScore));

  // Clarity calculation (0-100)
  let clarityScore = 92;
  if (fillerCount > 4) clarityScore -= 10;
  if (paceStatus === 'Fast') clarityScore -= 8;
  clarityScore = Math.max(45, Math.min(98, clarityScore));

  return {
    wpm: wordCount === 0 ? 0 : wpm,
    paceStatus,
    confidenceScore,
    clarityScore,
    fillerWordsCount: fillerCount,
    fillerWordsList: detectedFillers,
    durationSeconds: Math.round(durationSeconds),
    pauseCount: Math.max(0, Math.floor(durationSeconds / 10))
  };
}
