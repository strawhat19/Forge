import { useId } from 'react';

type HammerMarkProps = {
  className?: string;
};

export default function HammerMark({ className = `` }: HammerMarkProps) {
  const gradientId = `hammer-gradient-${useId().replaceAll(`:`, ``)}`;
  const handleGradientId = `hammer-handle-gradient-${useId().replaceAll(`:`, ``)}`;

  return (
    <span className={`hammerMark ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 200 124" focusable="false" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={gradientId} x1="20" y1="12" x2="158" y2="121" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--ember)" />
            <stop offset="30%" stopColor="#ff4230" />
            <stop offset="55%" stopColor="var(--red)" />
            <stop offset="78%" stopColor="#b70a13" />
            <stop offset="100%" stopColor="var(--red-deep)" />
          </linearGradient>
          <linearGradient id={handleGradientId} x1="94" y1="47" x2="161" y2="122" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a7191e" />
            <stop offset="32%" stopColor="#661015" />
            <stop offset="72%" stopColor="#3c090d" />
            <stop offset="100%" stopColor="#1f0508" />
          </linearGradient>
        </defs>

        <g transform="rotate(-7 100 62)">
          <path
            className="hammerMarkHandle"
            fill={`url(#${handleGradientId})`}
            d="M82 45L103 41L169 106C174 111 173 117 167 121L161 124H143L91 55Z"
          />
          <path
            className="hammerMarkBody"
            fill={`url(#${gradientId})`}
            d="M8 20L20 12H111L127 20V54L111 62H20L8 53Z"
          />
          <path
            className="hammerMarkBody"
            fill={`url(#${gradientId})`}
            d="M126 20L190 28L197 37L190 47L126 54Z"
          />
          <path
            className="hammerMarkSheen"
            d="M20 13H110L123 20H18L10 22Z"
          />
          <path
            className="hammerMarkHandleSheen"
            d="M91 53L97 50L163 112L157 116Z"
          />
          <path
            className="hammerMarkEdge"
            d="M20 12.5H111L127 20.5L190 28.5"
          />
          <path
            className="hammerMarkEdge hammerMarkFaceEdge"
            d="M20 13V61"
          />
        </g>
      </svg>
    </span>
  );
}
