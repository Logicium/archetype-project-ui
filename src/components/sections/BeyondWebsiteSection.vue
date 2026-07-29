<script setup lang="ts">
/**
 * "More than a website" — the value reframe, as a bento. One feature tile per
 * capability (found on Google Maps, an Instagram storefront, top of search) and
 * a wide tile that hands off to the Trinidad photo campaign below. Compact and
 * asymmetric on purpose — no repeating full-height rows.
 */
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { MapPin, Instagram, Search, Camera, Star, Navigation, Clock, ArrowDown } from 'lucide-vue-next'
import { CAMPAIGN_PHOTOS } from '../../config/campaign-photos'

const ig = CAMPAIGN_PHOTOS.slice(0, 4)
const strip = CAMPAIGN_PHOTOS.slice(4, 10)
const mapPhoto = CAMPAIGN_PHOTOS[3]?.src ?? CAMPAIGN_PHOTOS[0]?.src ?? ''

const root = ref<HTMLElement | null>(null)
let io: IntersectionObserver | null = null
onMounted(() => {
  const els = root.value?.querySelectorAll<HTMLElement>('[data-reveal]') ?? []
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-in')); return }
  io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io?.unobserve(e.target) }
  }, { threshold: 0.3 })
  els.forEach(e => io!.observe(e))
})
onBeforeUnmount(() => io?.disconnect())

