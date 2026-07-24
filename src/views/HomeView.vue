<script setup lang="ts">
import { siteConfig } from '../config/site.config'
import HeroSection from '@apotome/archetype-shared/components/sections/HeroSection.vue'
import BeyondWebsiteSection from '../components/sections/BeyondWebsiteSection.vue'
import CampaignGallerySection from '../components/sections/CampaignGallerySection.vue'
import ShowcaseSection from '../components/sections/ShowcaseSection.vue'
import DesignSystemSection from '../components/sections/DesignSystemSection.vue'
import PricingSection from '../components/sections/PricingSection.vue'
import SupportSection from '../components/sections/SupportSection.vue'
import PartnershipSection from '../components/sections/PartnershipSection.vue'
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
  <BeyondWebsiteSection />
  <CampaignGallerySection />
  <ShowcaseSection
    eyebrow="The templates"
    title="One engine. Five kinds of business."
    intro="Restaurants, stays, shops, trades, venues — each template is purpose-built for how that business actually works. Pick one to preview it live."
    :sites="siteConfig.showcase"
  />
  <DesignSystemSection />
  <div id="pricing">
    <PricingSection
      eyebrow="Transparent pricing"
      title="Pick what you need"
      intro="No subscriptions. No surprises. Pay once, own your site."
    />
  </div>
  <SupportSection
    :phone="siteConfig.contact.phone"
    :email="siteConfig.contact.email"
    :address="siteConfig.contact.address"
  />
  <PartnershipSection />
  <FAQSection eyebrow="FAQ" :items="siteConfig.faq" />
</template>
