import TextReveal from '@/app/components/effects/text-reveal';

type SplitHeadingProps = {
  text: string;
  html?: boolean;
  delay?: number;
  className?: string;
  as?: `h1` | `h2`;
};

export default function SplitHeading({
  text,
  delay = 0.1,
  as = `h2`,
  html = true,
  className = ``,
}: SplitHeadingProps) {
  return <TextReveal as={as} text={text} html={html} delay={delay} variant="hero" className={`forgeDisplayHeading ${className}`.trim()} />;
}
