<script setup lang="ts">
import { siteConfig } from '../config/site.config'
import HeroSection from '@apotome/archetype-shared/components/sections/HeroSection.vue'
import PillarsSection from '../components/sections/PillarsSection.vue'
import ShowcaseSection from '../components/sections/ShowcaseSection.vue'
import PricingSection from '../components/sections/PricingSection.vue'
import FAQSection from '../components/sections/FAQSection.vue'
</script>

<template>
  <HeroSection
    :eyebrow="siteConfig.hero.eyebrow"
    :title="siteConfig.hero.title"
    :subtitle="siteConfig.hero.subtitle"
    :image="siteConfig.hero.image"
    :cta-primary="{ label: 'See pricing', to: '/#pricing' }"
    :cta-secondary="{ label: 'Get in touch', to: '/contact' }"
    layout="split"
  />
  <PillarsSection eyebrow="The plan" title="Built for Trinidad" :pillars="siteConfig.pillars" />
  <ShowcaseSection
    eyebrow="The work"
    title="Five templates, every business covered"
    :sites="siteConfig.showcase"
  />
  <div id="pricing">
    <PricingSection
      eyebrow="Transparent pricing"
      title="Pick what you need"
      intro="No subscriptions. No surprises. Pay once, own your site."
    />
  </div>
  <FAQSection eyebrow="FAQ" :items="siteConfig.faq" />
</template>
