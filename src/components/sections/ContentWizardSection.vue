<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { UtensilsCrossed, BedDouble, ShoppingBag, Wrench, Theater, Sparkles, Rocket } from 'lucide-vue-next'
import IconPickerInput from '../IconPickerInput.vue'
import HeroSection from '@apotome/archetype-shared/components/sections/HeroSection.vue'
import { SWATCHES, SWATCH_LIST } from '@apotome/archetype-shared/themes/swatches'
import { SWATCH_THEORIES } from '@apotome/archetype-shared/themes/tokens'

// ─── Color preview helpers ────────────────────────────────────────────────────
function swatchOf(name: string) {
  return SWATCHES[name as keyof typeof SWATCHES] ?? SWATCHES.sand
}

// ─── Types ────────────────────────────────────────────────────────────────────
type WizardArchetype = 'mesa' | 'hearth' | 'vault' | 'marquee' | 'keystone'

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
interface Service { name: string; description: string; price: string; icon: string }
interface Capability { label: string; value: string }
interface WizEvent { title: string; date: string; startTime: string; category: string; priceLabel: string; blurb: string; image: string }

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
  // Marquee (venue / events)
  ticketingUrl: string
  venueCapacity: string; venueParking: string; venueAgeRestrictions: string
  events: WizEvent[]
  // Keystone (utility / trades)
  serviceArea: string; dispatchPhone: string; emergencyAvailable: boolean
  services: Service[]; capabilities: Capability[]
}

// ─── Constants ────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'ap-site-wizard-v1'
const THEME_OPTS = ['studio', 'heritage', 'vibrant', 'ironwood'] as const
// Swatch groups mirror the shared color theories — one source of truth for
// grouping, psychology copy, and membership across the switcher + wizard.
const SWATCH_GROUPS = SWATCH_THEORIES.map(t => ({
  label: t.label,
  psychology: t.psychology,
  swatches: SWATCH_LIST.filter(s => s.group === t.id).map(s => s.name),
}))
const VARIANT_OPTS = ['essentials', 'portfolio', 'extended'] as const
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
  { id: 'launch',       label: 'Launch' },
]

// ─── State ────────────────────────────────────────────────────────────────────
const step = ref(0)

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
  // Marquee
  ticketingUrl: '',
  venueCapacity: '', venueParking: '', venueAgeRestrictions: '',
  events: [
    { title: '', date: '', startTime: '', category: '', priceLabel: '', blurb: '', image: '/photos/event-1.jpg' },
    { title: '', date: '', startTime: '', category: '', priceLabel: '', blurb: '', image: '/photos/event-2.jpg' },
    { title: '', date: '', startTime: '', category: '', priceLabel: '', blurb: '', image: '/photos/event-3.jpg' },
  ],
  // Keystone
  serviceArea: '', dispatchPhone: '', emergencyAvailable: false,
  services: [
    { name: '', description: '', price: '', icon: '🔧' },
    { name: '', description: '', price: '', icon: '⚙' },
    { name: '', description: '', price: '', icon: '🛠' },
    { name: '', description: '', price: '', icon: '⚡' },
  ],
  capabilities: [
    { label: 'Years in business', value: '' },
    { label: 'Service radius', value: '' },
    { label: 'Licensed & insured', value: '' },
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
const isMarquee = computed(() => form.archetype === 'marquee')
const isKeystone = computed(() => form.archetype === 'keystone')
const hasHours = computed(() => isMesa.value || isVault.value || isKeystone.value || isMarquee.value)
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

// ─── AI copy assist ───────────────────────────────────────────────────────────
const aiLoading = reactive<Record<string, boolean>>({})

async function aiSuggest(
  field: string,
  apply: (text: string) => void,
  context: Record<string, string> = {},
) {
  if (aiLoading[field]) return
  aiLoading[field] = true
  try {
    const { text } = await contentClient.aiSuggest({
      archetype: form.archetype,
      brand: form.brand,
      field,
      context,
    })
    if (text) apply(text)
  } finally {
    aiLoading[field] = false
  }
}

// ─── Menu helpers ─────────────────────────────────────────────────────────────
function addMenuItem(catIdx: number) { form.menuCategories[catIdx]!.items.push(blankMenuItem()) }
function removeMenuItem(catIdx: number, itemIdx: number) { form.menuCategories[catIdx]!.items.splice(itemIdx, 1) }
function addMenuCategory() { form.menuCategories.push({ name: '', items: [blankMenuItem()] }) }

// ─── Config export ────────────────────────────────────────────────────────────

// ─── Buy & deploy (PLATFORM_ENABLED) ──────────────────────────────────────────
import { PLATFORM_ENABLED } from '@apotome/archetype-shared/platform/config'
import { contentClient } from '@apotome/archetype-shared/platform/contentClient'
import { PRICING, BUNDLES } from '../../config/pricing'

const CHECKOUT_BUNDLES = BUNDLES as readonly { id: string; name: string; price: number; items: readonly string[]; blurb: string }[]
const CHECKOUT_WEBSITE_ITEMS = PRICING.filter(p => p.category === 'website')
const CHECKOUT_MARKETING = PRICING.filter(p => p.category === 'marketing')
const CHECKOUT_ADDONS = PRICING.filter(p => p.category === 'addons')

function planForVariant(v: string): string {
  return v === 'extended' ? 'premium' : v === 'portfolio' ? 'pro' : 'starter'
}
const plan = ref<string>(planForVariant(form.variant))
watch(() => form.variant, v => { plan.value = planForVariant(v) })
const addOns = ref<string[]>([])
const owner = reactive({ email: '', name: '' })
const checkoutBusy = ref(false)
const checkoutError = ref<string | null>(null)
// Must accept the Terms + Privacy Policy before we take payment.
const agreedToTerms = ref(false)

// When a bundle is the selected plan, the services it already contains must not
// be offered (or charged for) again. Map the bundle's item labels back to PRICING ids.
const bundleIncludedIds = computed<string[]>(() => {
  const b = CHECKOUT_BUNDLES.find(b => b.id === plan.value)
  if (!b) return []
  const names = new Set(b.items.map(i => i.toLowerCase()))
  return PRICING.filter(p => names.has(p.name.toLowerCase())).map(p => p.id)
})
function isInBundle(id: string): boolean { return bundleIncludedIds.value.includes(id) }

// Keep add-on selections clean: drop anything the chosen bundle already covers.
watch(bundleIncludedIds, ids => {
  if (ids.length && addOns.value.some(id => ids.includes(id))) {
    addOns.value = addOns.value.filter(id => !ids.includes(id))
  }
}, { immediate: true })

const checkoutTotal = computed(() => {
  const b = CHECKOUT_BUNDLES.find(b => b.id === plan.value)
  const basePrice = b?.price ?? PRICING.find(p => p.id === plan.value)?.price ?? 0
  // Included-in-bundle items never add to the total, even if somehow still selected.
  const addOnTotal = addOns.value.reduce((sum, id) => sum + (isInBundle(id) ? 0 : (PRICING.find(p => p.id === id)?.price ?? 0)), 0)
  return basePrice + addOnTotal
})

async function buyAndDeploy() {
  checkoutError.value = null
  if (!form.archetype) { checkoutError.value = 'Pick an archetype first.'; return }
  if (!owner.email) { checkoutError.value = 'Enter your email so we can deliver your site.'; return }
  if (!agreedToTerms.value) { checkoutError.value = 'Please agree to the Terms of Service and Privacy Policy to continue.'; return }
  checkoutBusy.value = true
  try {
    const wizardPayload = JSON.parse(JSON.stringify(form))
    const res = await contentClient.createOrder({
      archetype: form.archetype as 'mesa' | 'hearth' | 'vault' | 'marquee' | 'keystone',
      plan: plan.value,
      addOns: addOns.value,
      wizardPayload,
      owner: { email: owner.email, name: owner.name || undefined },
    })
    if (res.checkoutUrl) window.location.href = res.checkoutUrl
    else checkoutError.value = 'Order created but no checkout URL was returned. Check Stripe configuration.'
  } catch (e) {
    checkoutError.value = e instanceof Error ? e.message : String(e)
  } finally {
    checkoutBusy.value = false
  }
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
  if (isKeystone.value) return [
    ...base,
    { slot: 'storefront.jpg',  label: 'Shop / Yard', desc: 'Your shop, yard, or job site exterior. Daylight, clear branding on the building or truck.' },
    { slot: 'gallery-01.jpg',  label: 'Work 1',     desc: 'A finished project or active job site. Wide shot.' },
    { slot: 'gallery-02.jpg',  label: 'Work 2',     desc: 'Equipment, fabrication, or detail of craft.' },
    { slot: 'gallery-03.jpg',  label: 'Work 3',     desc: 'Before/after or process shot.' },
    { slot: 'gallery-04.jpg',  label: 'Work 4',     desc: 'Crew at work, safety gear visible.' },
    { slot: 'gallery-05.jpg',  label: 'Work 5',     desc: 'Tools or materials staged.' },
    { slot: 'gallery-06.jpg',  label: 'Work 6',     desc: 'Hero project or signature build.' },
  ]
  return base
})
</script>

