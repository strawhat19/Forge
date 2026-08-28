'use client';

import { useState, type FormEvent } from 'react';
import { siteConfig } from '@/shared/config/site';
import { useGlobalContext } from '@/shared/global-context';
import ForgeAuthForm from '@/app/components/auth/forge-auth-form';

type WidgetTab = 'contact' | 'sign-in' | 'sign-up';

const widgetTabs: ReadonlyArray<{ id: WidgetTab; label: string; index: string }> = [
  { id: 'contact', label: 'Contact', index: '01' },
  { id: 'sign-in', label: 'Sign In', index: '02' },
  { id: 'sign-up', label: 'Sign Up', index: '03' },
];

export default function ContactWidget() {
  const { user } = useGlobalContext();
  
  const [activeTab, setActiveTab] = useState<WidgetTab>('contact');
  const activeTabIndex = widgetTabs.find((tab) => tab.id === activeTab)?.index ?? '01';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const message = String(formData.get('message') ?? '').trim();
    const subject = encodeURIComponent(`Forge inquiry from ${name}`);
    const body = encodeURIComponent([
      `Name: ${name}`,
      `Email: ${email}`,
      '',
      message,
    ].join('\n'));

    window.location.href = `mailto:${siteConfig.contactEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <aside className="contactWidget" aria-label="Contact and account access">
      <div className="contactWidgetHeader">
        <span>Direct channel</span>
        <span aria-hidden="true">{activeTabIndex} / 03</span>
      </div>

      <div className="contactWidgetSegments" role="tablist" aria-label="Contact options">
        {(user ? [widgetTabs[0]] : widgetTabs).map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              id={`contact-widget-tab-${tab.id}`}
              className={`contactWidgetSegmentButton_${tab?.id} contactWidgetSegment${active ? ' contactWidgetSegmentActive' : ''}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls="contact-widget-panel"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        id="contact-widget-panel"
        className="contactWidgetPanel"
        role="tabpanel"
        aria-labelledby={`contact-widget-tab-${activeTab}`}
      >
        {(activeTab === 'contact' || user != null) ? (
          <form className="contactWidgetForm" onSubmit={handleSubmit}>
            <div className="contactWidgetFieldRow">
              <label className="contactWidgetField">
                <span>Name</span>
                <input name="name" type="text" autoComplete="name" placeholder={user ? user?.name : `Your name`} disabled={user != null} required />
              </label>
              <label className="contactWidgetField">
                <span>Email</span>
                <input name="email" type="email" autoComplete="email" placeholder={user ? user?.email : `you@example.com`} disabled={user != null} required />
              </label>
            </div>

            <label className="contactWidgetField">
              <span>What are we making?</span>
              <textarea name="message" placeholder="A few details about the challenge, timing, or idea." maxLength={1200} required />
            </label>

            <div className="contactWidgetActionRow">
              <span>Opens your email app</span>
              <button type="submit">
                Send inquiry
                <span aria-hidden="true">↗</span>
              </button>
            </div>
          </form>
        ) : (
          <ForgeAuthForm key={activeTab} mode={activeTab} variant="compact" />
        )}
      </div>
    </aside>
  );
}
