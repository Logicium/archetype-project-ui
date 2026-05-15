<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'

// ─── Types ────────────────────────────────────────────────────────────────────
type WizardArchetype = 'mesa' | 'hearth' | 'vault'

interface Photo { src: string; alt: string; caption: string }
interface HourRow { day: string; open: string }
interface Testimonial { quote: string; author: string; source: string }
interface SocialLink { label: string; href: string }
interface Fact { label: string; value: string }
interface MenuItem { name: string; description: string; price: string; tags: string }
interface MenuCat { name: string; items: MenuItem[] }
interface Room { name: string; blurb: string; image: string; features: string; rateFrom: string; bookUrl: string }
interface Amenity { label: string; description: string; icon: string }
interface Product { name: string; price: string; image: string; blurb: string; badge: string; url: string }
interface ShopCat { name: string; image: string; url: string; count: string }

interface WizardForm {
  archetype: WizardArchetype | ''
  brand: string; tagline: string; blurb: string
  theme: string; swatch: string; variant: string
  address: string; phone: string; email: string; mapEmbedUrl: string
  hours: HourRow[]
  heroPhoto: Photo; aboutPhoto: Photo; gallery: Photo[]; storefrontPhoto: Photo
  storyTitle: string; storyParagraphs: string[]; storyFacts: Fact[]
  testimonials: Testimonial[]; social: SocialLink[]
  // Mesa
  menuIntro: string; menuCategories: MenuCat[]; menuFullMenuUrl: string
  // Hearth
  bookingUrl: string; rooms: Room[]; amenities: Amenity[]
  roomPhotos: Photo[]
  // Vault
  shopUrl: string; featured: Product[]; categories: ShopCat[]
}

// ─── Constants ────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'ap-site-wizard-v1'
const THEME_OPTS = ['studio', 'heritage', 'vibrant'] as const
const SWATCH_OPTS = ['sand', 'forest', 'sage', 'sunset', 'rose', 'stone', 'fiesta', 'citrus', 'midnight', 'obsidian', 'ember', 'plum'] as const
const VARIANT_OPTS = ['essentials', 'portfolio'] as const
const STEPS = [
  { id: 'archetype',    label: 'Archetype' },
  { id: 'brand',        label: 'Brand' },
  { id: 'design',       label: 'Design' },
  { id: 'contact',      label: 'Contact' },
  { id: 'photos',       label: 'Photos' },
  { id: 'story',        label: 'Story' },
  { id: 'content',      label: 'Content' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'social',       label: 'Social' },
  { id: 'export',       label: 'Export' },
]

// ─── State ────────────────────────────────────────────────────────────────────
const step = ref(0)
const copied = ref(false)

function blankPhoto(src = ''): Photo { return { src, alt: '', caption: '' } }
function blankMenuItem(): MenuItem { return { name: '', description: '', price: '', tags: '' } }

const form = reactive<WizardForm>({
  archetype: '',
  brand: '', tagline: '', blurb: '',
  theme: 'studio', swatch: 'sand', variant: 'essentials',
  address: '', phone: '', email: '', mapEmbedUrl: '',
  hours: [
    { day: 'Monday', open: 'Closed' },
    { day: 'Tue – Thu', open: '11:00 – 9:00' },
    { day: 'Fri – Sat', open: '11:00 – 10:00' },
    { day: 'Sunday', open: '10:00 – 8:00' },
  ],
  heroPhoto: blankPhoto('/photos/hero.jpg'),
  aboutPhoto: blankPhoto('/photos/about.jpg'),
  gallery: Array.from({ length: 8 }, (_, i) => blankPhoto(`/photos/gallery-${String(i + 1).padStart(2, '0')}.jpg`)),
  storefrontPhoto: blankPhoto('/photos/storefront.jpg'),
  storyTitle: '', storyParagraphs: ['', ''],
  storyFacts: [{ label: '', value: '' }, { label: '', value: '' }, { label: '', value: '' }],
  testimonials: [
    { quote: '', author: '', source: 'Google' },
    { quote: '', author: '', source: 'Yelp' },
    { quote: '', author: '', source: '' },
  ],
  social: [{ label: 'Instagram', href: '' }, { label: 'Facebook', href: '' }],
  // Mesa
  menuIntro: '', menuFullMenuUrl: '',
  menuCategories: [
    { name: 'Small plates', items: [blankMenuItem(), blankMenuItem(), blankMenuItem()] },
    { name: 'Mains', items: [blankMenuItem(), blankMenuItem(), blankMenuItem()] },
    { name: 'Dessert', items: [blankMenuItem()] },
  ],
  // Hearth
  bookingUrl: '',
  rooms: [
    { name: '', blurb: '', image: '/photos/room-suite.jpg', features: 'King bed, Sleeps 2', rateFrom: '', bookUrl: '' },
    { name: '', blurb: '', image: '/photos/room-king.jpg', features: 'Queen bed, Sleeps 2', rateFrom: '', bookUrl: '' },
    { name: '', blurb: '', image: '/photos/room-queen.jpg', features: 'Double bed, Sleeps 2', rateFrom: '', bookUrl: '' },
  ],
  roomPhotos: [blankPhoto('/photos/room-suite.jpg'), blankPhoto('/photos/room-king.jpg'), blankPhoto('/photos/room-queen.jpg')],
  amenities: [
    { label: 'Continental breakfast', description: '', icon: '☕' },
    { label: 'High-speed Wi-Fi', description: '', icon: '↯' },
    { label: 'Parking', description: '', icon: '◫' },
    { label: 'Pet friendly', description: '', icon: '🐾' },
  ],
  // Vault
  shopUrl: '',
  featured: [
    { name: '', price: '', image: '/photos/product-01.jpg', blurb: '', badge: '', url: '#' },
    { name: '', price: '', image: '/photos/product-02.jpg', blurb: '', badge: '', url: '#' },
    { name: '', price: '', image: '/photos/product-03.jpg', blurb: '', badge: '', url: '#' },
    { name: '', price: '', image: '/photos/product-04.jpg', blurb: '', badge: '', url: '#' },
  ],
  categories: [
    { name: '', image: '/photos/cat-1.jpg', url: '#', count: '' },
    { name: '', image: '/photos/cat-2.jpg', url: '#', count: '' },
    { name: '', image: '/photos/cat-3.jpg', url: '#', count: '' },
    { name: '', image: '/photos/cat-4.jpg', url: '#', count: '' },
  ],
})

// ─── Persistence ──────────────────────────────────────────────────────────────
onMounted(() => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return
  try {
    const saved = JSON.parse(raw)
    Object.assign(form, saved.form ?? saved)
    if (typeof saved.step === 'number') step.value = saved.step
  } catch { /* ignore corrupt data */ }
})

watch([() => ({ ...form }), step], () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ form, step: step.value }))
}, { deep: true })

