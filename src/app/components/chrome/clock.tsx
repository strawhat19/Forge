'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ForgeIcon from '@/app/components/brand/forge-icon';

const fullFormatter = new Intl.DateTimeFormat(`en-US`, { dateStyle: `full`, timeStyle: `full` });
const longFormatter = new Intl.DateTimeFormat(`en-US`, { weekday: `short`, year: `numeric`, month: `short`, day: `2-digit`, hour: `2-digit`, minute: `2-digit`, second: `2-digit`, timeZoneName: `short` });
const compactFormatter = new Intl.DateTimeFormat(`en-US`, { month: `short`, day: `2-digit`, hour: `2-digit`, minute: `2-digit`, second: `2-digit`, timeZoneName: `short` });
const timeFormatter = new Intl.DateTimeFormat(`en-US`, { hour: `2-digit`, minute: `2-digit`, second: `2-digit`, timeZoneName: `short` });
const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const fullDate = now ? `${now.toString()} / ${localTimeZone}` : `Synchronizing local time`;

  return (
    <time className="forgeClock" dateTime={now?.toISOString()} title={fullDate} aria-label={now ? `Current local date and time: ${fullDate}` : fullDate}>
      <span className="forgeClockIdentity"><ForgeIcon name="github" /><span>
        <Link href={`https://piratechs.com`} target={`_blank`}>
          Site Design // Piratechs
        </Link>
      </span></span>
      <span className="forgeClockValue forgeClockFull">{now ? fullDate : `--`}</span>
      <span className="forgeClockValue forgeClockLong">{now ? `${fullFormatter.format(now)} / ${localTimeZone}` : `--`}</span>
      <span className="forgeClockValue forgeClockMedium">{now ? longFormatter.format(now) : `--`}</span>
      <span className="forgeClockValue forgeClockCompact">{now ? compactFormatter.format(now) : `--`}</span>
      <span className="forgeClockValue forgeClockTime">{now ? timeFormatter.format(now) : `--`}</span>
    </time>
  );
}
