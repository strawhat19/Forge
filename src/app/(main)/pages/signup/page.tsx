import type { Metadata } from 'next';
import ForgeAuthForm from '@/app/components/auth/forge-auth-form';

export const metadata: Metadata = {
  title: 'Sign up',
};

export default function SignUpPage() {
  return (
    <section className="authPage">
      <div className="authIntro">
        <span className="eyebrow">Join the forge</span>
        <h1>Sign <em>up.</em></h1>
        <p>Create your Forge access and bring the next idea into focus.</p>
      </div>
      <ForgeAuthForm mode="sign-up" />
    </section>
  );
}
