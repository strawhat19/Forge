import { productConfig } from '@/shared/config/product';

export function GET() {
  return Response.json({
    product: productConfig.name,
    version: productConfig.version,
    core: productConfig.coreCapabilities,
    preview: productConfig.previewCapabilities,
    disclaimer: `Preview capabilities are present in the source but are not marketed as broadly production-ready.`,
  });
}

