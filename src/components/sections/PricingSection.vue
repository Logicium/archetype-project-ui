<script setup lang="ts">
import { computed } from 'vue'
import { Smartphone, TrendingUp, Globe, Zap, MapPin, Mail, Palette, Wrench, Instagram, Star, ArrowRight, Check } from 'lucide-vue-next'
import { PRICING, BUNDLES } from '../../config/pricing'

defineProps<{
  eyebrow?: string
  title?: string
  intro?: string
}>()

const websiteTiers = computed(() => PRICING.filter(p => p.category === 'website' && p.id !== 'tuneup' && !p.upgradeOnly))
const tuneup = computed(() => PRICING.find(p => p.id === 'tuneup'))
const marketingItems = computed(() => PRICING.filter(p => p.category === 'marketing'))
const addonItems = computed(() => PRICING.filter(p => p.category === 'addons'))

/* Three-word differences beat five-line checklists — the full breakdown
   lives in the wizard where the decision actually happens. */
const TIER_POINTS: Record<string, string[]> = {
  'website': ['Up to 8 photos', 'Every theme + palette', 'Live in days'],
  'website-extended': ['Everything in Essentials', 'Hero carousel', '16-photo gallery page'],
}

const WYG = [
  { icon: Smartphone, label: 'Every screen' },
  { icon: TrendingUp, label: 'SEO built in' },
  { icon: MapPin, label: 'Google Maps' },
  { icon: Instagram, label: 'Instagram feed' },
  { icon: Star, label: 'Live Google reviews' },
  { icon: Globe, label: 'First-year .com' },
  { icon: Zap, label: 'CDN hosting' },
  { icon: Mail, label: 'Contact form' },
  { icon: Palette, label: '5 themes · 24 palettes' },
  { icon: Wrench, label: 'Tune-ups on call' },
]
</script>

<!--
  Pricing as a ledger, not a SaaS grid. Two oversized tier "tickets" carry
  the story; everything-included renders as a hairline chip strip; services
  and add-ons are dot-leader ledger rows; bundles close on an ink ground.
