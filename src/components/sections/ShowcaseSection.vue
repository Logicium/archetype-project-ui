<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { ArrowUpRight } from 'lucide-vue-next'
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

function swatchOf(name: string) {
  return SWATCHES[name as keyof typeof SWATCHES] ?? SWATCHES.sand
}

// Scroll-reveal: panels drift up + fade in as they enter the viewport.
const rootEl = ref<HTMLElement | null>(null)
let io: IntersectionObserver | null = null
onMounted(() => {
  if (!('IntersectionObserver' in window)) return
  io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io?.unobserve(e.target) }
    }
  }, { threshold: 0.18 })
  rootEl.value?.querySelectorAll('.ap-show__panel').forEach(p => io?.observe(p))
})
onUnmounted(() => io?.disconnect())
</script>

<!--
  Cinematic showcase: one full-bleed panel per archetype. Text rail on one
  side (index, archetype, display-size name, themes), media stage on the
  other — the real homepage screenshot in a browser frame with two abstract
  "variant" plates behind it, painted live from the swatch data, so each
  panel reads as *the same site, restyled*. Layout alternates per panel.
-->
<template>
  <section ref="rootEl" class="ap-section--flush ap-showcase" aria-label="Template showcase">
    <div class="ap-container">
      <div class="ap-section-head">
        <span v-if="eyebrow" class="ap-eyebrow">{{ eyebrow }}</span>
        <h2>{{ title || 'The five archetypes' }}</h2>
        <p v-if="intro" class="ap-show__intro">{{ intro }}</p>
      </div>
    </div>

    <div class="ap-show__panels">
      <article
        v-for="(s, i) in sites"
        :key="s.id"
        class="ap-show__panel"
        :class="{ 'ap-show__panel--flip': i % 2 === 1 }"
      >
        <span class="ap-show__ghost" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>

        <div class="ap-show__text">
          <p class="ap-show__index">
            <span class="ap-show__index-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="ap-show__index-rule" aria-hidden="true" />
            <span class="ap-show__archetype">{{ s.archetype }}</span>
          </p>
          <h3 class="ap-show__name">{{ s.name }}</h3>
          <p class="ap-show__blurb">{{ s.blurb }}</p>

          <dl class="ap-show__meta">
            <div>
              <dt>Ships with</dt>
              <dd>{{ s.themes.map(t => THEMES[t].label).join(' · ') }}</dd>
            </div>
            <div>
              <dt>Palettes</dt>
              <dd class="ap-show__meta-swatches">
                <span
                  v-for="sw in s.swatches" :key="sw"
                  class="ap-show__meta-dot"
                  :style="{ background: swatchOf(sw).primary, boxShadow: `0 0 0 3px ${swatchOf(sw).surface}` }"
                  :title="swatchOf(sw).label"
                />
                <em>+ every other swatch &amp; theory</em>
              </dd>
            </div>
          </dl>

          <a v-if="s.liveUrl" :href="s.liveUrl" target="_blank" rel="noopener" class="ap-show__cta">
            Visit {{ s.name }} live
            <ArrowUpRight :size="16" />
          </a>
        </div>

        <div class="ap-show__stage">
          <!-- Variant plates: the same homepage, re-skinned from real swatch data -->
          <div
            v-for="(sw, vi) in s.swatches.slice(1, 3)"
            :key="sw"
            class="ap-show__variant"
            :class="`ap-show__variant--${vi + 1}`"
            :style="{ background: swatchOf(sw).surface, borderColor: swatchOf(sw).line }"
            aria-hidden="true"
          >
            <span class="ap-show__variant-bar" :style="{ borderColor: swatchOf(sw).line }">
              <i :style="{ background: swatchOf(sw).primary }" />
              <i :style="{ background: swatchOf(sw).accent }" />
              <i :style="{ background: swatchOf(sw).line }" />
            </span>
            <span class="ap-show__variant-hero">
              <b class="ln ln--title" :style="{ background: swatchOf(sw).ink }" />
              <b class="ln" :style="{ background: swatchOf(sw).inkMuted }" />
              <b class="ln ln--cta" :style="{ background: swatchOf(sw).primary }" />
            </span>
            <span class="ap-show__variant-cards">
              <i v-for="n in 3" :key="n" :style="{ background: swatchOf(sw).surfaceAlt, borderColor: swatchOf(sw).line }" />
            </span>
            <span class="ap-show__variant-tag" :style="{ background: swatchOf(sw).ink, color: swatchOf(sw).surface }">
              {{ swatchOf(sw).label }}
            </span>
          </div>

          <!-- Primary screenshot in a browser frame -->
          <a
            class="ap-show__frame"
            :href="s.liveUrl" target="_blank" rel="noopener"
            :aria-label="`Open the live ${s.name} demo`"
          >
            <span class="ap-show__frame-bar" aria-hidden="true">
              <i /><i /><i />
              <span class="ap-show__frame-url">{{ s.id }}.apotomelabs.com</span>
            </span>
            <OptimizedImage :src="s.image" :alt="`${s.name} homepage`" />
            <span class="ap-show__frame-swatch" :style="{ background: swatchOf(s.swatches[0]!).primary }" aria-hidden="true">
              {{ swatchOf(s.swatches[0]!).label }}
            </span>
          </a>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.ap-showcase {
  background: var(--ap-surface-alt);
  border-block: 1px solid var(--ap-line);
  padding-block: var(--ap-section-py);
  overflow: clip;
}
.ap-show__intro { color: var(--ap-ink-muted); margin: 0; max-width: 58ch; }

