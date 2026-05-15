<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title?: string
  pillars: Array<{ title: string; body: string }>
}>()
</script>

<template>
  <section class="ap-section ap-pillars">
    <div class="ap-container">
      <div class="ap-section-head">
        <span v-if="eyebrow" class="ap-eyebrow">{{ eyebrow }}</span>
        <h2>{{ title || 'How it works' }}</h2>
      </div>
      <ol class="ap-pillars__grid">
        <li v-for="(p, i) in pillars" :key="p.title" class="ap-pillars__item">
          <span class="ap-pillars__num">{{ String(i + 1).padStart(2, '0') }}</span>
          <h3>{{ p.title }}</h3>
          <p>{{ p.body }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.ap-pillars__grid {
  list-style: none; padding: 0; margin: 0;
  display: grid; gap: clamp(1.25rem, 2.5vw, 2rem);
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  counter-reset: pillar;
}
.ap-pillars__item {
  border-top: 1px solid var(--ap-line);
  padding-top: 1.25rem;
  display: grid; gap: 0.5rem;
}
.ap-pillars__num {
  font-family: var(--ap-font-mono);
  font-size: 0.85rem; color: var(--ap-primary);
  letter-spacing: 0.12em;
}
.ap-pillars__item h3 { margin: 0; font-size: 1.15rem; }
.ap-pillars__item p { margin: 0; color: var(--ap-ink-muted); font-size: 0.95rem; }
</style>
