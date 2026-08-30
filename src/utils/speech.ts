import { LanguageCode, SpeechMetrics } from '../types';

// Declare Web Speech API window types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface SpeechDiagnosticLog {
  id: string;
  timestamp: string;
  category: 'PERMISSION' | 'AUDIO_CONTEXT' | 'SPEECH_RECOGNITION' | 'RECORDER' | 'GEMINI_AI';
  level: 'info' | 'success' | 'warn' | 'error';
  message: string;
  details?: any;
}

// Global logger subscriber type
type DiagnosticLogListener = (log: SpeechDiagnosticLog) => void;
const diagnosticListeners: Set<DiagnosticLogListener> = new Set();

export function subscribeToSpeechDiagnostics(listener: DiagnosticLogListener): () => void {
  diagnosticListeners.add(listener);
  return () => {
    diagnosticListeners.delete(listener);
  };
}

export function logSpeechDiagnostic(
  category: SpeechDiagnosticLog['category'],
  level: SpeechDiagnosticLog['level'],
  message: string,
  details?: any
) {
  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });
  const logItem: SpeechDiagnosticLog = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    timestamp,
    category,
    level,
    message,
    details
  };

  // Browser developer console logging with distinct prefix and styling
  const prefix = `[${timestamp}] [${category}]`;
  if (level === 'error') {
    console.error(prefix, message, details !== undefined ? details : '');
  } else if (level === 'warn') {
    console.warn(prefix, message, details !== undefined ? details : '');
  } else if (level === 'success') {
    console.info(`%c${prefix} ${message}`, 'color: #22c55e; font-weight: bold;', details !== undefined ? details : '');
  } else {
    console.log(`%c${prefix} ${message}`, 'color: #38bdf8;', details !== undefined ? details : '');
  }

  // Notify active UI subscribers
  diagnosticListeners.forEach(listener => {
    try {
      listener(logItem);
    } catch {
      // Ignore subscriber errors
    }
  });
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

/**
 * Web Speech Recognition Client Service
 */
export class SpeechRecognitionService {
  private recognition: any = null;
  private isListening: boolean = false;
  private onTranscriptUpdate?: (transcript: string, isFinal: boolean) => void;
  private onErrorCallback?: (error: string, isPermissionError: boolean) => void;
  private currentLanguage: LanguageCode = 'en';
  private restartTimeout: any = null;
  private finalTranscriptHistory: string = '';

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        logSpeechDiagnostic(
          'SPEECH_RECOGNITION',
          'info',
          `Initializing Web Speech API constructor (${window.SpeechRecognition ? 'standard SpeechRecognition' : 'webkitSpeechRecognition'})`
        );

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;

        // Lifecycle event: onstart
        this.recognition.onstart = () => {
          logSpeechDiagnostic(
            'SPEECH_RECOGNITION',
            'success',
            `Web Speech Recognition service STARTED. Listening for vocal input in locale: ${LANGUAGE_LOCALES[this.currentLanguage].code}`
          );
        };

        // Lifecycle event: onaudiostart
        this.recognition.onaudiostart = () => {
          logSpeechDiagnostic(
            'SPEECH_RECOGNITION',
            'info',
            'Audio capture started inside Web Speech Recognition engine.'
          );
        };

        // Lifecycle event: onsoundstart
        this.recognition.onsoundstart = () => {
          logSpeechDiagnostic(
            'SPEECH_RECOGNITION',
            'info',
            'Sound detected by Web Speech Recognition engine.'
          );
        };

        // Lifecycle event: onspeechstart
        this.recognition.onspeechstart = () => {
          logSpeechDiagnostic(
            'SPEECH_RECOGNITION',
            'success',
            'Human speech detected in Web Speech Recognition audio stream.'
          );
        };

        // Lifecycle event: onspeechend
        this.recognition.onspeechend = () => {
          logSpeechDiagnostic(
            'SPEECH_RECOGNITION',
            'info',
            'Speech utterance ended in Web Speech Recognition engine.'
          );
        };

