'use client';

import Link from 'next/link';
import { type CSSProperties, useState } from 'react';
import ForgeIcon from '@/app/components/brand/forge-icon';
import Counter from '@/app/components/effects/counter';
import TextReveal from '@/app/components/effects/text-reveal';
import ElementReveal from '@/app/components/effects/element-reveal';
import { useGlobalContext } from '@/shared/global-context';

type ChartPoint = { x: number; y: number };

const environments = [
  { id: `production`, label: `Production`, region: `us-east-1`, account: `4821`, stacks: 48, nested: 126, drift: 0, staged: 1, health: 99 },
  { id: `staging`, label: `Staging`, region: `us-east-2`, account: `7194`, stacks: 31, nested: 84, drift: 2, staged: 3, health: 94 },
  { id: `development`, label: `Development`, region: `us-west-2`, account: `2057`, stacks: 18, nested: 43, drift: 5, staged: 2, health: 87 },
] as const;

const stagedChanges = [
  { id: `CS-1048`, stack: `forge-api-production`, environment: `Production`, resources: `12`, impact: `Moderate`, status: `Ready to inspect`, age: `8m` },
  { id: `CS-1047`, stack: `release-pipeline-staging`, environment: `Staging`, resources: `5`, impact: `Low`, status: `Awaiting approval`, age: `24m` },
  { id: `CS-1046`, stack: `observability-development`, environment: `Development`, resources: `21`, impact: `Elevated`, status: `Review required`, age: `1h` },
] as const;

const releaseActivity = [
  { action: `Released`, target: `network-core-production`, detail: `4 resources updated · no replacement`, time: `12:42` },
  { action: `Inspected`, target: `forge-api-production`, detail: `Nested parameter impact confirmed`, time: `12:18` },
  { action: `Staged`, target: `release-pipeline-staging`, detail: `Change Set CS-1047 created`, time: `11:56` },
  { action: `Reconciled`, target: `identity-development`, detail: `Template tree matches deployed state`, time: `10:31` },
] as const;

const pipelineRuns = [
  { name: `Forge release`, branch: `main`, stage: `Inspect`, progress: 72, status: `Running` },
  { name: `Infrastructure`, branch: `release/0.2`, stage: `Awaiting approval`, progress: 54, status: `Held` },
  { name: `Documentation`, branch: `main`, stage: `Complete`, progress: 100, status: `Passed` },
] as const;

const chartRanges = {
  '24h': {
    label: `24 hours`,
    axis: [`00`, `04`, `08`, `12`, `16`, `20`, `Now`],
    staged: [2, 4, 3, 7, 6, 9, 8],
    released: [1, 2, 2, 4, 4, 6, 7],
  },
  '7d': {
    label: `7 days`,
    axis: [`Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`, `Sun`],
    staged: [7, 9, 6, 12, 10, 16, 13],
    released: [5, 7, 6, 9, 8, 12, 11],
  },
  '30d': {
    label: `30 days`,
    axis: [`W1`, `W2`, `W3`, `W4`, `W5`],
    staged: [24, 31, 27, 39, 46],
    released: [19, 25, 24, 33, 41],
  },
} as const;

const environmentChartData = {
  production: {
    scale: 1,
    resourceImpact: [
      { label: `Modify`, value: 24, tone: `modify` },
      { label: `Add`, value: 9, tone: `add` },
      { label: `Replace`, value: 3, tone: `replace` },
    ],
    drift: {
      '24h': [0, 0, 1, 0, 0, 0, 0],
      '7d': [1, 1, 0, 0, 0, 0, 0],
      '30d': [2, 1, 1, 0, 0],
    },
  },
  staging: {
    scale: 0.76,
    resourceImpact: [
      { label: `Modify`, value: 16, tone: `modify` },
      { label: `Add`, value: 12, tone: `add` },
      { label: `Replace`, value: 5, tone: `replace` },
    ],
    drift: {
      '24h': [2, 3, 3, 2, 2, 1, 2],
      '7d': [4, 3, 3, 2, 3, 2, 2],
      '30d': [6, 5, 4, 3, 2],
    },
  },
  development: {
    scale: 0.58,
    resourceImpact: [
      { label: `Modify`, value: 12, tone: `modify` },
      { label: `Add`, value: 17, tone: `add` },
      { label: `Replace`, value: 8, tone: `replace` },
    ],
    drift: {
      '24h': [4, 6, 5, 7, 6, 5, 5],
      '7d': [8, 7, 7, 6, 6, 5, 5],
      '30d': [11, 9, 8, 6, 5],
    },
  },
} as const;