-->
<template>
  <section class="ap-section ap-pricing">
    <div class="ap-container">

      <div class="ap-section-head">
        <span v-if="eyebrow" class="ap-eyebrow">{{ eyebrow }}</span>
        <h2>{{ title || 'Transparent pricing' }}</h2>
        <p v-if="intro" class="ap-pricing__intro">{{ intro }}</p>
      </div>

      <!-- ── Tier tickets ─────────────────────────────────── -->
      <div class="ap-pricing__tiers">
        <article
          v-for="(p, i) in websiteTiers"
          :key="p.id"
          class="ap-pricing__tier"
          :class="{ 'is-featured': p.featured }"
        >
          <header class="ap-pricing__tier-head">
            <span class="ap-pricing__tier-index">{{ String(i + 1).padStart(2, '0') }}</span>
            <span v-if="p.featured" class="ap-pricing__tier-flag">Most chosen</span>
          </header>
          <h3 class="ap-pricing__tier-name">{{ p.name.replace(/^Website\s*/i, '').replace(/[()]/g, '') }}</h3>
          <p class="ap-pricing__tier-price">
            <sup>$</sup>{{ p.price }}
            <span class="ap-pricing__tier-once">once · you own it</span>
          </p>
          <ul class="ap-pricing__tier-list">
            <li v-for="line in TIER_POINTS[p.id] ?? []" :key="line">
              <Check :size="14" :stroke-width="2.5" />
              <span>{{ line }}</span>
            </li>
          </ul>
          <router-link to="/wizard" class="ap-pricing__tier-cta" :class="p.featured ? 'ap-btn' : 'ap-btn ap-btn--ghost'">
            Build it in the wizard <ArrowRight :size="15" />
          </router-link>
        </article>
      </div>

      <!-- ── Included with every site ─────────────────────── -->
      <div class="ap-pricing__wyg" aria-label="Included with every website">
        <span class="ap-pricing__wyg-label">Included with every site</span>
        <ul class="ap-pricing__wyg-strip">
          <li v-for="f in WYG" :key="f.label">
            <component :is="f.icon" :size="14" :stroke-width="1.8" />
            {{ f.label }}
          </li>
        </ul>
      </div>

      <!-- ── Services ledger ──────────────────────────────── -->
      <div class="ap-pricing__ledger">
        <div class="ap-pricing__ledger-col">
          <h3 class="ap-pricing__ledger-title">Photography &amp; marketing</h3>
          <div v-for="p in marketingItems" :key="p.id" class="ap-pricing__row" :title="p.blurb">
            <div class="ap-pricing__row-main">
              <span class="ap-pricing__row-name">{{ p.name }}</span>
              <span class="ap-pricing__row-leader" aria-hidden="true" />
              <span class="ap-pricing__row-price">${{ p.price }}</span>
            </div>
            <p class="ap-pricing__row-blurb">{{ p.blurb }}</p>
          </div>
          <div v-if="tuneup" class="ap-pricing__row" :title="tuneup.blurb">
            <div class="ap-pricing__row-main">
              <span class="ap-pricing__row-name">{{ tuneup.name }}</span>
              <span class="ap-pricing__row-leader" aria-hidden="true" />
              <span class="ap-pricing__row-price">${{ tuneup.price }}<em>/{{ (tuneup.unit || '').replace('per ', '') }}</em></span>
            </div>
            <p class="ap-pricing__row-blurb">{{ tuneup.blurb }}</p>
          </div>
        </div>

        <div class="ap-pricing__ledger-col">
          <h3 class="ap-pricing__ledger-title">Technical add-ons</h3>
          <div v-for="p in addonItems" :key="p.id" class="ap-pricing__row" :title="p.blurb">
            <div class="ap-pricing__row-main">
              <span class="ap-pricing__row-name">{{ p.name }}</span>
              <span class="ap-pricing__row-leader" aria-hidden="true" />
              <span class="ap-pricing__row-price">${{ p.price }}</span>
            </div>
            <p class="ap-pricing__row-blurb">{{ p.blurb }}</p>
          </div>
        </div>
      </div>

      <!-- ── Bundles ──────────────────────────────────────── -->
      <div class="ap-pricing__bundles">
        <article v-for="b in BUNDLES" :key="b.id" class="ap-pricing__bundle">
          <div class="ap-pricing__bundle-text">
            <span class="ap-pricing__bundle-kicker">Bundle</span>
            <h3>{{ b.name }}</h3>
            <p class="ap-pricing__bundle-items">{{ b.items.join(' · ') }}</p>
          </div>
          <div class="ap-pricing__bundle-side">
            <p class="ap-pricing__bundle-price"><sup>$</sup>{{ b.price }}</p>
            <router-link to="/wizard" class="ap-pricing__bundle-cta">
              Launch with this <ArrowRight :size="14" />
            </router-link>
          </div>
        </article>
      </div>

    </div>
  </section>
</template>

<style scoped>
.ap-pricing__intro { color: var(--ap-ink-muted); margin: 0; font-size: 1.02rem; }

