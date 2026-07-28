import type { ThemeName, SwatchName } from '@apotome/archetype-shared/themes/tokens'

export interface ShowcaseSite {
  id: 'mesa' | 'hearth' | 'vault' | 'keystone' | 'marquee'
  name: string
  archetype: 'Dine' | 'Stay' | 'Shop' | 'Utility' | 'Venue'
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

import { reactive } from 'vue'

export const siteConfig: ProjectSiteConfig = reactive(({
  brand: 'Apotome Archetypes',
  tagline: 'A website for every Trinidad business',
  mission:
    'Get 90% of Trinidad businesses online with a professional, fast, beautiful website at a price that makes sense.',
  theme: 'atlas',
  swatch: 'onyx-dark',
  contact: {
    email: 'hello@apotomelabs.com',
    phone: '(719) 555-0100',
    address: 'Trinidad, Colorado',
  },
  hero: {
    eyebrow: 'The Trinidad campaign',
    title: 'A website for every business in town.',
    subtitle:
      'Professionally designed, genuinely fast, and yours to keep — with the map, search, and photos that actually bring customers in. From $200 to launch.',
    image: '/showcase/hero.jpg',
  },
  pillars: [
    {
      title: 'Five archetypes',
      body: 'Mesa (Dine), Hearth (Stay), Vault (Shop), Keystone (Utility), and Marquee (Venue). Each archetype is purpose-built for the way that kind of business works — menus, rooms, products, dispatch, or an events calendar.',
    },
    {
      title: 'Five design themes',
      body: 'The Atlas (editorial index), The Studio (precision modern), The Heritage (editorial serif), The Vibrant (bold and local), and The Ironwood (industrial utility). Switch instantly to match your brand.',
    },
    {
      title: 'A color system, not a color list',
      body: 'Eighteen palette families organized by feeling: Terra, Coast, Solar, Bold, Noir, and Neon. Every family comes in a light and a dark version, and you can build and save your own in the Color Studio.',
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
      themes: ['atlas', 'heritage', 'vibrant'],
      swatches: ['adobe-light', 'vermilion-light', 'pine-light'],
      liveUrl: 'https://archetype-mesa-ui.vercel.app',
    },
    {
      id: 'hearth',
      name: 'Hearth',
      archetype: 'Stay',
      blurb: 'For inns, B&Bs, and small hotels. Rooms, amenities, gallery, booking.',
      image: '/showcase/hearth.jpg',
      themes: ['heritage', 'atlas', 'studio'],
      swatches: ['pine-light', 'matcha-light', 'ultramarine-light'],
      liveUrl: 'https://archetype-hearth-ui.vercel.app',
    },
    {
      id: 'vault',
      name: 'Vault',
      archetype: 'Shop',
      blurb: 'For retail, boutiques, and galleries. Categories, featured products, lookbook.',
      image: '/showcase/vault.jpg',
      themes: ['vibrant', 'atlas', 'studio'],
      swatches: ['riot-light', 'rosewood-light', 'midnight-dark'],
      liveUrl: 'https://archetype-vault-ui.vercel.app',
    },
    {
      id: 'marquee',
      name: 'Marquee',
      archetype: 'Venue',
      blurb: 'For venues, galleries, theaters, and festivals. Events calendar, ticketing, performers, and recurring series.',
      image: '/showcase/marquee.jpg',
      themes: ['atlas', 'heritage', 'vibrant'],
      swatches: ['signal-dark', 'midnight-dark', 'vermilion-dark'],
      liveUrl: 'https://apotome-archetypes-archetype-marque-orpin.vercel.app',
    },
    // Keystone is last: it's the one non-tourism trade archetype (auto/welding/build).
    {
      id: 'keystone',
      name: 'Keystone',
      archetype: 'Utility',
      blurb: 'For auto shops, contractors, welders, and mills. Services, capabilities, dispatch line, work gallery.',
      image: '/showcase/keystone.jpg',
      themes: ['ironwood', 'atlas', 'studio'],
      swatches: ['ultramarine-light', 'onyx-dark', 'pine-light'],
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
}))