type ChartRange = keyof typeof chartRanges;

const getChartPoints = (values: readonly number[], maxValue: number): ChartPoint[] => values.map((value, index) => ({
  x: values.length === 1 ? 0 : (index / (values.length - 1)) * 100,
  y: 40 - (value / maxValue) * 34,
}));

const getSmoothPath = (points: ChartPoint[]) => {
  if (!points.length) return ``;

  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index];
    const midpoint = (previous.x + point.x) / 2;
    return `${path} C ${midpoint} ${previous.y}, ${midpoint} ${point.y}, ${point.x} ${point.y}`;
  }, `M ${points[0].x} ${points[0].y}`);
};

export default function ForgeDashboard() {
  const { user } = useGlobalContext();
  const [selectedEnvironment, setSelectedEnvironment] = useState<(typeof environments)[number][`id`]>(`production`);
  const [chartRange, setChartRange] = useState<ChartRange>(`7d`);
  const environment = environments.find(item => item.id === selectedEnvironment) ?? environments[0];
  const firstName = user?.name?.split(` `)[0] || `Operator`;
  const activeRange = chartRanges[chartRange];
  const activeChartData = environmentChartData[selectedEnvironment];
  const stagedValues = activeRange.staged.map(value => Math.round(value * activeChartData.scale));
  const releasedValues = activeRange.released.map(value => Math.round(value * activeChartData.scale));
  const throughputMax = Math.max(...stagedValues, ...releasedValues, 1);
  const stagedPoints = getChartPoints(stagedValues, throughputMax);
  const releasedPoints = getChartPoints(releasedValues, throughputMax);
  const stagedPath = getSmoothPath(stagedPoints);
  const releasedPath = getSmoothPath(releasedPoints);
  const impactTotal = activeChartData.resourceImpact.reduce((total, item) => total + item.value, 0);
  const impactSegments = activeChartData.resourceImpact.map((item, index, items) => ({
    ...item,
    offset: (items.slice(0, index).reduce((total, segment) => total + segment.value, 0) / impactTotal) * 100,
    percentage: (item.value / impactTotal) * 100,
  }));
  const driftValues = activeChartData.drift[chartRange];
  const driftMax = Math.max(...driftValues, 1);
  const chartKey = `${selectedEnvironment}-${chartRange}`;

  return (
    <div className="forgeDashboard">
      <section className="dashboardHero">
        <div>
          <TextReveal as="span" className="eyebrow" text="CFN Forge / Command workspace" />
          <h1 style={{ letterSpacing: `-5px` }}>
            <TextReveal as="span" text="Welcome back," variant="hero" />
            <br />
            <TextReveal as="em" text={`${firstName}.`} variant="hero" delay={0.08} />
          </h1>
          <TextReveal as="p" text="Inspect staged CloudFormation changes, trace nested-stack impact, and control releases across every connected environment." delay={0.12} />
        </div>
        <ElementReveal className="dashboardHeroActions" delay={0.18}>
          <Link className="productButton productButtonPrimary" href="/workflows">Stage a change<span aria-hidden="true">→</span></Link>
          <Link className="productButton" href="/docs">Open CLI docs<span aria-hidden="true">↗</span></Link>
        </ElementReveal>
      </section>

      <section className="dashboardWorkspace" aria-label="CFN Forge dashboard workspace">
        <ElementReveal as="aside" className="dashboardRail" ariaLabel="Dashboard sections" x={-18} y={0}>
          <div className="dashboardRailIdentity">
            <span aria-hidden="true">{firstName[0]?.toUpperCase()}</span>
            <div><strong>{user?.name}</strong><small>{user?.role} role</small></div>
          </div>
          <nav>
            <a href="#overview"><ForgeIcon name="dashboard" />Overview<span>01</span></a>
            <a href="#environments"><ForgeIcon name="cloudformation" />Environments<span>02</span></a>
            <a href="#changes"><ForgeIcon name="stage" />Change Sets<span>03</span></a>
            <a href="#pipelines"><ForgeIcon name="pipeline" />Pipelines<span>04</span></a>
            <a href="#activity"><ForgeIcon name="history" />History<span>05</span></a>
          </nav>
          <div className="dashboardRailStatus"><i aria-hidden="true" /><span>Forge client connected</span><small>Simulation / local</small></div>
        </ElementReveal>

        <div className="dashboardMain">
          <ElementReveal className="dashboardCommandBar" y={-10} duration={0.5}>
            <div><i aria-hidden="true" /><span>All systems nominal</span></div>
            <span>Last reconciliation / 2 minutes ago</span>
            <span>Account / •••• {environment.account}</span>
          </ElementReveal>

          <section id="overview" className="dashboardMetrics" aria-label="Forge environment metrics">
            <ElementReveal as="article"><span>Managed stacks</span><strong><Counter number={97} speed={1.15} interval={18} blurIntensity={3.4} /></strong><small>+4 this month</small><ForgeIcon name="cloudformation" /></ElementReveal>
            <ElementReveal as="article" delay={0.045}><span>Nested templates</span><strong><Counter number={253} speed={1.3} interval={18} blurIntensity={3.8} delay={0.045} /></strong><small>Across 3 environments</small><ForgeIcon name="reconcile" /></ElementReveal>
            <ElementReveal as="article" delay={0.09}><span>Staged changes</span><strong><Counter number={36} speed={0.9} interval={22} blurIntensity={2.8} padStart={2} delay={0.09} /></strong><small>1 production-ready</small><ForgeIcon name="stage" /></ElementReveal>
            <ElementReveal as="article" delay={0.135}><span>Drift findings</span><strong><Counter number={81} speed={0.95} interval={22} blurIntensity={2.8} padStart={2} delay={0.135} /></strong><small>0 production drift</small><ForgeIcon name="drift" /></ElementReveal>
          </section>

          <section className="dashboardPanel dashboardChartsPanel" aria-label="Forge telemetry">
            <div className="dashboardPanelHeader dashboardChartsHeader">
              <div>
                <TextReveal as="span" className="eyebrow" text="Deployment intelligence" />
                <TextReveal as="h2" text="Forge telemetry" variant="hero" />
              </div>
              <div className="dashboardChartControls">
                <span><i aria-hidden="true" />Live simulation</span>
                <div role="group" aria-label="Chart time range">
                  {(Object.keys(chartRanges) as ChartRange[]).map(range => (
                    <button
                      key={range}
                      type="button"
                      aria-pressed={chartRange === range}
                      onClick={() => setChartRange(range)}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div key={chartKey} className="dashboardChartsGrid">
              <article className="dashboardChartCard dashboardThroughputChart">
                <header>
                  <div><span>Change Set throughput</span><small>{environment.label} / {activeRange.label}</small></div>
                  <strong><Counter number={stagedValues.reduce((total, value) => total + value, 0)} speed={0.9} blurIntensity={2.6} /><small> staged</small></strong>
                </header>
                <div className="dashboardChartLegend" aria-hidden="true">
                  <span><i />Staged</span><span><i />Released</span>
                </div>
                <div className="dashboardLineChart">
                  <svg viewBox="0 0 100 44" preserveAspectRatio="none" role="img" aria-label={`Staged and released Change Sets for ${environment.label} over ${activeRange.label}`}>
                    <title>Change Set throughput for {environment.label}</title>
                    <defs>
                      <linearGradient id="dashboard-throughput-area" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--red)" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="var(--red)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[8, 16, 24, 32, 40].map(y => <line key={y} className="dashboardChartGridLine" x1="0" x2="100" y1={y} y2={y} />)}
                    <path className="dashboardChartArea" d={`${stagedPath} L 100 40 L 0 40 Z`} />
                    <path className="dashboardChartLine dashboardChartLinePrimary" pathLength="1" d={stagedPath} />
                    <path className="dashboardChartLine dashboardChartLineSecondary" pathLength="1" d={releasedPath} />
                    {stagedPoints.map((point, index) => <circle key={`staged-${activeRange.axis[index]}`} className="dashboardChartPoint" cx={point.x} cy={point.y} r="0.95" />)}
                  </svg>
                  <div className="dashboardChartAxis" aria-hidden="true">
                    {activeRange.axis.map(label => <span key={label}>{label}</span>)}
                  </div>
                </div>
              </article>

              <article className="dashboardChartCard dashboardImpactChart">
                <header>
                  <div><span>Resource impact</span><small>Next staged release</small></div>
                  <strong><Counter number={impactTotal} speed={0.85} blurIntensity={2.4} /><small> resources</small></strong>
                </header>
                <div className="dashboardDonutLayout">
                  <div className="dashboardDonutChart">
                    <svg viewBox="0 0 42 42" role="img" aria-label={`${impactTotal} impacted resources split by operation`}>
                      <title>Resource impact mix for {environment.label}</title>
                      <circle className="dashboardDonutTrack" cx="21" cy="21" r="15.9155" pathLength="100" />
                      {impactSegments.map((segment, index) => (
                        <circle
                          key={segment.label}
                          className="dashboardDonutSegment"
                          data-tone={segment.tone}
                          cx="21"
                          cy="21"
                          r="15.9155"
                          pathLength="100"
                          strokeDashoffset={-segment.offset}
                          style={{
                            '--chart-segment': `${segment.percentage} ${100 - segment.percentage}`,
                            '--chart-delay': `${index * 120}ms`,
                          } as CSSProperties}
                        />
                      ))}
                    </svg>
                    <div><strong><Counter number={impactTotal} speed={0.95} blurIntensity={2.2} /></strong><span>Resources</span></div>
                  </div>
                  <ul>
                    {activeChartData.resourceImpact.map(item => (
                      <li key={item.label} data-tone={item.tone}><span><i />{item.label}</span><strong>{item.value}</strong></li>
                    ))}
                  </ul>
                </div>
              </article>

              <article className="dashboardChartCard dashboardDriftChart">
                <header>
                  <div><span>Drift findings</span><small>Open findings trend</small></div>
                  <strong><Counter number={driftValues[driftValues.length - 1]} speed={0.75} blurIntensity={2.2} /><small> open</small></strong>
                </header>
                <div className="dashboardDriftBars" role="img" aria-label={`Drift findings trend for ${environment.label} over ${activeRange.label}`}>
                  {driftValues.map((value, index) => (
                    <div key={`${activeRange.axis[index]}-${value}`}>
                      <span>{value}</span>
                      <i style={{ height: `${Math.max((value / driftMax) * 100, value === 0 ? 3 : 10)}%`, animationDelay: `${index * 70}ms` }} />
                      <small>{activeRange.axis[index]}</small>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </section>

          <section id="environments" className="dashboardPanel dashboardEnvironmentPanel">
            <div className="dashboardPanelHeader">
              <div><TextReveal as="span" className="eyebrow" text="Environment topology" /><TextReveal as="h2" text="Deployment surface" variant="hero" /></div>
              <Link href="/workflows">Manage workflows<span aria-hidden="true">→</span></Link>
            </div>

            <ElementReveal className="dashboardEnvironmentLayout" slide>
              <div className="dashboardEnvironmentList" role="group" aria-label="CloudFormation environments">
                {environments.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selectedEnvironment === item.id}
                    onClick={() => setSelectedEnvironment(item.id)}
                  >
                    <span><i aria-hidden="true" />{item.label}<small>{item.region}</small></span>
                    <strong>{item.stacks}<small> stacks</small></strong>
                  </button>
                ))}
              </div>

              <div className="dashboardEnvironmentDetail">
                <div className="dashboardEnvironmentScore">
                  <span><Counter number={environment.health} speed={1} interval={18} blurIntensity={3} suffix="%" /></span>
                  <small>Environment health</small>
                </div>
                <div className="dashboardEnvironmentStats">
                  <div><span>Root stacks</span><strong><Counter number={environment.stacks} speed={0.85} blurIntensity={2.2} /></strong></div>
                  <div><span>Nested stacks</span><strong><Counter number={environment.nested} speed={1} blurIntensity={2.6} /></strong></div>
                  <div><span>Staged</span><strong><Counter number={environment.staged} speed={0.7} blurIntensity={1.8} /></strong></div>
                  <div><span>Drifted</span><strong><Counter number={environment.drift} speed={0.7} blurIntensity={1.8} /></strong></div>
                </div>
                <div className="dashboardTopology" role="img" aria-label={`${environment.label} stack topology preview`}>
                  <span>Root</span><i /><span>Network</span><i /><span>Services</span><i /><span>Data</span>
                </div>
              </div>
            </ElementReveal>
          </section>

          <section id="changes" className="dashboardPanel dashboardChangesPanel">
            <div className="dashboardPanelHeader">
              <div><TextReveal as="span" className="eyebrow" text="Release queue" /><TextReveal as="h2" text="Staged Change Sets" variant="hero" /></div>
              <span>3 awaiting action</span>
            </div>
            <ElementReveal className="dashboardTableWrap" slide>
              <table>
                <thead><tr><th>Change Set</th><th>Stack / Environment</th><th>Resources</th><th>Impact</th><th>Status</th><th>Age</th></tr></thead>
                <tbody>
                  {stagedChanges.map(change => (
                    <tr key={change.id}>
                      <td><strong>{change.id}</strong></td>
                      <td><strong>{change.stack}</strong><small>{change.environment}</small></td>
                      <td>{change.resources}</td>
                      <td><span className={`dashboardImpact dashboardImpact${change.impact}`}>{change.impact}</span></td>
                      <td>{change.status}</td>
                      <td>{change.age}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ElementReveal>
          </section>

          <div className="dashboardSplitPanels">
            <section id="pipelines" className="dashboardPanel dashboardPipelinePanel">
              <div className="dashboardPanelHeader"><div><TextReveal as="span" className="eyebrow" text="Delivery" /><TextReveal as="h2" text="Pipeline runs" variant="hero" /></div><ForgeIcon name="pipeline" /></div>
              <div className="dashboardPipelineList">
                {pipelineRuns.map((run, index) => (
                  <ElementReveal as="article" key={run.name} delay={index * 0.05}>
                    <div><strong>{run.name}</strong><small>{run.branch} / {run.stage}</small></div>
                    <span>{run.status}</span>
                    <div className="dashboardProgress" role="progressbar" aria-label={`${run.name} progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={run.progress}><i style={{ width: `${run.progress}%` }} /></div>
                  </ElementReveal>
                ))}
              </div>
            </section>

            <section id="activity" className="dashboardPanel dashboardActivityPanel">
              <div className="dashboardPanelHeader"><div><TextReveal as="span" className="eyebrow" text="Audit trail" /><TextReveal as="h2" text="Release activity" variant="hero" /></div><ForgeIcon name="history" /></div>
              <ol>
                {releaseActivity.map((activity, index) => (
                  <ElementReveal as="li" key={`${activity.action}-${activity.target}`} delay={index * 0.045}>
                    <i aria-hidden="true" />
                    <div><strong>{activity.action}</strong><span>{activity.target}</span><small>{activity.detail}</small></div>
                    <time>{activity.time}</time>
                  </ElementReveal>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
