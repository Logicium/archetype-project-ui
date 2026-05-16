<script setup lang="ts">
import { siteConfig } from '../config/site.config'
import HeroSection from '../components/sections/HeroSection.vue'
import ContactSection from '../components/sections/ContactSection.vue'
</script>

<template>
  <HeroSection
    subpage
    eyebrow="Contact"
    title="Tell us about your business"
    subtitle="Send us a note with your business name and what you sell. We will reply within one business day with a quote and timeline."
    :image="siteConfig.hero.image"
  />
  <ContactSection
    title="Send a note"
    :intro="'Or call us — we are local and we answer the phone.'"
    :address="siteConfig.contact.address"
    :phone="siteConfig.contact.phone"
    :email="siteConfig.contact.email"
  />
</template>
