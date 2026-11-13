/**
 * The public route table, with each page's SEO record.
 *
 * This is the only list of public routes for websites.apotomelabs.com. The
 * router spreads it; the prerender (scripts/prerender.ts) walks it to write
 * one HTML file per page, the sitemap, robots.txt and llms.txt; the runtime
 * applies the same records on navigation. Admin routes live in the router and
 * are never indexed. Bodies come from the config modules the pages render
 * (site, pricing, beta, changelog); the legal pages keep their prose in the
 * .vue files, so their bodies carry the title, date and summary those pages
 * open with. No browser dependency here: the prerender imports this under Node.
 */
import type { RouteRecordRaw } from 'vue-router'
import { absUrl, esc, faqNode, serviceNode, type SiteConfig } from '@apotome/archetype-shared/seo/index'
import * as b from '@apotome/archetype-shared/seo/bodies'
import { BETA, monthLabel } from './config/beta'
import { CHANGELOG } from './config/changelog'
import { BUNDLES, PRICING } from './config/pricing'
import { siteConfig as c } from './config/site.config'

const forSale = () => PRICING.filter((p) => !p.upgradeOnly)

function pricingBody(title = 'Pricing'): string {
  const items = forSale()
  return `<section>${b.h(2, title)}<ul>${items
    .map((p) => `<li><strong>${esc(p.name)}</strong>: $${p.price}${p.unit ? ` ${esc(p.unit)}` : ''}. ${esc(p.blurb)}${p.includes?.length ? b.ul(p.includes) : ''}</li>`)
    .join('')}</ul>${b.h(3, 'Bundles')}<ul>${BUNDLES.map((bd) => `<li><strong>${esc(bd.name)}</strong>: $${bd.price}. ${esc(bd.blurb)} Includes ${esc(bd.items.join(', '))}.</li>`).join('')}</ul></section>`
}

function priceNodes(site: SiteConfig): object[] {
  return forSale().map((p, i) => {
    const node = serviceNode(site, { name: p.name, description: p.blurb, type: 'Website design', offers: { price: p.price, description: p.unit } }) as Record<string, unknown>
    node['@id'] = `${absUrl(site, '/')}#offer-${i + 1}`
    return node
  })
}

function faqBody(): string {
  if (!c.faq.length) return ''
  return `<section>${b.h(2, 'Questions')}${c.faq.map((f) => `${b.h(3, f.q)}${b.p(f.a)}`).join('')}</section>`
}

/** The legal pages open with these lines (views/legal/*.vue). */
const LEGAL = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'July 21, 2026',
    summary: 'Plain-language version: we only collect what we need to build and run your website, we never sell your data, and you can delete everything at any time.',
  },
  terms: {
    title: 'Terms of Service',
    updated: 'July 21, 2026',
    summary: 'The short version: you own your content, we build and host your site, be reasonable about how you use it, and either of us can end the arrangement.',
  },
  'data-deletion': {
    title: 'Data Deletion',
    updated: 'July 21, 2026',
    summary: 'You can permanently delete your account and all your data at any time, from your dashboard in a couple of clicks, or by emailing us.',
  },
} as const

function legalRoute(key: keyof typeof LEGAL, path: string, component: RouteRecordRaw['component'], description: string): RouteRecordRaw {
  const doc = LEGAL[key]
  return {
    path,
    name: key,
    component: component!,
    meta: {
      seo: {
        title: doc.title,
        description,
        lastmod: b.isoDate(doc.updated),
        body: () =>
          b.main(
            b.hero(doc.title, `Last updated ${doc.updated}`, doc.summary),
            `<p>Questions? Email <a href="mailto:kisora@apotomelabs.com">kisora@apotomelabs.com</a>.</p>`,
          ),
      },
    },
  } as RouteRecordRaw
}

