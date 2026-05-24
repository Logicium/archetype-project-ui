<script setup lang="ts">
import type { ShowcaseSite } from '../../config/site.config'
import { THEMES } from '@apotome/archetype-shared/themes/index'
import { SWATCHES } from '@apotome/archetype-shared/themes/swatches'
import OptimizedImage from '@apotome/archetype-shared/components/OptimizedImage.vue'

defineProps<{
  eyebrow?: string
  title?: string
  intro?: string
  sites: ShowcaseSite[]
}>()
</script>

<template>
  <section class="ap-section ap-section--alt ap-showcase">
    <div class="ap-container">
      <div class="ap-section-head">
        <span v-if="eyebrow" class="ap-eyebrow">{{ eyebrow }}</span>
        <h2>{{ title || 'The three archetypes' }}</h2>
        <p v-if="intro" style="color: var(--ap-ink-muted)">{{ intro }}</p>
      </div>

      <div class="ap-showcase__grid">
        <article v-for="s in sites" :key="s.id" class="ap-showcase__card">
          <a :href="s.liveUrl" target="_blank" rel="noopener" class="ap-showcase__media">
            <OptimizedImage :src="s.image" :alt="s.name + ' preview'" />
            <span class="ap-showcase__pill">{{ s.archetype }}</span>
          </a>
          <div class="ap-showcase__body">
            <h3>{{ s.name }}</h3>
            <p>{{ s.blurb }}</p>
            <div class="ap-showcase__meta">
              <div>
                <small class="ap-eyebrow">Themes</small>
                <ul>
                  <li v-for="t in s.themes" :key="t">{{ THEMES[t].label }}</li>
                </ul>
              </div>
              <div>
                <small class="ap-eyebrow">Swatches</small>
                <div class="ap-showcase__swatches">
                  <span
                    v-for="sw in s.swatches"
                    :key="sw"
                    :title="SWATCHES[sw].label"
                    :style="{ background: SWATCHES[sw].primary }"
                  />
                </div>
              </div>
            </div>
            <a v-if="s.liveUrl" :href="s.liveUrl" target="_blank" rel="noopener" class="ap-btn ap-btn--ghost">
              See {{ s.name }} live
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ap-showcase__grid {
  display: grid; gap: clamp(1.5rem, 3vw, 2.5rem);
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
.ap-showcase__card {
  background: var(--ap-surface);
  border: 1px solid var(--ap-line);
  border-radius: var(--ap-radius-lg);
  overflow: hidden;
  display: flex; flex-direction: column;
}
.ap-showcase__media {
  position: relative; display: block;
  border-bottom: 1px solid var(--ap-line);
}
.ap-showcase__media img { width: 100%; aspect-ratio: 16 / 10; object-fit: cover; }
.ap-showcase__pill {
  position: absolute; top: 0.75rem; left: 0.75rem;
  background: var(--ap-ink); color: var(--ap-surface);
  padding: 0.2rem 0.6rem; border-radius: 999px;
  font-size: 0.7rem; letter-spacing: 0.16em; text-transform: uppercase;
}
.ap-showcase__body { padding: 1.25rem 1.4rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.ap-showcase__body h3 { margin: 0; }
.ap-showcase__body p { margin: 0; color: var(--ap-ink-muted); }
.ap-showcase__meta {
  display: grid; gap: 1rem; grid-template-columns: 1fr 1fr;
  padding: 0.75rem 0; border-top: 1px solid var(--ap-line); border-bottom: 1px solid var(--ap-line);
}
.ap-showcase__meta ul { list-style: none; padding: 0; margin: 0.4rem 0 0; display: grid; gap: 0.2rem; font-size: 0.88rem; }
.ap-showcase__swatches { display: flex; gap: 0.35rem; margin-top: 0.4rem; }
.ap-showcase__swatches span {
  width: 22px; height: 22px; border-radius: 50%;
  border: 1px solid var(--ap-line);
}
</style>
