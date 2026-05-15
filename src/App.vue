<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { siteConfig } from './config/site.config'
import { useSiteTheme } from './composables/useSiteTheme'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import ThemeSwitcher from './components/ThemeSwitcher.vue'

const { init } = useSiteTheme()
onMounted(() => init(siteConfig.theme, siteConfig.swatch, 'essentials', 'project'))

const showSwitcher = true

const navLinks = [
  { to: '/', label: 'Overview' },
  { to: '/#pricing', label: 'Pricing' },
  { to: '/wizard', label: 'Site wizard' },
  { to: '/contact', label: 'Contact' },
]
</script>

<template>
  <AppHeader
    :brand="siteConfig.brand"
    :tagline="siteConfig.tagline"
    :links="navLinks"
    cta-label="Start a project"
    cta-to="/contact"
  />
  <main><RouterView /></main>
  <AppFooter
    :brand="siteConfig.brand"
    :blurb="siteConfig.mission"
    :address="siteConfig.contact.address"
    :phone="siteConfig.contact.phone"
    :email="siteConfig.contact.email"
    :links="navLinks"
    :social="siteConfig.social"
  />
  <ThemeSwitcher v-if="showSwitcher" />
</template>