// ─── Navigation ───────────────────────────────────────────────────────────────
const isMesa   = computed(() => form.archetype === 'mesa')
const isHearth = computed(() => form.archetype === 'hearth')
const isVault  = computed(() => form.archetype === 'vault')
const hasHours = computed(() => isMesa.value || isVault.value)
const progress = computed(() => Math.round((step.value / (STEPS.length - 1)) * 100))

function next() { if (step.value < STEPS.length - 1) step.value++ }
function back() { if (step.value > 0) step.value-- }
function goTo(n: number) { step.value = n }

function clearAll() {
  if (!confirm('Clear all saved progress? This cannot be undone.')) return
  localStorage.removeItem(STORAGE_KEY)
  Object.assign(form, { archetype: '', brand: '', tagline: '', blurb: '' })
  step.value = 0
}

// ─── Menu helpers ─────────────────────────────────────────────────────────────
function addMenuItem(catIdx: number) { form.menuCategories[catIdx]!.items.push(blankMenuItem()) }
function removeMenuItem(catIdx: number, itemIdx: number) { form.menuCategories[catIdx]!.items.splice(itemIdx, 1) }
function addMenuCategory() { form.menuCategories.push({ name: '', items: [blankMenuItem()] }) }

// ─── Config export ────────────────────────────────────────────────────────────
function q(s: string) { return `'${s.replace(/'/g, "\\'")}'` }
function qArr(arr: string[]) { return arr.map(s => `'${s.replace(/'/g, "\\'")}'`).join(', ') }
function indent(s: string, n: number) { return s.split('\n').map(l => ' '.repeat(n) + l).join('\n') }

const configOutput = computed((): string => {
  if (!form.archetype) return '// Choose an archetype to generate your config'

  const photoSlot = (p: Photo) =>
    `{ src: ${q(p.src)}, alt: ${q(p.alt)}${p.caption ? `, caption: ${q(p.caption)}` : ''} }`

  const gallery = form.gallery
    .filter(p => p.src)
    .map(p => `      ${photoSlot(p)},`)
    .join('\n')

  const testimonials = form.testimonials
    .filter(t => t.quote)
    .map(t => `    { quote: ${q(t.quote)}, author: ${q(t.author)}${t.source ? `, source: ${q(t.source)}` : ''} },`)
    .join('\n')

  const social = form.social
    .filter(s => s.href)
    .map(s => `    { label: ${q(s.label)}, href: ${q(s.href)} },`)
    .join('\n')

  const facts = form.storyFacts
    .filter(f => f.label && f.value)
    .map(f => `      { label: ${q(f.label)}, value: ${q(f.value)} },`)
    .join('\n')

  const contactBlock = `  contact: {
    address: ${q(form.address)},
    phone: ${q(form.phone)},
    email: ${q(form.email)},${form.mapEmbedUrl ? `\n    mapEmbedUrl: ${q(form.mapEmbedUrl)},` : ''}
  },`

  const storyBlock = `  story: {
    title: ${q(form.storyTitle)},
    paragraphs: [
${form.storyParagraphs.filter(Boolean).map(p => `      ${q(p)},`).join('\n')}
    ],${facts ? `\n    facts: [\n${facts}\n    ],` : ''}
  },`

  const testimonialsBlock = `  testimonials: [\n${testimonials}\n  ],`
  const socialBlock = `  social: [\n${social}\n  ],`

  // ── Mesa ──────────────────────────────────────────────────────────────────
  if (isMesa.value) {
    const hours = form.hours.map(h => `    { day: ${q(h.day)}, open: ${q(h.open)} },`).join('\n')
    const menu = form.menuCategories.map(cat => {
      const items = cat.items.filter(i => i.name).map(i =>
        `          { name: ${q(i.name)}, description: ${q(i.description)}, price: ${q(i.price)}${i.tags ? `, tags: [${qArr(i.tags.split(',').map(t => t.trim()).filter(Boolean))}]` : ''} },`
      ).join('\n')
      return `      {\n        name: ${q(cat.name)},\n        items: [\n${items}\n        ],\n      },`
    }).join('\n')

    return `import type { MesaSiteConfig } from './site.config'

export const siteConfig: MesaSiteConfig = {
  brand: ${q(form.brand)},
  tagline: ${q(form.tagline)},
  blurb: ${q(form.blurb)},
  theme: '${form.theme}',
  swatch: '${form.swatch}',
  variant: '${form.variant}',
${contactBlock}
  hours: [
${hours}
  ],
  photos: {
    hero: ${photoSlot(form.heroPhoto)},
    about: ${photoSlot(form.aboutPhoto)},
    gallery: [
${gallery}
    ],
  },
${storyBlock}
  menu: {${form.menuIntro ? `\n    intro: ${q(form.menuIntro)},` : ''}
    categories: [
${menu}
    ],${form.menuFullMenuUrl ? `\n    fullMenuUrl: ${q(form.menuFullMenuUrl)},` : ''}
  },
${testimonialsBlock}
${socialBlock}
}`
  }

  // ── Hearth ────────────────────────────────────────────────────────────────
  if (isHearth.value) {
    const rooms = form.rooms.map((r, i) => {
      const feats = r.features.split(',').map(f => f.trim()).filter(Boolean)
      const roomPhoto = form.roomPhotos[i]
      return `    {
      name: ${q(r.name)},
      blurb: ${q(r.blurb)},
      image: ${q(roomPhoto?.src || r.image)},
      features: [${qArr(feats).split(', ').map(f => f).join(', ')}],${r.rateFrom ? `\n      rateFrom: ${q(r.rateFrom)},` : ''}${r.bookUrl ? `\n      bookUrl: ${q(r.bookUrl)},` : ''}
    },`
    }).join('\n')

    const amenities = form.amenities.filter(a => a.label).map(a =>
      `    { label: ${q(a.label)}, description: ${q(a.description)}, icon: ${q(a.icon)} },`
    ).join('\n')

    return `import type { HearthSiteConfig } from './site.config'

export const siteConfig: HearthSiteConfig = {
  brand: ${q(form.brand)},
  tagline: ${q(form.tagline)},
  blurb: ${q(form.blurb)},
  theme: '${form.theme}',
  swatch: '${form.swatch}',
  variant: '${form.variant}',
${contactBlock}
  bookingUrl: ${q(form.bookingUrl)},
  photos: {
    hero: ${photoSlot(form.heroPhoto)},
    about: ${photoSlot(form.aboutPhoto)},
    rooms: [
${form.roomPhotos.filter(p => p.src).map(p => `      ${photoSlot(p)},`).join('\n')}
    ],
    gallery: [
${gallery}
    ],
  },
${storyBlock}
  rooms: [
${rooms}
  ],
  amenities: [
${amenities}
  ],
${testimonialsBlock}
${socialBlock}
}`
  }

  // ── Vault ─────────────────────────────────────────────────────────────────
  if (isVault.value) {
    const hours = form.hours.map(h => `    { day: ${q(h.day)}, open: ${q(h.open)} },`).join('\n')

    const products = form.featured.filter(p => p.name).map(p =>
      `    { name: ${q(p.name)}, price: ${q(p.price)}, image: ${q(p.image)}, blurb: ${q(p.blurb)}${p.badge ? `, badge: ${q(p.badge)}` : ''}${p.url ? `, url: ${q(p.url)}` : ''} },`
    ).join('\n')

    const cats = form.categories.filter(c => c.name).map(c =>
      `    { name: ${q(c.name)}, image: ${q(c.image)}${c.count ? `, count: ${Number(c.count)}` : ''}, url: ${q(c.url)} },`
    ).join('\n')

    return `import type { VaultSiteConfig } from './site.config'

export const siteConfig: VaultSiteConfig = {
  brand: ${q(form.brand)},
  tagline: ${q(form.tagline)},
  blurb: ${q(form.blurb)},
  theme: '${form.theme}',
  swatch: '${form.swatch}',
  variant: '${form.variant}',
${contactBlock}
  shopUrl: ${q(form.shopUrl)},
  hours: [
${hours}
  ],
  photos: {
    hero: ${photoSlot(form.heroPhoto)},
    about: ${photoSlot(form.aboutPhoto)},
    storefront: ${photoSlot(form.storefrontPhoto)},
    gallery: [
${gallery}
    ],
  },
${storyBlock}
  featured: [
${products}
  ],
  categories: [
${cats}
  ],
${testimonialsBlock}
${socialBlock}
}`
  }

  return '// Select an archetype to generate config'
})

