<script setup lang="ts">
/** Shared shell for legal / policy pages — readable prose column, title,
    last-updated stamp, and a back link. Content goes in the default slot. */
import { RouterLink } from 'vue-router'

defineProps<{
  eyebrow?: string
  title: string
  updated: string
  summary?: string
}>()
</script>

<template>
  <section class="legal ap-section">
    <div class="ap-container legal__wrap">
      <RouterLink to="/" class="legal__back">← Back to Apotome</RouterLink>
      <p v-if="eyebrow" class="ap-eyebrow legal__eyebrow">{{ eyebrow }}</p>
      <h1 class="legal__title">{{ title }}</h1>
      <p class="legal__updated">Last updated {{ updated }}</p>
      <p v-if="summary" class="legal__summary">{{ summary }}</p>
      <div class="legal__body">
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped>
.legal { padding-top: clamp(2rem, 6vw, 4rem); }
.legal__wrap { max-width: 760px; }
.legal__back {
  display: inline-block; margin-bottom: 1.5rem;
  font-size: 0.9rem; color: var(--ap-ink-muted);
  border-bottom: 0;
}
.legal__back:hover { color: var(--ap-primary); }
.legal__eyebrow { margin-bottom: 0.5rem; }
.legal__title { margin: 0 0 0.5rem; }
.legal__updated { color: var(--ap-ink-muted); font-size: 0.85rem; margin: 0 0 1.5rem; }
.legal__summary {
  font-size: 1.1rem; line-height: 1.6; color: var(--ap-ink);
  padding: 1rem 1.25rem; margin: 0 0 2rem;
  background: var(--ap-surface-alt);
  border-left: 3px solid var(--ap-primary);
  border-radius: var(--ap-radius, 8px);
}

/* Prose */
.legal__body :deep(h2) {
  font-size: 1.35rem; margin: 2.25rem 0 0.75rem;
}
.legal__body :deep(h3) { font-size: 1.05rem; margin: 1.5rem 0 0.5rem; }
.legal__body :deep(p) { line-height: 1.7; margin: 0 0 1rem; color: var(--ap-ink); }
.legal__body :deep(ul) { margin: 0 0 1.25rem; padding-left: 1.25rem; line-height: 1.7; }
.legal__body :deep(li) { margin: 0 0 0.4rem; }
.legal__body :deep(a) { color: var(--ap-primary); }
.legal__body :deep(strong) { color: var(--ap-ink); }
.legal__body :deep(.legal__note) {
  font-size: 0.92rem; color: var(--ap-ink-muted);
  background: var(--ap-surface-alt);
  padding: 0.85rem 1.1rem; border-radius: var(--ap-radius, 8px);
  margin: 1.25rem 0;
}
</style>
