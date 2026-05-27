<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { siteConfig } from './config/site.config'
import { useSiteTheme } from '@apotome/archetype-shared/composables/useSiteTheme'
import { useImagePreload } from '@apotome/archetype-shared/composables/useImagePreload'
import { useApScrollbar } from '@apotome/archetype-shared/composables/useApScrollbar'
import AppHeader from '@apotome/archetype-shared/components/layout/AppHeader.vue'
import AppFooter from '@apotome/archetype-shared/components/layout/AppFooter.vue'
import AppLoader from '@apotome/archetype-shared/components/AppLoader.vue'
import ThemeSwitcher from '@apotome/archetype-shared/components/ThemeSwitcher.vue'

const { init } = useSiteTheme()
const { isReady, progress, loaded, total, label, preloadCritical } = useImagePreload()
onMounted(async () => {
  init(siteConfig.theme, siteConfig.swatch, 'essentials', 'project')
  useApScrollbar()
  await preloadCritical([
    siteConfig.hero.image,
    ...siteConfig.showcase.map(s => s.image),
  ])
})

const navLinks = [
  { to: '/', label: 'Overview' },
  { to: '/#pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
]
</script>

<template>
  <AppLoader :brand="siteConfig.brand" :visible="!isReady" :progress="progress" :loaded="loaded" :total="total" :label="label" />
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
  <ThemeSwitcher />
</template>