/* ── Tier tickets ────────────────────────────────────── */
.ap-pricing__tiers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: clamp(0.85rem, 1.5vw, 1.2rem);
}
.ap-pricing__tier {
  position: relative;
  display: flex; flex-direction: column; gap: 0.55rem;
  padding: clamp(1.25rem, 2vw, 1.65rem);
  background: var(--ap-surface-alt);
  border: 1px solid var(--ap-line);
  border-radius: var(--ap-radius-lg);
  overflow: hidden;
  transition: transform 300ms cubic-bezier(0.2, 0.6, 0.2, 1), box-shadow 300ms ease;
}
.ap-pricing__tier:hover {
  transform: translateY(-4px);
  box-shadow: 0 28px 56px -28px color-mix(in srgb, var(--ap-ink) 40%, transparent);
}
.ap-pricing__tier.is-featured {
  border-color: var(--ap-primary);
  background:
    linear-gradient(160deg, color-mix(in srgb, var(--ap-primary) 9%, transparent) 0%, transparent 45%),
    var(--ap-surface-alt);
  box-shadow: 0 0 0 1px var(--ap-primary);
}
.ap-pricing__tier-head {
  display: flex; align-items: center; justify-content: space-between;
}
.ap-pricing__tier-index {
  font-family: var(--ap-font-mono);
  font-size: 0.8rem; color: var(--ap-ink-muted);
  letter-spacing: 0.12em;
}
.ap-pricing__tier-flag {
  padding: 0.26rem 0.7rem;
  background: var(--ap-primary);
  color: var(--ap-on-primary, var(--ap-surface-alt));
  border-radius: 999px;
  font-size: 0.64rem; font-weight: 700;
  letter-spacing: 0.16em; text-transform: uppercase;
}
.ap-pricing__tier-name {
  margin: 0;
  font-size: clamp(1.35rem, 2vw, 1.7rem);
}
.ap-pricing__tier-price {
  margin: 0.3rem 0 0.15rem;
  font-family: var(--ap-font-heading);
  font-size: clamp(2.3rem, 3.8vw, 3.1rem);
  font-weight: 700;
  line-height: 0.9;
  letter-spacing: -0.03em;
  color: var(--ap-ink);
  display: flex; align-items: baseline; gap: 0.5rem; flex-wrap: wrap;
}
.ap-pricing__tier-price sup {
  font-size: 0.4em;
  color: var(--ap-primary);
  vertical-align: super;
}
.ap-pricing__tier-once {
  font-family: var(--ap-font-mono);
  font-size: 0.68rem; font-weight: 400;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ap-ink-muted);
}
.ap-pricing__tier-list {
  list-style: none; margin: 0.3rem 0 0.6rem; padding: 0.7rem 0 0;
  border-top: 1px solid var(--ap-line);
  display: grid; gap: 0.4rem;
}
.ap-pricing__tier-list li {
  display: flex; gap: 0.55rem; align-items: flex-start;
  font-size: 0.88rem;
}
.ap-pricing__tier-list svg { color: var(--ap-primary); flex-shrink: 0; margin-top: 0.22em; }
.ap-pricing__tier-cta {
  margin-top: auto;
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  width: 100%;
}

/* ── Included strip ──────────────────────────────────── */
.ap-pricing__wyg {
  display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap;
  margin-top: clamp(1.5rem, 3vw, 2.25rem);
  padding: 1rem 1.25rem;
  border: 1px dashed var(--ap-line);
  border-radius: var(--ap-radius-lg);
}
.ap-pricing__wyg-label {
  font-size: 0.66rem; font-weight: 700;
  letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--ap-primary);
  flex-shrink: 0;
}
.ap-pricing__wyg-strip {
  list-style: none; margin: 0; padding: 0;
  display: flex; flex-wrap: wrap; gap: 0.4rem 1.35rem;
}
.ap-pricing__wyg-strip li {
  display: inline-flex; align-items: center; gap: 0.4rem;
  font-size: 0.82rem; color: var(--ap-ink);
  white-space: nowrap;
}
.ap-pricing__wyg-strip svg { color: var(--ap-ink-muted); }

/* ── Ledger ──────────────────────────────────────────── */
.ap-pricing__ledger {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: clamp(1.5rem, 3vw, 3rem);
  margin-top: clamp(1.75rem, 3.5vw, 2.75rem);
}
.ap-pricing__ledger-title {
  margin: 0 0 0.35rem;
  font-size: 0.78rem; font-weight: 700;
  letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--ap-ink-muted);
  padding-bottom: 0.7rem;
  border-bottom: 2px solid var(--ap-ink);
}
.ap-pricing__row { padding: 0.75rem 0; border-bottom: 1px solid var(--ap-line); }
.ap-pricing__row-main {
  display: flex; align-items: baseline; gap: 0.6rem;
}
/* Blurbs stay out of the reading flow — they unfold on hover/focus,
   and the row's title attribute covers touch. */
