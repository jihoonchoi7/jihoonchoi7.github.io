export type NoteType = 'eighth' | 'quarter' | 'half' | 'whole';

export interface NoteThreshold {
  ms: number;
  type: NoteType;
  label: string;
  hint: string;
}

export const NOTE_THRESHOLDS: NoteThreshold[] = [
  { ms: 4000, type: 'whole', label: 'Whole', hint: 'hold 4s' },
  { ms: 2000, type: 'half', label: 'Half', hint: 'hold 2s' },
  { ms: 1000, type: 'quarter', label: 'Quarter', hint: 'hold 1s' },
  { ms: 0, type: 'eighth', label: 'Eighth', hint: 'tap' },
];

export const NOTE_LIFETIME_MS = 4000;

export const HOLD_MAX_MS = 4000;

export function noteTypeForDuration(ms: number): NoteType {
  for (const t of NOTE_THRESHOLDS) if (ms >= t.ms) return t.type;
  return 'eighth';
}

export function noteLabelForDuration(ms: number): string {
  for (const t of NOTE_THRESHOLDS) if (ms >= t.ms) return t.label;
  return 'Eighth';
}