async function copyConfig() {
  await navigator.clipboard.writeText(configOutput.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2200)
}

// ─── Photo alt helpers ────────────────────────────────────────────────────────
function getPhotoAlt(slotFilename: string): string {
  if (slotFilename === 'hero.jpg') return form.heroPhoto.alt
  if (slotFilename === 'about.jpg') return form.aboutPhoto.alt
  if (slotFilename === 'storefront.jpg') return form.storefrontPhoto.alt
  const m = slotFilename.match(/^room-(\d+)\.jpg$/)
  if (m) return form.roomPhotos[parseInt(m[1]!) - 1]?.alt ?? ''
  return ''
}
function setPhotoAlt(slotFilename: string, val: string) {
  if (slotFilename === 'hero.jpg') { form.heroPhoto.alt = val; return }
  if (slotFilename === 'about.jpg') { form.aboutPhoto.alt = val; return }
  if (slotFilename === 'storefront.jpg') { form.storefrontPhoto.alt = val; return }
  const m = slotFilename.match(/^room-(\d+)\.jpg$/)
  if (m) { const r = form.roomPhotos[parseInt(m[1]!) - 1]; if (r) r.alt = val }
}

// ─── Photo guide ──────────────────────────────────────────────────────────────
const photoGuide = computed(() => {
  const base = [
    { slot: 'hero.jpg',        label: 'Hero',      desc: 'The main banner photo. Landscape. High impact — a food shot, room shot, or storefront. Min 1400px wide.' },
    { slot: 'about.jpg',       label: 'About',     desc: 'Interior or behind-the-scenes. Used in your story section. Square or 4:3 works well.' },
  ]
  if (isMesa.value) return [
    ...base,
    { slot: 'gallery-01.jpg',  label: 'Gallery 1', desc: 'Dish or food detail. Portrait or square.' },
    { slot: 'gallery-02.jpg',  label: 'Gallery 2', desc: 'Another dish or drink. Landscape.' },
    { slot: 'gallery-03.jpg',  label: 'Gallery 3', desc: 'Dish or detail. Any ratio.' },
    { slot: 'gallery-04.jpg',  label: 'Gallery 4', desc: 'Interior atmosphere. Wide.' },
    { slot: 'gallery-05.jpg',  label: 'Gallery 5', desc: 'Bar, kitchen, or team shot.' },
    { slot: 'gallery-06.jpg',  label: 'Gallery 6', desc: 'Any strong food or interior photo.' },
  ]
  if (isHearth.value) return [
    ...base,
    { slot: 'room-suite.jpg',  label: 'Room 1',    desc: 'Your flagship room. Well-lit, bedding styled.' },
    { slot: 'room-king.jpg',   label: 'Room 2',    desc: 'Second room type. Show the character.' },
    { slot: 'room-queen.jpg',  label: 'Room 3',    desc: 'Third room. Can be a detail shot.' },
    { slot: 'gallery-01.jpg',  label: 'Gallery 1', desc: 'Exterior or façade. Daytime preferred.' },
    { slot: 'gallery-02.jpg',  label: 'Gallery 2', desc: 'Lobby or common area.' },
    { slot: 'gallery-03.jpg',  label: 'Gallery 3', desc: 'Breakfast spread or amenity.' },
    { slot: 'gallery-04.jpg',  label: 'Gallery 4', desc: 'Architectural detail or garden.' },
    { slot: 'gallery-05.jpg',  label: 'Gallery 5', desc: 'Outdoor space or courtyard.' },
    { slot: 'gallery-06.jpg',  label: 'Gallery 6', desc: 'Any atmospheric shot.' },
  ]
  if (isVault.value) return [
    ...base,
    { slot: 'storefront.jpg',  label: 'Storefront', desc: 'Your shop exterior. Street-level, clear signage.' },
    { slot: 'product-01.jpg',  label: 'Product 1',  desc: 'Featured product. Clean flat lay or lifestyle.' },
    { slot: 'product-02.jpg',  label: 'Product 2',  desc: 'Featured product. Consistent style.' },
    { slot: 'product-03.jpg',  label: 'Product 3',  desc: 'Featured product.' },
    { slot: 'product-04.jpg',  label: 'Product 4',  desc: 'Featured product.' },
    { slot: 'cat-1.jpg',       label: 'Category 1', desc: 'Category cover photo. Square or portrait.' },
    { slot: 'cat-2.jpg',       label: 'Category 2', desc: 'Category cover photo.' },
    { slot: 'cat-3.jpg',       label: 'Category 3', desc: 'Category cover photo.' },
    { slot: 'cat-4.jpg',       label: 'Category 4', desc: 'Category cover photo.' },
  ]
  return base
})
</script>

