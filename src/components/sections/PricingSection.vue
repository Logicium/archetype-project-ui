<script setup lang="ts">
import { computed } from 'vue'
import { Smartphone, TrendingUp, Globe, Zap, MapPin, Mail, Palette, Wrench } from 'lucide-vue-next'
import { PRICING, BUNDLES } from '../../config/pricing'

const props = defineProps<{
  eyebrow?: string
  title?: string
  intro?: string
  only?: 'website' | 'marketing' | 'addons'
}>()

const websiteItems = computed(() => PRICING.filter(p => p.category === 'website'))
const marketingItems = computed(() => PRICING.filter(p => p.category === 'marketing'))
const addonItems = computed(() => PRICING.filter(p => p.category === 'addons'))

const WYG = [
  { icon: Smartphone, label: 'Works on every screen', desc: 'Desktop, tablet, and mobile — pixel-perfect on all of them.' },
  { icon: TrendingUp, label: 'SEO built in', desc: 'Local, on-page, and technical SEO configured from day one.' },
  { icon: Globe, label: 'Domain included', desc: 'Your first year .com domain is on us.' },
  { icon: Zap, label: 'Fast & cloud-hosted', desc: 'Sub-3s load on Vercel\'s global CDN — no server to manage.' },
  { icon: MapPin, label: 'Google Maps embedded', desc: 'Customers find your address and get directions in one tap.' },
  { icon: Mail, label: 'Contact form ready', desc: 'Inquiries go straight to your inbox the moment they\'re sent.' },
  { icon: Palette, label: '4 themes · 20 color swatches', desc: 'Pick the exact look that fits your brand.' },
  { icon: Wrench, label: 'Easy updates', desc: 'Tune-up service available any time your site needs a refresh.' },
]
</script>

<template>
  <section class="ap-section ap-pricing">
    <div class="ap-container">

      <!-- Header -->
      <div class="ap-section-head ap-section-head--center">
        <span v-if="eyebrow" class="ap-eyebrow">{{ eyebrow }}</span>
        <h2>{{ title || 'Transparent pricing' }}</h2>
        <p v-if="intro" class="ap-pricing__intro">{{ intro }}</p>
      </div>

      <!-- What you get -->
      <div class="ap-pricing__wyg">
        <h3 class="ap-pricing__group-title">What's included with every website</h3>
        <div class="ap-pricing__wyg-grid">
          <div v-for="f in WYG" :key="f.label" class="ap-pricing__wyg-item">
            <span class="ap-pricing__wyg-icon">
              <component :is="f.icon" :size="18" :stroke-width="1.75" />
            </span>
            <div class="ap-pricing__wyg-text">
              <strong>{{ f.label }}</strong>
              <p>{{ f.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Website -->
      <template v-if="!only || only === 'website'">
        <div class="ap-pricing__group">
          <h3 class="ap-pricing__group-title">Website</h3>
          <div class="ap-pricing__grid">
            <article
              v-for="p in websiteItems"
              :key="p.id"
              class="ap-card ap-pricing__card"
              :class="{ 'is-featured': p.featured }"
            >
              <header class="ap-pricing__head">
                <h4>{{ p.name }}</h4>
                <p class="ap-pricing__price">
                  <span class="ap-pricing__amount">${{ p.price }}</span>
                  <small v-if="p.unit">{{ p.unit }}</small>
                </p>
              </header>
              <p class="ap-pricing__blurb">{{ p.blurb }}</p>
              <ul v-if="p.includes?.length" class="ap-pricing__list">
                <li v-for="line in p.includes" :key="line">{{ line }}</li>
              </ul>
            </article>
          </div>
        </div>
      </template>

      <!-- Photography & Marketing -->
      <template v-if="!only || only === 'marketing'">
        <div class="ap-pricing__group">
          <h3 class="ap-pricing__group-title">Photography &amp; Marketing</h3>
          <div class="ap-pricing__grid">
            <article
              v-for="p in marketingItems"
              :key="p.id"
              class="ap-card ap-pricing__card"
              :class="{ 'is-featured': p.featured }"
            >
              <header class="ap-pricing__head">
                <h4>{{ p.name }}</h4>
                <p class="ap-pricing__price">
                  <span class="ap-pricing__amount">${{ p.price }}</span>
                  <small v-if="p.unit">{{ p.unit }}</small>
                </p>
              </header>
              <p class="ap-pricing__blurb">{{ p.blurb }}</p>
              <ul v-if="p.includes?.length" class="ap-pricing__list">
                <li v-for="line in p.includes" :key="line">{{ line }}</li>
              </ul>
            </article>
          </div>
        </div>
      </template>

      <!-- Add-ons -->
      <template v-if="!only || only === 'addons'">
        <div class="ap-pricing__group">
          <h3 class="ap-pricing__group-title">Add-ons</h3>
          <p class="ap-pricing__group-desc">Pair any of these with your site for an even stronger online presence.</p>
          <div class="ap-pricing__addons">
            <div v-for="p in addonItems" :key="p.id" class="ap-pricing__addon">
              <div class="ap-pricing__addon-main">
                <span class="ap-pricing__addon-name">{{ p.name }}</span>
                <span class="ap-pricing__addon-price">${{ p.price }}</span>
              </div>
              <p class="ap-pricing__addon-blurb">{{ p.blurb }}</p>
            </div>
          </div>
        </div>
      </template>

      <!-- Bundles -->
      <div v-if="!only" class="ap-pricing__group">
        <h3 class="ap-pricing__group-title">Bundles</h3>
        <p class="ap-pricing__group-desc">Save when you combine — everything a new business needs to launch online.</p>
        <div class="ap-pricing__grid">
          <article v-for="b in BUNDLES" :key="b.id" class="ap-card ap-pricing__card is-bundle">
            <header class="ap-pricing__head">
              <h4>{{ b.name }}</h4>
              <p class="ap-pricing__price"><span class="ap-pricing__amount">${{ b.price }}</span></p>
            </header>
            <p class="ap-pricing__blurb">{{ b.blurb }}</p>
            <ul class="ap-pricing__list">
              <li v-for="line in b.items" :key="line">{{ line }}</li>
            </ul>
          </article>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* ── Section intro ───────────────────────────────────── */
.ap-pricing__intro { color: var(--ap-ink-muted); margin: 0.5rem 0 0; font-size: 1rem; }

/* ── What you get ────────────────────────────────────── */
.ap-pricing__wyg {
  margin-top: clamp(2rem, 4vw, 3rem);
  padding: clamp(1.25rem, 2.5vw, 2rem) clamp(1.25rem, 2.5vw, 2rem);
  background: var(--ap-surface);
  border: 1px solid var(--ap-line);
  border-radius: var(--ap-radius);
}
.ap-pricing__wyg-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.1rem 2rem;
  margin-top: 1.1rem;
}
.ap-pricing__wyg-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}
.ap-pricing__wyg-icon {
  flex-shrink: 0;
  width: 2rem; height: 2rem;
  display: flex; align-items: center; justify-content: center;
  background: color-mix(in srgb, var(--ap-primary) 12%, transparent);
  color: var(--ap-primary);
  border-radius: calc(var(--ap-radius) / 2);
}
.ap-pricing__wyg-text strong {
  display: block;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--ap-ink);
  margin-bottom: 0.15rem;
}
.ap-pricing__wyg-text p {
  margin: 0;
  font-size: 0.82rem;
  color: var(--ap-ink-muted);
  line-height: 1.5;
}

