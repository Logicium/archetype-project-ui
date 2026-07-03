<script setup lang="ts">
import { Phone, Mail, CalendarCheck, Wrench, ArrowRight } from 'lucide-vue-next'

const props = defineProps<{
  phone: string
  email: string
  address?: string
}>()

const CHANNELS = [
  {
    icon: Phone,
    label: 'Call the studio',
    value: props.phone,
    href: `tel:${props.phone}`,
    note: 'A person answers. Same town, same time zone.',
  },
  {
    icon: Mail,
    label: 'Write to us',
    value: props.email,
    href: `mailto:${props.email}`,
    note: 'Answered within one business day, usually sooner.',
  },
  {
    icon: CalendarCheck,
    label: 'Book a session',
    value: 'Demo · walkthrough · photo shoot',
    href: '/contact',
    note: 'Sit with us and see your site before you spend a dollar.',
  },
  {
    icon: Wrench,
    label: 'Tune-ups, forever',
    value: '$100 · any time',
    href: '/#pricing',
    note: 'Season change, new menu, new photos — we keep it current.',
  },
]
</script>

<!--
  Support pathway: a confident, full-width band that makes "who do I call"
  a design feature. Four concrete channels, one unmissable next step.
-->
<template>
  <section class="ap-support">
    <div class="ap-container">
      <div class="ap-support__head">
        <span class="ap-eyebrow">After launch</span>
        <h2>You're never emailing a robot.</h2>
        <p>
          The site comes with people attached — <template v-if="address">based in {{ address }}, </template>we build it,
          we host it, and we're the ones who pick up when something needs changing.
        </p>
      </div>

      <div class="ap-support__grid">
        <a
          v-for="c in CHANNELS"
          :key="c.label"
          :href="c.href"
          class="ap-support__card"
        >
          <span class="ap-support__icon"><component :is="c.icon" :size="19" :stroke-width="1.7" /></span>
          <span class="ap-support__label">{{ c.label }}</span>
          <span class="ap-support__value">{{ c.value }}</span>
          <span class="ap-support__note">{{ c.note }}</span>
        </a>
      </div>

      <div class="ap-support__cta-row">
        <router-link to="/wizard" class="ap-btn ap-support__cta">
          Start your site <ArrowRight :size="16" />
        </router-link>
        <router-link to="/contact" class="ap-btn ap-btn--ghost">Talk to us first</router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ap-support {
  padding-block: var(--ap-section-py);
  background: var(--ap-surface-alt);
  border-block: 1px solid var(--ap-line);
}
.ap-support__head { max-width: 620px; margin-bottom: clamp(2rem, 4vw, 3rem); }
.ap-support__head h2 { margin: 0.6rem 0; }
.ap-support__head p { margin: 0; color: var(--ap-ink-muted); line-height: 1.65; }

.ap-support__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: clamp(0.75rem, 1.5vw, 1.25rem);
}
.ap-support__card {
  display: flex; flex-direction: column; gap: 0.35rem;
  padding: clamp(1.25rem, 2.5vw, 1.6rem);
  background: var(--ap-surface);
  border: 1px solid var(--ap-line);
  border-radius: var(--ap-radius-lg);
  color: var(--ap-ink);
  text-decoration: none;
  border-bottom-width: 1px;
  transition: transform 260ms cubic-bezier(0.2, 0.6, 0.2, 1), box-shadow 260ms ease, border-color 200ms ease;
}
.ap-support__card:hover {
  transform: translateY(-3px);
  border-color: var(--ap-primary);
  border-bottom-color: var(--ap-primary);
  box-shadow: 0 18px 40px -20px color-mix(in srgb, var(--ap-ink) 35%, transparent);
}
.ap-support__icon {
  width: 38px; height: 38px;
  display: grid; place-items: center;
  border-radius: 50%;
  background: color-mix(in srgb, var(--ap-primary) 12%, transparent);
  color: var(--ap-primary);
  margin-bottom: 0.5rem;
}
.ap-support__label {
  font-size: 0.7rem; font-weight: 700;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ap-ink-muted);
}
.ap-support__value {
  font-family: var(--ap-font-heading);
  font-size: 1.05rem; font-weight: 600;
  letter-spacing: var(--ap-tracking-heading);
}
.ap-support__note { font-size: 0.83rem; color: var(--ap-ink-muted); line-height: 1.5; }

.ap-support__cta-row {
  display: flex; gap: 0.75rem; flex-wrap: wrap;
  margin-top: clamp(2rem, 4vw, 3rem);
}
.ap-support__cta { display: inline-flex; align-items: center; gap: 0.5rem; }
</style>
