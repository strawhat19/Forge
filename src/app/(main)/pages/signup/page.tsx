import type { Metadata } from 'next';
import ForgeAuthForm from '@/app/components/auth/forge-auth-form';
import TextReveal from '@/app/components/effects/text-reveal';
import SplitHeading from '@/app/components/effects/split-heading';

export const metadata: Metadata = {
  title: 'Sign Up',
};

export default function SignUpPage() {
  return (
    <section className="authPage">
      <div className="authIntro">
        <TextReveal as="span" className="eyebrow" text="Access Anvil" />
        <SplitHeading as="h1" text="Sign <em>up.</em>" />
        <TextReveal as="p" text="Forge your Success." delay={0.06} />
      </div>
      <ForgeAuthForm mode="sign-up" />
    </section>
  );
}
