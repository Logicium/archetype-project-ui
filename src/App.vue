<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { siteConfig } from './config/site.config'
import { PLATFORM_ENABLED } from '@apotome/archetype-shared/platform/config'
import { useAdminAuthStore } from '@apotome/archetype-shared/platform/adminAuthStore'
import { useSiteTheme } from '@apotome/archetype-shared/composables/useSiteTheme'
import { useImagePreload } from '@apotome/archetype-shared/composables/useImagePreload'
import { useApScrollbar } from '@apotome/archetype-shared/composables/useApScrollbar'
import AppHeader from '@apotome/archetype-shared/components/layout/AppHeader.vue'
import AppFooter from '@apotome/archetype-shared/components/layout/AppFooter.vue'
import AppLoader from '@apotome/archetype-shared/components/AppLoader.vue'
import ThemeSwitcher from '@apotome/archetype-shared/components/ThemeSwitcher.vue'

const { init } = useSiteTheme()
const { isReady, progress, loaded, total, label, preloadCritical } = useImagePreload()
const auth = useAdminAuthStore()
onMounted(async () => {
  init(siteConfig.theme, siteConfig.swatch, 'essentials', 'project')
  useApScrollbar()
  if (PLATFORM_ENABLED) void auth.refresh()
  await preloadCritical([
    siteConfig.hero.image,
    ...siteConfig.showcase.map(s => s.image),
  ])
})

const loginLabel = computed(() => (PLATFORM_ENABLED ? (auth.owner ? 'Dashboard' : 'Log in') : undefined))
const loginTo = computed(() => (auth.owner ? '/admin' : '/admin/login'))

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
    :secondary-label="loginLabel"
    :secondary-to="loginTo"
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
