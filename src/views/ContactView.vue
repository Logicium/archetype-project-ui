<script setup lang="ts">
import { siteConfig } from '../config/site.config'
import HeroSection from '@apotome/archetype-shared/components/sections/HeroSection.vue'
import ContactSection from '../components/sections/ContactSection.vue'
import BookingSection from '@apotome/archetype-shared/components/sections/BookingSection.vue'
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
  <BookingSection
    eyebrow="Schedule with us"
    title="Book a demo, walkthrough, or photo session"
    intro="Want a guided tour, a hands-on walkthrough of your project, or a photo campaign with our photographer? Pick a time — we'll send a confirmation and a calendar invite."
  />
</template>