export const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('./views/HomeView.vue'),
    meta: {
      seo: {
        description: () => b.compose([c.mission, 'Restaurants, stays, shops, trades and venues, from $200 to launch. Pay once, own your site']),
        schema: ({ site, path }) => [...priceNodes(site), faqNode(site, path, c.faq)].filter((n): n is object => Boolean(n)),
        body: () =>
          b.main(
            b.hero(c.hero.title, c.tagline, c.hero.subtitle),
            `<section>${c.pillars.map((p) => `${b.h(2, p.title)}${b.p(p.body)}`).join('')}</section>`,
            `<section>${b.h(2, 'One engine. Five kinds of business.')}<ul>${c.showcase
              .map((s) => `<li><strong>${esc(s.name)}</strong> (${esc(s.archetype)}): ${esc(s.blurb)}${s.liveUrl ? ` <a href="${esc(s.liveUrl)}">See it live</a>` : ''}</li>`)
              .join('')}</ul></section>`,
            pricingBody('Pick what you need'),
            faqBody(),
            b.contact({ email: c.contact.email }, 'Get in touch'),
          ),
      },
    },
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('./views/ContactView.vue'),
    meta: {
      seo: {
        title: 'Contact',
        description:
          'Talk to Apotome Labs about a website for your Trinidad business. Send your business name and what you sell, and get a quote and timeline within one business day.',
        body: () =>
          b.main(
            b.hero('Tell us about your business', 'Contact', 'Send us a note with your business name and what you sell. We will reply within one business day with a quote and timeline.'),
            b.contact({ email: c.contact.email }, 'Send a note'),
            b.p('Book a demo, a walkthrough of your project, or a photo session with our photographer.'),
          ),
      },
    },
  },
  {
    path: '/wizard',
    name: 'wizard',
    component: () => import('./views/WizardView.vue'),
    meta: {
      seo: {
        title: 'Start your website',
        description:
          'Start a website for your business: pick an archetype, a design theme and a color palette, add your details and photos, and launch from $200, paid once.',
        body: () =>
          b.main(
            b.hero('Start your website', c.tagline, 'Pick an archetype, a theme and a palette, add your business details, and launch a professional website.'),
            `<section>${b.h(2, 'Archetypes')}${b.ul(c.showcase.map((s) => `${s.name} (${s.archetype}): ${s.blurb}`))}</section>`,
            pricingBody(),
          ),
      },
    },
  },
  {
    path: '/changelog',
    name: 'changelog',
    component: () => import('./views/ChangelogView.vue'),
    meta: {
      seo: {
        title: "What's new",
        description: () =>
          b.compose([`The latest improvements to Apotome Archetypes, newest first${CHANGELOG[0] ? `: ${CHANGELOG[0].title}` : ''}`, CHANGELOG[0]?.summary]),
        lastmod: () => b.isoDate(CHANGELOG[0]?.date),
        body: () =>
          b.main(
            b.hero("What's new", 'Product updates', 'The latest improvements to Apotome. More to come.'),
            CHANGELOG.map((e) => `<article>${b.h(2, e.title)}<p><time datetime="${esc(b.isoDate(e.date) ?? e.date)}">${esc(e.date)}</time></p>${b.p(e.summary)}${b.ul(e.items.map((it) => `${it.tag}: ${it.text}`))}</article>`).join(''),
          ),
      },
    },
  },
  {
    path: '/beta',
    name: 'beta',
    component: () => import('./views/BetaView.vue'),
    meta: {
      seo: {
        title: 'Beta program',
        description: () =>
          b.compose([
            `Apotome Archetypes is in beta through ${monthLabel(BETA.period.end)}: the ${BETA.programName} program brings ${BETA.cohortSize} Trinidad businesses online at no cost to them`,
            'Timeline, milestones and partners',
          ]),
        body: () =>
          b.main(
            b.hero('Apotome Archetypes is in beta.', `${BETA.programName}: ${BETA.programSubtitle}`, BETA.acknowledgment),
            `<section>${b.h(2, 'Timeline')}${BETA.phases
              .map((ph) => `<article>${b.h(3, ph.title)}<p>${esc(monthLabel(ph.start))} to ${esc(monthLabel(ph.end))}</p>${b.p(ph.summary)}${b.ul(ph.deliverables)}</article>`)
              .join('')}</section>`,
            `<section>${b.h(2, 'Milestones')}${b.ul(BETA.milestones.map((m) => `${m.title} (${m.target}): ${m.detail}`))}</section>`,
            `<section>${b.h(2, 'Partners')}${b.ul(BETA.partners.map((p) => `${p.name}: ${p.role}`))}</section>`,
            `<p>Feedback: <a href="mailto:${esc(BETA.feedbackEmail)}">${esc(BETA.feedbackEmail)}</a></p>`,
          ),
      },
    },
  },
  legalRoute(
    'privacy',
    '/privacy',
    () => import('./views/legal/PrivacyView.vue'),
    'What Apotome Labs collects to build and run your website, why, and your choices. We never sell your data, and you can delete everything at any time.',
  ),
  legalRoute(
    'terms',
    '/terms',
    () => import('./views/legal/TermsView.vue'),
    'The terms for building and hosting your site with Apotome Archetypes: you own your content, we build and host the site, and either side can end it.',
  ),
  legalRoute(
    'data-deletion',
    '/data-deletion',
    () => import('./views/legal/DataDeletionView.vue'),
    'How to delete your Apotome account and all its data, including Instagram and Google connections: from your dashboard in a few clicks, or by email.',
  ),
]

/** The catch-all: a real not-found page, noindex, never a redirect home. */
export const notFoundRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'not-found',
  component: () => import('./views/NotFoundView.vue'),
  meta: { seo: { title: 'Page not found', description: 'That page is not on websites.apotomelabs.com.', noindex: true } },
}
