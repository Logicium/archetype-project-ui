<script setup lang="ts">
/**
 * The photo campaign, front and center — a masonry wall of real Trinidad shots
 * from the Apotome photo campaign. Framed as an essential part of what you get,
 * not an optional add-on. Click any photo for a full-screen lightbox.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { CAMPAIGN_PHOTOS } from '../../config/campaign-photos'

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
        <p class="ap-eyebrow">The photo campaign · included</p>
        <h2>A brand refresh, shot in Trinidad</h2>
        <p class="camp__intro">
          Every Apotome site comes with a real photo campaign — we show up, shoot your
          space, your food, your people, your town, and hand you a gallery that makes the
          whole site feel alive. Not an add-on. Part of the magic. Every photo below is
          the real thing.
        </p>
      </div>

      <div class="camp__grid">
        <button
          v-for="(p, i) in CAMPAIGN_PHOTOS"
          :key="p.src"
          type="button"
          class="camp__item"
          :class="`camp__item--${p.orientation}`"
          :style="{ aspectRatio: `${p.w} / ${p.h}` }"
          @click="open(i)"
        >
          <img :src="p.src" :alt="`Trinidad, Colorado — Apotome photo campaign ${i + 1}`" loading="lazy" decoding="async" />
          <span class="camp__zoom" aria-hidden="true">⤢</span>
        </button>
      </div>

      <p class="camp__foot">Shot on location in Trinidad, Colorado.</p>
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

/* Masonry via CSS columns — handles mixed portrait/landscape cleanly. */
.camp__grid {
  column-count: 4;
  column-gap: 0.85rem;
  margin-top: clamp(1.5rem, 4vw, 2.5rem);
}
@media (max-width: 1100px) { .camp__grid { column-count: 3; } }
@media (max-width: 760px)  { .camp__grid { column-count: 2; } }
@media (max-width: 460px)  { .camp__grid { column-count: 1; } }

.camp__item {
  display: block; width: 100%; margin: 0 0 0.85rem;
  padding: 0; border: 0; cursor: zoom-in;
  position: relative; overflow: hidden;
  border-radius: var(--ap-radius, 8px);
  background: var(--ap-line);
  break-inside: avoid;
  box-shadow: 0 1px 2px rgba(0,0,0,0.08);
  transition: transform 240ms ease, box-shadow 240ms ease;
}
.camp__item img { display: block; width: 100%; height: auto; transition: transform 500ms ease; }
.camp__item:hover { box-shadow: 0 12px 30px -12px rgba(0,0,0,0.4); transform: translateY(-2px); }
.camp__item:hover img { transform: scale(1.05); }
.camp__zoom {
  position: absolute; top: 0.5rem; right: 0.5rem;
  width: 28px; height: 28px; border-radius: 50%;
  display: grid; place-items: center;
  background: rgba(0,0,0,0.55); color: #fff; font-size: 0.9rem;
  opacity: 0; transition: opacity 200ms ease;
  backdrop-filter: blur(4px);
}
.camp__item:hover .camp__zoom { opacity: 1; }

.camp__foot {
  margin: 1.5rem 0 0; text-align: center;
  font-size: 0.85rem; color: var(--ap-ink-muted);
  letter-spacing: 0.02em;
}

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
