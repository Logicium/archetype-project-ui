<script setup lang="ts">
import { Star } from 'lucide-vue-next'

defineProps<{
  eyebrow?: string
  title?: string
  items: Array<{ quote: string; author: string; source?: string; rating?: number }>
}>()
</script>

<template>
  <section class="ap-section ap-section--alt ap-testimonials">
    <div class="ap-container">

      <!-- STUDIO: minimal mono numbered grid -->
      <div class="ap-testimonials--studio">
        <div class="ap-section-head">
          <span v-if="eyebrow" class="ap-eyebrow">{{ eyebrow }}</span>
          <h2>{{ title || 'What people say' }}</h2>
        </div>
        <div class="ap-testimonials__studio-grid">
          <figure v-for="(t, i) in items" :key="i" class="ap-testimonials__studio-item">
            <div class="ap-testimonials__studio-num" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</div>
            <blockquote>{{ t.quote }}</blockquote>
            <figcaption>
              <span class="ap-testimonials__author">{{ t.author }}</span>
              <span v-if="t.source" class="ap-testimonials__source">{{ t.source }}</span>
            </figcaption>
          </figure>
        </div>
      </div>

      <!-- HERITAGE: warm shadow cards with serif quote mark -->
      <div class="ap-testimonials--heritage">
        <div class="ap-section-head ap-section-head--center">
          <span v-if="eyebrow" class="ap-eyebrow">{{ eyebrow }}</span>
          <h2>{{ title || 'What people say' }}</h2>
        </div>
        <div class="ap-testimonials__heritage-grid">
          <figure v-for="(t, i) in items" :key="i" class="ap-testimonials__heritage-item">
            <div class="ap-testimonials__heritage-mark" aria-hidden="true">&ldquo;</div>
            <blockquote>{{ t.quote }}</blockquote>
            <figcaption>
              <strong>{{ t.author }}</strong>
              <span v-if="t.source"> &middot; {{ t.source }}</span>
            </figcaption>
          </figure>
        </div>
      </div>

      <!-- VIBRANT: sticker cards with star ratings -->
      <div class="ap-testimonials--vibrant">
        <div class="ap-section-head ap-section-head--center">
          <span v-if="eyebrow" class="ap-eyebrow">{{ eyebrow }}</span>
          <h2>{{ title || 'What people say' }}</h2>
        </div>
        <div class="ap-testimonials__vibrant-grid">
          <figure v-for="(t, i) in items" :key="i" class="ap-testimonials__vibrant-item">
            <div class="ap-testimonials__stars">
              <Star v-for="s in (t.rating ?? 5)" :key="s" :size="15" fill="currentColor" stroke="none" />
            </div>
            <blockquote>{{ t.quote }}</blockquote>
            <figcaption>
              <strong>{{ t.author }}</strong>
              <span v-if="t.source"> &middot; {{ t.source }}</span>
            </figcaption>
          </figure>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.ap-testimonials--studio,
.ap-testimonials--heritage,
.ap-testimonials--vibrant { display: none; }
[data-theme='studio']   .ap-testimonials--studio  { display: block; }
[data-theme='heritage'] .ap-testimonials--heritage { display: block; }
[data-theme='vibrant']  .ap-testimonials--vibrant  { display: block; }

/* STUDIO */
.ap-testimonials__studio-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  border-top: 1px solid var(--ap-line); margin-top: clamp(2rem, 4vw, 3.5rem);
}
.ap-testimonials__studio-item {
  padding: clamp(1.5rem, 3vw, 2.5rem) clamp(1rem, 2vw, 1.75rem);
  border-right: 1px solid var(--ap-line);
  display: flex; flex-direction: column; gap: 1.25rem;
}
.ap-testimonials__studio-item:last-child { border-right: none; }
.ap-testimonials__studio-num {
  font-family: var(--ap-font-mono); font-size: 0.7rem;
  letter-spacing: 0.22em; color: var(--ap-ink-muted);
}
.ap-testimonials__studio-item blockquote {
  margin: 0; font-size: 1.05rem; line-height: 1.62; color: var(--ap-ink); flex: 1;
}
.ap-testimonials__author {
  display: block; font-family: var(--ap-font-mono); font-size: 0.76rem;
  letter-spacing: 0.14em; text-transform: uppercase; color: var(--ap-ink);
}
.ap-testimonials__source { display: block; font-family: var(--ap-font-mono); font-size: 0.76rem; color: var(--ap-ink-muted); }
@media (max-width: 640px) {
  .ap-testimonials__studio-item { border-right: none; border-bottom: 1px solid var(--ap-line); }
  .ap-testimonials__studio-item:last-child { border-bottom: none; }
}

/* HERITAGE */
.ap-testimonials__heritage-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: clamp(1.25rem, 3vw, 2rem);
}
.ap-testimonials__heritage-item {
  background: var(--ap-surface); border-radius: var(--ap-radius);
  padding: clamp(1.5rem, 3vw, 2.5rem);
  display: flex; flex-direction: column; gap: 0.85rem;
  box-shadow: 0 2px 18px -4px color-mix(in srgb, var(--ap-ink) 12%, transparent);
}
.ap-testimonials__heritage-mark {
  font-family: var(--ap-font-heading); font-size: 4.5rem; line-height: 0.75;
  color: var(--ap-primary); opacity: 0.35; user-select: none;
}
.ap-testimonials__heritage-item blockquote {
  margin: 0; font-family: var(--ap-font-heading); font-style: italic;
  font-size: 1.1rem; line-height: 1.56; color: var(--ap-ink); flex: 1;
}
.ap-testimonials__heritage-item figcaption { color: var(--ap-ink-muted); font-size: 0.9rem; }
.ap-testimonials__heritage-item figcaption strong { color: var(--ap-ink); }

/* VIBRANT */
.ap-testimonials__vibrant-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
}
.ap-testimonials__vibrant-item {
  background: var(--ap-surface); border: 3px solid var(--ap-ink);
  border-radius: 20px; padding: clamp(1.25rem, 3vw, 2rem);
  display: flex; flex-direction: column; gap: 0.85rem;
  box-shadow: 5px 5px 0 var(--ap-ink); transform: rotate(-0.5deg);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.ap-testimonials__vibrant-item:nth-child(even) { transform: rotate(0.5deg); }
.ap-testimonials__vibrant-item:hover { transform: rotate(0deg) translateY(-4px); box-shadow: 7px 7px 0 var(--ap-ink); }
.ap-testimonials__stars { display: flex; gap: 2px; color: var(--ap-accent); }
.ap-testimonials__vibrant-item blockquote { margin: 0; font-size: 1rem; line-height: 1.55; font-weight: 500; color: var(--ap-ink); flex: 1; }
.ap-testimonials__vibrant-item figcaption { font-size: 0.85rem; font-weight: 700; color: var(--ap-ink); }
.ap-testimonials__vibrant-item figcaption span { font-weight: 400; color: var(--ap-ink-muted); }
[data-theme='heritage'] .ap-testimonials__item blockquote::before { content: '“ 
</style>
