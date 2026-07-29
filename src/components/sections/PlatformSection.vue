<script setup lang="ts">
import { LayoutDashboard, Sparkles, Instagram, CalendarClock, Globe, LineChart } from 'lucide-vue-next'

/** The inverted, ink-ground band for the paid machinery — extracted from
    DesignSystemSection so the color act can sit directly under the themes. */
const PREMIUM = [
  {
    icon: LayoutDashboard,
    name: 'Your own studio',
    desc: 'Edit copy, photos, hours, and menus yourself — live in seconds, no code.',
  },
  {
    icon: Sparkles,
    name: 'AI copywriter',
    desc: 'One click drafts taglines and descriptions in your brand voice.',
  },
  {
    icon: Instagram,
    name: 'Always-fresh content',
    desc: 'Instagram posts and live Google ratings on-site — zero upkeep.',
  },
  {
    icon: CalendarClock,
    name: 'Built to sell',
    desc: 'Booking, ordering, ticketing, or dispatch — built into your site.',
  },
  {
    icon: Globe,
    name: 'Domain & hosting',
    desc: 'Your .com, global edge hosting, and SSL — all handled for you.',
  },
  {
    icon: LineChart,
    name: 'Proof it works',
    desc: 'Visitors, reviews, and inquiries — together in one dashboard.',
  },
]
</script>

<template>
  <section class="ap-platform">
    <div class="ap-container">
      <div class="ap-platform__head">
        <span class="ap-eyebrow ap-platform__eyebrow">Included, not upsold</span>
        <h3>Not just a page. A platform that works for you.</h3>
        <p>Six things a brochure site will never do — all standard.</p>
      </div>
      <div class="ap-platform__grid">
        <article v-for="(f, i) in PREMIUM" :key="f.name" class="ap-platform__feature">
          <span class="ap-platform__feature-num" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="ap-platform__feature-icon">
            <component :is="f.icon" :size="20" :stroke-width="1.6" />
          </span>
          <h4>{{ f.name }}</h4>
          <p>{{ f.desc }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ap-platform {
  margin-top: var(--ap-section-py);
  background: var(--ap-ink);
  color: var(--ap-surface);
  padding-block: var(--ap-section-py);
}
.ap-platform__head { max-width: 640px; margin-bottom: clamp(2rem, 4vw, 3.5rem); }
.ap-platform__eyebrow { color: var(--ap-accent); }
.ap-platform__head h3 {
  color: var(--ap-surface);
  font-size: clamp(1.9rem, 3.6vw, 2.8rem);
  margin: 0.6rem 0;
}
.ap-platform__head p { color: color-mix(in srgb, var(--ap-surface) 65%, transparent); margin: 0; line-height: 1.65; }

.ap-platform__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1px;
  background: color-mix(in srgb, var(--ap-surface) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--ap-surface) 14%, transparent);
  border-radius: var(--ap-radius-lg);
  overflow: hidden;
}
.ap-platform__feature {
  position: relative;
  background: var(--ap-ink);
  padding: clamp(1.5rem, 3vw, 2rem);
  display: flex; flex-direction: column; gap: 0.55rem;
  transition: background 300ms ease;
}
.ap-platform__feature:hover { background: color-mix(in srgb, var(--ap-surface) 6%, var(--ap-ink)); }
.ap-platform__feature-num {
  position: absolute; top: clamp(1.5rem, 3vw, 2rem); right: clamp(1.4rem, 3vw, 1.9rem);
  font-family: var(--ap-font-mono); font-size: 0.72rem; letter-spacing: 0.12em;
  color: color-mix(in srgb, var(--ap-accent) 65%, transparent);
}
.ap-platform__feature-icon {
  width: 42px; height: 42px;
  display: grid; place-items: center;
  border-radius: 50%;
  background: color-mix(in srgb, var(--ap-accent) 16%, transparent);
  color: var(--ap-accent);
  margin-bottom: 0.4rem;
}
.ap-platform__feature h4 {
  margin: 0;
  color: var(--ap-surface);
  font-size: 1.2rem;
}
.ap-platform__feature p {
  margin: 0;
  color: color-mix(in srgb, var(--ap-surface) 68%, transparent);
  font-size: 0.9rem; line-height: 1.55;
}
</style>
