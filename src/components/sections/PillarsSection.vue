<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title?: string
  pillars: Array<{ title: string; body: string }>
}>()
</script>

<!--
  The plan, staged like a title sequence: a full-width hairline grid where
  each pillar is a numbered act. Oversized outline numerals give scale;
  the hover state pulls the theme's primary through the rule.
-->
<template>
  <section class="ap-section ap-pillars">
    <div class="ap-container">
      <div class="ap-section-head">
        <span v-if="eyebrow" class="ap-eyebrow">{{ eyebrow }}</span>
        <h2>{{ title || 'How it works' }}</h2>
      </div>
      <ol class="ap-pillars__grid">
        <li v-for="(p, i) in pillars" :key="p.title" class="ap-pillars__item">
          <span class="ap-pillars__num" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
          <div class="ap-pillars__body">
            <h3>{{ p.title }}</h3>
            <p>{{ p.body }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.ap-pillars__grid {
  list-style: none; padding: 0; margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  border-top: 1px solid var(--ap-line);
  border-left: 1px solid var(--ap-line);
}
.ap-pillars__item {
  position: relative;
  display: flex; flex-direction: column;
  gap: clamp(1.5rem, 3.5vw, 3rem);
  padding: clamp(1.5rem, 3vw, 2.25rem) clamp(1.25rem, 2.5vw, 2rem);
  border-right: 1px solid var(--ap-line);
  border-bottom: 1px solid var(--ap-line);
  overflow: hidden;
  transition: background 300ms ease;
}
.ap-pillars__item::before {
  content: '';
  position: absolute; top: 0; left: 0;
  width: 100%; height: 2px;
  background: var(--ap-primary);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 420ms cubic-bezier(0.2, 0.6, 0.2, 1);
}
.ap-pillars__item:hover { background: var(--ap-surface-alt); }
.ap-pillars__item:hover::before { transform: scaleX(1); }
.ap-pillars__num {
  font-family: var(--ap-font-heading);
  font-size: clamp(3rem, 6vw, 4.5rem);
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: -0.04em;
  color: transparent;
  -webkit-text-stroke: 1.5px color-mix(in srgb, var(--ap-ink) 30%, transparent);
  transition: color 300ms ease, -webkit-text-stroke-color 300ms ease;
}
.ap-pillars__item:hover .ap-pillars__num {
  color: var(--ap-primary);
  -webkit-text-stroke-color: var(--ap-primary);
}
.ap-pillars__body { display: grid; gap: 0.5rem; margin-top: auto; }
.ap-pillars__body h3 { margin: 0; font-size: 1.15rem; }
.ap-pillars__body p { margin: 0; color: var(--ap-ink-muted); font-size: 0.93rem; line-height: 1.6; }
</style>
