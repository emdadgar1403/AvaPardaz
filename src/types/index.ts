export type EngineType = 'VOICE_ENGINE' | 'KOKORO_ENGINE';

export type GenerationStatus = 'DRAFT' | 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type EmotionTag = 'NEUTRAL' | 'NARRATION' | 'HAPPY' | 'SAD' | 'WHISPER' | 'DRAMATIC';

export interface PauseConfig {
  smartPauseEnabled: boolean;
  commaPauseMs: number;
  periodPauseMs: number;
  paragraphPauseMs: number;
  questionPauseMs: number;
}

export interface VoiceSpeaker {
  id: string;
  nameFa: string;
  gender: 'مرد' | 'زن';
  engineType: EngineType;
  recommendedFor: string;
}

export interface AudioProject {
  id: string;
  title: string;
  rawText: string;
  engineType: EngineType;
  modelId: string;
  speakerId: string;
  speed: number;
  pitch: number;
  isSmartPauseEnabled: boolean;
  pauseConfig: PauseConfig;
  emotionTag: EmotionTag;
  audioFilePath?: string | null;
  sampleRate: number;
  durationSeconds: number;
  createdAt: number;
  updatedAt: number;
  status: GenerationStatus;
  errorMessage?: string | null;
}

export interface ModelInfo {
  id: string;
  nameFa: string;
  engineType: EngineType;
  sampleRate: number;
  sizeBytes: number;
  status: 'INSTALLED' | 'CONTRACT_PENDING' | 'NOT_DOWNLOADED';
  isDefault?: boolean;
  filePath?: string | null;
  description: string;
}

export interface UserSettings {
  defaultEngine: EngineType;
  defaultSpeed: number;
  defaultPitch: number;
  pauseConfig: PauseConfig;
  exportStoragePath: string;
  isAutoSaveEnabled: boolean;
}
