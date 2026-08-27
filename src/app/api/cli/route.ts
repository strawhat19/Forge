import { productConfig } from '@/shared/config/product';

export function GET() {
  return Response.json({
    product: productConfig.packageName,
    version: productConfig.version,
    syntax: `forge [-h] [-e ENV] [-p PROFILE] [-f] ACTION TARGET`,
    targets: [`infra`, `pipeline`],
    flags: {
      environment: `-e, --env`,
      profile: `-p, --profile`,
      force: `-f, --force (stage only)`,
    },
    groups: productConfig.commandGroups,
    coreActions: [`stage`, `inspect`, `status`, `list`, `history`, `release`, `discard`, `restage`, `cleanup`],
    previewActions: [`drift`, `reconcile`, `refactor (infrastructure only)`, `teardown`],
    excludedClaims: [`promote dispatch`, `pipeline refactor dispatch`, `multi-cloud providers`],
  });
}