<template>
  <section class="wiz">
    <div class="ap-container">

      <!-- ── Header ──────────────────────────────────────────────────────── -->
      <div class="wiz__header">
        <p class="ap-eyebrow">Site setup wizard</p>
        <h1 class="wiz__title">Build your site config</h1>
        <p class="wiz__lead">
          Answer the questions below. Your progress saves automatically — come back any time.
          At the end you'll get a ready-to-paste TypeScript config file.
        </p>
        <button type="button" class="wiz__clear" @click="clearAll">Clear all progress</button>
      </div>

      <!-- ── Progress bar ────────────────────────────────────────────────── -->
      <div class="wiz__progress" role="progressbar" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">
        <div class="wiz__progress-fill" :style="{ width: progress + '%' }"></div>
      </div>

      <!-- ── Step tabs ───────────────────────────────────────────────────── -->
      <nav class="wiz__tabs" aria-label="Wizard steps">
        <button
          v-for="(s, i) in STEPS"
          :key="s.id"
          type="button"
          class="wiz__tab"
          :class="{ 'is-active': step === i, 'is-done': step > i }"
          @click="goTo(i)"
        >
          <span class="wiz__tab-num">{{ i + 1 }}</span>
          <span class="wiz__tab-label">{{ s.label }}</span>
        </button>
      </nav>

      <!-- ── Step panels ─────────────────────────────────────────────────── -->
      <div class="wiz__body">

        <!-- STEP 0: Archetype ──────────────────────────────────────────── -->
        <div v-if="step === 0" class="wiz__step">
          <h2 class="wiz__step-title">What kind of business is this?</h2>
          <p class="wiz__step-desc">Choose the template that fits. Each archetype comes pre-built with the right sections for that type of business.</p>
          <div class="wiz__arch-grid">
            <button
              type="button"
              class="wiz__arch-card"
              :class="{ 'is-active': form.archetype === 'mesa' }"
              @click="form.archetype = 'mesa'"
            >
              <span class="wiz__arch-icon">🍽</span>
              <strong>Mesa</strong>
              <span>Dine — restaurant, café, food truck, bar</span>
              <span class="wiz__arch-sections">Menu · Gallery · Hours · Story · Testimonials</span>
            </button>
            <button
              type="button"
              class="wiz__arch-card"
              :class="{ 'is-active': form.archetype === 'hearth' }"
              @click="form.archetype = 'hearth'"
            >
              <span class="wiz__arch-icon">🛏</span>
              <strong>Hearth</strong>
              <span>Stay — hotel, B&amp;B, inn, rental property</span>
              <span class="wiz__arch-sections">Rooms · Amenities · Gallery · Story · Testimonials</span>
            </button>
            <button
              type="button"
              class="wiz__arch-card"
              :class="{ 'is-active': form.archetype === 'vault' }"
              @click="form.archetype = 'vault'"
            >
              <span class="wiz__arch-icon">🛍</span>
              <strong>Vault</strong>
              <span>Shop — retail, boutique, market, maker</span>
              <span class="wiz__arch-sections">Products · Categories · Gallery · Story · Testimonials</span>
            </button>
          </div>
        </div>

        <!-- STEP 1: Brand ──────────────────────────────────────────────── -->
        <div v-if="step === 1" class="wiz__step">
          <h2 class="wiz__step-title">Brand identity</h2>
          <p class="wiz__step-desc">The name and voice of the business. These appear in the header, hero, and throughout the site.</p>
          <div class="wiz__fields">
            <label class="wiz__field">
              <span class="wiz__label">Business name <em>*</em></span>
              <input v-model="form.brand" type="text" class="wiz__input" placeholder="e.g. Mesa Trinidad" />
            </label>
            <label class="wiz__field">
              <span class="wiz__label">Tagline</span>
              <input v-model="form.tagline" type="text" class="wiz__input" placeholder="e.g. Wood-fired kitchen" />
              <span class="wiz__hint">Short — 3 to 6 words. Shows under the name in the header.</span>
            </label>
            <label class="wiz__field wiz__field--full">
              <span class="wiz__label">One-sentence description</span>
              <textarea v-model="form.blurb" class="wiz__input wiz__textarea" rows="2" placeholder="e.g. A neighborhood kitchen serving Southern Colorado classics with a wood-fired heart." />
              <span class="wiz__hint">Used in the site footer and meta description. Keep it under 160 characters.</span>
            </label>
          </div>
        </div>

        <!-- STEP 2: Design ─────────────────────────────────────────────── -->
        <div v-if="step === 2" class="wiz__step">
          <h2 class="wiz__step-title">Design: theme &amp; color</h2>
          <p class="wiz__step-desc">Pick a theme (typography + layout feel) and a color swatch. You can change these any time in the code.</p>
          <div class="wiz__fields">
            <div class="wiz__field wiz__field--full">
              <p class="wiz__label">Theme</p>
              <div class="wiz__chips">
                <button
                  v-for="t in THEME_OPTS" :key="t"
                  type="button" class="wiz__chip"
                  :class="{ 'is-active': form.theme === t }"
                  @click="form.theme = t"
                >
                  <strong>{{ t }}</strong>
                  <span v-if="t === 'studio'">Minimal · Mono type · Hairline rules</span>
                  <span v-if="t === 'heritage'">Editorial · Serif · Generous whitespace</span>
                  <span v-if="t === 'vibrant'">Bold · Graphic · Chunky borders</span>
                </button>
              </div>
            </div>
            <div class="wiz__field wiz__field--full">
              <p class="wiz__label">Color swatch</p>
              <div class="wiz__chips wiz__chips--wrap">
                <button
                  v-for="s in SWATCH_OPTS" :key="s"
                  type="button" class="wiz__chip wiz__chip--sm"
                  :class="{ 'is-active': form.swatch === s }"
                  @click="form.swatch = s"
                >{{ s }}</button>
              </div>
              <span class="wiz__hint">Light swatches: sand, forest, sage, sunset, rose, stone, fiesta, citrus. Dark: midnight, obsidian, ember, plum.</span>
            </div>
            <div class="wiz__field wiz__field--full">
              <p class="wiz__label">Variant</p>
              <div class="wiz__chips">
                <button
                  v-for="v in VARIANT_OPTS" :key="v"
                  type="button" class="wiz__chip"
                  :class="{ 'is-active': form.variant === v }"
                  @click="form.variant = v"
                >
                  <strong>{{ v }}</strong>
                  <span v-if="v === 'essentials'">6-8 gallery photos · Standard sections</span>
                  <span v-if="v === 'portfolio'">12-16 gallery photos · Full content depth</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 3: Contact ─────────────────────────────────────────────── -->
        <div v-if="step === 3" class="wiz__step">
          <h2 class="wiz__step-title">Contact &amp; location</h2>
          <p class="wiz__step-desc">These appear in the footer, the contact section, and in search engine results.</p>
          <div class="wiz__fields">
            <label class="wiz__field wiz__field--full">
              <span class="wiz__label">Street address</span>
              <input v-model="form.address" type="text" class="wiz__input" placeholder="123 Main St, Trinidad, CO 81082" />
            </label>
            <label class="wiz__field">
              <span class="wiz__label">Phone</span>
              <input v-model="form.phone" type="tel" class="wiz__input" placeholder="(719) 555-0100" />
            </label>
            <label class="wiz__field">
              <span class="wiz__label">Email</span>
              <input v-model="form.email" type="email" class="wiz__input" placeholder="hello@yourbusiness.com" />
            </label>
            <label class="wiz__field wiz__field--full">
              <span class="wiz__label">Google Maps embed URL <em>(optional)</em></span>
              <input v-model="form.mapEmbedUrl" type="url" class="wiz__input" placeholder="https://www.google.com/maps?q=..." />
              <span class="wiz__hint">From Google Maps: Share → Embed a map → copy the src URL inside the iframe tag.</span>
            </label>
          </div>

          <!-- Hours — Mesa + Vault only -->
          <template v-if="hasHours">
            <h3 class="wiz__sub">Hours</h3>
            <div v-for="(h, i) in form.hours" :key="i" class="wiz__row-pair">
              <input v-model="h.day" type="text" class="wiz__input" placeholder="Day / range" />
              <input v-model="h.open" type="text" class="wiz__input" placeholder="e.g. 11:00 – 9:00 or Closed" />
            </div>
            <button type="button" class="wiz__add" @click="form.hours.push({ day: '', open: '' })">+ Add row</button>
          </template>

          <!-- Booking / shop URL -->
          <template v-if="isHearth">
            <h3 class="wiz__sub">Booking</h3>
            <label class="wiz__field wiz__field--full">
              <span class="wiz__label">Booking URL</span>
              <input v-model="form.bookingUrl" type="url" class="wiz__input" placeholder="https://your-booking-system.com/book" />
              <span class="wiz__hint">Where guests click "Book a room". Can be a Lodgify, Airbnb, or direct link.</span>
            </label>
          </template>
          <template v-if="isVault">
            <h3 class="wiz__sub">Shop</h3>
            <label class="wiz__field wiz__field--full">
              <span class="wiz__label">Online shop URL</span>
              <input v-model="form.shopUrl" type="url" class="wiz__input" placeholder="https://your-shop.com" />
            </label>
          </template>
        </div>

        <!-- STEP 4: Photos ──────────────────────────────────────────────── -->
        <div v-if="step === 4" class="wiz__step">
          <h2 class="wiz__step-title">Photo checklist</h2>
          <p class="wiz__step-desc">
            Place your photos in <code class="wiz__code">public/photos/</code> using the filenames below.
            Fill in alt text for accessibility — it also helps with SEO.
          </p>

          <div class="wiz__photo-guide">
            <div v-for="slot in photoGuide" :key="slot.slot" class="wiz__photo-row">
              <div class="wiz__photo-meta">
                <code class="wiz__code">{{ slot.slot }}</code>
                <strong>{{ slot.label }}</strong>
                <span>{{ slot.desc }}</span>
              </div>
              <div class="wiz__photo-inputs">
                <input
                  type="text" class="wiz__input wiz__input--sm"
                  :value="getPhotoAlt(slot.slot)"
                  @input="setPhotoAlt(slot.slot, ($event.target as HTMLInputElement).value)"
                  placeholder="Alt text (describe the image)"
                />
              </div>
            </div>
          </div>

          <!-- Gallery alt texts -->
          <h3 class="wiz__sub">Gallery photos</h3>
          <p class="wiz__step-desc">You'll need {{ form.variant === 'portfolio' ? '12–16' : '6–8' }} gallery photos. Fill in alt text for each.</p>
          <div v-for="(p, i) in form.gallery" :key="i" class="wiz__row-pair">
            <code class="wiz__code wiz__code--inline">gallery-{{ String(i + 1).padStart(2, '0') }}.jpg</code>
            <input v-model="p.alt" type="text" class="wiz__input" :placeholder="`Alt text for photo ${i + 1}`" />
          </div>

          <!-- Hearth room photos -->
          <template v-if="isHearth">
            <h3 class="wiz__sub">Room photos</h3>
            <div v-for="(p, i) in form.roomPhotos" :key="i" class="wiz__row-pair">
              <input v-model="p.src" type="text" class="wiz__input wiz__input--sm" :placeholder="`/photos/room-${i+1}.jpg`" />
              <input v-model="p.alt" type="text" class="wiz__input" :placeholder="`Alt text for room ${i + 1} photo`" />
            </div>
          </template>

          <!-- Vault storefront -->
          <template v-if="isVault">
            <h3 class="wiz__sub">Storefront photo</h3>
            <div class="wiz__row-pair">
              <code class="wiz__code wiz__code--inline">storefront.jpg</code>
              <input v-model="form.storefrontPhoto.alt" type="text" class="wiz__input" placeholder="Alt text for your storefront photo" />
            </div>
          </template>
        </div>

        <!-- STEP 5: Story ───────────────────────────────────────────────── -->
        <div v-if="step === 5" class="wiz__step">
          <h2 class="wiz__step-title">Your story</h2>
          <p class="wiz__step-desc">The "About" section of your site. Tell people who you are and why this place matters.</p>
          <div class="wiz__fields">
            <label class="wiz__field wiz__field--full">
              <span class="wiz__label">Section headline</span>
              <input v-model="form.storyTitle" type="text" class="wiz__input" placeholder="e.g. A table built for Trinidad." />
            </label>
            <div v-for="(_, i) in form.storyParagraphs" :key="i" class="wiz__field wiz__field--full">
              <span class="wiz__label">Paragraph {{ i + 1 }}</span>
              <textarea v-model="form.storyParagraphs[i]" class="wiz__input wiz__textarea" rows="3" placeholder="2–4 sentences. Write naturally, like you're telling a friend." />
            </div>
            <button type="button" class="wiz__add" @click="form.storyParagraphs.push('')">+ Add paragraph</button>
          </div>

          <h3 class="wiz__sub">Key facts <em>(optional)</em></h3>
          <p class="wiz__step-desc">3 short stats shown next to your story. e.g. Founded: 2021 · Seats: 48 · Rooms: 8</p>
          <div v-for="(f, i) in form.storyFacts" :key="i" class="wiz__row-pair">
            <input v-model="f.label" type="text" class="wiz__input wiz__input--sm" placeholder="Label (e.g. Founded)" />
            <input v-model="f.value" type="text" class="wiz__input" placeholder="Value (e.g. 2022)" />
          </div>
        </div>

        <!-- STEP 6: Content (archetype-specific) ───────────────────────── -->
        <div v-if="step === 6" class="wiz__step">

          <!-- MESA: Menu ─────────────────────────────────────────────── -->
          <template v-if="isMesa">
            <h2 class="wiz__step-title">Menu</h2>
            <p class="wiz__step-desc">Enter your menu categories and items. You can always add more later directly in <code class="wiz__code">site.config.ts</code>.</p>
            <label class="wiz__field wiz__field--full">
              <span class="wiz__label">Menu intro <em>(optional)</em></span>
              <input v-model="form.menuIntro" type="text" class="wiz__input" placeholder="e.g. Updated weekly with the best from the valley." />
            </label>
            <label class="wiz__field wiz__field--full">
              <span class="wiz__label">Full menu URL <em>(optional)</em></span>
              <input v-model="form.menuFullMenuUrl" type="url" class="wiz__input" placeholder="Link to a PDF or external menu" />
            </label>
            <div v-for="(cat, ci) in form.menuCategories" :key="ci" class="wiz__menu-cat">
              <div class="wiz__menu-cat-header">
                <input v-model="cat.name" type="text" class="wiz__input" placeholder="Category name (e.g. Small plates)" />
              </div>
              <div v-for="(item, ii) in cat.items" :key="ii" class="wiz__menu-item">
                <input v-model="item.name" type="text" class="wiz__input" placeholder="Dish name" />
                <input v-model="item.description" type="text" class="wiz__input" placeholder="Description (optional)" />
                <input v-model="item.price" type="text" class="wiz__input wiz__input--xs" placeholder="$12" />
                <input v-model="item.tags" type="text" class="wiz__input wiz__input--xs" placeholder="GF, V, ..." />
                <button type="button" class="wiz__remove" @click="removeMenuItem(ci, ii)" title="Remove item">✕</button>
              </div>
              <button type="button" class="wiz__add" @click="addMenuItem(ci)">+ Add item to {{ cat.name || 'category' }}</button>
            </div>
            <button type="button" class="wiz__add wiz__add--lg" @click="addMenuCategory">+ Add menu category</button>
          </template>

          <!-- HEARTH: Rooms ──────────────────────────────────────────── -->
          <template v-if="isHearth">
            <h2 class="wiz__step-title">Rooms</h2>
            <p class="wiz__step-desc">Describe each room type. Features are comma-separated (e.g. King bed, Sleeps 2, Soaking tub).</p>
            <div v-for="(room, i) in form.rooms" :key="i" class="wiz__card-block">
              <h3 class="wiz__sub">Room {{ i + 1 }}</h3>
              <div class="wiz__fields">
                <label class="wiz__field">
                  <span class="wiz__label">Room name</span>
                  <input v-model="room.name" type="text" class="wiz__input" placeholder="e.g. The Suite" />
                </label>
                <label class="wiz__field">
                  <span class="wiz__label">Rate from</span>
                  <input v-model="room.rateFrom" type="text" class="wiz__input" placeholder="$145" />
                </label>
                <label class="wiz__field wiz__field--full">
                  <span class="wiz__label">Short description</span>
                  <input v-model="room.blurb" type="text" class="wiz__input" placeholder="One sentence about this room." />
                </label>
                <label class="wiz__field wiz__field--full">
                  <span class="wiz__label">Features <em>(comma-separated)</em></span>
                  <input v-model="room.features" type="text" class="wiz__input" placeholder="King bed, Sleeps 2, Walk-in shower, 300 sq ft" />
                </label>
                <label class="wiz__field wiz__field--full">
                  <span class="wiz__label">Book URL <em>(optional)</em></span>
                  <input v-model="room.bookUrl" type="url" class="wiz__input" placeholder="Direct link to book this room" />
                </label>
              </div>
            </div>
            <button type="button" class="wiz__add wiz__add--lg" @click="form.rooms.push({ name: '', blurb: '', image: `/photos/room-${form.rooms.length + 1}.jpg`, features: '', rateFrom: '', bookUrl: '' }); form.roomPhotos.push(blankPhoto(`/photos/room-${form.roomPhotos.length + 1}.jpg`))">
              + Add room
            </button>

            <h3 class="wiz__sub" style="margin-top:2.5rem">Amenities</h3>
            <p class="wiz__step-desc">Things included with every stay. Shown as a grid of icons.</p>
            <div v-for="(a, i) in form.amenities" :key="i" class="wiz__row-trio">
              <input v-model="a.icon" type="text" class="wiz__input wiz__input--xs" placeholder="☕" />
              <input v-model="a.label" type="text" class="wiz__input wiz__input--sm" placeholder="Label" />
              <input v-model="a.description" type="text" class="wiz__input" placeholder="Short description (optional)" />
            </div>
            <button type="button" class="wiz__add" @click="form.amenities.push({ label: '', description: '', icon: '' })">+ Add amenity</button>
          </template>

          <!-- VAULT: Products & Categories ──────────────────────────── -->
          <template v-if="isVault">
            <h2 class="wiz__step-title">Products &amp; categories</h2>
            <p class="wiz__step-desc">Enter your featured products and shop categories.</p>

            <h3 class="wiz__sub">Featured products</h3>
            <div v-for="(p, i) in form.featured" :key="i" class="wiz__card-block">
              <div class="wiz__fields">
                <label class="wiz__field">
                  <span class="wiz__label">Product name</span>
                  <input v-model="p.name" type="text" class="wiz__input" placeholder="Sangre de Cristo Mug" />
                </label>
                <label class="wiz__field">
                  <span class="wiz__label">Price</span>
                  <input v-model="p.price" type="text" class="wiz__input" placeholder="$28" />
                </label>
                <label class="wiz__field">
                  <span class="wiz__label">Short description</span>
                  <input v-model="p.blurb" type="text" class="wiz__input" placeholder="Hand-thrown stoneware" />
                </label>
                <label class="wiz__field">
                  <span class="wiz__label">Badge <em>(optional)</em></span>
                  <input v-model="p.badge" type="text" class="wiz__input" placeholder="New · Local · Sale" />
                </label>
                <label class="wiz__field wiz__field--full">
                  <span class="wiz__label">Image filename</span>
                  <input v-model="p.image" type="text" class="wiz__input" :placeholder="`/photos/product-${String(i+1).padStart(2,'0')}.jpg`" />
                </label>
              </div>
            </div>
            <button type="button" class="wiz__add wiz__add--lg" @click="form.featured.push({ name: '', price: '', image: `/photos/product-${String(form.featured.length + 1).padStart(2,'0')}.jpg`, blurb: '', badge: '', url: '#' })">
              + Add product
            </button>

            <h3 class="wiz__sub" style="margin-top:2.5rem">Shop categories</h3>
            <div v-for="(c, i) in form.categories" :key="i" class="wiz__row-trio">
              <input v-model="c.name" type="text" class="wiz__input" placeholder="Category name (e.g. Apparel)" />
              <input v-model="c.count" type="text" class="wiz__input wiz__input--xs" placeholder="Item count" />
              <input v-model="c.image" type="text" class="wiz__input" :placeholder="`/photos/cat-${i+1}.jpg`" />
            </div>
            <button type="button" class="wiz__add" @click="form.categories.push({ name: '', image: `/photos/cat-${form.categories.length + 1}.jpg`, url: '#', count: '' })">
              + Add category
            </button>
          </template>
        </div>

        <!-- STEP 7: Testimonials ────────────────────────────────────────── -->
        <div v-if="step === 7" class="wiz__step">
          <h2 class="wiz__step-title">Testimonials</h2>
          <p class="wiz__step-desc">3 short quotes from happy customers. Source is where the review came from (Google, Yelp, Tripadvisor, etc).</p>
          <div v-for="(t, i) in form.testimonials" :key="i" class="wiz__card-block">
            <h3 class="wiz__sub">Quote {{ i + 1 }}</h3>
            <div class="wiz__fields">
              <label class="wiz__field wiz__field--full">
                <span class="wiz__label">Quote</span>
                <textarea v-model="t.quote" class="wiz__input wiz__textarea" rows="2" placeholder="&ldquo;The best meal we've had in Southern Colorado.&rdquo;" />
              </label>
              <label class="wiz__field">
                <span class="wiz__label">Author name</span>
                <input v-model="t.author" type="text" class="wiz__input" placeholder="Diana K." />
              </label>
              <label class="wiz__field">
                <span class="wiz__label">Source</span>
                <input v-model="t.source" type="text" class="wiz__input" placeholder="Google · Yelp · Tripadvisor" />
              </label>
            </div>
          </div>
          <button type="button" class="wiz__add" @click="form.testimonials.push({ quote: '', author: '', source: '' })">+ Add testimonial</button>
        </div>

        <!-- STEP 8: Social ──────────────────────────────────────────────── -->
        <div v-if="step === 8" class="wiz__step">
          <h2 class="wiz__step-title">Social links</h2>
          <p class="wiz__step-desc">Links shown in the footer. Leave blank to hide.</p>
          <div v-for="(s, i) in form.social" :key="i" class="wiz__row-pair">
            <input v-model="s.label" type="text" class="wiz__input wiz__input--sm" placeholder="Platform (e.g. Instagram)" />
            <input v-model="s.href" type="url" class="wiz__input" placeholder="https://..." />
          </div>
          <button type="button" class="wiz__add" @click="form.social.push({ label: '', href: '' })">+ Add link</button>
        </div>

        <!-- STEP 9: Export ──────────────────────────────────────────────── -->
        <div v-if="step === 9" class="wiz__step">
          <h2 class="wiz__step-title">Your site config is ready</h2>
          <p class="wiz__step-desc">
            Copy the code below and paste it into <code class="wiz__code">src/config/site.config.ts</code> in your archetype project.
            Replace the default export with your new config — the site will instantly reflect your content.
          </p>

          <div class="wiz__export-actions">
            <button type="button" class="ap-btn" @click="copyConfig">
              {{ copied ? '✓ Copied!' : 'Copy to clipboard' }}
            </button>
          </div>

          <pre class="wiz__code-block"><code>{{ configOutput }}</code></pre>

          <div class="wiz__checklist">
            <h3 class="wiz__sub">What to do next</h3>
            <ol class="wiz__ol">
              <li>Replace the contents of <code class="wiz__code">src/config/site.config.ts</code> with the code above.</li>
              <li>Place your photos in <code class="wiz__code">public/photos/</code> using the filenames from step 4.</li>
              <li>Run <code class="wiz__code">npm run dev</code> to preview the site with your content.</li>
              <li>Use the theme switcher (bottom-right corner) to try different themes, swatches, and hero styles.</li>
              <li>When happy, run <code class="wiz__code">npm run build</code> and deploy the <code class="wiz__code">dist/</code> folder.</li>
            </ol>
          </div>
        </div>

      </div><!-- /wiz__body -->

      <!-- ── Navigation ────────────────────────────────────────────────── -->
      <div class="wiz__nav">
        <button type="button" class="ap-btn ap-btn--ghost" :disabled="step === 0" @click="back">← Back</button>
        <span class="wiz__nav-label">Step {{ step + 1 }} of {{ STEPS.length }}</span>
        <button
          v-if="step < STEPS.length - 1"
          type="button" class="ap-btn"
          :disabled="step === 0 && !form.archetype"
          @click="next"
        >Next →</button>
        <button v-else type="button" class="ap-btn" @click="copyConfig">
          {{ copied ? '✓ Copied!' : 'Copy config' }}
        </button>
      </div>

    </div>
  </section>
