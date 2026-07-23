import { createRouter, createWebHistory } from 'vue-router'
import { PLATFORM_ENABLED } from '@apotome/archetype-shared/platform/config'
import { adminRoutes } from '@apotome/archetype-shared/admin/routes'
import { installAnalytics } from '@apotome/archetype-shared/platform/track'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    { path: '/contact', name: 'contact', component: () => import('../views/ContactView.vue') },
    { path: '/wizard', name: 'wizard', component: () => import('../views/WizardView.vue') },
    { path: '/changelog', name: 'changelog', component: () => import('../views/ChangelogView.vue') },
    { path: '/privacy', name: 'privacy', component: () => import('../views/legal/PrivacyView.vue') },
    { path: '/terms', name: 'terms', component: () => import('../views/legal/TermsView.vue') },
    { path: '/data-deletion', name: 'data-deletion', component: () => import('../views/legal/DataDeletionView.vue') },
    ...(PLATFORM_ENABLED ? adminRoutes : []),
  ],
  scrollBehavior(_to, _from, saved) {
    if (saved) return saved
    if (_to.hash) return { el: _to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

installAnalytics(router)

export default router
