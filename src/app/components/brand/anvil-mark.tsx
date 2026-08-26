import { useId } from 'react';

type AnvilMarkProps = {
  className?: string;
};

export default function AnvilMark({ className = `` }: AnvilMarkProps) {
  const gradientId = `anvil-gradient-${useId().replaceAll(`:`, ``)}`;

  return (
    <span className={`anvilMark ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 200 124" focusable="false" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={gradientId} x1="22" y1="11" x2="160" y2="119" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--ember)" />
            <stop offset="30%" stopColor="#ff4230" />
            <stop offset="55%" stopColor="var(--red)" />
            <stop offset="78%" stopColor="#b70a13" />
            <stop offset="100%" stopColor="var(--red-deep)" />
          </linearGradient>
        </defs>

        <path
          className="anvilMarkBody"
          fill={`url(#${gradientId})`}
          d="M4 28C25 16 48 12 73 12H196V36C171 37 151 42 135 50C126 55 121 61 118 67V81L151 101V116H45V101L78 81V67C75 59 71 53 65 49C48 44 29 39 7 33L2 31Z"
        />
        <path
          className="anvilMarkSheen"
          d="M5 29C26 17 49 13 73 13H195V19H73C49 19 30 22 12 31Z"
        />
        <path
          className="anvilMarkEdge"
          d="M6 28.5C27 16.8 49 12.8 73 12.8H195"
        />
      </svg>
    </span>
  );
}
