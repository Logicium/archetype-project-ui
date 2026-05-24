<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title?: string
  items: Array<{ q: string; a: string }>
}>()
</script>

<template>
  <section class="ap-section ap-faq">
    <div class="ap-container">
      <div class="ap-section-head">
        <span v-if="eyebrow" class="ap-eyebrow">{{ eyebrow }}</span>
        <h2>{{ title || 'Common questions' }}</h2>
      </div>
      <ul class="ap-faq__list">
        <li v-for="(f, i) in items" :key="i" class="ap-faq__item">
          <details>
            <summary>{{ f.q }}</summary>
            <p>{{ f.a }}</p>
          </details>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.ap-faq__list { list-style: none; padding: 0; margin: 0; }
.ap-faq__item { border-top: 1px solid var(--ap-line); }
.ap-faq__item:last-child { border-bottom: 1px solid var(--ap-line); }
.ap-faq__item summary {
  list-style: none; cursor: pointer;
  padding: 1.25rem 0; display: flex; justify-content: space-between;
  align-items: center; gap: 2rem;
  font-family: var(--ap-font-heading); font-size: 1.1rem;
  letter-spacing: var(--ap-tracking-heading);
}
.ap-faq__item summary::-webkit-details-marker { display: none; }
.ap-faq__item summary::after { content: '+'; font-size: 1.5rem; color: var(--ap-primary); }
.ap-faq__item details[open] summary::after { content: '−'; }
.ap-faq__item p { padding-bottom: 1.25rem; color: var(--ap-ink-muted); margin: 0; max-width: 60ch; }
</style>
