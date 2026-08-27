import type { Metadata } from 'next';
import AccountPagePanel from '@/app/components/account/account-page-panel';
import AuthenticatedRoute from '@/app/components/auth/authenticated-route';
import ProductPageHero from '@/app/components/product/product-page-hero';

export const metadata: Metadata = {
  title: `Profile`,
  description: `Preview the signed-in Forge identity, provider, and access role.`,
};

export default function ProfilePage() {
  return (
    <AuthenticatedRoute>
      <div className="productPage productPageProfile">
        <ProductPageHero
          icon="profile"
          eyebrow="Profile / Account"
          title="One identity."
          accent="Clear access."
          description="A simple front-end profile surface prepared for Firebase Authentication, Firestore user records, and role-aware product experiences."
          metrics={[
            { value: `Local`, label: `Current session` },
            { value: `Role`, label: `Rendering ready` },
            { value: `Next`, label: `Firebase identity` },
          ]}
        />
        <AccountPagePanel page="profile" />
      </div>
    </AuthenticatedRoute>
  );
}
