import type { Metadata } from 'next';
import ForgeAuthForm from '@/app/components/auth/forge-auth-form';
import TextReveal from '@/app/components/effects/text-reveal';
import SplitHeading from '@/app/components/effects/split-heading';

export const metadata: Metadata = {
  title: 'Sign in',
};

export default function SignInPage() {
  return (
    <section className="authPage">
      <div className="authIntro">
        <TextReveal as="span" className="eyebrow" text="Forge access" />
        <SplitHeading as="h1" text="Sign <em>in.</em>" />
        <TextReveal as="p" text="Return to the workbench and keep shaping what matters." delay={0.06} />
      </div>
      <ForgeAuthForm mode="sign-in" />
    </section>
  );
}