</template>



<style scoped>
/* ── Layout ──────────────────────────────────────────────────────────────── */
.wiz { padding: clamp(3rem, 8vw, 7rem) 0; }
.wiz__header { max-width: 62ch; margin-bottom: 2.5rem; }
.wiz__title {
  font-size: clamp(2rem, 4vw, 3.2rem);
  letter-spacing: var(--ap-tracking-heading);
  font-weight: var(--ap-heading-weight);
  margin: 0.75rem 0;
}
.wiz__lead { color: var(--ap-ink-muted); max-width: 54ch; font-size: 1.05rem; line-height: 1.6; }
.wiz__clear {
  margin-top: 0.75rem;
  background: none; border: none; padding: 0;
  color: var(--ap-ink-muted); font-size: 0.8rem;
  cursor: pointer; text-decoration: underline;
}
.wiz__clear:hover { color: var(--ap-ink); }

/* ── Progress ────────────────────────────────────────────────────────────── */
.wiz__progress {
  height: 3px; background: var(--ap-line);
  border-radius: 999px; margin-bottom: 2rem; overflow: hidden;
}
.wiz__progress-fill {
  height: 100%; background: var(--ap-primary);
  border-radius: 999px; transition: width 0.35s ease;
}

/* ── Step tabs ───────────────────────────────────────────────────────────── */
.wiz__tabs {
  display: flex; flex-wrap: wrap; gap: 0.3rem;
  margin-bottom: 2.5rem;
}
.wiz__tab {
  display: flex; align-items: center; gap: 0.5rem;
  background: none; border: 1px solid var(--ap-line);
  border-radius: 999px; padding: 0.35rem 0.8rem;
  font-size: 0.78rem; cursor: pointer;
  color: var(--ap-ink-muted); transition: all 0.12s;
}
.wiz__tab:hover { border-color: var(--ap-ink); color: var(--ap-ink); }
.wiz__tab.is-done { border-color: var(--ap-primary); color: var(--ap-primary); }
.wiz__tab.is-active {
  background: var(--ap-ink); border-color: var(--ap-ink); color: var(--ap-surface);
}
.wiz__tab-num {
  font-variant-numeric: tabular-nums;
  width: 1.4em; height: 1.4em; display: flex; align-items: center; justify-content: center;
  border-radius: 50%; background: currentColor; color: var(--ap-surface);
  font-size: 0.7em; font-weight: 700;
}
.wiz__tab.is-active .wiz__tab-num { background: var(--ap-surface); color: var(--ap-ink); }
.wiz__tab-label { font-weight: 500; }

