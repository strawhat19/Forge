export const siteConfig = {
  title: 'Forge',
  contactEmail: 'hello@forge.studio',
  titleAlt: `Forge // Official Home Page`,
  logo: 'icons-logos-graphics/logos/Forge_Vector.svg',
  logoAlt: 'icons-logos-graphics/logos/forge-circle-black.png',
  description: 'A digital foundry for bold products, systems, and experiences.',
  navigation: [
    { label: 'Expertise', href: '#expertise' },
    { label: 'Process', href: '#process' },
    { label: 'Studio', href: '#studio' },
  ],
  capabilities: [
    {
      index: '01',
      title: 'Product strategy',
      description: 'Shape the right problem, define the edge, and turn ambitious ideas into a buildable path.',
      tags: ['Direction', 'Research', 'Roadmaps'],
    },
    {
      index: '02',
      title: 'Digital products',
      description: 'Design expressive, useful interfaces and engineer them into fast, resilient applications.',
      tags: ['UX / UI', 'Web apps', 'Platforms'],
    },
    {
      index: '03',
      title: 'Intelligent systems',
      description: 'Connect data, automation, and AI into workflows that sharpen how teams operate.',
      tags: ['AI systems', 'Automation', 'Tooling'],
    },
  ],
  process: [
    { phase: 'Heat', detail: 'Find the signal. Strip the idea to what matters.' },
    { phase: 'Shape', detail: 'Prototype the experience and pressure-test the system.' },
    { phase: 'Strike', detail: 'Build with precision, ship with confidence, keep refining.' },
  ],
} as const;
