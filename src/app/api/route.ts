import { productConfig } from '@/shared/config/product';

export function GET() {
  return Response.json({
    product: productConfig.name,
    package: productConfig.packageName,
    version: productConfig.version,
    status: productConfig.status,
    description: productConfig.summary,
    routes: {
      health: `/api/health`,
      features: `/api/features`,
      cli: `/api/cli`,
      plans: `/api/plans`,
    },
    repositories: {
      client: `https://github.com/strawhat19/Forge`,
      server: `https://github.com/MJ66GA-Projects/cfn-forge`,
    },
  });
}