function toGallery() {
  document.querySelector('.camp')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <section ref="root" class="bw ap-section">
    <div class="ap-container">
      <div class="ap-section-head bw__head">
        <p class="ap-eyebrow">More than a website</p>
        <h2>We don't just build the site. We get you found.</h2>
        <p class="bw__intro">
          The page is the easy part. The magic is everything around it — the map pin,
          the feed that turns followers into regulars, the search ranking, and a photo
          campaign that makes it all look like you.
        </p>
      </div>

      <div class="bw__bento">
        <!-- Google Maps — feature tile -->
        <article class="bw__cell bw__cell--map" data-reveal>
          <header class="bw__cell-head">
            <span class="bw__tag"><MapPin :size="14" /> Google Maps · included</span>
            <h3>Show up on the map</h3>
            <p>We put your business on Google — pin, hours, photos, and reviews — right where locals are searching.</p>
          </header>
          <div class="bw-map" aria-hidden="true">
            <!-- Real map (keyless embed). Decorative: pointer-events off, the
                 entrance scales it up so it reads as the map zooming to the pin. -->
            <div class="bw-map__zoom">
              <iframe
                class="bw-map__frame"
                src="https://www.google.com/maps?ll=37.1695,-104.5005&z=14&output=embed"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                tabindex="-1"
                title="Trinidad, Colorado on Google Maps"
              />
            </div>
            <!-- Location chip — doubles as a mask over the embed's built-in
                 "Open in Maps" chrome in the top-left corner. -->
            <span class="bw-map__loc"><MapPin :size="12" /> Trinidad, Colorado</span>
            <span class="bw-map__ring" />
            <span class="bw-map__pin"><MapPin :size="20" :stroke-width="2.5" /></span>
            <div class="bw-map__card">
              <img :src="mapPhoto" alt="" class="bw-map__thumb" />
              <div class="bw-map__info">
                <strong>Corazón Coffee</strong>
                <span class="bw-map__rating"><Star :size="12" fill="currentColor" /> 4.9 <span class="bw-map__muted">(214)</span></span>
                <span class="bw-map__open"><Clock :size="12" /> Open · closes 9 PM</span>
              </div>
              <span class="bw-map__dir"><Navigation :size="14" /></span>
            </div>
          </div>
        </article>

        <!-- Instagram -->
        <article class="bw__cell bw__cell--ig" data-reveal>
          <span class="bw__tag"><Instagram :size="14" /> Instagram · included</span>
          <h3>Your feed, on your site</h3>
          <div class="bw-ig">
            <span v-for="(p, i) in ig" :key="p.src" class="bw-ig__tile" :style="{ '--d': `${i * 80}ms` }">
              <img :src="p.src" alt="" loading="lazy" />
            </span>
          </div>
        </article>

        <!-- SEO -->
        <article class="bw__cell bw__cell--seo" data-reveal>
          <span class="bw__tag"><Search :size="14" /> Search</span>
          <h3>First on the results</h3>
          <div class="bw-seo" aria-hidden="true">
            <div class="bw-seo__bar"><Search :size="12" /><span>coffee shop trinidad co</span></div>
            <div class="bw-seo__result">
              <span class="bw-seo__url">corazoncoffee.com</span>
              <span class="bw-seo__title">Corazón Coffee — Trinidad's café</span>
              <span class="bw-seo__rating"><Star :size="10" fill="currentColor" /><Star :size="10" fill="currentColor" /><Star :size="10" fill="currentColor" /><Star :size="10" fill="currentColor" /><Star :size="10" fill="currentColor" /> 4.9 · Open now</span>
              <span class="bw-seo__badge">Your site</span>
            </div>
          </div>
        </article>

        <!-- Photo campaign → gallery -->
        <article class="bw__cell bw__cell--photo" data-reveal>
          <div class="bw__photo-copy">
            <span class="bw__tag"><Camera :size="14" /> Photo campaign · add-on</span>
            <h3>A brand refresh, shot in Trinidad</h3>
            <p>We show up and shoot your space, your food, your people — and hand you a gallery that makes the whole site feel alive.</p>
            <button type="button" class="bw__photo-link" @click="toGallery">See the gallery <ArrowDown :size="15" /></button>
          </div>
          <div class="bw__photo-strip">
            <span v-for="p in strip" :key="p.src"><img :src="p.src" alt="" loading="lazy" /></span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bw__head { max-width: 720px; }
.bw__intro { color: var(--ap-ink-muted); line-height: 1.7; }

/* ── Bento ── */
.bw__bento {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(150px, auto);
  gap: clamp(0.75rem, 1.5vw, 1.1rem);
  margin-top: clamp(1.75rem, 4vw, 2.75rem);
}
.bw__cell {
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; gap: 0.6rem;
  padding: clamp(1.1rem, 2vw, 1.6rem);
  background: var(--ap-surface);
  border: 1px solid var(--ap-line);
  border-radius: var(--ap-radius-lg, 16px);
  opacity: 0; transform: translateY(16px);
  transition: opacity 600ms ease, transform 600ms cubic-bezier(0.2, 0.7, 0.3, 1), border-color 200ms ease, box-shadow 200ms ease;
}
.bw__cell.is-in { opacity: 1; transform: none; }
.bw__cell:hover { border-color: color-mix(in srgb, var(--ap-primary) 40%, var(--ap-line)); box-shadow: 0 18px 44px -26px color-mix(in srgb, var(--ap-ink) 40%, transparent); }
.bw__cell--map { grid-column: span 2; grid-row: span 2; }
.bw__cell--ig  { grid-column: 3; }
.bw__cell--seo { grid-column: 3; }
.bw__cell--photo { grid-column: span 3; flex-direction: row; align-items: center; gap: clamp(1.25rem, 3vw, 2.5rem); }

.bw__tag { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ap-primary); }
.bw__cell h3 { margin: 0; font-size: clamp(1.15rem, 2vw, 1.5rem); }
.bw__cell p { margin: 0; color: var(--ap-ink-muted); line-height: 1.6; font-size: 0.92rem; }
.bw__cell-head { display: flex; flex-direction: column; gap: 0.5rem; }
.bw__cell-head p { max-width: 42ch; }