.ap-show__panels {
  display: flex; flex-direction: column;
  gap: clamp(4rem, 9vw, 8rem);
  margin-top: clamp(2.5rem, 5vw, 4rem);
}

/* ── Panel: 12-col full-bleed grid, media bleeds to the outer edge ── */
.ap-show__panel {
  position: relative;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  align-items: center;
  gap: clamp(1.5rem, 3vw, 3rem);
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 700ms cubic-bezier(0.2, 0.6, 0.2, 1), transform 700ms cubic-bezier(0.2, 0.6, 0.2, 1);
}
.ap-show__panel.is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .ap-show__panel { opacity: 1; transform: none; transition: none; }
}

.ap-show__text {
  grid-column: 2 / 6;
  grid-row: 1;
  position: relative; z-index: 2;
  display: flex; flex-direction: column; gap: 1.1rem;
}
.ap-show__stage {
  grid-column: 6 / 13;
  grid-row: 1;
  position: relative;
  padding: clamp(1rem, 2.5vw, 2.5rem) 0;
}
.ap-show__panel--flip .ap-show__text { grid-column: 9 / 12; }
.ap-show__panel--flip .ap-show__stage { grid-column: 1 / 8; }

/* Ghost numeral — cinematic backdrop digit */
.ap-show__ghost {
  position: absolute;
  top: 50%; transform: translateY(-52%);
  right: -0.05em;
  z-index: 0;
  font-family: var(--ap-font-heading);
  font-size: clamp(12rem, 26vw, 24rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.06em;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in srgb, var(--ap-ink) 14%, transparent);
  pointer-events: none;
  user-select: none;
}
.ap-show__panel--flip .ap-show__ghost { right: auto; left: -0.05em; }

/* Text rail */
.ap-show__index {
  display: flex; align-items: center; gap: 0.75rem;
  margin: 0;
}
.ap-show__index-num {
  font-family: var(--ap-font-mono);
  font-size: 0.85rem;
  color: var(--ap-primary);
  letter-spacing: 0.1em;
}
.ap-show__index-rule { flex: 0 0 44px; height: 1px; background: var(--ap-line); }
.ap-show__archetype {
  font-size: 0.72rem; font-weight: 700;
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--ap-ink-muted);
}
.ap-show__name {
  margin: 0;
  font-size: clamp(2.6rem, 5.5vw, 4.5rem);
  line-height: 0.95;
  letter-spacing: var(--ap-tracking-heading);
}
.ap-show__blurb { margin: 0; color: var(--ap-ink-muted); max-width: 38ch; }

.ap-show__meta {
  margin: 0.25rem 0 0; padding: 0;
  display: grid; gap: 0.8rem;
  border-top: 1px solid var(--ap-line);
  padding-top: 1rem;
}
.ap-show__meta dt {
  font-size: 0.66rem; font-weight: 700;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--ap-ink-muted);
  margin-bottom: 0.25rem;
}
.ap-show__meta dd { margin: 0; font-size: 0.92rem; }
.ap-show__meta-swatches { display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap; }
.ap-show__meta-dot {
  width: 18px; height: 18px; border-radius: 50%;
  display: inline-block;
}
.ap-show__meta-swatches em {
  font-style: normal; font-size: 0.78rem; color: var(--ap-ink-muted);
}

.ap-show__cta {
  display: inline-flex; align-items: center; gap: 0.4rem;
  margin-top: 0.5rem;
  width: fit-content;
  font-family: var(--ap-font-heading);
  font-weight: 600;
  letter-spacing: var(--ap-tracking-heading);
  text-transform: var(--ap-heading-transform);
  color: var(--ap-ink);
  border-bottom: 2px solid var(--ap-primary);
  padding-bottom: 0.2rem;
  transition: gap 160ms ease, color 160ms ease;
}
.ap-show__cta:hover { gap: 0.7rem; color: var(--ap-primary); border-bottom-color: currentColor; }