        // Lifecycle event: onsoundend
        this.recognition.onsoundend = () => {
          logSpeechDiagnostic(
            'SPEECH_RECOGNITION',
            'info',
            'Sound ended in Web Speech Recognition engine.'
          );
        };

        // Lifecycle event: onaudioend
        this.recognition.onaudioend = () => {
          logSpeechDiagnostic(
            'SPEECH_RECOGNITION',
            'info',
            'Audio capture ended in Web Speech Recognition engine.'
          );
        };

        // Result event
        this.recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let sessionFinalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcriptPiece = event.results[i][0].transcript;
            const confidence = event.results[i][0].confidence;
            if (event.results[i].isFinal) {
              sessionFinalTranscript += transcriptPiece + ' ';
              logSpeechDiagnostic(
                'SPEECH_RECOGNITION',
                'success',
                `Final phrase recognized: "${transcriptPiece.trim()}" (confidence: ${(confidence * 100).toFixed(1)}%)`,
                { phrase: transcriptPiece, confidence }
              );
            } else {
              interimTranscript += transcriptPiece;
            }
          }

          if (sessionFinalTranscript) {
            this.finalTranscriptHistory = (this.finalTranscriptHistory + ' ' + sessionFinalTranscript).trim();
          }

          const combined = (this.finalTranscriptHistory + (interimTranscript ? ' ' + interimTranscript : '')).trim();
          
          if (interimTranscript) {
            logSpeechDiagnostic(
              'SPEECH_RECOGNITION',
              'info',
              `Interim live transcript: "${interimTranscript.trim()}"`
            );
          }

          if (this.onTranscriptUpdate && combined) {
            this.onTranscriptUpdate(combined, Boolean(sessionFinalTranscript));
          }
        };

        // Error event
        this.recognition.onerror = (event: any) => {
          const err = event.error || 'speech_recognition_error';
          logSpeechDiagnostic(
            'SPEECH_RECOGNITION',
            err === 'no-speech' ? 'info' : 'warn',
            `Speech recognition error event: code="${err}", message="${event.message || 'No additional details'}"`,
            { error: err, rawEvent: event }
          );

          if (err === 'no-speech') {
            // Non-fatal, keep listening
            return;
          }

          const isPermissionDenied = err === 'not-allowed' || err === 'service-not-allowed';
          let humanMessage = 'Speech recognition is listening.';

          if (err === 'not-allowed') {
            humanMessage = 'Microphone permission was denied in this browser. Please allow microphone access or type directly into the response box.';
          } else if (err === 'service-not-allowed') {
            humanMessage = 'Browser Web Speech API network service is restricted in this sandboxed iframe. Audio recording backup is transcribing your voice directly with Gemini Audio AI.';
          } else if (err === 'network') {
            humanMessage = 'Speech recognition network dropped. Audio recording backup is transcribing your voice with Gemini Audio AI.';
          } else if (err === 'audio-capture') {
            humanMessage = 'No microphone hardware found. Please check your audio input devices.';
          }

          if (this.onErrorCallback) {
            this.onErrorCallback(humanMessage, isPermissionDenied);
          }
        };

        // End event
        this.recognition.onend = () => {
          logSpeechDiagnostic(
            'SPEECH_RECOGNITION',
            'info',
            `Web Speech Recognition session ended (isListening state: ${this.isListening})`
          );

          if (this.isListening) {
            // Debounced restart if candidate is still actively recording
            if (this.restartTimeout) clearTimeout(this.restartTimeout);
            this.restartTimeout = setTimeout(() => {
              if (this.isListening && this.recognition) {
                try {
                  logSpeechDiagnostic('SPEECH_RECOGNITION', 'info', 'Auto-restarting Web Speech Recognition loop...');
                  this.recognition.start();
                } catch (e: any) {
                  logSpeechDiagnostic('SPEECH_RECOGNITION', 'warn', `Speech restart notice: ${e?.message}`);
                }
              }
            }, 200);
          }
        };
      } catch (e: any) {
        logSpeechDiagnostic('SPEECH_RECOGNITION', 'error', `Failed to initialize SpeechRecognition: ${e?.message}`);
      }
    } else {
      logSpeechDiagnostic('SPEECH_RECOGNITION', 'warn', 'Web Speech API is not supported in this browser environment.');
    }
  }

  public isSupported(): boolean {
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  public setLanguage(lang: LanguageCode) {
    this.currentLanguage = lang;
    if (this.recognition) {
      try {
        this.recognition.lang = LANGUAGE_LOCALES[lang].code;
        logSpeechDiagnostic('SPEECH_RECOGNITION', 'info', `Recognition language set to: ${LANGUAGE_LOCALES[lang].name} (${LANGUAGE_LOCALES[lang].code})`);
      } catch (e: any) {
        logSpeechDiagnostic('SPEECH_RECOGNITION', 'warn', `Could not update language: ${e?.message}`);
      }
    }
  }

  public setBaseTranscript(text: string) {
    this.finalTranscriptHistory = text.trim();
  }

  public start(
    onTranscript: (transcript: string, isFinal: boolean) => void,
    onError?: (error: string, isPermissionError: boolean) => void,
    initialTranscript: string = ''
  ) {
    this.finalTranscriptHistory = initialTranscript.trim();

    if (!this.recognition) {
      this.initRecognition();
    }

    if (!this.recognition) {
      logSpeechDiagnostic('SPEECH_RECOGNITION', 'warn', 'Web Speech API is unavailable. MediaRecorder with Gemini Audio AI is active.');
      if (onError) {
        onError('Web Speech API is unavailable in this browser. Live Audio Recording is active and will transcribe directly via Gemini Audio AI.', false);
      }
      return;
    }

    this.onTranscriptUpdate = onTranscript;
    this.onErrorCallback = onError;
    this.isListening = true;

    try {
      this.recognition.lang = LANGUAGE_LOCALES[this.currentLanguage].code;
      logSpeechDiagnostic('SPEECH_RECOGNITION', 'info', `Calling recognition.start() [locale: ${this.recognition.lang}]...`);
      this.recognition.start();
    } catch (e: any) {
      logSpeechDiagnostic('SPEECH_RECOGNITION', 'warn', `recognition.start() call notice: ${e?.message}`);
    }
  }

  public stop() {
    this.isListening = false;
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }
    if (this.recognition) {
      try {
        logSpeechDiagnostic('SPEECH_RECOGNITION', 'info', 'Calling recognition.stop()...');
        this.recognition.stop();
      } catch (e: any) {
        logSpeechDiagnostic('SPEECH_RECOGNITION', 'warn', `recognition.stop() call notice: ${e?.message}`);
      }
    }
  }
}

