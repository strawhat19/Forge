export type BillingCycle = `monthly` | `annual`;

export type PricingPlan = {
  name: string;
  eyebrow: string;
  description: string;
  availability: string;
  price: Record<BillingCycle, string>;
  suffix: string;
  cta: string;
  href: string;
  featured?: boolean;
  features: readonly string[];
};

export const githubLinks = {
  client: `https://github.com/strawhat19/Forge`,
  server: `https://github.com/MJ66GA-Projects/cfn-forge`,
} as const;

export const productConfig = {
  name: `Forge`,
  packageName: `cfn-forge`,
  version: `0.1.0`,
  runtime: `Python 3.12+`,
  status: `Developer Preview`,
  summary: `Deployment intelligence and lifecycle control for existing AWS CloudFormation estates.`,
  coreCapabilities: [
    {
      index: `01`,
      icon: `stage`,
      title: `Stage without executing`,
      description: `Validate parameters, resolve the environment, upload the desired template tree, and create a CloudFormation Change Set without touching production.`,
      detail: `A local stage artifact preserves the exact stack, environment, region, Change Set, resource summary, template diffs, and lifecycle state.`,
      status: `Core`,
    },
    {
      index: `02`,
      icon: `diff`,
      title: `See the whole deployment tree`,
      description: `Compare deployed and desired nested templates by presence, SHA-256, and normalized body—not just the root stack summary.`,
      detail: `Forge surfaces added, removed, and modified templates alongside unified body diffs for the files that actually changed.`,
      status: `Core`,
    },
    {
      index: `03`,
      icon: `parameter`,
      title: `Explain why resources move`,
      description: `Trace parameter changes through nested-stack updates and connect one changed input to the resources and stacks it affects.`,
      detail: `Inspect the old value, new value, dependent outputs, nested stack impact, and CloudFormation action in one release artifact.`,
      status: `Core`,
    },
    {
      index: `04`,
      icon: `release`,
      title: `Release with an explicit gate`,
      description: `Revalidate the staged Change Set, require operator confirmation, execute, wait for completion, and capture outputs and failure events.`,
      detail: `Identity checks guard stack, environment, and region before Forge moves a stage from STAGED to RELEASING and RELEASED or FAILED.`,
      status: `Core`,
    },
    {
      index: `05`,
      icon: `history`,
      title: `Keep a lifecycle, not a loose command`,
      description: `List, inspect, discard, restage, clean up, and review the history of deployment artifacts stored under the project-owned .forge workspace.`,
      detail: `Stages become identifiable records with timestamps and state transitions instead of transient terminal output.`,
      status: `Core`,
    },
    {
      index: `06`,
      icon: `pipeline`,
      title: `Operate infrastructure and pipelines alike`,
      description: `Use the same stage, inspect, status, release, discard, restage, history, and cleanup grammar for infrastructure and pipeline stacks.`,
      detail: `Separate configuration and orchestrators preserve target-specific AWS identity while keeping the operator workflow consistent.`,
      status: `Core`,
    },
  ],
  previewCapabilities: [
    {
      icon: `drift`,
      title: `Nested drift intelligence`,
      description: `Walk nested stacks and separate expected runtime variance from actionable CloudFormation drift.`,
      label: `Preview`,
    },
    {
      icon: `reconcile`,
      title: `Policy-aware reconcile`,
      description: `Classify changes as safe, review, destructive, or undetermined and execute only a narrowly supported safe strategy.`,
      label: `Preview`,
    },
    {
      icon: `refactor`,
      title: `Template refactor analysis`,
      description: `Score template trees for hardcoded accounts, regions, environments, repeated configuration, stale parameters, and duplicate conditions.`,
      label: `Preview`,
    },
    {
      icon: `teardown`,
      title: `Guarded teardown planning`,
      description: `Inventory resources and nested stacks, expose termination protection, require an exact-name confirmation, and report deletion failures.`,
      label: `Preview`,
    },
  ],
  lifecycle: [
    {
      index: `01`,
      icon: `stage`,
      command: `forge stage infra -e dev1-us`,
      title: `Stage`,
      description: `Resolve topology, validate parameters, compare template trees, build a Change Set, and save the artifact.`,
    },
    {
      index: `02`,
      icon: `inspect`,
      command: `forge inspect infra -e dev1-us`,
      title: `Inspect`,
      description: `Review resource actions, template bodies, dependencies, parameter impact, counts, and release readiness.`,
    },
    {
      index: `03`,
      icon: `release`,
      command: `forge release infra -e dev1-us`,
      title: `Release`,
      description: `Confirm the exact staged deployment, execute it, wait for CloudFormation, and record the result.`,
    },
    {
      index: `04`,
      icon: `history`,
      command: `forge history infra`,
      title: `Remember`,
      description: `Keep the stage lifecycle available for status, history, restage, discard, and cleanup operations.`,
    },
  ],
  commandGroups: [
    {
      label: `Lifecycle`,
      commands: [`stage`, `inspect`, `status`, `release`, `discard`, `restage`],
    },
    {
      label: `Records`,
      commands: [`list`, `history`, `cleanup`],
    },
    {
      label: `Advanced preview`,
      commands: [`drift`, `reconcile`, `refactor (infra)`, `teardown`],
    },
    {
      label: `Targets`,
      commands: [`infra`, `pipeline`],
    },
  ],
  plans: [
    {
      name: `Starter`,
      eyebrow: `Public source`,
      description: `Evaluate Forge from source and learn the controlled CloudFormation lifecycle.`,
      availability: `Available now`,
      price: { monthly: `$0`, annual: `$0` },
      suffix: `forever`,
      cta: `Download Starter`,
      href: githubLinks.server,
      features: [
        `Source access to cfn-forge v0.1.0`,
        `Infrastructure and pipeline lifecycle`,
        `Nested template and parameter intelligence`,
        `Source repository updates`,
      ],
    },
    {
      name: `Operator`,
      eyebrow: `Individual`,
      description: `A planned member channel for operators using Forge in active AWS environments.`,
      availability: `Planned`,
      price: { monthly: `$29`, annual: `$290` },
      suffix: `per member`,
      cta: `Request access`,
      href: `mailto:hello@forge.studio?subject=Forge%20Operator%20Access`,
      featured: true,
      features: [
        `Everything in Starter`,
        `Member build and update channel`,
        `Operator-focused release notes`,
        `Email support`,
      ],
    },
    {
      name: `Team`,
      eyebrow: `Shared operations`,
      description: `A planned subscription for teams standardizing deployment review and release workflows.`,
      availability: `Planned`,
      price: { monthly: `$79`, annual: `$790` },
      suffix: `per workspace`,
      cta: `Talk to Forge`,
      href: `mailto:hello@forge.studio?subject=Forge%20Team%20Plan`,
      features: [
        `Everything in Operator`,
        `Shared workspace roadmap`,
        `Team onboarding guidance`,
        `Priority support channel`,
      ],
    },
    {
      name: `Enterprise`,
      eyebrow: `Custom`,
      description: `A future commercial path for governed rollout, support, and environment-specific enablement.`,
      availability: `Planned`,
      price: { monthly: `Custom`, annual: `Custom` },
      suffix: `annual agreement`,
      cta: `Start a conversation`,
      href: `mailto:hello@forge.studio?subject=Forge%20Enterprise`,
      features: [
        `Everything in Team`,
        `Architecture and rollout review`,
        `Environment topology guidance`,
        `Commercial support planning`,
      ],
    },
  ] satisfies readonly PricingPlan[],
} as const;