<template>
  <section class="wiz">
    <!-- ── Header — the shared subpage hero, so the wizard wears whatever
         subhero style the theme picker selects (compact / banner / centered /
         broadsheet / split), same as every other subpage. ── -->
    <HeroSection
      subpage
      eyebrow="Site setup wizard"
      title="Build your site."
      subtitle="Answer the questions below — progress saves automatically, so come back any time. The last step launches your site."
      image="/showcase/hero.jpg"
    />

    <div class="ap-container wiz__body-wrap">

      <!-- ── Toolbar: step meta + reset ──────────────────────────────────── -->
      <div class="wiz__toolbar">
        <span class="wiz__toolbar-step">Step {{ step + 1 }} of {{ STEPS.length }} · {{ STEPS[step]?.label }}</span>
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
              <span class="wiz__arch-icon"><UtensilsCrossed :size="28" :stroke-width="1.5" /></span>
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
              <span class="wiz__arch-icon"><BedDouble :size="28" :stroke-width="1.5" /></span>
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
              <span class="wiz__arch-icon"><ShoppingBag :size="28" :stroke-width="1.5" /></span>
              <strong>Vault</strong>
              <span>Shop — retail, boutique, market, maker</span>
              <span class="wiz__arch-sections">Products · Categories · Gallery · Story · Testimonials</span>
            </button>
            <button
              type="button"
              class="wiz__arch-card"
              :class="{ 'is-active': form.archetype === 'marquee' }"
              @click="form.archetype = 'marquee'"
            >
              <span class="wiz__arch-icon"><Theater :size="28" :stroke-width="1.5" /></span>
              <strong>Marquee</strong>
              <span>Venue — theater, gallery, music hall, event space</span>
              <span class="wiz__arch-sections">Events · Tickets · Venue info · Story · Testimonials</span>
            </button>
            <button
              type="button"
              class="wiz__arch-card"
              :class="{ 'is-active': form.archetype === 'keystone' }"
              @click="form.archetype = 'keystone'"
            >
              <span class="wiz__arch-icon"><Wrench :size="28" :stroke-width="1.5" /></span>
              <strong>Keystone</strong>
              <span>Utility — auto, contractor, welder, mill, field crew</span>
              <span class="wiz__arch-sections">Services · Capabilities · Hours · Story · Testimonials</span>
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
              <div class="wiz__input-ai">
                <input v-model="form.tagline" type="text" class="wiz__input" placeholder="e.g. Wood-fired kitchen" />
                <button type="button" class="wiz__ai-btn" :class="{ 'is-loading': aiLoading['tagline'] }" :disabled="!form.archetype || !form.brand || aiLoading['tagline']" @click="aiSuggest('tagline', t => form.tagline = t)" title="AI suggest"><Sparkles :size="13" /><span>Suggest</span></button>
              </div>
              <span class="wiz__hint">Short — 3 to 6 words. Shows under the name in the header.</span>
            </label>
            <label class="wiz__field wiz__field--full">
              <span class="wiz__label">One-sentence description</span>
              <div class="wiz__input-ai wiz__input-ai--textarea">
                <textarea v-model="form.blurb" class="wiz__input wiz__textarea" rows="2" placeholder="e.g. A neighborhood kitchen serving Southern Colorado classics with a wood-fired heart." />
                <button type="button" class="wiz__ai-btn" :class="{ 'is-loading': aiLoading['blurb'] }" :disabled="!form.archetype || !form.brand || aiLoading['blurb']" @click="aiSuggest('blurb', t => form.blurb = t)" title="AI suggest"><Sparkles :size="13" /><span>Suggest</span></button>
              </div>
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
                  <span v-if="t === 'ironwood'">Industrial · Condensed · Spec-sheet contrast</span>
                </button>
              </div>
            </div>
            <div class="wiz__field wiz__field--full">
              <p class="wiz__label">Color swatch</p>
              <div class="wiz__swatch-groups">
                <div v-for="group in SWATCH_GROUPS" :key="group.label" class="wiz__swatch-group">
                  <p class="wiz__swatch-group-label">{{ group.label }}</p>
                  <p class="wiz__swatch-group-psy">{{ group.psychology }}</p>
                  <div class="wiz__swatch-row">
                    <button
                      v-for="s in group.swatches" :key="s"
                      type="button" class="wiz__swatch"
                      :class="{ 'is-active': form.swatch === s }"
                      @click="form.swatch = s"
                      :title="swatchOf(s).label + ' · ' + swatchOf(s).mode"
                    >
                      <span class="wiz__swatch-dot" :style="{ background: swatchOf(s).primary }" aria-hidden="true" />
                      <span class="wiz__swatch-label">{{ s }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- ── Interactive site preview ─────────────────────────────── -->
            <div class="wiz__field wiz__field--full">
              <p class="wiz__label">Live preview</p>
              <div
                class="wiz__preview"
                :data-theme="form.theme"
                :style="{
                  '--pv-primary':     swatchOf(form.swatch).primary,
                  '--pv-accent':      swatchOf(form.swatch).accent,
                  '--pv-surface':     swatchOf(form.swatch).surface,
                  '--pv-surface-alt': swatchOf(form.swatch).surfaceAlt,
                  '--pv-ink':         swatchOf(form.swatch).ink,
                  '--pv-ink-muted':   swatchOf(form.swatch).inkMuted,
                  '--pv-line':        swatchOf(form.swatch).line,
                }"
              >
                <div class="wiz__preview-bar" aria-hidden="true">
                  <span /><span /><span />
                  <span class="wiz__preview-url">{{ (form.brand || 'yoursite').toLowerCase().replace(/\s+/g, '') }}.com</span>
                </div>
                <div class="wiz__preview-frame">
                  <header class="wiz__preview-header">
                    <span class="wiz__preview-brand">{{ form.brand || 'Your Brand' }}</span>
                    <nav class="wiz__preview-nav">
                      <span>Home</span><span>About</span><span>Contact</span>
                    </nav>
                    <span class="wiz__preview-cta wiz__preview-cta--sm">Get a quote</span>
                  </header>
                  <section class="wiz__preview-hero">
                    <span class="wiz__preview-eyebrow">{{ form.tagline || 'Tagline goes here' }}</span>
                    <h3 class="wiz__preview-title">{{ form.brand || 'A real headline.' }}</h3>
                    <p class="wiz__preview-sub">{{ form.blurb || 'A short sentence about what this business does and why it matters.' }}</p>
                    <div class="wiz__preview-ctas">
                      <span class="wiz__preview-cta">Primary action</span>
                      <span class="wiz__preview-cta wiz__preview-cta--ghost">Secondary</span>
                    </div>
                  </section>
                  <section class="wiz__preview-cards">
                    <div v-for="i in 3" :key="i" class="wiz__preview-card">
                      <span class="wiz__preview-card-dot" />
                      <span class="wiz__preview-card-line wiz__preview-card-line--lg" />
                      <span class="wiz__preview-card-line" />
                      <span class="wiz__preview-card-line wiz__preview-card-line--short" />
                    </div>
                  </section>
                  <footer class="wiz__preview-footer">
                    <span>© {{ form.brand || 'Your Brand' }}</span>
                    <span class="wiz__preview-footer-accent">·</span>
                    <span>Trinidad, CO</span>
                  </footer>
                </div>
                <div class="wiz__preview-legend">
                  <div v-for="c in [
                    { key: 'primary', label: 'Primary', val: swatchOf(form.swatch).primary },
                    { key: 'accent', label: 'Accent', val: swatchOf(form.swatch).accent },
                    { key: 'surface', label: 'Surface', val: swatchOf(form.swatch).surface },
                    { key: 'surface-alt', label: 'Surface Alt', val: swatchOf(form.swatch).surfaceAlt },
                    { key: 'ink', label: 'Ink', val: swatchOf(form.swatch).ink },
                    { key: 'ink-muted', label: 'Ink Muted', val: swatchOf(form.swatch).inkMuted },
                    { key: 'line', label: 'Line', val: swatchOf(form.swatch).line },
                  ]" :key="c.key" class="wiz__preview-legend-row">
                    <span class="wiz__preview-legend-swatch" :style="{ background: c.val }" />
                    <span class="wiz__preview-legend-label">{{ c.label }}</span>
                    <code class="wiz__preview-legend-hex">{{ c.val }}</code>
                  </div>
                </div>
              </div>
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
                  <span v-if="v === 'extended'">20-28 gallery photos · Maximum content depth</span>
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
          <template v-if="isMarquee">
            <h3 class="wiz__sub">Ticketing</h3>
            <label class="wiz__field wiz__field--full">
              <span class="wiz__label">External ticketing URL <em>(optional)</em></span>
              <input v-model="form.ticketingUrl" type="url" class="wiz__input" placeholder="https://your-ticketing-partner.com" />
              <span class="wiz__hint">Leave empty to use the built-in ticketing system (premium add-on) — tickets sell directly on your site.</span>
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
          <p class="wiz__step-desc">You'll need {{ form.variant === 'extended' ? '20–28' : form.variant === 'portfolio' ? '12–16' : '6–8' }} gallery photos. Fill in alt text for each.</p>
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
              <div class="wiz__input-ai">
                <input v-model="form.storyTitle" type="text" class="wiz__input" placeholder="e.g. A table built for Trinidad." />
                <button type="button" class="wiz__ai-btn" :class="{ 'is-loading': aiLoading['storyTitle'] }" :disabled="!form.archetype || !form.brand || aiLoading['storyTitle']" @click="aiSuggest('storyTitle', t => form.storyTitle = t, { hint: 'short headline for the About section' })" title="AI suggest"><Sparkles :size="13" /><span>Suggest</span></button>
              </div>
            </label>
            <div v-for="(_, i) in form.storyParagraphs" :key="i" class="wiz__field wiz__field--full">
              <span class="wiz__label">Paragraph {{ i + 1 }}</span>
              <div class="wiz__input-ai wiz__input-ai--textarea">
                <textarea v-model="form.storyParagraphs[i]" class="wiz__input wiz__textarea" rows="3" placeholder="2–4 sentences. Write naturally, like you're telling a friend." />
                <button type="button" class="wiz__ai-btn" :class="{ 'is-loading': aiLoading[`storyParagraph-${i}`] }" :disabled="!form.archetype || !form.brand || aiLoading[`storyParagraph-${i}`]" @click="aiSuggest('storyParagraph', t => form.storyParagraphs[i] = t, { existing: form.storyParagraphs.slice(0, i).join(' | ') })" title="AI suggest"><Sparkles :size="13" /><span>Suggest</span></button>
              </div>
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

          <div v-if="!form.archetype" class="wiz__empty">
            <p class="wiz__empty-msg">Choose a project type first — the content fields here depend on your archetype.</p>
            <button type="button" class="ap-btn ap-btn--ghost" @click="goTo(0)">← Choose project type</button>
          </div>

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
                <div class="wiz__input-ai">
                  <input v-model="item.description" type="text" class="wiz__input" placeholder="Description (optional)" />
                  <button type="button" class="wiz__ai-btn" :class="{ 'is-loading': aiLoading[`menuitem-${ci}-${ii}`] }" :disabled="!form.archetype || !form.brand || !item.name || aiLoading[`menuitem-${ci}-${ii}`]" @click="aiSuggest('menuItem.description', t => item.description = t, { item: item.name, category: cat.name })" title="AI suggest"><Sparkles :size="13" /><span>Suggest</span></button>
                </div>
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
                  <div class="wiz__input-ai">
                    <input v-model="room.blurb" type="text" class="wiz__input" placeholder="One sentence about this room." />
                    <button type="button" class="wiz__ai-btn" :class="{ 'is-loading': aiLoading[`room-blurb-${i}`] }" :disabled="!form.archetype || !form.brand || !room.name || aiLoading[`room-blurb-${i}`]" @click="aiSuggest('room.blurb', t => room.blurb = t, { room: room.name, features: room.features, rate: room.rateFrom })" title="AI suggest"><Sparkles :size="13" /><span>Suggest</span></button>
                  </div>
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
              <IconPickerInput v-model="a.icon" />
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
                  <div class="wiz__input-ai">
                    <input v-model="p.blurb" type="text" class="wiz__input" placeholder="Hand-thrown stoneware" />
                    <button type="button" class="wiz__ai-btn" :class="{ 'is-loading': aiLoading[`product-blurb-${i}`] }" :disabled="!form.archetype || !form.brand || !p.name || aiLoading[`product-blurb-${i}`]" @click="aiSuggest('product.blurb', t => p.blurb = t, { product: p.name, price: p.price })" title="AI suggest"><Sparkles :size="13" /><span>Suggest</span></button>
                  </div>
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

          <!-- MARQUEE: Events & Venue ────────────────────────────────── -->
          <template v-if="isMarquee">
            <h2 class="wiz__step-title">Events &amp; venue</h2>
            <p class="wiz__step-desc">Your upcoming events — these fill the calendar and homepage. You can manage them any time from your site's admin.</p>

            <div v-for="(e, i) in form.events" :key="i" class="wiz__card-block">
              <h3 class="wiz__sub">Event {{ i + 1 }}</h3>
              <div class="wiz__fields">
                <label class="wiz__field">
                  <span class="wiz__label">Title</span>
                  <input v-model="e.title" type="text" class="wiz__input" placeholder="e.g. Friday Night Live" />
                </label>
                <label class="wiz__field">
                  <span class="wiz__label">Date</span>
                  <input v-model="e.date" type="date" class="wiz__input" />
                </label>
                <label class="wiz__field">
                  <span class="wiz__label">Start time</span>
                  <input v-model="e.startTime" type="text" class="wiz__input" placeholder="7:30 PM" />
                </label>
                <label class="wiz__field">
                  <span class="wiz__label">Category <em>(optional)</em></span>
                  <input v-model="e.category" type="text" class="wiz__input" placeholder="Music · Comedy · Gallery" />
                </label>
                <label class="wiz__field">
                  <span class="wiz__label">Price label <em>(optional)</em></span>
                  <input v-model="e.priceLabel" type="text" class="wiz__input" placeholder="$25 · Free · From $15" />
                </label>
                <label class="wiz__field">
                  <span class="wiz__label">Image filename</span>
                  <input v-model="e.image" type="text" class="wiz__input" :placeholder="`/photos/event-${i + 1}.jpg`" />
                </label>
                <label class="wiz__field wiz__field--full">
                  <span class="wiz__label">Short description</span>
                  <div class="wiz__input-ai">
                    <input v-model="e.blurb" type="text" class="wiz__input" placeholder="One line that sells the night." />
                    <button type="button" class="wiz__ai-btn" :class="{ 'is-loading': aiLoading[`event-blurb-${i}`] }" :disabled="!form.archetype || !form.brand || !e.title || aiLoading[`event-blurb-${i}`]" @click="aiSuggest('event.blurb', t => e.blurb = t, { event: e.title, category: e.category })" title="AI suggest"><Sparkles :size="13" /><span>Suggest</span></button>
                  </div>
                </label>
              </div>
            </div>
            <button type="button" class="wiz__add wiz__add--lg" @click="form.events.push({ title: '', date: '', startTime: '', category: '', priceLabel: '', blurb: '', image: `/photos/event-${form.events.length + 1}.jpg` })">
              + Add event
            </button>

            <h3 class="wiz__sub" style="margin-top:2.5rem">Venue facts <em>(optional)</em></h3>
            <p class="wiz__step-desc">Shown on the Visit page — capacity, parking, and door policy.</p>
            <div class="wiz__fields">
              <label class="wiz__field">
                <span class="wiz__label">Capacity</span>
                <input v-model="form.venueCapacity" type="text" class="wiz__input" placeholder="e.g. 180 standing · 120 seated" />
              </label>
              <label class="wiz__field">
                <span class="wiz__label">Parking</span>
                <input v-model="form.venueParking" type="text" class="wiz__input" placeholder="e.g. Free street parking after 6" />
              </label>
              <label class="wiz__field">
                <span class="wiz__label">Age restrictions</span>
                <input v-model="form.venueAgeRestrictions" type="text" class="wiz__input" placeholder="e.g. All ages until 9 PM" />
              </label>
            </div>
          </template>

          <!-- KEYSTONE: Services & Capabilities ──────────────────────── -->
          <template v-if="isKeystone">
            <h2 class="wiz__step-title">Services &amp; capabilities</h2>
            <p class="wiz__step-desc">List what you do and key facts about your operation. These populate the services grid and stats bar on your site.</p>

            <h3 class="wiz__sub">Services</h3>
            <div v-for="(s, i) in form.services" :key="i" class="wiz__card-block">
              <div class="wiz__fields">
                <label class="wiz__field">
                  <span class="wiz__label">Service name</span>
                  <input v-model="s.name" type="text" class="wiz__input" placeholder="e.g. Electrical Repair" />
                </label>
                <label class="wiz__field">
                  <span class="wiz__label">Price / rate <em>(optional)</em></span>
                  <input v-model="s.price" type="text" class="wiz__input" placeholder="Starting at $95" />
                </label>
                <label class="wiz__field">
                  <span class="wiz__label">Icon</span>
                  <IconPickerInput v-model="s.icon" />
                </label>
                <label class="wiz__field wiz__field--full">
                  <span class="wiz__label">Short description</span>
                  <div class="wiz__input-ai">
                    <input v-model="s.description" type="text" class="wiz__input" placeholder="One sentence describing this service." />
                    <button type="button" class="wiz__ai-btn" :class="{ 'is-loading': aiLoading[`service-desc-${i}`] }" :disabled="!form.archetype || !form.brand || !s.name || aiLoading[`service-desc-${i}`]" @click="aiSuggest('service.description', t => s.description = t, { service: s.name, price: s.price })" title="AI suggest"><Sparkles :size="13" /><span>Suggest</span></button>
                  </div>
                </label>
              </div>
            </div>
            <button type="button" class="wiz__add wiz__add--lg" @click="form.services.push({ name: '', description: '', price: '', icon: '🔧' })">
              + Add service
            </button>

            <h3 class="wiz__sub" style="margin-top:2.5rem">Key capabilities / stats</h3>
            <p class="wiz__step-desc">Short facts shown in the trust bar (e.g. "15 years in business", "Licensed &amp; insured").</p>
            <div v-for="(c, i) in form.capabilities" :key="i" class="wiz__row-pair">
              <input v-model="c.label" type="text" class="wiz__input wiz__input--sm" placeholder="Label (e.g. Years in business)" />
              <input v-model="c.value" type="text" class="wiz__input" placeholder="Value (e.g. 15+)" />
            </div>
            <button type="button" class="wiz__add" @click="form.capabilities.push({ label: '', value: '' })">+ Add capability</button>
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

        <!-- STEP 9: Launch ──────────────────────────────────────────────── -->
        <div v-if="step === 9" class="wiz__step">
          <h2 class="wiz__step-title wiz__step-title--launch">
            <span class="wiz__launch-icon"><Rocket :size="22" :stroke-width="1.8" /></span>
            Launch your site
          </h2>
          <p class="wiz__step-desc">
            Everything you've entered is packed and ready. Pick a package and we'll
            take it from here — your site goes live in minutes, not weeks.
          </p>

          <!-- Launch flow: only when the platform switch is on. -->
          <div v-if="PLATFORM_ENABLED" class="wiz__buy">
            <h3 class="wiz__sub">Choose your launch package</h3>
            <p class="wiz__step-desc">
                Add any extras, enter your email, and pay. We provision your site
                within minutes and email you a sign-in link the moment it's live.
              </p>

              <!-- Bundle selection -->
              <div class="wiz__plans">
                <label
                  v-for="b in CHECKOUT_BUNDLES"
                  :key="b.id"
                  class="wiz__plan"
                  :class="{ 'wiz__plan--active': plan === b.id }"
                >
                  <input type="radio" :value="b.id" v-model="plan" class="wiz__plan-radio" />
                  <div class="wiz__plan-body">
                    <div class="wiz__plan-header">
                      <span class="wiz__plan-name">{{ b.name }}</span>
                      <span class="wiz__plan-price">${{ b.price }}</span>
                    </div>
                    <p class="wiz__plan-blurb">{{ b.blurb }}</p>
                    <ul class="wiz__plan-includes">
                      <li v-for="item in b.items" :key="item">{{ item }}</li>
                    </ul>
                  </div>
                </label>
              </div>

              <!-- Individual website services -->
              <div class="wiz__addons-section">
                <h4 class="wiz__addons-title">Or choose a website service individually</h4>
                <div class="wiz__plans wiz__plans--sm">
                  <label
                    v-for="w in CHECKOUT_WEBSITE_ITEMS"
                    :key="w.id"
                    class="wiz__plan"
                    :class="{ 'wiz__plan--active': plan === w.id }"
                  >
                    <input type="radio" :value="w.id" v-model="plan" class="wiz__plan-radio" />
                    <div class="wiz__plan-body">
                      <div class="wiz__plan-header">
                        <span class="wiz__plan-name">{{ w.name }}</span>
                        <span class="wiz__plan-price">${{ w.price }}<span v-if="w.unit" class="wiz__plan-unit"> {{ w.unit }}</span></span>
                      </div>
                      <p class="wiz__plan-blurb">{{ w.blurb }}</p>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Photography & marketing -->
              <div class="wiz__addons-section">
                <h4 class="wiz__addons-title">Photography &amp; marketing</h4>
                <div class="wiz__addons">
                  <label
                    v-for="a in CHECKOUT_MARKETING"
                    :key="a.id"
                    class="wiz__addon"
                    :class="{ 'wiz__addon--checked': addOns.includes(a.id) && !isInBundle(a.id), 'wiz__addon--included': isInBundle(a.id) }"
                  >
                    <input type="checkbox" :value="a.id" v-model="addOns" :disabled="isInBundle(a.id)" />
                    <div class="wiz__addon-body">
                      <span class="wiz__addon-name">{{ a.name }}</span>
                      <span v-if="isInBundle(a.id)" class="wiz__addon-included">In bundle</span>
                      <span v-else class="wiz__addon-price">+${{ a.price }}</span>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Technical add-ons -->
              <div class="wiz__addons-section">
                <h4 class="wiz__addons-title">Technical add-ons</h4>
                <div class="wiz__addons">
                  <label
                    v-for="a in CHECKOUT_ADDONS"
                    :key="a.id"
                    class="wiz__addon"
                    :class="{ 'wiz__addon--checked': addOns.includes(a.id) && !isInBundle(a.id), 'wiz__addon--included': isInBundle(a.id) }"
                  >
                    <input type="checkbox" :value="a.id" v-model="addOns" :disabled="isInBundle(a.id)" />
                    <div class="wiz__addon-body">
                      <span class="wiz__addon-name">{{ a.name }}</span>
                      <span v-if="isInBundle(a.id)" class="wiz__addon-included">In bundle</span>
                      <span v-else class="wiz__addon-price">+${{ a.price }}</span>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Owner info -->
              <div class="wiz__fields wiz__buy-fields">
                <label class="wiz__field">
                  <span class="wiz__label">Your email</span>
                  <input v-model="owner.email" type="email" required placeholder="you@example.com" class="wiz__input" />
                </label>
                <label class="wiz__field">
                  <span class="wiz__label">Your name <em>(optional)</em></span>
                  <input v-model="owner.name" type="text" class="wiz__input" />
                </label>
              </div>

              <!-- Terms + Privacy agreement (required before payment) -->
              <label class="wiz__agree">
                <input type="checkbox" v-model="agreedToTerms" class="wiz__agree-check" />
                <span>
                  I agree to the
                  <RouterLink to="/terms" target="_blank" rel="noopener">Terms of Service</RouterLink>
                  and
                  <RouterLink to="/privacy" target="_blank" rel="noopener">Privacy Policy</RouterLink>.
                </span>
              </label>

              <!-- Launch bar -->
              <div class="wiz__launch-bar">
                <div class="wiz__total">
                  <span class="wiz__total-label">Due today</span>
                  <strong>${{ checkoutTotal }}</strong>
                </div>
                <button type="button" class="ap-btn wiz__launch-btn" :disabled="checkoutBusy || !agreedToTerms" @click="buyAndDeploy">
                  <Rocket :size="16" />
                  {{ checkoutBusy ? 'Redirecting…' : 'Launch my site' }}
                </button>
                <span class="wiz__launch-note">Secure checkout · live in minutes · you own everything</span>
              </div>
              <p v-if="checkoutError" class="wiz__err">{{ checkoutError }}</p>
            </div><!-- /wiz__buy -->
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
      </div>

    </div>
  </section>
