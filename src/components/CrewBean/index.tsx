import type {ReactNode} from 'react';

const BODY =
  'M14 30C14 14 22 6 34 6C46 6 52 14 52 28L52 64C52 70 49 74 44 74L40 74C37 74 36 72 36 69L36 64L30 64L30 69C30 72 29 74 26 74L21 74C17 74 14 71 14 66Z';
const SHADE =
  'M14 47C21 56 32 58 52 55L52 64C52 70 49 74 44 74L40 74C37 74 36 72 36 69L36 64L30 64L30 69C30 72 29 74 26 74L21 74C17 74 14 71 14 66Z';
const PACK = 'M14 32L9 32C6 32 4 34 4 37L4 55C4 58 6 60 9 60L14 60Z';
const INK = '#02030a';

type Props = {
  color: string;
  shade: string;
  dapper?: boolean;
  className?: string;
};

export default function CrewBean({color, shade, dapper = false, className}: Props): ReactNode {
  return (
    <svg
      className={className}
      viewBox={dapper ? '0 -20 64 98' : '0 2 64 76'}
      aria-hidden="true"
      focusable="false">
      <path d={PACK} fill={shade} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d={BODY} fill={color} />
      <path d={SHADE} fill={shade} />
      <path d={BODY} fill="none" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <rect x="29" y="15" width="29" height="18" rx="9" fill="#9dd3e8" stroke={INK} strokeWidth="4" />
      <rect x="37" y="19" width="13" height="4" rx="2" fill="#f4fbff" opacity="0.9" />
      {dapper && (
        <g stroke={INK} strokeWidth="3.5" strokeLinejoin="round">
          <rect x="19" y="-15" width="24" height="21" rx="3" fill="#5b3fb0" />
          <rect x="19" y="-1" width="24" height="5" fill="#9b86e6" />
          <rect x="12" y="4" width="38" height="7" rx="3.5" fill="#46308f" />
          <circle cx="51" cy="24" r="7" fill="none" stroke="#e2a73a" strokeWidth="3" />
          <path d="M51 31C50 40 46 46 44 52" fill="none" stroke="#e2a73a" strokeWidth="1.6" />
        </g>
      )}
    </svg>
  );
}