/* ── Category groups ─────────────────────────────────── */
.ap-pricing__group { margin-top: clamp(2.5rem, 5vw, 4rem); }
.ap-pricing__group-title {
  font-family: var(--ap-font-heading);
  font-size: 1.15rem;
  letter-spacing: var(--ap-tracking-heading);
  text-transform: var(--ap-heading-transform);
  margin: 0 0 0.9rem;
}
.ap-pricing__group-desc {
  color: var(--ap-ink-muted);
  font-size: 0.92rem;
  margin: -0.4rem 0 1.1rem;
}

/* ── Main pricing cards ──────────────────────────────── */
.ap-pricing__grid {
  display: grid; gap: clamp(1rem, 2vw, 1.5rem);
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}
.ap-pricing__card { display: flex; flex-direction: column; gap: 0.75rem; }
.ap-pricing__card.is-featured { border-color: var(--ap-primary); border-width: 2px; }
.ap-pricing__card.is-bundle { background: var(--ap-surface); border-style: dashed; }
.ap-pricing__head { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; }
.ap-pricing__head h4 { margin: 0; font-size: 1.05rem; font-weight: 600; }
.ap-pricing__price { margin: 0; text-align: right; line-height: 1; }
.ap-pricing__amount {
  font-family: var(--ap-font-heading); font-size: 1.65rem; color: var(--ap-primary);
  letter-spacing: var(--ap-tracking-heading);
}
.ap-pricing__price small { display: block; color: var(--ap-ink-muted); font-size: 0.7rem; letter-spacing: 0.16em; text-transform: uppercase; }
.ap-pricing__blurb { color: var(--ap-ink-muted); margin: 0; font-size: 0.9rem; }
.ap-pricing__list { list-style: none; padding: 0; margin: 0.25rem 0 0; display: grid; gap: 0.4rem; }
.ap-pricing__list li {
  font-size: 0.88rem; padding-left: 1.1rem; position: relative;
}
.ap-pricing__list li::before {
  content: '\2713'; position: absolute; left: 0; top: 0; color: var(--ap-primary); font-weight: 700;
}

/* ── Add-ons compact grid ────────────────────────────── */
.ap-pricing__addons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 0.65rem;
}
.ap-pricing__addon {
  padding: 0.85rem 1rem;
  border: 1px solid var(--ap-line);
  border-radius: var(--ap-radius);
  background: var(--ap-surface);
}
.ap-pricing__addon-main {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 0.3rem;
}
.ap-pricing__addon-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--ap-ink);
}
.ap-pricing__addon-price {
  font-family: var(--ap-font-heading);
  font-size: 1.05rem;
  color: var(--ap-primary);
  font-weight: 700;
  letter-spacing: var(--ap-tracking-heading);
  white-space: nowrap;
}
.ap-pricing__addon-blurb {
  margin: 0;
  font-size: 0.82rem;
  color: var(--ap-ink-muted);
  line-height: 1.5;
}
</style>