</template>



<style scoped>
/* ── Google Fonts for preview ────────────────────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&family=Inter:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Lora:wght@400;500;600&family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Oswald:wght@500;600;700&family=Roboto:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

/* ── Layout ──────────────────────────────────────────────────────────────── */
.wiz { padding: 0 0 clamp(3rem, 8vw, 7rem); }
.wiz__body-wrap { margin-top: clamp(1.5rem, 3vw, 2.5rem); }
.wiz__toolbar {
  display: flex; align-items: baseline; justify-content: space-between;
  gap: 1rem; flex-wrap: wrap;
  margin-bottom: 0.9rem;
}
.wiz__toolbar-step {
  font-family: var(--ap-font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ap-ink-muted);
}
.wiz__clear {
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
.wiz__tab.is-done .wiz__tab-num { background: var(--ap-primary); color: var(--ap-surface); }
.wiz__tab.is-active {
  background: var(--ap-ink); border-color: var(--ap-ink); color: var(--ap-surface);
}
.wiz__tab-num {
  font-variant-numeric: tabular-nums;
  width: 1.4em; height: 1.4em; display: flex; align-items: center; justify-content: center;
  border-radius: 50%;
  background: var(--ap-ink-muted); color: var(--ap-surface);
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

/* ── Launch step ──────────────────────────────────────────────────────────── */
.wiz__step-title--launch { display: flex; align-items: center; gap: 0.7rem; }
.wiz__launch-icon {
  width: 44px; height: 44px;
  display: inline-grid; place-items: center;
  border-radius: 50%;
  background: color-mix(in srgb, var(--ap-primary) 14%, transparent);
  color: var(--ap-primary);
  flex-shrink: 0;
}
.wiz__agree {
  display: flex; align-items: flex-start; gap: 0.6rem;
  margin: 0 0 1rem;
  font-size: 0.9rem; line-height: 1.5; color: var(--ap-ink);
  cursor: pointer;
}
.wiz__agree-check { margin-top: 0.2rem; width: 1.05rem; height: 1.05rem; flex-shrink: 0; accent-color: var(--ap-primary); cursor: pointer; }
.wiz__agree a { color: var(--ap-primary); text-decoration: underline; }
.wiz__launch-bar {
  display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap;
  padding: 1rem 1.25rem;
  background: var(--ap-ink);
  border-radius: var(--ap-radius-lg);
  color: var(--ap-surface);
}
.wiz__launch-btn:disabled { opacity: 0.55; cursor: not-allowed; }
.wiz__total { display: flex; flex-direction: column; line-height: 1.15; }
.wiz__total-label {
  font-size: 0.62rem; font-weight: 700;
  letter-spacing: 0.2em; text-transform: uppercase;
  color: color-mix(in srgb, var(--ap-surface) 55%, transparent);
}
.wiz__total strong {
  font-family: var(--ap-font-heading);
  font-size: 1.9rem; font-weight: 700;
  color: var(--ap-surface);
}
.wiz__launch-btn { display: inline-flex; align-items: center; gap: 0.5rem; }
.wiz__launch-note {
  font-size: 0.74rem;
  color: color-mix(in srgb, var(--ap-surface) 55%, transparent);
  margin-left: auto;
}
.wiz__selfhost {
  margin-top: 1.75rem;
  border: 1px dashed var(--ap-line);
  border-radius: var(--ap-radius-lg);
  padding: 0 1.25rem;
}
.wiz__selfhost > summary {
  cursor: pointer;
  padding: 1rem 0;
  font-weight: 600;
  color: var(--ap-ink-muted);
  list-style: none;
  display: flex; align-items: center; gap: 0.5rem;
}
.wiz__selfhost > summary::-webkit-details-marker { display: none; }
.wiz__selfhost > summary::before { content: '›'; transition: transform 160ms ease; color: var(--ap-primary); font-size: 1.1rem; }
.wiz__selfhost[open] > summary::before { transform: rotate(90deg); }
.wiz__selfhost[open] { padding-bottom: 1.25rem; }
.wiz__selfhost > summary:hover { color: var(--ap-ink); }

/* ── Buy & deploy ─────────────────────────────────────────────────────────── */
.wiz__buy {
  background: var(--ap-surface);
  border: 1px solid var(--ap-line);
  border-radius: var(--ap-radius-lg);
  padding: 2rem;
  margin-bottom: 0.5rem;
}

/* Plans grid */
.wiz__plans {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 0.85rem;
  margin-bottom: 1.5rem;
}
.wiz__plan {
  position: relative;
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.1rem;
  background: var(--ap-surface-alt);
  border: 2px solid var(--ap-line);
  border-radius: var(--ap-radius);
  cursor: pointer;
  transition: border-color 0.12s, box-shadow 0.12s;
}
.wiz__plan:hover { border-color: var(--ap-primary); }
.wiz__plan--active {
  border-color: var(--ap-primary);
  background: color-mix(in srgb, var(--ap-primary) 6%, var(--ap-surface));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ap-primary) 15%, transparent);
}
.wiz__plan-radio { margin-top: 2px; flex-shrink: 0; accent-color: var(--ap-primary); }
.wiz__plan-body { display: flex; flex-direction: column; gap: 0.35rem; flex: 1; }
.wiz__plan-header { display: flex; align-items: baseline; justify-content: space-between; gap: 0.5rem; }
.wiz__plan-name { font-weight: 700; font-size: 0.95rem; color: var(--ap-ink); }
.wiz__plan-price {
  font-family: var(--ap-font-heading);
  font-weight: 700; font-size: 1.35rem;
  letter-spacing: -0.02em;
  color: var(--ap-primary);
  white-space: nowrap;
}
.wiz__plan-blurb { font-size: 0.82rem; color: var(--ap-ink-muted); line-height: 1.4; margin: 0; }
.wiz__plan-includes {
  list-style: none; margin: 0.35rem 0 0; padding: 0;
  display: flex; flex-direction: column; gap: 0.2rem;
}
.wiz__plan-includes li {
  font-size: 0.78rem; color: var(--ap-ink-muted);
  padding-left: 1.1em;
  position: relative;
}
.wiz__plan-includes li::before {
  content: '✓';
  position: absolute; left: 0;
  color: var(--ap-primary); font-size: 0.72em; top: 0.1em;
}

