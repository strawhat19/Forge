import type { Metadata } from 'next';
import ForgeAuthForm from '@/app/components/auth/forge-auth-form';

export const metadata: Metadata = {
  title: 'Sign in',
};

export default function SignInPage() {
  return (
    <section className="authPage">
      <div className="authIntro">
        <span className="eyebrow">Forge access</span>
        <h1>Sign <em>in.</em></h1>
        <p>Return to the workbench and keep shaping what matters.</p>
      </div>
      <ForgeAuthForm mode="sign-in" />
    </section>
  );
}
