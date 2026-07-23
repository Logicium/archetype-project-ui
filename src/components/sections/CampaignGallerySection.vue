<script setup lang="ts">
/**
 * The photo campaign — real Trinidad shots from an Apotome shoot. It's an
 * optional add-on (from $100), pitched as the thing that makes the whole site
 * feel alive. Click any photo for a full-screen lightbox.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { CAMPAIGN_PHOTOS } from '../../config/campaign-photos'

// Show a tight, curated set on the page; the lightbox holds the full campaign.
const preview = CAMPAIGN_PHOTOS.slice(0, 7)
const rest = CAMPAIGN_PHOTOS.length - preview.length

const lightbox = ref<number | null>(null)
function open(i: number) { lightbox.value = i; document.documentElement.style.overflow = 'hidden' }
function close() { lightbox.value = null; document.documentElement.style.overflow = '' }
function next() { if (lightbox.value !== null) lightbox.value = (lightbox.value + 1) % CAMPAIGN_PHOTOS.length }
function prev() { if (lightbox.value !== null) lightbox.value = (lightbox.value - 1 + CAMPAIGN_PHOTOS.length) % CAMPAIGN_PHOTOS.length }

function onKey(e: KeyboardEvent) {
  if (lightbox.value === null) return
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowRight') next()
  else if (e.key === 'ArrowLeft') prev()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => { window.removeEventListener('keydown', onKey); document.documentElement.style.overflow = '' })
</script>

<template>
  <section class="camp ap-section ap-section--alt">
    <div class="ap-container">
      <div class="ap-section-head camp__head">
        <p class="ap-eyebrow">The photo campaign · add-on · from $100</p>
        <h2>A brand refresh, shot in Trinidad</h2>
        <p class="camp__intro">
          Add a real photo campaign to any site — we shoot your space, your food, and your
          people, then hand you a gallery that makes the whole thing feel alive.
        </p>
      </div>

      <div class="camp__grid">
        <button
          v-for="(p, i) in preview"
          :key="p.src"
          type="button"
          class="camp__item"
          @click="open(i)"
        >
          <img :src="p.src" :alt="`Trinidad, Colorado — Apotome photo campaign ${i + 1}`" loading="lazy" decoding="async" />
          <span class="camp__zoom" aria-hidden="true">⤢</span>
        </button>
        <button type="button" class="camp__item camp__item--all" @click="open(preview.length)">
          <img :src="CAMPAIGN_PHOTOS[preview.length]!.src" alt="" loading="lazy" decoding="async" />
          <span class="camp__all">
            <strong>+{{ rest }}</strong>
            <span>See all {{ CAMPAIGN_PHOTOS.length }}</span>
          </span>
        </button>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div v-if="lightbox !== null" class="camp-lb" @click.self="close">
        <button class="camp-lb__close" aria-label="Close" @click="close">×</button>
        <button class="camp-lb__nav camp-lb__nav--prev" aria-label="Previous" @click.stop="prev">‹</button>
        <img :src="CAMPAIGN_PHOTOS[lightbox]!.src" :alt="`Trinidad photo ${lightbox + 1}`" class="camp-lb__img" />
        <button class="camp-lb__nav camp-lb__nav--next" aria-label="Next" @click.stop="next">›</button>
        <span class="camp-lb__count">{{ lightbox + 1 }} / {{ CAMPAIGN_PHOTOS.length }}</span>
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.camp__head { max-width: 760px; }
.camp__intro { color: var(--ap-ink-muted); line-height: 1.7; }

/* Compact 2-row grid — uniform tiles keep the section short; the lightbox
   carries the full campaign. */
.camp__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;
  margin-top: clamp(1.25rem, 3vw, 2rem);
}
@media (max-width: 900px) { .camp__grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 520px) { .camp__grid { grid-template-columns: repeat(2, 1fr); } }

.camp__item {
  position: relative; overflow: hidden;
  padding: 0; border: 0; cursor: zoom-in;
  aspect-ratio: 4 / 3;
  border-radius: var(--ap-radius, 8px);
  background: var(--ap-line);
  box-shadow: 0 1px 2px rgba(0,0,0,0.08);
}
.camp__item img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform 500ms ease; }
.camp__item:hover img { transform: scale(1.06); }
.camp__zoom {
  position: absolute; top: 0.5rem; right: 0.5rem;
  width: 26px; height: 26px; border-radius: 50%;
  display: grid; place-items: center;
  background: rgba(0,0,0,0.55); color: #fff; font-size: 0.85rem;
  opacity: 0; transition: opacity 200ms ease;
  backdrop-filter: blur(4px);
}
.camp__item:hover .camp__zoom { opacity: 1; }

/* "See all" tile */
.camp__item--all { cursor: pointer; }
.camp__item--all img { filter: brightness(0.4); }
.camp__all {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.15rem;
  color: #fff; text-align: center;
}
.camp__all strong { font-family: var(--ap-font-heading); font-size: clamp(1.5rem, 3vw, 2.1rem); line-height: 1; }
.camp__all span { font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.85; }

/* Lightbox */
.camp-lb {
  position: fixed; inset: 0; z-index: 2000;
  display: grid; place-items: center;
  background: rgba(8, 8, 10, 0.92);
  padding: clamp(1rem, 5vw, 3rem);
  animation: camp-fade 180ms ease;
}
@keyframes camp-fade { from { opacity: 0; } }
.camp-lb__img {
  max-width: 100%; max-height: 88vh;
  object-fit: contain; border-radius: 4px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
}
.camp-lb__close {
  position: absolute; top: 1rem; right: 1.25rem;
  width: 44px; height: 44px; border: 0; border-radius: 50%;
  background: rgba(255,255,255,0.1); color: #fff;
  font-size: 1.6rem; line-height: 1; cursor: pointer;
}
.camp-lb__close:hover { background: rgba(255,255,255,0.2); }
.camp-lb__nav {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 48px; height: 48px; border: 0; border-radius: 50%;
  background: rgba(255,255,255,0.1); color: #fff;
  font-size: 2rem; line-height: 1; cursor: pointer;
}
.camp-lb__nav:hover { background: rgba(255,255,255,0.2); }
.camp-lb__nav--prev { left: clamp(0.5rem, 3vw, 2rem); }
.camp-lb__nav--next { right: clamp(0.5rem, 3vw, 2rem); }
.camp-lb__count {
  position: absolute; bottom: 1.25rem; left: 50%; transform: translateX(-50%);
  color: rgba(255,255,255,0.8); font-size: 0.85rem;
  font-variant-numeric: tabular-nums; letter-spacing: 0.1em;
}

@media (prefers-reduced-motion: reduce) {
  .camp__item, .camp__item img { transition: none; }
  .camp__item:hover img { transform: none; }
}
</style>