/* ── Body / steps ────────────────────────────────────────────────────────── */
.wiz__body {
  background: var(--ap-surface-alt);
  border: 1px solid var(--ap-line);
  border-radius: var(--ap-radius-lg);
  padding: clamp(1.5rem, 4vw, 3rem);
  min-height: 400px;
}
.wiz__step { max-width: 820px; }
.wiz__step-title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: var(--ap-heading-weight);
  letter-spacing: var(--ap-tracking-heading);
  margin: 0 0 0.6rem;
}
.wiz__step-desc {
  color: var(--ap-ink-muted); max-width: 60ch;
  line-height: 1.6; margin: 0 0 2rem;
}
.wiz__sub { font-size: 1rem; font-weight: 600; margin: 2rem 0 0.85rem; }

/* ── Fields ──────────────────────────────────────────────────────────────── */
.wiz__fields {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 1.25rem; margin-bottom: 1.5rem;
}
.wiz__field { display: flex; flex-direction: column; gap: 0.4rem; }
.wiz__field--full { grid-column: 1 / -1; }
.wiz__label { font-size: 0.85rem; font-weight: 600; }
.wiz__label em { font-style: normal; font-weight: 400; color: var(--ap-ink-muted); }
.wiz__hint { font-size: 0.78rem; color: var(--ap-ink-muted); }
.wiz__input {
  background: var(--ap-surface);
  border: 1px solid var(--ap-line);
  border-radius: var(--ap-radius);
  padding: 0.6rem 0.85rem;
  font-size: 0.9rem;
  font-family: inherit;
  color: var(--ap-ink);
  width: 100%;
  transition: border-color 0.12s;
}
.wiz__input:focus { outline: none; border-color: var(--ap-primary); }
.wiz__textarea { resize: vertical; min-height: 3.5rem; }
.wiz__input--sm { max-width: 160px; }
.wiz__input--xs { max-width: 100px; }