/**
 * Microphone Audio Visualizer & MediaRecorder Engine with Diagnostic Telemetry
 */
export class AudioVisualizerService {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private animationId: number | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private mimeType: string = 'audio/webm';
  private hasLoggedFirstAudioPacket: boolean = false;

  public async start(
    onVolumeUpdate: (volumeLevels: number[], isVoiceDetected: boolean, peakLevel: number) => void,
    onError?: (err: any, isPermissionDenied: boolean) => void
  ) {
    this.hasLoggedFirstAudioPacket = false;

    try {
      // Step 1: Check Permissions API if available
      if (navigator.permissions && (navigator.permissions as any).query) {
        try {
          const permStatus = await (navigator.permissions as any).query({ name: 'microphone' as PermissionName });
          logSpeechDiagnostic(
            'PERMISSION',
            permStatus.state === 'granted' ? 'success' : permStatus.state === 'denied' ? 'error' : 'info',
            `Microphone Permissions API state: "${permStatus.state}"`,
            { state: permStatus.state }
          );
        } catch {
          // Some browsers do not support microphone in permissions.query
        }
      }

      // Step 2: Request microphone stream via getUserMedia
      logSpeechDiagnostic('PERMISSION', 'info', 'Requesting microphone access via navigator.mediaDevices.getUserMedia...');
      
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: false
      });

