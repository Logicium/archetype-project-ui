import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import '@apotome/archetype-shared/styles/base.scss'
import './styles/themes.scss'
import './styles/scrollbar.css'
import '@apotome/archetype-shared/styles/elevate.scss'
import { PLATFORM_ENABLED } from '@apotome/archetype-shared/platform/config'
import { useSiteContentStore, applyDeep } from '@apotome/archetype-shared/platform/siteContentStore'
import { siteConfig } from './config/site.config'
import { initApotomeAnalytics } from './kit/analytics'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

async function boot() {
  const store = useSiteContentStore(pinia)
  store.setBuildTimeConfig(siteConfig)
  if (PLATFORM_ENABLED) {
    try {
      await store.hydrate()
      applyDeep(siteConfig as unknown as Record<string, unknown>, store.config)
    } catch { /* fall back to build-time config */ }
  }
  app.mount('#app')

  /*
   * Page views for websites.apotomelabs.com, reported to the Apotome Labs
   * studio (the project row "apotome-archetypes"), not to the archetype
   * platform's own service: this is the studio's marketing site for the
   * template product, so its traffic belongs beside every other client
   * site on the studio's analytics page.
   *
   * Inert until both variables are set, so a local run sends nothing.
   */
  initApotomeAnalytics({
    siteKey: import.meta.env.VITE_APOTOME_SITE_KEY,
    apiUrl: import.meta.env.VITE_APOTOME_API_URL,
    router,
  })
}

void boot()