/* Add-ons */
.wiz__addons-section { margin-bottom: 1.5rem; }
.wiz__addons-title { font-size: 0.82rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: var(--ap-ink-muted); margin: 0 0 0.65rem; }
.wiz__addons { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.wiz__addon {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.5rem 0.85rem;
  background: var(--ap-surface-alt);
  border: 1.5px solid var(--ap-line);
  border-radius: 999px;
  cursor: pointer;
  transition: border-color 0.12s;
  font-size: 0.85rem;
}
.wiz__addon:hover { border-color: var(--ap-primary); }
.wiz__addon--checked { border-color: var(--ap-primary); background: color-mix(in srgb, var(--ap-primary) 8%, var(--ap-surface)); }
.wiz__addon input { accent-color: var(--ap-primary); }
.wiz__addon-body { display: flex; align-items: center; gap: 0.5rem; }
.wiz__addon-name { font-weight: 500; color: var(--ap-ink); }
.wiz__addon-price { font-size: 0.8rem; color: var(--ap-ink-muted); }
/* Already covered by the selected bundle — grayed, not chargeable, not clickable. */
.wiz__addon--included {
  opacity: 0.55;
  cursor: not-allowed;
  background: var(--ap-surface-alt);
  border-style: dashed;
}
.wiz__addon--included:hover { border-color: var(--ap-line); }
.wiz__addon--included input { cursor: not-allowed; }
.wiz__addon-included {
  font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--ap-primary);
  padding: 0.12rem 0.45rem;
  border: 1px solid color-mix(in srgb, var(--ap-primary) 40%, transparent);
  border-radius: 999px;
  white-space: nowrap;
}

