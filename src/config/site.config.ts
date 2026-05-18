import type { ThemeName, SwatchName } from '../themes/tokens'

export interface ShowcaseSite {
  id: 'mesa' | 'hearth' | 'vault' | 'keystone'
  name: string
  archetype: 'Dine' | 'Stay' | 'Shop' | 'Utility'
  blurb: string
  image: string
  themes: ThemeName[]
  swatches: SwatchName[]
  liveUrl?: string
}

export interface ProjectSiteConfig {
  brand: string
  tagline: string
  mission: string
  theme: ThemeName
  swatch: SwatchName
  contact: { email: string; phone: string; address: string }
  hero: { eyebrow: string; title: string; subtitle: string; image: string }
  pillars: Array<{ title: string; body: string }>
  showcase: ShowcaseSite[]
  faq: Array<{ q: string; a: string }>
  social: Array<{ label: string; href: string }>
}

export const siteConfig: ProjectSiteConfig = {
  brand: 'Apotome Archetypes',
  tagline: 'A website for every Trinidad business',
  mission:
    'Get 90% of Trinidad businesses online with a professional, fast, beautiful website at a price that makes sense.',
  theme: 'studio',
  swatch: 'midnight',
  contact: {
    email: 'hello@apotomelabs.com',
    phone: '(719) 555-0100',
    address: 'Trinidad, Colorado',
  },
  hero: {
    eyebrow: 'The Trinidad campaign',
    title: 'A website for every business in town.',
    subtitle:
      'Three robust templates — Mesa for restaurants, Hearth for hotels, Vault for shops — each with three design themes and eight color swatches. $200 to launch.',
    image: '/showcase/hero.jpg',
  },
  pillars: [
    {
      title: 'Three archetypes',
      body: 'Mesa (Dine), Hearth (Stay), Vault (Shop). Each archetype is purpose-built for the way that kind of business works — menus, rooms, products.',
    },
    {
      title: 'Three design themes',
      body: 'The Studio (modern minimal), The Heritage (classic editorial), The Vibrant (bold and local). Switch instantly to match your brand.',
    },
    {
      title: 'Eight color swatches',
      body: 'Pick from a curated palette — sand, forest, sunset, midnight, rose, stone, sage, fiesta — or let us tailor one to your brand.',
    },
    {
      title: 'Two sizes',
      body: 'Essentials with 8 photos for $200, or Portfolio with 16 photos and a dedicated gallery for $250. Upgrade later, anytime.',
    },
  ],
  showcase: [
    {
      id: 'mesa',
      name: 'Mesa',
      archetype: 'Dine',
      blurb: 'For restaurants, cafés, and bars. Menu, hours, story, gallery, reservations.',
      image: '/showcase/mesa.jpg',
      themes: ['studio', 'heritage', 'vibrant'],
      swatches: ['sand', 'sunset', 'forest'],
      liveUrl: 'https://archetype-mesa-ui.vercel.app',
    },
    {
      id: 'hearth',
      name: 'Hearth',
      archetype: 'Stay',
      blurb: 'For inns, B&Bs, and small hotels. Rooms, amenities, gallery, booking.',
      image: '/showcase/hearth.jpg',
      themes: ['studio', 'heritage', 'vibrant'],
      swatches: ['forest', 'sage', 'stone'],
      liveUrl: 'https://archetype-hearth-ui.vercel.app',
    },
    {
      id: 'vault',
      name: 'Vault',
      archetype: 'Shop',
      blurb: 'For retail, boutiques, and galleries. Categories, featured products, lookbook.',
      image: '/showcase/vault.jpg',
      themes: ['studio', 'heritage', 'vibrant'],
      swatches: ['fiesta', 'rose', 'midnight'],
      liveUrl: 'https://archetype-vault-ui.vercel.app',
    },
    {
      id: 'keystone',
      name: 'Keystone',
      archetype: 'Utility',
      blurb: 'For auto shops, contractors, welders, and mills. Services, capabilities, dispatch line, work gallery.',
      image: '/showcase/vault.jpg',
      themes: ['ironwood', 'studio', 'heritage', 'vibrant'],
      swatches: ['stone', 'midnight', 'forest'],
      liveUrl: 'https://archetype-keystone-ui.vercel.app',
    },
  ],
  faq: [
    { q: 'Who owns the site?', a: 'You do. The code is yours, the domain is yours, the photos are yours.' },
    { q: 'Where is it hosted?', a: 'On a fast modern host (Vercel or Netlify). We will set up free hosting for you.' },
    { q: 'Can I change the design later?', a: 'Yes. Switching themes or swatches is one config edit — and we offer a $100 tune-up any time.' },
    { q: 'Do I need photos?', a: 'You can use yours, or book a $100 photo campaign with us and we will deliver everything ready to drop in.' },
  ],
  social: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'GitHub', href: 'https://github.com' },
  ],
}
