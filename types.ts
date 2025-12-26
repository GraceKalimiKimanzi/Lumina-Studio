
export enum AppStatus {
  IDLE = 'IDLE',
  CONFIGURING = 'CONFIGURING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface GenerationSettings {
  gestureIntensity: 'low' | 'medium';
  facialExpressiveness: 'natural' | 'expressive';
  backgroundStyle: 'cinematic' | 'neutral' | 'office';
}

export interface MediaState {
  photo: string | null;
  audio: string | null;
  resultVideo: string | null;
}

export interface ProcessingLog {
  timestamp: string;
  message: string;
}
