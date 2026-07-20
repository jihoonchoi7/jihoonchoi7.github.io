import { NoteType } from '../lib/notes';

interface NoteGlyphProps {
  type: NoteType;
  size?: number;
  color?: string;
}

const CODEPOINTS: Record<NoteType, string> = {
  whole: '\uE1D2',
  half: '\uE1D3',
  quarter: '\uE1D5',
  eighth: '\uE1D7',
};

export function NoteGlyph({ type, size = 48, color = 'currentColor' }: NoteGlyphProps) {
  return (
    <span
      aria-hidden="true"
      style={{
        fontFamily: 'Bravura, serif',
        fontSize: `${size}px`,
        lineHeight: 1,
        color,
        display: 'inline-block',
        transform: 'translateY(-14%)',
      }}
    >
      {CODEPOINTS[type]}
    </span>
  );
}
