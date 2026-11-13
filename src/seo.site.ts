/**
 * Who this site is, for search engines and assistants.
 *
 * The facts come from the owner's content (brand, tagline, blurb, contact,
 * hours, socials, photos): the demo config in a template build, the tenant
 * record laid over it in a provisioned build, the published overlay at
 * runtime. This file only says which archetype the template is and what to
 * fall back to when a record is thin. Pure data: the prerender imports it
 * under Node and the app imports it in the browser.
 */
import type { SiteConfig } from '@apotome/archetype-shared/seo/index'
import { siteConfigFor, type SeoArchetype, type SeoFallback } from '@apotome/archetype-shared/seo/siteConfig'
import { siteConfig } from './config/site.config'

export const archetype: SeoArchetype = 'project'

/** websites.apotomelabs.com is this template's own deployment, not a tenant. */
export const fallback: SeoFallback = {
  brand: 'Apotome Archetypes',
  tagline: 'Websites for Trinidad',
  description: 'Professional, fast websites for Trinidad businesses: restaurants, stays, shops, trades and venues. Pay once, own your site.',
  siteUrl: 'https://websites.apotomelabs.com',
}

/**
 * The runtime SiteConfig, built from the reactive site config as it stands
 * now. The origin comes from the same variables the build used
 * (VITE_SITE_URL, VERCEL_PROJECT_PRODUCTION_URL; see envPrefix in
 * vite.config.ts), so the head the app applies matches the prerendered one.
 */
export function seoSite(): SiteConfig {
  // vite.config defines VITE_SITE_SLUG for the platform client; this site is
  // still never a provisioned tenant, so it keeps its own share card
  const env = { ...(import.meta.env as Record<string, unknown>), VITE_SITE_SLUG: undefined, VITE_SITE_ID: undefined }
  return siteConfigFor({ tenant: siteConfig, archetype, fallback, env })
}
