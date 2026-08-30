import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppSettings, CoachRigor, SpeechEngine } from '../types';

export const DEFAULT_SETTINGS: AppSettings = {
  coachRigor: 'strict',
  strictStarScoring: true,
  followupProbing: true,
  speechEngine: 'web_speech',
  targetWpm: 140,
  enableTtsQuestionAudio: false,
  ttsSpeed: 1.0,
  noiseSuppression: true,
  showCountdownTimer: true,
  timerDurationSeconds: 120,
  autoAdvanceQuestions: false,
  showLiveTranscript: true,
  enableWaveformAnimation: true
};

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  resetSettings: () => void;
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => {},
  resetSettings: () => {},
  isSettingsOpen: false,
  openSettings: () => {},
  closeSettings: () => {}
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('smartcoach_settings');
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('smartcoach_settings', JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }, [settings]);

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  return (
    <SettingsContext.Provider 
      value={{ 
        settings, 
        updateSettings, 
        resetSettings, 
        isSettingsOpen, 
        openSettings, 
        closeSettings 
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
