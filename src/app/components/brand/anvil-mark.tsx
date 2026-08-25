type AnvilMarkProps = {
  className?: string;
};

export default function AnvilMark({ className = '' }: AnvilMarkProps) {
  return (
    <span className={`anvilMark ${className}`.trim()} aria-hidden="true">
      <span className="anvilMarkTop" />
      <span className="anvilMarkStem" />
      <span className="anvilMarkBase" />
    </span>
  );
}