/* ── Row pairs / trios ───────────────────────────────────────────────────── */
.wiz__row-pair { display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.6rem; }
.wiz__row-pair .wiz__code--inline { flex-shrink: 0; }
.wiz__row-trio { display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.6rem; }

/* ── Add / remove buttons ────────────────────────────────────────────────── */
.wiz__add {
  background: none; border: 1px dashed var(--ap-line);
  border-radius: var(--ap-radius); padding: 0.5rem 1rem;
  font-size: 0.82rem; color: var(--ap-ink-muted); cursor: pointer;
  margin-top: 0.5rem; display: block;
  transition: border-color 0.12s, color 0.12s;
}
.wiz__add:hover { border-color: var(--ap-primary); color: var(--ap-primary); }
.wiz__add--lg { width: 100%; text-align: center; padding: 0.75rem; }
.wiz__remove {
  background: none; border: none; color: var(--ap-ink-muted);
  font-size: 0.82rem; cursor: pointer; padding: 0.25rem; flex-shrink: 0;
}
.wiz__remove:hover { color: var(--ap-ink); }

/* ── Archetype cards ─────────────────────────────────────────────────────── */
.wiz__arch-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.wiz__arch-card {
  display: flex; flex-direction: column; gap: 0.4rem; align-items: flex-start;
  background: var(--ap-surface); border: 2px solid var(--ap-line);
  border-radius: var(--ap-radius-lg); padding: 1.5rem 1.25rem;
  cursor: pointer; text-align: left;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.wiz__arch-card:hover { border-color: var(--ap-primary); }
.wiz__arch-card.is-active {
  border-color: var(--ap-primary);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--ap-primary) 25%, transparent);
}
.wiz__arch-card strong { font-size: 1.15rem; font-weight: 700; }
.wiz__arch-card span { font-size: 0.85rem; color: var(--ap-ink-muted); line-height: 1.4; }
.wiz__arch-sections {
  font-size: 0.72rem !important;
  font-family: var(--ap-font-mono);
  letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--ap-primary) !important;
  margin-top: 0.5rem;
}
.wiz__arch-icon { font-size: 1.75rem; }

