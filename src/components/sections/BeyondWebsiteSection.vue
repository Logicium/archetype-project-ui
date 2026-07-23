<script setup lang="ts">
/**
 * "More than a website" — the core reframe. Three animated demos show what a
 * customer actually gets: found on Google Maps, an Instagram-powered storefront,
 * and the #1 spot in search. The photo campaign (4th pillar) lives in the
 * gallery section right below. Animations trigger when each row scrolls in.
 */
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { MapPin, Instagram, Search, Camera, Star, Navigation, Clock } from 'lucide-vue-next'
import { CAMPAIGN_PHOTOS } from '../../config/campaign-photos'

const PILLARS = [
  { icon: MapPin, label: 'Google Maps' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Search, label: 'Top of search' },
  { icon: Camera, label: 'Photo campaign' },
]

// A few real Trinidad shots reused inside the demos so the mockups feel alive.
const ig = CAMPAIGN_PHOTOS.slice(0, 6)
const mapPhoto = CAMPAIGN_PHOTOS[3]?.src ?? CAMPAIGN_PHOTOS[0]?.src ?? ''

// Reveal-on-scroll: add `is-in` to each [data-reveal] row when it enters view.
const root = ref<HTMLElement | null>(null)
let io: IntersectionObserver | null = null
onMounted(() => {
  const els = root.value?.querySelectorAll<HTMLElement>('[data-reveal]') ?? []
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-in')); return }
  io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io?.unobserve(e.target) }
  }, { threshold: 0.35 })
  els.forEach(e => io!.observe(e))
})
onBeforeUnmount(() => io?.disconnect())
</script>

<template>
  <section ref="root" class="bw ap-section">
    <div class="ap-container">
      <div class="ap-section-head bw__head">
        <p class="ap-eyebrow">More than a website</p>
        <h2>We don't just build the site. We get you found.</h2>
        <p class="bw__intro">
          A pretty page is the easy part. The magic is everything around it — the map
          pin that shows up when someone searches nearby, the Instagram feed that turns
          followers into regulars, the search ranking that puts you first, and a photo
          campaign that makes it all look like you.
        </p>
        <ul class="bw__pillars">
          <li v-for="p in PILLARS" :key="p.label"><component :is="p.icon" :size="16" /> {{ p.label }}</li>
        </ul>
      </div>

      <!-- ── 1 · Google Maps ── -->
      <div class="bw__row" data-reveal>
        <div class="bw__copy">
          <span class="bw__tag"><MapPin :size="14" /> Google Maps</span>
          <h3>Show up on the map — pin, hours, and all</h3>
          <p>We connect your business to Google so you appear right where locals are looking, with your photos, hours, and reviews front and center.</p>
        </div>
        <div class="bw__demo">
          <div class="bw-map" aria-hidden="true">
            <svg class="bw-map__bg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
              <rect width="400" height="300" fill="#e8ece6" />
              <g stroke="#d3dad0" stroke-width="6" fill="none">
                <path d="M-10 70 H410" /><path d="M-10 160 H410" /><path d="M-10 240 H410" />
                <path d="M90 -10 V310" /><path d="M230 -10 V310" /><path d="M320 -10 V310" />
              </g>
              <path d="M-10 300 L200 90 L410 250" stroke="#c7d0c3" stroke-width="14" fill="none" />
              <path d="M-10 20 L120 140 L260 60 L410 180" stroke="#cfe3f0" stroke-width="10" fill="none" opacity="0.8" />
              <g fill="#dfe6db"><rect x="30" y="90" width="45" height="55" rx="3"/><rect x="250" y="30" width="55" height="30" rx="3"/><rect x="330" y="185" width="50" height="45" rx="3"/></g>
            </svg>
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
        </div>
      </div>

      <!-- ── 2 · Instagram ── -->
      <div class="bw__row bw__row--rev" data-reveal>
        <div class="bw__copy">
          <span class="bw__tag"><Instagram :size="14" /> Instagram</span>
          <h3>Your feed becomes a storefront</h3>
          <p>Connect Instagram once and your latest posts flow straight onto your site — perfect for the influencer-style businesses that live on their feed.</p>
        </div>
        <div class="bw__demo">
          <div class="bw-ig" aria-hidden="true">
            <div class="bw-ig__head">
              <span class="bw-ig__avatar"><Instagram :size="16" /></span>
              <div class="bw-ig__id"><strong>@corazoncoffee</strong><span>Trinidad, CO · connected</span></div>
              <span class="bw-ig__badge">Live</span>
            </div>
            <div class="bw-ig__grid">
              <span v-for="(p, i) in ig" :key="p.src" class="bw-ig__tile" :style="{ '--d': `${i * 90}ms` }">
                <img :src="p.src" alt="" loading="lazy" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── 3 · SEO ── -->
      <div class="bw__row" data-reveal>
        <div class="bw__copy">
          <span class="bw__tag"><Search :size="14" /> Search</span>
          <h3>Land at the top of the results</h3>
          <p>Clean, fast, structured pages mean search engines actually understand your business — so when someone searches, you're the first thing they see.</p>
        </div>
        <div class="bw__demo">
          <div class="bw-seo" aria-hidden="true">
            <div class="bw-seo__bar"><Search :size="14" /><span>coffee shop trinidad co</span></div>
            <div class="bw-seo__result bw-seo__result--top" style="--d: 120ms">
              <span class="bw-seo__url">corazoncoffee.com</span>
              <span class="bw-seo__title">Corazón Coffee — Trinidad's neighborhood café</span>
              <span class="bw-seo__rating"><Star :size="11" fill="currentColor" /><Star :size="11" fill="currentColor" /><Star :size="11" fill="currentColor" /><Star :size="11" fill="currentColor" /><Star :size="11" fill="currentColor" /> 4.9 · 214 reviews · Open now</span>
              <span class="bw-seo__desc">Small-batch roasts, house pastries, and a patio on Main Street. Order online for pickup…</span>
              <span class="bw-seo__badge">Your site</span>
            </div>
            <div class="bw-seo__result" style="--d: 260ms"><span class="bw-seo__url bw-seo__url--dim">yelp.com › biz</span><span class="bw-seo__title bw-seo__title--dim">Coffee near Trinidad, CO — Yelp</span></div>
            <div class="bw-seo__result" style="--d: 380ms"><span class="bw-seo__url bw-seo__url--dim">tripadvisor.com › …</span><span class="bw-seo__title bw-seo__title--dim">The 10 best cafés in Trinidad</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bw__head { max-width: 780px; }
