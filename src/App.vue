<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { siteConfig } from './config/site.config'
import { PLATFORM_ENABLED } from '@apotome/archetype-shared/platform/config'
import { useAdminAuthStore } from '@apotome/archetype-shared/platform/adminAuthStore'
import { useSiteTheme } from '@apotome/archetype-shared/composables/useSiteTheme'
import { useSiteSeo } from '@apotome/archetype-shared/platform/seo'
import { useImagePreload } from '@apotome/archetype-shared/composables/useImagePreload'
import { useApScrollbar } from '@apotome/archetype-shared/composables/useApScrollbar'
import AppHeader from '@apotome/archetype-shared/components/layout/AppHeader.vue'
import AppFooter from '@apotome/archetype-shared/components/layout/AppFooter.vue'
import AppLoader from '@apotome/archetype-shared/components/AppLoader.vue'
import ThemeSwitcher from '@apotome/archetype-shared/components/ThemeSwitcher.vue'

const { init } = useSiteTheme()

/* Page titles and cards for the platform site itself. */
const PAGE_SEO: Record<string, { title: string; description?: string }> = {
  contact: { title: 'Contact', description: 'Talk to Apotome Labs about a website for your Trinidad business.' },
  wizard: { title: 'Start a project', description: 'Pick an archetype, a theme and a palette, and launch a professional website for your business.' },
  changelog: { title: "What's new", description: 'The latest improvements to Apotome Archetypes.' },
  beta: { title: 'Beta program', description: 'Apotome Archetypes is in beta: the Discoverable Trinidad program, its timeline and milestones.' },
  privacy: { title: 'Privacy policy' },
  terms: { title: 'Terms of service' },
  'data-deletion': { title: 'Data deletion' },
}
useSiteSeo({
  site: () => ({ ...siteConfig, photos: { hero: { src: siteConfig.hero.image } } }),
  archetype: 'project',
  page: (route) => PAGE_SEO[String(route.name ?? '')] ?? null,
})
const { isReady, progress, loaded, total, label, preloadCritical } = useImagePreload()
const auth = useAdminAuthStore()
onMounted(async () => {
  init(siteConfig.theme, siteConfig.swatch, 'essentials', 'project')
  useApScrollbar()
  if (PLATFORM_ENABLED) void auth.refresh()
  try {
    await preloadCritical([
      siteConfig.hero.image,
      ...siteConfig.showcase.map(s => s.image),
    ])
  } catch {
    // Malformed hydrated content must never strand the splash screen.
    await preloadCritical([])
  }
})

const loginLabel = computed(() => (PLATFORM_ENABLED ? (auth.owner ? 'Dashboard' : 'Log in') : undefined))
const loginTo = computed(() => (auth.owner ? '/admin' : '/admin/login'))

const navLinks = [
  { to: '/', label: 'Overview' },
  { to: '/#pricing', label: 'Pricing' },
  { to: '/beta', label: 'Beta' },
  { to: '/contact', label: 'Contact' },
]

/* Archetypes is in beta through the Discoverable Trinidad rollout (spring
   2027); the pill beside the brand makes that plain on every page. */
const betaBadge = { label: 'Beta', to: '/beta', title: 'Apotome Archetypes is in beta. See the program, timeline and milestones.' }

// Footer carries the nav links plus legal / policy pages (kept out of the
// header to avoid clutter). Legal pages are required for Instagram production.
const footerLinks = [
  ...navLinks,
  { to: '/changelog', label: "What's new" },
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
  { to: '/data-deletion', label: 'Data deletion' },
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
    :secondary-icon="!!auth.owner"
    :badge="betaBadge"
  />
  <main><RouterView /></main>
  <AppFooter
    :brand="siteConfig.brand"
    :blurb="siteConfig.mission"
    :address="siteConfig.contact.address"
    :phone="siteConfig.contact.phone"
    :email="siteConfig.contact.email"
    :links="footerLinks"
    :social="siteConfig.social"
  />
  <ThemeSwitcher />
</template>
