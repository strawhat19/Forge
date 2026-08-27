import { productConfig } from '@/shared/config/product';

export function GET() {
  return Response.json({
    product: productConfig.name,
    currency: `USD`,
    plans: productConfig.plans,
    disclosure: `Starter source access is available now. Paid plans, checkout, member downloads, and access control are planned product experiences.`,
  });
}