/* Owner fields — reuse existing wiz__fields grid */
.wiz__buy-fields { margin-bottom: 1.5rem; }

/* Error */
.wiz__err { color: #c0392b; font-size: 0.85rem; margin-top: 0.75rem; }

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

/* ── AI suggest ──────────────────────────────────────────────────────────── */
.wiz__input-ai {
  display: flex; align-items: center; gap: 0.45rem;
  width: 100%;
}
.wiz__input-ai .wiz__input { flex: 1; }
.wiz__input-ai--textarea { align-items: flex-start; }
.wiz__input-ai--textarea .wiz__input { resize: vertical; }
.wiz__input-ai--textarea .wiz__ai-btn { margin-top: 0.15rem; }
.wiz__ai-btn {
  flex-shrink: 0;
  display: inline-flex; align-items: center; gap: 0.3rem;
  padding: 0.35rem 0.7rem;
  border: none; border-radius: 99px;
  background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
  color: #fff;
  font-size: 0.75rem; font-weight: 600; white-space: nowrap;
  cursor: pointer;
  position: relative; overflow: hidden;
  transition: filter 140ms, opacity 140ms;
}
.wiz__ai-btn:hover:not(:disabled) { filter: brightness(1.12); }
.wiz__ai-btn:disabled { opacity: 0.4; cursor: not-allowed; }

@keyframes wiz-ai-spin { to { transform: rotate(360deg); } }
.wiz__ai-btn.is-loading { pointer-events: none; }
.wiz__ai-btn.is-loading > * { visibility: hidden; }
.wiz__ai-btn.is-loading::after {
  content: ''; position: absolute; inset: 0; margin: auto;
  width: 13px; height: 13px;
  border: 2px solid rgba(255,255,255,0.5);
  border-top-color: #fff;
  border-radius: 50%;
  animation: wiz-ai-spin 0.7s linear infinite;
}
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
.wiz__arch-icon { display: inline-flex; align-items: center; justify-content: center; color: var(--ap-ink); }
.wiz__arch-card.is-active .wiz__arch-icon { color: var(--ap-primary); }

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

/* ── Swatch picker (colored dot + label) ─────────────────────────────────── */
.wiz__swatch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.wiz__swatch {
  display: flex; align-items: center; gap: 0.55rem;
  background: var(--ap-surface); border: 1.5px solid var(--ap-line);
  border-radius: var(--ap-radius);
  padding: 0.45rem 0.7rem;
  cursor: pointer; text-align: left;
  font: inherit;
  transition: border-color 0.12s, background 0.12s;
}
.wiz__swatch:hover { border-color: var(--ap-ink-muted); }
.wiz__swatch.is-active {
  border-color: var(--ap-primary);
  background: color-mix(in srgb, var(--ap-primary) 8%, var(--ap-surface));
}
.wiz__swatch-dot {
  width: 18px; height: 18px; border-radius: 50%;
  border: 1px solid color-mix(in srgb, var(--ap-ink) 18%, transparent);
  flex-shrink: 0;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.18);
}
.wiz__swatch-label {
  font-size: 0.82rem; font-weight: 500;
  text-transform: capitalize;
  color: var(--ap-ink);
}

