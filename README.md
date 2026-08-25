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
- `src/app/components` groups brand, chrome, landing, and loader components
- `src/shared/config/site.ts` centralizes editable navigation and page content
- `src/styles` contains the global theme, loader, landing, and responsive SCSS partials
- `public` contains the supplied Forge brand mark
