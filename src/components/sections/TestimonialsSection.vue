<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title?: string
  items: Array<{ quote: string; author: string; source?: string }>
}>()
</script>

<template>
  <section class="ap-section ap-section--alt ap-testimonials">
    <div class="ap-container">
      <div class="ap-section-head ap-section-head--center">
        <span v-if="eyebrow" class="ap-eyebrow">{{ eyebrow }}</span>
        <h2>{{ title || 'What guests say' }}</h2>
      </div>
      <div class="ap-grid ap-grid--3 ap-testimonials__grid">
        <figure v-for="(t, i) in items" :key="i" class="ap-card ap-testimonials__item">
          <blockquote>&ldquo;{{ t.quote }}&rdquo;</blockquote>
          <figcaption>
            <strong>{{ t.author }}</strong>
            <span v-if="t.source"> &middot; {{ t.source }}</span>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ap-testimonials__item { display: flex; flex-direction: column; gap: 1rem; }
.ap-testimonials__item blockquote {
  margin: 0; font-family: var(--ap-font-heading);
  font-size: 1.15rem; line-height: 1.45;
  color: var(--ap-ink);
}
.ap-testimonials__item figcaption { color: var(--ap-ink-muted); font-size: 0.9rem; }
[data-theme='heritage'] .ap-testimonials__item blockquote::before { content: '“ '; color: var(--ap-primary); }
</style>