/* ── Grouped swatches ─────────────────────────────────────────────────────── */
.wiz__swatch-groups { display: flex; flex-direction: column; gap: 1rem; margin-top: 0.5rem; }
.wiz__swatch-group-label {
  font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.1em; color: var(--ap-ink-muted);
  margin: 0 0 0.1rem;
}
.wiz__swatch-group-psy {
  font-size: 0.74rem; color: var(--ap-ink-muted);
  margin: 0 0 0.45rem; max-width: 64ch; line-height: 1.4;
}
.wiz__swatch-row { display: flex; flex-wrap: wrap; gap: 0.4rem; }

/* ── Step empty state ─────────────────────────────────────────────────────── */
.wiz__empty { display: flex; flex-direction: column; align-items: flex-start; gap: 1rem; padding: 2.5rem 0; }
.wiz__empty-msg { color: var(--ap-ink-muted); margin: 0; max-width: 44ch; }

/* ── Plan modifiers ───────────────────────────────────────────────────────── */
.wiz__plans--sm { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
.wiz__plan-unit { font-size: 0.75rem; font-weight: 400; color: var(--ap-ink-muted); }

/* ── Live site preview ────────────────────────────────────────────────────── */
.wiz__preview {
  margin-top: 0.5rem;
  border: 1px solid var(--ap-line);
  border-radius: var(--ap-radius-lg, 12px);
  overflow: hidden;
  background: var(--pv-surface);
  color: var(--pv-ink);
  /* Theme-driven look tweaks (default: studio) */
  font-family: ui-sans-serif, system-ui, sans-serif;
}
/* ── studio ──────────────────────────────────────────────────────────────── */
.wiz__preview[data-theme='studio'] .wiz__preview-title {
  font-family: "Inter Tight", "Inter", "Helvetica Neue", Arial, sans-serif;
  font-weight: 600;
  letter-spacing: -0.035em;
}
.wiz__preview[data-theme='studio'] .wiz__preview-eyebrow {
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--pv-ink-muted);
  border-top: 1px solid var(--pv-line);
  padding-top: 0.4rem;
  background: none;
  border-radius: 0;
  padding-inline: 0;
}
.wiz__preview[data-theme='studio'] .wiz__preview-cta {
  border-radius: 2px;
  font-weight: 500;
  letter-spacing: 0.01em;
}