      const audioTracks = this.mediaStream.getAudioTracks();
      const trackDetails = audioTracks.map(t => ({
        id: t.id,
        label: t.label || 'Default Microphone Device',
        readyState: t.readyState,
        enabled: t.enabled,
        muted: t.muted,
        settings: t.getSettings ? t.getSettings() : {}
      }));

      logSpeechDiagnostic(
        'PERMISSION',
        'success',
        `Microphone access GRANTED! Stream ID: "${this.mediaStream.id}", Active audio tracks: ${audioTracks.length}`,
        trackDetails
      );

      // Step 3: Initialize AudioContext & Verify State
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) {
        throw new Error('Web Audio API (AudioContext) is not supported in this browser.');
      }

      this.audioCtx = new AudioCtxClass();
      logSpeechDiagnostic(
        'AUDIO_CONTEXT',
        'info',
        `AudioContext created. SampleRate: ${this.audioCtx.sampleRate}Hz, Initial State: "${this.audioCtx.state}"`,
        { sampleRate: this.audioCtx.sampleRate, state: this.audioCtx.state }
      );

      // Explicit resume for browser autoplay/user gesture policies
      if (this.audioCtx.state === 'suspended') {
        logSpeechDiagnostic('AUDIO_CONTEXT', 'info', 'AudioContext is suspended. Calling audioCtx.resume()...');
        await this.audioCtx.resume();
        logSpeechDiagnostic('AUDIO_CONTEXT', 'success', `AudioContext resumed successfully. State: "${this.audioCtx.state}"`);
      }

      this.audioCtx.onstatechange = () => {
        if (this.audioCtx) {
          logSpeechDiagnostic('AUDIO_CONTEXT', 'info', `AudioContext state changed to: "${this.audioCtx.state}"`);
        }
      };

      // Step 4: Configure Analyser Node and Audio Graph
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.6;
      this.source = this.audioCtx.createMediaStreamSource(this.mediaStream);
      this.source.connect(this.analyser);

      logSpeechDiagnostic(
        'AUDIO_CONTEXT',
        'success',
        'Audio routing graph connected: MediaStreamSource -> AnalyserNode -> DSP Pipeline.'
      );

      // Step 5: Setup MediaRecorder for universal backup audio
      this.audioChunks = [];
      const supportedTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
        'audio/wav'
      ];
      this.mimeType = supportedTypes.find(type => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) || 'audio/webm';

      if (typeof MediaRecorder !== 'undefined') {
        try {
          this.mediaRecorder = new MediaRecorder(this.mediaStream, { mimeType: this.mimeType });
          this.mediaRecorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
              this.audioChunks.push(event.data);
            }
          };
          this.mediaRecorder.start(400); // 400ms time slices
          logSpeechDiagnostic(
            'RECORDER',
            'success',
            `MediaRecorder started recording audio chunks. MIME: "${this.mimeType}", state: "${this.mediaRecorder.state}"`
          );
        } catch (mrErr: any) {
          logSpeechDiagnostic('RECORDER', 'warn', `MediaRecorder init notice: ${mrErr?.message}`);
        }
      }

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const render = () => {
        if (!this.analyser) return;
        this.analyser.getByteFrequencyData(dataArray);

        // Sample 14 discrete bars for the UI waveform
        const bars: number[] = [];
        const step = Math.max(1, Math.floor(bufferLength / 14));
        let totalEnergy = 0;
        let maxVal = 0;

        for (let i = 0; i < 14; i++) {
          const val = dataArray[i * step] || 0;
          if (val > maxVal) maxVal = val;
          totalEnergy += val;
          // Scale to percentage (15% to 100%)
          const pct = Math.min(100, Math.max(15, Math.round((val / 255) * 100)));
          bars.push(pct);
        }

        const avgEnergy = totalEnergy / 14;
        const isVoiceDetected = avgEnergy > 16; // Threshold for active vocal speech
        const peakLevel = Math.min(100, Math.round((avgEnergy / 160) * 100));

        // Log the first non-zero audio input frame to verify data flow
        if (!this.hasLoggedFirstAudioPacket && maxVal > 0) {
          this.hasLoggedFirstAudioPacket = true;
          logSpeechDiagnostic(
            'AUDIO_CONTEXT',
            'success',
            `Audio input data flow VERIFIED! Non-zero acoustic signal captured. Peak amplitude: ${maxVal}/255 (${Math.round((maxVal/255)*100)}%), Average vocal energy: ${avgEnergy.toFixed(1)}`,
            { maxVal, avgEnergy, isVoiceDetected, sampleFrequencies: Array.from(dataArray.slice(0, 8)) }
          );
        }

        onVolumeUpdate(bars, isVoiceDetected, peakLevel);
        this.animationId = requestAnimationFrame(render);
      };

      render();
    } catch (err: any) {
      logSpeechDiagnostic(
        'PERMISSION',
        'error',
        `Microphone capture / AudioContext setup failed: ${err?.name || 'Error'} - ${err?.message || 'Unknown issue'}`,
        err
      );
      const isPermissionDenied = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError';
      if (onError) onError(err, isPermissionDenied);
    }
  }

  public async getRecordedAudioPayload(): Promise<{ base64Audio: string; mimeType: string }> {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      try {
        this.mediaRecorder.requestData();
      } catch {
        // Safe ignore
      }
    }

    if (this.audioChunks.length > 0) {
      const blob = new Blob(this.audioChunks, { type: this.mimeType });
      const base64Audio = await this.blobToBase64(blob);
      return { base64Audio, mimeType: this.mimeType };
    }

    return { base64Audio: '', mimeType: this.mimeType };
  }

  public async stop(): Promise<{ audioBlob: Blob | null; base64Audio: string; mimeType: string }> {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    let recordedBlob: Blob | null = null;
    let base64Audio = '';

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        await new Promise<void>((resolve) => {
          if (!this.mediaRecorder) return resolve();
          this.mediaRecorder.onstop = () => resolve();
          try {
            this.mediaRecorder.stop();
            logSpeechDiagnostic('RECORDER', 'info', 'MediaRecorder stopped cleanly.');
          } catch {
            resolve();
          }
        });

        if (this.audioChunks.length > 0) {
          recordedBlob = new Blob(this.audioChunks, { type: this.mimeType });
          base64Audio = await this.blobToBase64(recordedBlob);
          logSpeechDiagnostic(
            'RECORDER',
            'success',
            `Recorded audio payload created. Total size: ${(recordedBlob.size / 1024).toFixed(1)} KB, Chunks count: ${this.audioChunks.length}`,
            { sizeBytes: recordedBlob.size, mimeType: this.mimeType }
          );
        }
      } catch (err: any) {
        logSpeechDiagnostic('RECORDER', 'warn', `MediaRecorder stop error: ${err?.message}`);
      }
    } else if (this.audioChunks.length > 0) {
      recordedBlob = new Blob(this.audioChunks, { type: this.mimeType });
      base64Audio = await this.blobToBase64(recordedBlob);
    }

    if (this.mediaStream) {
      const tracks = this.mediaStream.getTracks();
      tracks.forEach(track => {
        track.stop();
        logSpeechDiagnostic('PERMISSION', 'info', `Stopped audio track: ${track.label}`);
      });
      this.mediaStream = null;
    }

    if (this.audioCtx) {
      try {
        await this.audioCtx.close();
        logSpeechDiagnostic('AUDIO_CONTEXT', 'info', 'AudioContext closed.');
      } catch {
        // Safe ignore
      }
      this.audioCtx = null;
    }

    return {
      audioBlob: recordedBlob,
      base64Audio,
      mimeType: this.mimeType
    };
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result as string;
        resolve(res);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
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
