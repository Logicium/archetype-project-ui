import { createRouter, createWebHistory } from 'vue-router'
import { PLATFORM_ENABLED } from '@apotome/archetype-shared/platform/config'
import { adminRoutes } from '@apotome/archetype-shared/admin/routes'
import { installAnalytics } from '@apotome/archetype-shared/platform/track'
import { notFoundRoute, publicRoutes } from '../routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public pages and their SEO records live in src/routes.ts; the prerender
    // walks the same list.
    ...publicRoutes,
    // Admin is only mounted when the platform switch is on.
    ...(PLATFORM_ENABLED ? adminRoutes : []),
    notFoundRoute,
  ],
  scrollBehavior(_to, _from, saved) {
    if (saved) return saved
    if (_to.hash) return { el: _to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

installAnalytics(router)

export default router