/* ── heritage ────────────────────────────────────────────────────────────── */
.wiz__preview[data-theme='heritage'] {
  font-family: "Lora", Georgia, "Times New Roman", serif;
}
.wiz__preview[data-theme='heritage'] .wiz__preview-title {
  font-family: "Fraunces", "Cormorant Garamond", Georgia, serif;
  font-weight: 400;
  font-size: 1.65rem;
  letter-spacing: -0.01em;
}
.wiz__preview[data-theme='heritage'] .wiz__preview-eyebrow {
  font-family: "Fraunces", "Cormorant Garamond", Georgia, serif;
  font-style: italic;
  font-size: 1rem;
  color: var(--pv-primary);
  letter-spacing: 0;
  text-transform: none;
  background: none;
  border-radius: 0;
  padding: 0;
}
.wiz__preview[data-theme='heritage'] .wiz__preview-cta {
  border-radius: 0;
  border-width: 2px;
  font-weight: 500;
  letter-spacing: 0.04em;
  font-family: "Lora", Georgia, serif;
}

/* ── vibrant ─────────────────────────────────────────────────────────────── */
.wiz__preview[data-theme='vibrant'] {
  font-family: "Space Grotesk", "Inter", system-ui, sans-serif;
}
.wiz__preview[data-theme='vibrant'] .wiz__preview-title {
  font-family: "Bricolage Grotesque", "Space Grotesk", system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-size: 1.55rem;
}
.wiz__preview[data-theme='vibrant'] .wiz__preview-eyebrow {
  display: inline-block;
  background: var(--pv-ink);
  color: var(--pv-surface);
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.wiz__preview[data-theme='vibrant'] .wiz__preview-cta {
  border-radius: 999px;
  border-width: 2.5px;
  border-color: var(--pv-ink);
  font-weight: 800;
  letter-spacing: -0.01em;
  box-shadow: 4px 4px 0 var(--pv-ink);
  color: var(--pv-surface);
}
.wiz__preview[data-theme='vibrant'] .wiz__preview-cta--ghost {
  background: var(--pv-surface);
  color: var(--pv-ink);
  border-color: var(--pv-ink);
  box-shadow: 4px 4px 0 var(--pv-ink);
}

/* ── ironwood ────────────────────────────────────────────────────────────── */
.wiz__preview[data-theme='ironwood'] {
  font-family: "Roboto", "Helvetica Neue", Arial, sans-serif;
  letter-spacing: 0.005em;
}
.wiz__preview[data-theme='ironwood'] .wiz__preview-title {
  font-family: "Oswald", "Roboto Condensed", "Impact", Arial, sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 1.5rem;
}
.wiz__preview[data-theme='ironwood'] .wiz__preview-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: "JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--pv-ink);
  background: none;
  border-radius: 0;
  padding: 0;
}
.wiz__preview[data-theme='ironwood'] .wiz__preview-eyebrow::before {
  content: '';
  display: inline-block;
  width: 22px;
  height: 5px;
  background: var(--pv-accent);
  border: 1px solid var(--pv-ink);
  flex-shrink: 0;
}
.wiz__preview[data-theme='ironwood'] .wiz__preview-card,
.wiz__preview[data-theme='ironwood'] .wiz__preview-frame { border-radius: 0; }
.wiz__preview[data-theme='ironwood'] .wiz__preview-cta {
  border-radius: 0;
  border-width: 2px;
  border-color: var(--pv-ink);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-family: "Oswald", "Roboto Condensed", Arial, sans-serif;
  font-size: 0.75rem;
  box-shadow: none;
}

