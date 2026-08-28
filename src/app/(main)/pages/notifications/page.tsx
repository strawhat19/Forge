import Link from 'next/link';
import type { Metadata } from 'next';
import ForgeIcon from '@/app/components/brand/forge-icon';
import TextReveal from '@/app/components/effects/text-reveal';
import SplitHeading from '@/app/components/effects/split-heading';
import { forgeNotifications } from '@/shared/config/notifications';
import ElementReveal from '@/app/components/effects/element-reveal';
import ProductPageHero from '@/app/components/product/product-page-hero';

export const metadata: Metadata = {
  title: `Notifications`,
  description: `Follow Forge source, documentation, capability, API, and plan updates in one product feed.`,
};

export default function NotificationsPage() {
  return (
    <div className="productPage productPageNotifications">
      <ProductPageHero
        icon="bell"
        eyebrow="Notifications / 07"
        title="Updates &"
        accent="Critical Alerts."
        description="Track the product surface around cfn-forge: source availability, documentation, preview boundaries, API manifests, and planned member paths."
        metrics={[
          { value: String(forgeNotifications.length), label: `Current updates` },
          { value: `5`, label: `Signal types` },
          { value: `Clear`, label: `Readiness labels` },
        ]}
        actions={(
          <Link className="productButton productButtonPrimary" href="/download">Get the current source<span aria-hidden="true">→</span></Link>
        )}
      />

      <section className="productSection notificationPageSection">
        <div className="productSectionHeading">
          <TextReveal as="span" className="eyebrow" text="Product feed" />
          <SplitHeading text="What changed.<br /><em>Why it matters.</em>" />
          <TextReveal as="p" text="A concise record of meaningful Forge client and cfn-forge product-surface updates, ordered newest first." delay={0.05} />
        </div>

        <div className="notificationTimeline">
          {forgeNotifications.map((notification, index) => (
            <ElementReveal as="article" className="notificationTimelineItem" delay={(index % 3) * 0.045} key={notification.id}>
              <div className="notificationTimelineMeta"><span>{notification.type}</span><time dateTime={notification.dateTime}>{notification.dateLabel}</time></div>
              <span className="notificationTimelineIcon"><ForgeIcon name={notification.icon} /></span>
              <h3>{notification.title}</h3>
              <p>{notification.detail}</p>
              <Link href={notification.href}>Open update<span aria-hidden="true">→</span></Link>
            </ElementReveal>
          ))}
        </div>
      </section>

      <section className="productSection notificationDigest">
        <div><TextReveal as="span" className="eyebrow" text="Notification policy" /><SplitHeading text="Signal without<br /><em>the noise.</em>" /></div>
        <ElementReveal className="notificationDigestCopy"><ForgeIcon name="shield" /><p>Forge notifications describe what exists now and label planned or preview experiences before asking an operator to act.</p></ElementReveal>
      </section>
    </div>
  );
}
