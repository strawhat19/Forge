# Forge

Forge is a black-and-red Next.js site built around a motion-led initial loader and a modular landing-page shell.

## Stack

- Next.js App Router
- React and TypeScript
- Sass / SCSS partials
- GSAP loader motion

## Local development

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Structure

- `src/app/(main)` owns the public root layout and home route
- `src/app/(main)/pages` holds clean top-level pages that share the public layout
- `src/app/components` groups brand, chrome, landing, and loader components
- `src/shared/config/site.ts` centralizes editable navigation and page content
- `src/styles` contains the global theme, loader, landing, and responsive SCSS partials
- `public` contains the supplied Forge brand mark

Forge also ships with the same production PWA flow as Piratechs. The canonical
access routes are `/sign-in` and `/sign-up`; `/signin`, `/signup`, `/login`, and
`/register` redirect to them. Add a new page folder below `src/app/(main)/pages`
and register its clean path in `next.config.ts` to keep the shared layout.
