import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import '@apotome/archetype-shared/styles/base.css'
import './styles/themes.css'
import './styles/scrollbar.css'
import { PLATFORM_ENABLED } from '@apotome/archetype-shared/platform/config'
import { useSiteContentStore } from '@apotome/archetype-shared/platform/siteContentStore'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

async function boot() {
  if (PLATFORM_ENABLED) {
    try { await useSiteContentStore(pinia).hydrate() } catch { /* fall back */ }
  }
  app.mount('#app')
}

void boot()