/* Map tile */
.bw-map { position: relative; flex: 1; min-height: 220px; margin-top: 0.4rem; border-radius: 12px; overflow: hidden; border: 1px solid var(--ap-line); }
/* The zoom stage: starts pulled back, eases in toward the pin on reveal. */
.bw-map__zoom {
  position: absolute; inset: 0;
  transform: scale(1.08);
  /* Zoom about the pin's anchor point — keeps the pin planted and pushes
     the embed's top-left chrome out of frame as it scales. */
  transform-origin: 46% 44%;
  transition: transform 1600ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}
.bw__cell--map.is-in .bw-map__zoom { transform: scale(1.32); }
.bw-map__frame {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  border: 0; display: block;
  pointer-events: none;               /* decorative — no scroll traps */
  filter: saturate(0.92) contrast(1.02);
}
.bw-map__loc {
  position: absolute; left: 0; top: 0; z-index: 3;
  display: inline-flex; align-items: center; gap: 0.35rem;
  /* Oversized on purpose: it sits on the embed's "Open in Maps" chrome. */
  min-width: 190px; min-height: 46px;
  padding: 0 1rem;
  border-radius: 0 0 12px 0;
  background: color-mix(in srgb, var(--ap-surface-alt) 88%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-right: 1px solid var(--ap-line);
  border-bottom: 1px solid var(--ap-line);
  font-family: var(--ap-font-mono);
  font-size: 0.68rem; font-weight: 600;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--ap-ink);
}
.bw-map__loc svg { color: var(--ap-primary); }
.bw-map__pin { position: absolute; left: 46%; top: 44%; transform: translate(-50%, -100%); color: var(--ap-primary); filter: drop-shadow(0 3px 3px rgba(0,0,0,0.3)); opacity: 0; z-index: 2; }
.bw-map__ring { position: absolute; left: 46%; top: 44%; transform: translate(-50%, -50%); width: 18px; height: 18px; border-radius: 50%; background: color-mix(in srgb, var(--ap-primary) 40%, transparent); opacity: 0; z-index: 2; }
.bw-map__card {
  position: absolute; left: 50%; bottom: 0.85rem; transform: translateX(-50%) translateY(140%);
  width: min(90%, 330px); display: flex; align-items: center; gap: 0.65rem;
  padding: 0.55rem 0.65rem; background: var(--ap-surface); border: 1px solid var(--ap-line);
  border-radius: 12px; box-shadow: 0 10px 24px -10px rgba(0,0,0,0.35); opacity: 0;
}
.bw-map__thumb { width: 46px; height: 46px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
.bw-map__info { display: flex; flex-direction: column; gap: 0.1rem; min-width: 0; line-height: 1.25; }
.bw-map__info strong { font-size: 0.9rem; }
.bw-map__rating { display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.78rem; color: #e0a100; font-weight: 600; }
.bw-map__muted { color: var(--ap-ink-muted); font-weight: 400; }
.bw-map__open { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.74rem; color: #1a9d5a; }
.bw-map__dir { margin-left: auto; flex-shrink: 0; width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center; background: color-mix(in srgb, var(--ap-primary) 14%, transparent); color: var(--ap-primary); }
/* Sequence: map zooms (0–1.6s) → pin drops (0.55s) → business card slides up (1.15s). */
.bw__cell--map.is-in .bw-map__ring { animation: bw-ring 2.4s ease-out 1.1s infinite; }
.bw__cell--map.is-in .bw-map__pin { animation: bw-pin-drop 0.6s cubic-bezier(0.2, 1.4, 0.4, 1) 0.55s forwards; }
.bw__cell--map.is-in .bw-map__card { animation: bw-card-up 0.5s cubic-bezier(0.2, 0.8, 0.3, 1) 1.15s forwards; }
@keyframes bw-pin-drop { 0% { opacity: 0; transform: translate(-50%, -220%); } 100% { opacity: 1; transform: translate(-50%, -100%); } }
@keyframes bw-ring { 0% { opacity: 0.7; width: 18px; height: 18px; } 100% { opacity: 0; width: 90px; height: 90px; } }
@keyframes bw-card-up { to { opacity: 1; transform: translateX(-50%) translateY(0); } }

/* Instagram tile */
.bw-ig { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; margin-top: auto; border-radius: 10px; overflow: hidden; }
.bw-ig__tile { aspect-ratio: 1; overflow: hidden; opacity: 0; transform: scale(0.9); }
.bw-ig__tile img { width: 100%; height: 100%; object-fit: cover; }
.bw__cell--ig.is-in .bw-ig__tile { animation: bw-pop 0.45s ease var(--d, 0ms) forwards; }
@keyframes bw-pop { to { opacity: 1; transform: scale(1); } }

/* SEO tile */
.bw-seo { margin-top: auto; display: flex; flex-direction: column; gap: 0.5rem; }
.bw-seo__bar { display: flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.7rem; border-radius: 999px; border: 1px solid var(--ap-line); background: var(--ap-surface-alt); font-size: 0.8rem; color: var(--ap-ink); }
.bw-seo__bar svg { color: var(--ap-ink-muted); }
.bw-seo__result { position: relative; display: flex; flex-direction: column; gap: 0.1rem; padding: 0.55rem 0.65rem; border-radius: 10px; background: color-mix(in srgb, var(--ap-primary) 7%, transparent); border: 1px solid color-mix(in srgb, var(--ap-primary) 28%, transparent); }
.bw-seo__url { font-size: 0.72rem; color: #1a7f37; }
.bw-seo__title { font-size: 0.92rem; color: #1a4fc4; font-weight: 600; }
.bw-seo__rating { display: inline-flex; align-items: center; gap: 0.1rem; font-size: 0.74rem; color: #e0a100; font-weight: 600; }
.bw-seo__badge { position: absolute; top: 0.5rem; right: 0.6rem; font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ap-primary); background: var(--ap-surface); border: 1px solid color-mix(in srgb, var(--ap-primary) 40%, transparent); padding: 0.1rem 0.4rem; border-radius: 999px; }

/* Photo campaign tile */
.bw__photo-copy { flex: 1 1 42%; display: flex; flex-direction: column; gap: 0.55rem; }
.bw__photo-copy p { max-width: 46ch; }
.bw__photo-link { align-self: flex-start; margin-top: 0.3rem; display: inline-flex; align-items: center; gap: 0.4rem; background: none; border: 0; padding: 0; cursor: pointer; font: inherit; font-weight: 600; color: var(--ap-ink); border-bottom: 2px solid var(--ap-primary); padding-bottom: 0.15rem; transition: gap 160ms ease, color 160ms ease; }
.bw__photo-link:hover { gap: 0.65rem; color: var(--ap-primary); }
.bw__photo-strip { flex: 1 1 55%; display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; }
.bw__photo-strip span { aspect-ratio: 3 / 4; overflow: hidden; border-radius: 8px; }
.bw__photo-strip img { width: 100%; height: 100%; object-fit: cover; }

@media (max-width: 900px) {
  .bw__bento { grid-template-columns: repeat(2, 1fr); }
  .bw__cell--map { grid-column: span 2; grid-row: auto; }
  .bw__cell--ig, .bw__cell--seo { grid-column: auto; }
  .bw__cell--photo { grid-column: span 2; flex-direction: column; align-items: stretch; }
  .bw__photo-strip { grid-template-columns: repeat(6, 1fr); }
}
@media (max-width: 560px) {
  .bw__bento { grid-template-columns: 1fr; }
  .bw__cell--map, .bw__cell--ig, .bw__cell--seo, .bw__cell--photo { grid-column: auto; }
  .bw__photo-strip { grid-template-columns: repeat(3, 1fr); }
}
@media (prefers-reduced-motion: reduce) {
  .bw__cell { opacity: 1 !important; transform: none !important; }
  .bw-map__pin, .bw-map__card, .bw-ig__tile { opacity: 1 !important; transform: none !important; animation: none !important; }
  .bw-map__ring { display: none; }
}
</style>
