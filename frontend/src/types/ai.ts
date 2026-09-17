export interface TaskSubgoal {
  step: number;
  title: string;
  description: string;
  assignedArm: 'left_arm' | 'right_arm' | 'both';
  actionType: 'SCAN' | 'PICK_AND_PLACE' | 'ALIGN' | 'DEPOSIT' | 'RETRACT' | 'RECOVER';
  targetObjectId?: string;
  durationSeconds: number;
  status: 'pending' | 'active' | 'completed' | 'failed';
  verificationCriteria: string;
}

export interface VLAPlanResponse {
  query: string;
  matchedTemplate: string;
  goal: string;
  totalSteps: number;
  steps: TaskSubgoal[];
  estimatedTimeSeconds: number;
  planningLatencyMs: number;
  vlaModel: string;
}

export interface VoiceTranscriptionResult {
  transcript: string;
  confidence: number;
  provider: string;
  speechLatencyMs: number;
  isFinal: boolean;
}