/* ── Design chips ────────────────────────────────────────────────────────── */
.wiz__chips { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.5rem; }
.wiz__chips--wrap { flex-wrap: wrap; }
.wiz__chip {
  display: flex; flex-direction: column; gap: 0.2rem;
  background: var(--ap-surface); border: 1.5px solid var(--ap-line);
  border-radius: var(--ap-radius); padding: 0.75rem 1rem;
  cursor: pointer; text-align: left;
  transition: border-color 0.12s;
}
.wiz__chip strong { font-size: 0.9rem; font-weight: 700; }
.wiz__chip span { font-size: 0.78rem; color: var(--ap-ink-muted); }
.wiz__chip.is-active { border-color: var(--ap-primary); background: color-mix(in srgb, var(--ap-primary) 8%, var(--ap-surface)); }
.wiz__chip--sm {
  flex-direction: row; padding: 0.4rem 0.75rem;
  font-size: 0.8rem; font-weight: 500;
}

/* ── Menu ────────────────────────────────────────────────────────────────── */
.wiz__menu-cat {
  border: 1px solid var(--ap-line); border-radius: var(--ap-radius);
  padding: 1.25rem; margin-bottom: 1rem;
}
.wiz__menu-cat-header { margin-bottom: 1rem; }
.wiz__menu-item {
  display: flex; gap: 0.6rem; align-items: center; margin-bottom: 0.6rem;
}

/* ── Card blocks ─────────────────────────────────────────────────────────── */
.wiz__card-block {
  border: 1px solid var(--ap-line); border-radius: var(--ap-radius);
  padding: 1.25rem; margin-bottom: 1rem;
}

/* ── Photo guide ─────────────────────────────────────────────────────────── */
.wiz__photo-guide { display: flex; flex-direction: column; gap: 0; margin-bottom: 2rem; }
.wiz__photo-row {
  display: grid; grid-template-columns: 1fr auto;
  gap: 1rem; align-items: center;
  padding: 0.85rem 0; border-bottom: 1px solid var(--ap-line);
}
.wiz__photo-meta { display: flex; flex-direction: column; gap: 0.25rem; }
.wiz__photo-meta strong { font-size: 0.9rem; }
.wiz__photo-meta span { font-size: 0.82rem; color: var(--ap-ink-muted); }
.wiz__photo-inputs { min-width: 260px; }

/* ── Code display ────────────────────────────────────────────────────────── */
.wiz__code {
  font-family: var(--ap-font-mono);
  font-size: 0.82em;
  background: color-mix(in srgb, var(--ap-ink) 8%, var(--ap-surface));
  padding: 0.1em 0.4em; border-radius: 3px;
}
.wiz__code--inline { white-space: nowrap; flex-shrink: 0; }
.wiz__code-block {
  background: var(--ap-surface);
  border: 1px solid var(--ap-line);
  border-radius: var(--ap-radius);
  padding: 1.5rem; overflow-x: auto;
  font-family: var(--ap-font-mono);
  font-size: 0.78rem; line-height: 1.65;
  color: var(--ap-ink);
  max-height: 60vh; overflow-y: auto;
  white-space: pre;
}

/* ── Export ──────────────────────────────────────────────────────────────── */
.wiz__export-actions { margin-bottom: 1.5rem; display: flex; gap: 1rem; align-items: center; }
.wiz__checklist { margin-top: 2.5rem; }
.wiz__ol { display: flex; flex-direction: column; gap: 0.6rem; padding-left: 1.5rem; }
.wiz__ol li { line-height: 1.5; color: var(--ap-ink-muted); }
.wiz__ol li code { color: var(--ap-ink); }

/* ── Navigation ──────────────────────────────────────────────────────────── */
.wiz__nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.5rem 0 0; border-top: 1px solid var(--ap-line); margin-top: 2rem;
}
.wiz__nav-label { font-size: 0.82rem; color: var(--ap-ink-muted); }

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 680px) {
  .wiz__arch-grid { grid-template-columns: 1fr; }
  .wiz__fields { grid-template-columns: 1fr; }
  .wiz__field--full { grid-column: 1; }
  .wiz__tabs { gap: 0.2rem; }
  .wiz__tab-label { display: none; }
  .wiz__photo-row { grid-template-columns: 1fr; }
  .wiz__menu-item { flex-wrap: wrap; }
}
</style>
