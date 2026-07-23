<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { CHANGELOG, type ChangeTag } from '../config/changelog'

const TAG_ORDER: ChangeTag[] = ['New', 'Improved', 'Fixed']
function sortItems(items: { tag: ChangeTag; text: string }[]) {
  return [...items].sort((a, b) => TAG_ORDER.indexOf(a.tag) - TAG_ORDER.indexOf(b.tag))
}
</script>

<template>
  <section class="cl ap-section">
    <div class="ap-container cl__wrap">
      <RouterLink to="/" class="cl__back">← Back to Apotome</RouterLink>
      <p class="ap-eyebrow cl__eyebrow">Product updates</p>
      <h1 class="cl__title">What's new</h1>
      <p class="cl__intro">The latest improvements to Apotome. More to come.</p>

      <ol class="cl__list">
        <li v-for="entry in CHANGELOG" :key="entry.date" class="cl__entry">
          <div class="cl__meta">
            <time class="cl__date">{{ entry.date }}</time>
          </div>
          <div class="cl__content">
            <h2 class="cl__entry-title">{{ entry.title }}</h2>
            <p v-if="entry.summary" class="cl__summary">{{ entry.summary }}</p>
            <ul class="cl__items">
              <li v-for="(it, i) in sortItems(entry.items)" :key="i" class="cl__item">
                <span class="cl__tag" :class="`cl__tag--${it.tag.toLowerCase()}`">{{ it.tag }}</span>
                <span class="cl__item-text">{{ it.text }}</span>
              </li>
            </ul>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.cl { padding-top: clamp(2rem, 6vw, 4rem); }
.cl__wrap { max-width: 780px; }
.cl__back {
  display: inline-block; margin-bottom: 1.5rem;
  font-size: 0.9rem; color: var(--ap-ink-muted); border-bottom: 0;
}
.cl__back:hover { color: var(--ap-primary); }
.cl__eyebrow { margin-bottom: 0.5rem; }
.cl__title { margin: 0 0 0.4rem; }
.cl__intro { color: var(--ap-ink-muted); margin: 0 0 2.5rem; }

.cl__list { list-style: none; margin: 0; padding: 0; }
.cl__entry {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 1.5rem;
  padding: 0 0 2.5rem;
  position: relative;
}
/* timeline rule */
.cl__entry::before {
  content: '';
  position: absolute; left: 148px; top: 0.55rem; bottom: -0.5rem;
  width: 1px; background: var(--ap-line);
}
.cl__entry:last-child::before { display: none; }
.cl__meta { position: relative; }
.cl__date {
  font-size: 0.82rem; font-weight: 600;
  color: var(--ap-ink-muted);
  text-transform: uppercase; letter-spacing: 0.06em;
}
.cl__content { min-width: 0; }
.cl__entry-title { font-size: 1.4rem; margin: 0 0 0.5rem; }
.cl__summary { color: var(--ap-ink-muted); margin: 0 0 1.25rem; line-height: 1.6; }
.cl__items { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.7rem; }
.cl__item { display: flex; align-items: flex-start; gap: 0.7rem; }
.cl__item-text { line-height: 1.55; }
.cl__tag {
  flex-shrink: 0;
  display: inline-block; min-width: 68px; text-align: center;
  padding: 0.15rem 0.5rem;
  font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase;
  border-radius: 999px;
  margin-top: 0.1rem;
}
.cl__tag--new { background: color-mix(in srgb, var(--ap-primary) 16%, transparent); color: var(--ap-primary); }
.cl__tag--improved { background: color-mix(in srgb, #3987e5 15%, transparent); color: #2a6fbf; }
.cl__tag--fixed { background: color-mix(in srgb, var(--ap-ink) 8%, transparent); color: var(--ap-ink-muted); }

@media (max-width: 600px) {
  .cl__entry { grid-template-columns: 1fr; gap: 0.5rem; }
  .cl__entry::before { display: none; }
  .cl__tag { min-width: 60px; }
}
</style>