.ap-pricing__row .ap-pricing__row-blurb {
  max-height: 0;
  overflow: hidden;
  margin: 0;
  opacity: 0;
  transition: max-height 280ms cubic-bezier(0.2, 0.7, 0.3, 1), opacity 220ms ease, margin 280ms ease;
}
.ap-pricing__row:hover .ap-pricing__row-blurb,
.ap-pricing__row:focus-within .ap-pricing__row-blurb {
  max-height: 4.5em;
  opacity: 1;
  margin-top: 0.3rem;
}
.ap-pricing__row-name {
  font-family: var(--ap-font-heading);
  font-weight: 600;
  letter-spacing: var(--ap-tracking-heading);
  font-size: 0.98rem;
}
.ap-pricing__row-leader {
  flex: 1;
  border-bottom: 1px dotted color-mix(in srgb, var(--ap-ink) 35%, transparent);
  transform: translateY(-0.25em);
}
.ap-pricing__row-price {
  font-family: var(--ap-font-mono);
  font-size: 1.02rem; font-weight: 600;
  color: var(--ap-primary);
  white-space: nowrap;
}
.ap-pricing__row-price em { font-style: normal; font-size: 0.7em; color: var(--ap-ink-muted); }
.ap-pricing__row-blurb {
  margin: 0.3rem 0 0;
  font-size: 0.83rem; color: var(--ap-ink-muted); line-height: 1.5;
  max-width: 52ch;
}

/* ── Bundles ─────────────────────────────────────────── */
.ap-pricing__bundles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
  margin-top: clamp(1.75rem, 3.5vw, 2.75rem);
}
.ap-pricing__bundle {
  display: flex; gap: 1.5rem; justify-content: space-between;
  padding: clamp(1.5rem, 3vw, 2rem);
  background: var(--ap-ink);
  color: var(--ap-surface);
  border-radius: var(--ap-radius-lg);
  transition: transform 300ms cubic-bezier(0.2, 0.6, 0.2, 1);
}
.ap-pricing__bundle:hover { transform: translateY(-3px); }
.ap-pricing__bundle-kicker {
  font-size: 0.62rem; font-weight: 700;
  letter-spacing: 0.24em; text-transform: uppercase;
  color: var(--ap-accent);
}
.ap-pricing__bundle-text h3 {
  margin: 0.4rem 0 0.3rem;
  color: var(--ap-surface);
  font-size: 1.35rem;
}
.ap-pricing__bundle-items {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.6;
  color: color-mix(in srgb, var(--ap-surface) 72%, transparent);
  max-width: 40ch;
}
.ap-pricing__bundle-side {
  display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between;
  gap: 1rem; flex-shrink: 0;
}
.ap-pricing__bundle-price {
  margin: 0;
  /* Explicit: the global `p { color: var(--ap-ink) }` would otherwise match
     this <p> directly and paint it the same color as the ink-ground card. */
  color: var(--ap-surface);
  font-family: var(--ap-font-heading);
  font-size: clamp(2.4rem, 4vw, 3.2rem);
  font-weight: 700;
  line-height: 0.9;
  letter-spacing: -0.02em;
}
.ap-pricing__bundle-price sup { font-size: 0.45em; color: var(--ap-accent); }
.ap-pricing__bundle-cta {
  display: inline-flex; align-items: center; gap: 0.4rem;
  color: var(--ap-surface);
  font-size: 0.82rem; font-weight: 600;
  letter-spacing: 0.06em; text-transform: uppercase;
  border-bottom: 2px solid var(--ap-accent);
  padding-bottom: 0.2rem;
  white-space: nowrap;
  transition: gap 160ms ease;
}
.ap-pricing__bundle-cta:hover { gap: 0.75rem; }

@media (max-width: 560px) {
  .ap-pricing__bundle { flex-direction: column; }
  .ap-pricing__bundle-side { align-items: flex-start; flex-direction: row; width: 100%; }
}
</style>