.bw__intro { color: var(--ap-ink-muted); line-height: 1.7; }
.bw__pillars {
  list-style: none; display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1.25rem 0 0; padding: 0;
}
.bw__pillars li {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.35rem 0.75rem; border-radius: 999px;
  background: var(--ap-surface-alt); border: 1px solid var(--ap-line);
  font-size: 0.82rem; font-weight: 600; color: var(--ap-ink);
}
.bw__pillars svg { color: var(--ap-primary); }

/* Feature rows */
.bw__row {
  display: grid; grid-template-columns: 1fr 1fr; gap: clamp(1.5rem, 5vw, 4rem);
  align-items: center;
  margin-top: clamp(2.5rem, 6vw, 4.5rem);
}
.bw__row--rev .bw__copy { order: 2; }
@media (max-width: 820px) {
  .bw__row, .bw__row--rev { grid-template-columns: 1fr; gap: 1.5rem; }
  .bw__row--rev .bw__copy { order: 0; }
}
.bw__tag {
  display: inline-flex; align-items: center; gap: 0.4rem;
  font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--ap-primary); margin-bottom: 0.6rem;
}
.bw__copy h3 { font-size: clamp(1.3rem, 2.6vw, 1.8rem); margin: 0 0 0.6rem; }
.bw__copy p { color: var(--ap-ink-muted); line-height: 1.7; margin: 0; }
.bw__demo { min-width: 0; }

/* Shared demo card look */
.bw-map, .bw-ig, .bw-seo {
  border: 1px solid var(--ap-line);
  border-radius: var(--ap-radius-lg, 14px);
  background: var(--ap-surface);
  box-shadow: 0 24px 60px -30px rgba(0,0,0,0.4);
  overflow: hidden;
}

