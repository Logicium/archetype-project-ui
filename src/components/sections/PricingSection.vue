<script setup lang="ts">
import { computed } from 'vue'
import { PRICING, BUNDLES } from '../../config/pricing'

const props = defineProps<{
  eyebrow?: string
  title?: string
  intro?: string
  /** Filter to a single category, otherwise show all. */
  only?: 'website' | 'photos' | 'visibility'
}>()

const items = computed(() =>
  props.only ? PRICING.filter(p => p.category === props.only) : PRICING
)
</script>

<template>
  <section class="ap-section ap-pricing">
    <div class="ap-container">
      <div class="ap-section-head ap-section-head--center">
        <span v-if="eyebrow" class="ap-eyebrow">{{ eyebrow }}</span>
        <h2>{{ title || 'Transparent pricing' }}</h2>
        <p v-if="intro" style="color: var(--ap-ink-muted)">{{ intro }}</p>
      </div>

      <div class="ap-pricing__grid">
        <article
          v-for="p in items"
          :key="p.id"
          class="ap-card ap-pricing__card"
          :class="{ 'is-featured': p.featured }"
        >
          <header class="ap-pricing__head">
            <h3>{{ p.name }}</h3>
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

      <div v-if="!only" class="ap-pricing__bundles">
        <h3 class="ap-pricing__bundles-title">Bundles</h3>
        <div class="ap-pricing__grid">
          <article v-for="b in BUNDLES" :key="b.id" class="ap-card ap-pricing__card is-bundle">
            <header class="ap-pricing__head">
              <h3>{{ b.name }}</h3>
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
.ap-pricing__grid {
  display: grid; gap: clamp(1rem, 2vw, 1.5rem);
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}
.ap-pricing__card { display: flex; flex-direction: column; gap: 0.75rem; }
.ap-pricing__card.is-featured { border-color: var(--ap-primary); border-width: 2px; }
.ap-pricing__card.is-bundle { background: var(--ap-surface); border-style: dashed; }
.ap-pricing__head { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; }
.ap-pricing__head h3 { margin: 0; font-size: 1.1rem; }
.ap-pricing__price { margin: 0; text-align: right; line-height: 1; }
.ap-pricing__amount {
  font-family: var(--ap-font-heading); font-size: 1.7rem; color: var(--ap-primary);
  letter-spacing: var(--ap-tracking-heading);
}
.ap-pricing__price small { display: block; color: var(--ap-ink-muted); font-size: 0.7rem; letter-spacing: 0.16em; text-transform: uppercase; }
.ap-pricing__blurb { color: var(--ap-ink-muted); margin: 0; font-size: 0.95rem; }
.ap-pricing__list { list-style: none; padding: 0; margin: 0.25rem 0 0; display: grid; gap: 0.4rem; }
.ap-pricing__list li {
  font-size: 0.9rem; padding-left: 1.1rem; position: relative;
}
.ap-pricing__list li::before {
  content: '✓'; position: absolute; left: 0; top: 0; color: var(--ap-primary); font-weight: 700;
}
.ap-pricing__bundles { margin-top: clamp(2rem, 5vw, 4rem); }
.ap-pricing__bundles-title {
  font-family: var(--ap-font-heading); font-size: 1.3rem; margin: 0 0 1rem;
  letter-spacing: var(--ap-tracking-heading); text-transform: var(--ap-heading-transform);
}
</style>
