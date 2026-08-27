export type ForgeNotification = {
  id: string;
  icon: string;
  type: string;
  title: string;
  detail: string;
  dateTime: string;
  dateLabel: string;
  href: string;
};

export const forgeNotifications = [
  {
    id: `notification-source-010`,
    icon: `release`,
    type: `Source`,
    title: `cfn-forge 0.1.0 is the current source version`,
    detail: `Clone the server repository and install its requirements before the editable Python package.`,
    dateTime: `2026-08-27T09:00:00-04:00`,
    dateLabel: `Aug 27, 2026`,
    href: `/download`,
  },
  {
    id: `notification-docs`,
    icon: `docs`,
    type: `Docs`,
    title: `The controlled release guide is available`,
    detail: `Follow installation, project topology, stage, inspect, and release as one operator path.`,
    dateTime: `2026-08-27T08:15:00-04:00`,
    dateLabel: `Aug 27, 2026`,
    href: `/docs`,
  },
  {
    id: `notification-preview`,
    icon: `shield`,
    type: `Preview`,
    title: `Advanced capabilities keep explicit preview labels`,
    detail: `Drift, reconcile, refactor analysis, and teardown remain visible without overstating readiness.`,
    dateTime: `2026-08-26T16:40:00-04:00`,
    dateLabel: `Aug 26, 2026`,
    href: `/features`,
  },
  {
    id: `notification-api`,
    icon: `api`,
    type: `API`,
    title: `Read-only product manifests are online`,
    detail: `Inspect feature, CLI, plan, and health manifests directly from the Forge client.`,
    dateTime: `2026-08-26T13:20:00-04:00`,
    dateLabel: `Aug 26, 2026`,
    href: `/api`,
  },
  {
    id: `notification-plans`,
    icon: `plans`,
    type: `Plans`,
    title: `Starter is available from public source`,
    detail: `Paid Operator, Team, and Enterprise paths remain clearly marked as planned experiences.`,
    dateTime: `2026-08-25T11:00:00-04:00`,
    dateLabel: `Aug 25, 2026`,
    href: `/plans`,
  },
] as const satisfies readonly ForgeNotification[];
