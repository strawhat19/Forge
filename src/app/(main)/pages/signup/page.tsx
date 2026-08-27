import type { Metadata } from 'next';
import ForgeAuthForm from '@/app/components/auth/forge-auth-form';
import TextReveal from '@/app/components/effects/text-reveal';
import SplitHeading from '@/app/components/effects/split-heading';

export const metadata: Metadata = {
  title: 'Sign up',
};

export default function SignUpPage() {
  return (
    <section className="authPage">
      <div className="authIntro">
        <TextReveal as="span" className="eyebrow" text="Join the forge" />
        <SplitHeading as="h1" text="Sign <em>up.</em>" />
        <TextReveal as="p" text="Create your Forge access and bring the next idea into focus." delay={0.06} />
      </div>
      <ForgeAuthForm mode="sign-up" />
    </section>
  );
}