.wiz__preview-bar {
  display: flex; align-items: center; gap: 0.35rem;
  padding: 0.45rem 0.7rem;
  background: var(--pv-surface-alt);
  border-bottom: 1px solid var(--pv-line);
}
.wiz__preview-bar > span:not(.wiz__preview-url) {
  width: 9px; height: 9px; border-radius: 50%;
  background: color-mix(in srgb, var(--pv-ink) 22%, transparent);
}
.wiz__preview-url {
  margin-left: 0.6rem;
  font: 11px/1 ui-monospace, SFMono-Regular, Menlo, monospace !important;
  color: var(--pv-ink-muted);
  padding: 0.25rem 0.55rem;
  background: var(--pv-surface);
  border: 1px solid var(--pv-line);
  border-radius: 999px;
}
.wiz__preview-frame { padding: 0; }
.wiz__preview-header {
  display: flex; align-items: center; gap: 1rem;
  padding: 0.7rem 1rem;
  border-bottom: 1px solid var(--pv-line);
  background: var(--pv-surface);
}
.wiz__preview-brand {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--pv-ink);
}
.wiz__preview-nav {
  display: flex; gap: 0.85rem;
  font-size: 0.78rem;
  color: var(--pv-ink-muted);
}
.wiz__preview-header .wiz__preview-cta--sm { margin-left: auto; }
.wiz__preview-hero {
  padding: 1.5rem 1.25rem 1.6rem;
  background: var(--pv-surface-alt);
  border-bottom: 1px solid var(--pv-line);
  display: flex; flex-direction: column; gap: 0.45rem;
}
.wiz__preview-eyebrow {
  /* Base reset — each theme overrides font, color, transform */
  font-size: 0.72rem;
  font-weight: 600;
}
.wiz__preview-title {
  margin: 0;
  font-size: 1.4rem;
  line-height: 1.15;
  font-weight: 700;
  color: var(--pv-ink);
}
.wiz__preview-sub {
  margin: 0;
  font-size: 0.85rem;
  color: var(--pv-ink-muted);
  max-width: 50ch;
}
.wiz__preview-ctas {
  display: flex; gap: 0.5rem; margin-top: 0.55rem;
}
.wiz__preview-cta {
  display: inline-block;
  padding: 0.45rem 0.85rem;
  background: var(--pv-primary);
  color: var(--pv-surface);
  font-size: 0.78rem;
  font-weight: 600;
  border-radius: 6px;
  border: 1.5px solid var(--pv-primary);
}
.wiz__preview-cta--ghost {
  background: transparent;
  color: var(--pv-ink);
  border-color: var(--pv-ink);
}
.wiz__preview-cta--sm { padding: 0.3rem 0.65rem; font-size: 0.72rem; }
.wiz__preview-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  padding: 0.9rem 1rem;
  background: var(--pv-surface);
}
.wiz__preview-card {
  display: flex; flex-direction: column; gap: 0.4rem;
  padding: 0.7rem 0.7rem 0.8rem;
  background: var(--pv-surface-alt);
  border: 1px solid var(--pv-line);
  border-radius: 6px;
}
.wiz__preview-card-dot {
  width: 14px; height: 14px; border-radius: 50%;
  background: var(--pv-accent);
}
.wiz__preview-card-line {
  height: 6px; border-radius: 3px;
  background: color-mix(in srgb, var(--pv-ink) 22%, transparent);
  width: 80%;
}
.wiz__preview-card-line--lg { height: 8px; width: 95%; background: color-mix(in srgb, var(--pv-ink) 38%, transparent); }
.wiz__preview-card-line--short { width: 55%; }
.wiz__preview-footer {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.7rem 1rem;
  background: var(--pv-ink);
  color: var(--pv-surface);
  font-size: 0.74rem;
}
.wiz__preview-footer-accent { color: var(--pv-accent); }

.wiz__preview-legend {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.4rem 0.85rem;
  padding: 0.9rem 1rem 1rem;
  background: var(--ap-surface-alt, var(--ap-surface));
  border-top: 1px solid var(--ap-line);
  color: var(--ap-ink);
  font-family: ui-sans-serif, system-ui, sans-serif !important;
}
.wiz__preview-legend-row {
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.78rem;
}
.wiz__preview-legend-swatch {
  width: 16px; height: 16px;
  border-radius: 4px;
  border: 1px solid color-mix(in srgb, var(--ap-ink) 18%, transparent);
  flex-shrink: 0;
}
.wiz__preview-legend-label {
  font-weight: 600;
  color: var(--ap-ink);
  flex-shrink: 0;
}
.wiz__preview-legend-hex {
  margin-left: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.72rem;
  color: var(--ap-ink-muted);
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