/* ── Map demo ── */
.bw-map { position: relative; aspect-ratio: 4 / 3; }
.bw-map__bg { position: absolute; inset: 0; width: 100%; height: 100%; }
.bw-map__pin {
  position: absolute; left: 50%; top: 46%; transform: translate(-50%, -100%);
  color: var(--ap-primary); filter: drop-shadow(0 3px 3px rgba(0,0,0,0.3));
  opacity: 0;
}
.bw-map__ring {
  position: absolute; left: 50%; top: 46%; transform: translate(-50%, -50%);
  width: 18px; height: 18px; border-radius: 50%;
  background: color-mix(in srgb, var(--ap-primary) 40%, transparent);
  opacity: 0;
}
.bw-map__card {
  position: absolute; left: 50%; bottom: 0.75rem; transform: translateX(-50%) translateY(140%);
  width: min(88%, 320px);
  display: flex; align-items: center; gap: 0.65rem;
  padding: 0.55rem 0.65rem;
  background: var(--ap-surface); border: 1px solid var(--ap-line);
  border-radius: 12px; box-shadow: 0 10px 24px -10px rgba(0,0,0,0.35);
  opacity: 0;
}
.bw-map__thumb { width: 46px; height: 46px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
.bw-map__info { display: flex; flex-direction: column; gap: 0.1rem; min-width: 0; line-height: 1.25; }
.bw-map__info strong { font-size: 0.9rem; }
.bw-map__rating { display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.78rem; color: #e0a100; font-weight: 600; }
.bw-map__muted { color: var(--ap-ink-muted); font-weight: 400; }
.bw-map__open { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.74rem; color: #1a9d5a; }
.bw-map__dir {
  margin-left: auto; flex-shrink: 0;
  width: 32px; height: 32px; border-radius: 50%;
  display: grid; place-items: center;
  background: color-mix(in srgb, var(--ap-primary) 14%, transparent); color: var(--ap-primary);
}
.is-in .bw-map__ring { animation: bw-ring 2.4s ease-out 0.6s infinite; }
.is-in .bw-map__pin { animation: bw-pin-drop 0.6s cubic-bezier(0.2, 1.4, 0.4, 1) 0.2s forwards; }
.is-in .bw-map__card { animation: bw-card-up 0.5s cubic-bezier(0.2, 0.8, 0.3, 1) 0.7s forwards; }
@keyframes bw-pin-drop { 0% { opacity: 0; transform: translate(-50%, -220%); } 100% { opacity: 1; transform: translate(-50%, -100%); } }
@keyframes bw-ring { 0% { opacity: 0.7; width: 18px; height: 18px; } 100% { opacity: 0; width: 90px; height: 90px; } }
@keyframes bw-card-up { to { opacity: 1; transform: translateX(-50%) translateY(0); } }

/* ── Instagram demo ── */
.bw-ig__head { display: flex; align-items: center; gap: 0.6rem; padding: 0.75rem 0.85rem; border-bottom: 1px solid var(--ap-line); }
.bw-ig__avatar {
  width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
  display: grid; place-items: center; color: #fff;
  background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
}
.bw-ig__id { display: flex; flex-direction: column; line-height: 1.2; min-width: 0; }
.bw-ig__id strong { font-size: 0.88rem; }
.bw-ig__id span { font-size: 0.72rem; color: var(--ap-ink-muted); }
.bw-ig__badge {
  margin-left: auto; font-size: 0.66rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
  color: #1a9d5a; padding: 0.15rem 0.5rem; border-radius: 999px;
  background: color-mix(in srgb, #1a9d5a 12%, transparent);
}
.bw-ig__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px; padding: 3px; }
.bw-ig__tile { aspect-ratio: 1; overflow: hidden; opacity: 0; transform: scale(0.9); }
.bw-ig__tile img { width: 100%; height: 100%; object-fit: cover; }
.is-in .bw-ig__tile { animation: bw-pop 0.45s ease var(--d, 0ms) forwards; }
@keyframes bw-pop { to { opacity: 1; transform: scale(1); } }

/* ── SEO demo ── */
.bw-seo { padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; }
.bw-seo__bar {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.6rem 0.85rem; border-radius: 999px;
  border: 1px solid var(--ap-line); background: var(--ap-surface-alt);
  color: var(--ap-ink); font-size: 0.9rem;
}
.bw-seo__bar svg { color: var(--ap-ink-muted); }
.bw-seo__result {
  display: flex; flex-direction: column; gap: 0.15rem;
  padding: 0.6rem 0.7rem; border-radius: 10px;
  opacity: 0; transform: translateY(8px);
  position: relative;
}
.is-in .bw-seo__result { animation: bw-slide 0.45s ease var(--d, 0ms) forwards; }
@keyframes bw-slide { to { opacity: 1; transform: none; } }
.bw-seo__result--top {
  background: color-mix(in srgb, var(--ap-primary) 7%, transparent);
  border: 1px solid color-mix(in srgb, var(--ap-primary) 30%, transparent);
}
.bw-seo__url { font-size: 0.74rem; color: #1a7f37; }
.bw-seo__url--dim { color: var(--ap-ink-muted); }
.bw-seo__title { font-size: 1rem; color: #1a4fc4; font-weight: 600; }
.bw-seo__title--dim { font-size: 0.9rem; color: color-mix(in srgb, #1a4fc4 55%, var(--ap-ink-muted)); font-weight: 500; }
.bw-seo__rating { display: inline-flex; align-items: center; gap: 0.15rem; font-size: 0.76rem; color: #e0a100; font-weight: 600; }
.bw-seo__rating :deep(svg) { margin-right: 1px; }
.bw-seo__desc { font-size: 0.82rem; color: var(--ap-ink-muted); line-height: 1.5; }
.bw-seo__badge {
  position: absolute; top: 0.6rem; right: 0.7rem;
  font-size: 0.62rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--ap-primary); background: var(--ap-surface);
  border: 1px solid color-mix(in srgb, var(--ap-primary) 40%, transparent);
  padding: 0.12rem 0.45rem; border-radius: 999px;
}

@media (prefers-reduced-motion: reduce) {
  .bw-map__pin, .bw-map__card, .bw-ig__tile, .bw-seo__result { opacity: 1 !important; transform: none !important; animation: none !important; }
  .bw-map__ring { display: none; }
}
</style>
