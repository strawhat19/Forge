import type { Metadata } from 'next';
import ForgeDashboard from '@/app/components/account/forge-dashboard';
import AuthenticatedRoute from '@/app/components/auth/authenticated-route';

export const metadata: Metadata = {
  title: `Dashboard`,
  description: `Preview the role-aware Forge account dashboard.`,
};

export default function DashboardPage() {
  return (
    <AuthenticatedRoute>
      <ForgeDashboard />
    </AuthenticatedRoute>
  );
}