/* ── Media stage ── */
.ap-show__frame {
  position: relative; z-index: 2;
  display: block;
  border-radius: var(--ap-radius-lg);
  overflow: hidden;
  border: 1px solid var(--ap-line);
  background: var(--ap-surface);
  box-shadow: 0 30px 80px -30px color-mix(in srgb, var(--ap-ink) 45%, transparent);
  transition: transform 400ms cubic-bezier(0.2, 0.6, 0.2, 1), box-shadow 400ms ease;
}
.ap-show__frame:hover {
  transform: translateY(-6px);
  box-shadow: 0 44px 90px -30px color-mix(in srgb, var(--ap-ink) 55%, transparent);
}
.ap-show__frame-bar {
  display: flex; align-items: center; gap: 0.35rem;
  padding: 0.55rem 0.8rem;
  border-bottom: 1px solid var(--ap-line);
  background: var(--ap-surface);
}
.ap-show__frame-bar i {
  width: 9px; height: 9px; border-radius: 50%;
  background: color-mix(in srgb, var(--ap-ink) 18%, transparent);
}
.ap-show__frame-url {
  margin-left: 0.6rem;
  font-family: var(--ap-font-mono);
  font-size: 0.68rem;
  color: var(--ap-ink-muted);
  padding: 0.18rem 0.6rem;
  border: 1px solid var(--ap-line);
  border-radius: 999px;
}
.ap-show__frame :deep(img) {
  width: 100%; aspect-ratio: 16 / 10; object-fit: cover; object-position: top;
  display: block;
}
.ap-show__frame-swatch {
  position: absolute; right: 0.9rem; bottom: 0.9rem;
  padding: 0.28rem 0.75rem;
  border-radius: 999px;
  font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: #fff;
  box-shadow: 0 4px 14px rgba(0,0,0,0.35);
}

/* Variant plates — same page, other palettes, fanned behind the frame */
.ap-show__variant {
  position: absolute;
  z-index: 1;
  width: clamp(150px, 17vw, 230px);
  border: 1.5px solid;
  border-radius: calc(var(--ap-radius-lg) * 0.75);
  padding: 0;
  overflow: hidden;
  box-shadow: 0 18px 44px -18px color-mix(in srgb, var(--ap-ink) 40%, transparent);
  transition: transform 500ms cubic-bezier(0.2, 0.6, 0.2, 1);
}
.ap-show__variant--1 { top: 0; right: clamp(-0.5rem, -1vw, -1.5rem); transform: rotate(2.5deg); }
.ap-show__variant--2 { bottom: 0; right: clamp(2rem, 6vw, 6rem); transform: rotate(-2deg); }
.ap-show__panel--flip .ap-show__variant--1 { right: auto; left: clamp(-0.5rem, -1vw, -1.5rem); transform: rotate(-2.5deg); }
.ap-show__panel--flip .ap-show__variant--2 { right: auto; left: clamp(2rem, 6vw, 6rem); transform: rotate(2deg); }
.ap-show__panel:hover .ap-show__variant--1 { transform: rotate(3.5deg) translateY(-4px); }
.ap-show__panel:hover .ap-show__variant--2 { transform: rotate(-3deg) translateY(4px); }
.ap-show__panel--flip:hover .ap-show__variant--1 { transform: rotate(-3.5deg) translateY(-4px); }
.ap-show__panel--flip:hover .ap-show__variant--2 { transform: rotate(3deg) translateY(4px); }

.ap-show__variant-bar {
  display: flex; gap: 3px;
  padding: 0.35rem 0.5rem;
  border-bottom: 1px solid;
}
.ap-show__variant-bar i { width: 6px; height: 6px; border-radius: 50%; display: block; }
.ap-show__variant-hero {
  display: flex; flex-direction: column; gap: 5px;
  padding: 0.65rem 0.6rem 0.5rem;
}
.ap-show__variant-hero .ln { height: 7px; border-radius: 3px; width: 82%; opacity: 0.55; display: block; }
.ap-show__variant-hero .ln--title { height: 11px; width: 92%; opacity: 0.9; }
.ap-show__variant-hero .ln--cta { height: 12px; width: 38%; border-radius: 5px; opacity: 1; margin-top: 2px; }
.ap-show__variant-cards {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px;
  padding: 0 0.6rem 0.6rem;
}
.ap-show__variant-cards i {
  height: 24px; border-radius: 4px; border: 1px solid; display: block;
}
.ap-show__variant-tag {
  position: absolute; left: 0.45rem; bottom: 0.45rem;
  padding: 0.12rem 0.5rem;
  border-radius: 999px;
  font-size: 0.56rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
}

/* ── Responsive ── */
@media (max-width: 980px) {
  .ap-show__text { grid-column: 2 / 12 !important; grid-row: 1; }
  .ap-show__stage { grid-column: 2 / 12 !important; grid-row: 2; }
  .ap-show__ghost { display: none; }
}
@media (max-width: 560px) {
  .ap-show__variant--2 { display: none; }
  .ap-show__variant--1 { top: -0.75rem; }
}
</style>
