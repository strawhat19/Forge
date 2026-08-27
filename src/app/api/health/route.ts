import { productConfig } from '@/shared/config/product';

export function GET() {
  return Response.json({
    ok: true,
    app: productConfig.name,
    package: productConfig.packageName,
    version: productConfig.version,
    status: `Product client ready`,
  });
}
