<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { useSiteTheme } from '@apotome/archetype-shared/composables/useSiteTheme'
import { THEME_LIST } from '@apotome/archetype-shared/themes/index'

const { themeName, setTheme } = useSiteTheme()

// Typographic personality per theme. Fonts load once via the @import below
// (same set the wizard preview uses). `transform` lets a theme's giant
// specimen wear its own casing (Atlas & Ironwood live in caps).
const SPECIMEN: Record<string, { heading: string; body: string; note: string; transform?: string; weight?: number }> = {
  atlas:    { heading: '"Archivo", sans-serif', body: '"Archivo", sans-serif', note: 'Index numerals · hairline grids', transform: 'uppercase', weight: 700 },
  studio:   { heading: '"Inter Tight", "Inter", sans-serif', body: '"Inter", sans-serif', note: 'Hairline rules · mono details', weight: 600 },
  heritage: { heading: '"Fraunces", Georgia, serif', body: '"Lora", Georgia, serif', note: 'Editorial serifs · generous air', weight: 500 },
  vibrant:  { heading: '"Bricolage Grotesque", sans-serif', body: '"Space Grotesk", sans-serif', note: 'Chunky borders · sticker energy', weight: 700 },
  ironwood: { heading: '"Big Shoulders Display", "Oswald", sans-serif', body: '"Barlow", "Roboto", sans-serif', note: 'Condensed caps · spec-sheet grit', transform: 'uppercase', weight: 700 },
}

/** One sample line per theme, typeset in the theme's own body face. */
const SAMPLE: Record<string, string> = {
  atlas:    'Open Tue–Sat · Menu, hours, and the map — filed like an index.',
  studio:   'Precision defaults. Hairline rules. Nothing decorative survives.',
  heritage: 'Set in serifs with generous air, the way a good menu reads.',
  vibrant:  'Big shapes, loud corners — a site that grins back.',
  ironwood: 'Built like signage: readable from across the shop floor.',
}
</script>

<!--
  The theme index — ultramodern, text-forward. Each personality is an
  editorial row: description on the left, the theme's name set HUGE in its
  own faces on the right. Clicking a row restyles the entire page live.
  (Color follows in ColorTheorySection; the platform band follows that.)
-->
<template>
  <section class="ap-dsys" id="design-system">
    <div class="ap-container">
      <div class="ap-section-head">
        <span class="ap-eyebrow">The design system</span>
        <h2>One site. Five personalities.</h2>
        <p class="ap-dsys__lead">
          Everything below is live — press it. The whole page, header to footer,
          restyles itself the same way every client site does.
        </p>
      </div>

      <div class="ap-dsys__index" role="list">
        <button
          v-for="(t, i) in THEME_LIST"
          :key="t.name"
          type="button"
          role="listitem"
          class="ap-dsys__row"
          :class="{ 'is-active': themeName === t.name }"
          @click="setTheme(t.name)"
        >
          <div class="ap-dsys__meta">
            <span class="ap-dsys__idx" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="ap-dsys__state">
              <Check v-if="themeName === t.name" :size="12" />
              {{ themeName === t.name ? 'Wearing it now' : 'Try it on' }}
            </span>
            <p class="ap-dsys__desc">{{ t.description }}</p>
            <span class="ap-dsys__note">{{ SPECIMEN[t.name]?.note }}</span>
          </div>
          <div class="ap-dsys__preview">
            <span
              class="ap-dsys__name"
              :style="{
                fontFamily: SPECIMEN[t.name]?.heading,
                textTransform: SPECIMEN[t.name]?.transform ?? 'none',
                fontWeight: SPECIMEN[t.name]?.weight ?? 600,
              }"
            >The {{ t.label.replace(/^The\s+/i, '') }}</span>
            <span class="ap-dsys__sample" :style="{ fontFamily: SPECIMEN[t.name]?.body }">
              {{ SAMPLE[t.name] }}
            </span>
          </div>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&family=Inter:wght@400;500&family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Lora:wght@400;500&family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&family=Space+Grotesk:wght@400;600&family=Archivo:wght@500;700&family=Big+Shoulders+Display:wght@600;700&family=Barlow:wght@400;500&display=swap');

.ap-dsys { padding-top: var(--ap-section-py); }
.ap-dsys__lead { color: var(--ap-ink-muted); margin: 0; max-width: 52ch; }

/* ── The theme index — editorial rows, no cards ─────────────── */
.ap-dsys__index {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--ap-line);
}
.ap-dsys__row {
  display: grid;
  grid-template-columns: minmax(0, 0.72fr) minmax(0, 1.28fr);
  gap: clamp(1.25rem, 3vw, 3.5rem);
  align-items: center;
  padding: clamp(1.5rem, 3vw, 2.4rem) 0;
  background: none;
  border: 0;
  border-bottom: 1px solid var(--ap-line);
  cursor: pointer;
  text-align: left;
  font: inherit;
  color: var(--ap-ink);
}

/* Left column — the reading rail. */
.ap-dsys__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  min-width: 0;
}
.ap-dsys__idx {
  font-family: var(--ap-font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  color: var(--ap-ink-muted);
}
.ap-dsys__state {
  display: inline-flex; align-items: center; gap: 0.32rem;
  font-family: var(--ap-font-mono);
  font-size: 0.62rem; font-weight: 600;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ap-ink-muted);
  border-bottom: 1px solid transparent;
  transition: color 200ms ease;
}
.ap-dsys__row.is-active .ap-dsys__state { color: var(--ap-primary); }
.ap-dsys__desc {
  margin: 0.2rem 0 0;
  font-size: 0.9rem; line-height: 1.55;
  color: var(--ap-ink-muted);
  max-width: 34ch;
}
.ap-dsys__note {
  font-family: var(--ap-font-mono);
  font-size: 0.64rem;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--ap-ink-muted);
  opacity: 0.75;
}

/* Right column — the type, enormous. */
.ap-dsys__preview {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}
.ap-dsys__name {
  font-size: clamp(2.8rem, 7.5vw, 6rem);
  line-height: 0.98;
  letter-spacing: -0.015em;
  color: var(--ap-ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 260ms ease, transform 420ms cubic-bezier(0.2, 0.7, 0.3, 1);
  transform-origin: left center;
}
.ap-dsys__row:hover .ap-dsys__name { transform: translateX(0.35rem); }
.ap-dsys__row.is-active .ap-dsys__name { color: var(--ap-primary); }
.ap-dsys__sample {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--ap-ink-muted);
  max-width: 52ch;
}

@media (max-width: 760px) {
  .ap-dsys__row { grid-template-columns: 1fr; gap: 0.9rem; align-items: start; }
  .ap-dsys__meta { order: 2; }
  .ap-dsys__preview { order: 1; }
  .ap-dsys__name { white-space: normal; }
}
</style>
