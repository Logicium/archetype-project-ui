<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { siteConfig } from './config/site.config'
import { useSiteTheme } from './composables/useSiteTheme'
import { useImagePreload } from './composables/useImagePreload'
import { useApScrollbar } from './composables/useApScrollbar'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import AppLoader from './components/AppLoader.vue'
import ThemeSwitcher from './components/ThemeSwitcher.vue'

const { init } = useSiteTheme()
const { isReady, preloadCritical } = useImagePreload()

onMounted(async () => {
  init(siteConfig.theme, siteConfig.swatch, 'essentials', 'project')
  useApScrollbar()
  await preloadCritical([
    siteConfig.hero.image,
    ...siteConfig.showcase.map(s => s.image),
  ])
})

const showSwitcher = true

const navLinks = [
  { to: '/', label: 'Overview' },
  { to: '/#pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
]
</script>

<template>
  <AppLoader :brand="siteConfig.brand" :visible="!isReady" />
  <AppHeader
    :brand="siteConfig.brand"
    :tagline="siteConfig.tagline"
    :links="navLinks"
    cta-label="Start a project"
    cta-to="/wizard"
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
