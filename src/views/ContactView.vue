<script setup lang="ts">
import { siteConfig } from '../config/site.config'
import ContactSection from '../components/sections/ContactSection.vue'
</script>

<template>
  <section class="ap-section">
    <div class="ap-container ap-section-head ap-section-head--center">
      <span class="ap-eyebrow">Contact</span>
      <h1>Tell us about your business</h1>
      <p style="color: var(--ap-ink-muted); max-width: 50ch">
        Send us a note with your business name and what you sell.
        We will reply within one business day with a quote and timeline.
      </p>
    </div>
  </section>
  <ContactSection
    title="Send a note"
    :intro="'Or call us — we are local and we answer the phone.'"
    :address="siteConfig.contact.address"
    :phone="siteConfig.contact.phone"
    :email="siteConfig.contact.email"
  />
</template>
