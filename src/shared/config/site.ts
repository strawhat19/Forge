import { forgeNotifications } from './notifications';

export type SiteNavigationChild = {
  label: string;
  href: string;
  icon: string;
  description: string;
  badge?: string;
  external?: boolean;
};

export type SiteNavigationItem = {
  id: string;
  label: string;
  href: string;
  icon: string;
  description: string;
  children?: readonly SiteNavigationChild[];
};

export const siteConfig = {
  title: `Forge`,
  titleLine1: `Build anything.`,
  titleLine2: `Deploy anywhere.`,
  contactEmail: `hello@forge.studio`,
  titleAlt: `Forge // Official Website`,
  logo: `icons-logos-graphics/logos/Forge_Vector.svg`,
  logoAlt: `icons-logos-graphics/logos/forge-circle-black.png`,
  description: `Deployment intelligence and lifecycle control for AWS CloudFormation infrastructure and pipeline stacks.`,
  navigation: [
    {
      id: `product`,
      icon: `overview`,
      href: `/overview`,
      label: `Overview`,
      description: `Understand every CloudFormation change before it becomes a release.`,
      children: [
        { label: `Product`, href: `/product`, icon: `product`, description: `Meet the deployment intelligence layer between definitions and execution.` },
        { label: `Features`, href: `/features`, icon: `diff`, description: `Explore nested diffs, parameter impact, lifecycle records, and preview tooling.` },
        { label: `Workflows`, href: `/workflows`, icon: `workflow`, description: `Follow the same controlled grammar across infrastructure and pipelines.` },
        { label: `Notifications`, href: `/notifications`, icon: `bell`, description: `Follow Forge source, documentation, capability, API, and plan updates in one product feed.`, badge: String(forgeNotifications.length) },
      ],
    },
    {
      href: `/docs`,
      id: `developers`,
      icon: `terminal`,
      label: `Developers`,
      description: `Install the Python CLI, learn the command surface, and inspect the source.`,
      children: [
        { label: `Documentation`, href: `/docs`, icon: `docs`, description: `Install Forge, configure environments, and run the first staged deployment.` },
        { label: `Download`, href: `/download`, icon: `download`, description: `Get the current source version and its declared Python requirements.`, badge: `v0.1.0` },
        { label: `Server`, href: `https://github.com/MJ66GA-Projects/cfn-forge`, icon: `github`, description: `Read the cfn-forge orchestration engine on GitHub.`, external: true },
        { label: `API`, href: `/api`, icon: `api`, description: `Inspect the public product, feature, CLI, and plan manifests.`, badge: `v0.0.0.0` },
      ],
    },
    { id: `plans`, label: `Plans`, href: `/plans`, icon: `plans`, description: `Start from source today and preview the planned member tiers.` },
    // { id: `api`, label: `API`, href: `/api`, icon: `api`, description: `Inspect the public product, feature, CLI, and plan manifests.` },
  ] satisfies readonly SiteNavigationItem[],
  marqueeItems: [
    { icon: `cloudformation`, text: `CloudFormation` },
    { icon: `terminal`, text: `CLI` },
    { icon: `diff`, text: `Nested Template Diffs` },
    { icon: `terraform`, text: `Terraform` },
    { icon: `ai`, text: `AI` },
    { icon: `stage`, text: `Change Set Staging` },
    { icon: `pipeline`, text: `CI / CD Pipelines` },
    { icon: `parameter`, text: `Parameter Impact` },
    { icon: `applications`, text: `Next.js Applications` },
    { icon: `inspect`, text: `Release Inspection` },
    { icon: `iac`, text: `Infrastructure as Code` },
    { icon: `history`, text: `Lifecycle History` },
    { icon: `cloud`, text: `AWS Environments` },
    { icon: `shield`, text: `Release Guardrails` },
    { icon: `api`, text: `API` },
    { icon: `refactor`, text: `Refactor Analysis` },
    { icon: `drift`, text: `Drift Intelligence` },
    { icon: `teardown`, text: `Teardown Planning` },
  ],
  capabilities: [
    {
      index: `01`,
      title: `Change intelligence`,
      description: `Walk the deployed and desired nested-stack trees, compare template bodies, and trace one changed parameter through every affected stack.`,
      tags: [`Nested trees`, `Body diffs`, `Parameter impact`],
    },
    {
      index: `02`,
      title: `Controlled lifecycle`,
      description: `Turn a CloudFormation Change Set into an inspectable stage with identity checks, explicit release confirmation, status, and history.`,
      tags: [`Stage`, `Inspect`, `Release`],
    },
    {
      index: `03`,
      title: `One operator grammar`,
      description: `Use the same lifecycle verbs for infrastructure and pipeline stacks while keeping their AWS configuration and artifacts separate.`,
      tags: [`Infrastructure`, `Pipelines`, `History`],
    },
  ],
  process: [
    { phase: `Heat`, detail: `Resolve the environment, validate parameters, and assemble the desired CloudFormation template tree.` },
    { phase: `Shape`, detail: `Compare deployed state, create the Change Set, explain its impact, and preserve a staged artifact.` },
    { phase: `Strike`, detail: `Inspect the exact release, confirm execution, wait for CloudFormation, and record the outcome.` },
  ],
} as const;
