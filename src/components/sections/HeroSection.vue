<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  subtitle?: string
  image: string
  imageAlt?: string
  ctaPrimary?: { label: string; to: string }
  ctaSecondary?: { label: string; to: string }
  /** Layout variant: 'split' shows image beside text, 'stage' is full-bleed image. */
  layout?: 'split' | 'stage'
}>()
</script>

<template>
  <section class="ap-hero" :class="`ap-hero--${layout || 'split'}`">
    <div class="ap-hero__deco" aria-hidden="true"></div>
    <div class="ap-container ap-hero__inner">
      <div class="ap-hero__content">
        <p v-if="eyebrow" class="ap-eyebrow ap-hero__eyebrow">{{ eyebrow }}</p>
        <h1 class="ap-hero__title">{{ title }}</h1>
        <p v-if="subtitle" class="ap-hero__subtitle">{{ subtitle }}</p>
        <div v-if="ctaPrimary || ctaSecondary" class="ap-hero__ctas">
          <router-link v-if="ctaPrimary" :to="ctaPrimary.to" class="ap-btn">{{ ctaPrimary.label }}</router-link>
          <router-link v-if="ctaSecondary" :to="ctaSecondary.to" class="ap-btn ap-btn--ghost">{{ ctaSecondary.label }}</router-link>
        </div>
      </div>
      <div class="ap-hero__media">
        <img :src="image" :alt="imageAlt || title" loading="eager" />
      </div>
    </div>
  </section>
</template>

<!--
  All visual treatment for the hero lives in src/styles/themes.css so it
  can vary structurally per data-theme. Only baseline, theme-agnostic
  structure is kept here.
-->
<style scoped>
.ap-hero { position: relative; }
.ap-hero__inner {
  display: grid; gap: clamp(2rem, 4vw, 4rem);
  align-items: center;
}
.ap-hero__content { display: flex; flex-direction: column; gap: 1rem; }
.ap-hero__subtitle {
  font-size: clamp(1.05rem, 1.4vw, 1.25rem);
  color: var(--ap-ink-muted); max-width: 52ch;
}
.ap-hero__ctas { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.75rem; }
.ap-hero__media img {
  display: block; width: 100%; height: auto; object-fit: cover;
}
@media (max-width: 820px) {
  .ap-hero__inner { grid-template-columns: 1fr !important; }
  .ap-hero__media { order: -1; }
}
</style>
