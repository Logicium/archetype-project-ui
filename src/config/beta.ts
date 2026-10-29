/**
 * The beta program as described in the Discoverable Trinidad grant
 * application (Apotome Labs, June 2026): a first cohort of Trinidad tourism
 * businesses brought online through the Archetypes pipeline over a nine-month
 * implementation period, August 2026 to April 2027.
 *
 * Dates drive the "in progress / upcoming / complete" state on the beta page
 * automatically; set `status` on a phase to override that when reality drifts
 * from the plan.
 */

export type PhaseStatus = 'upcoming' | 'current' | 'complete'

export interface BetaPhase {
  title: string
  /** First day of the phase, ISO date. */
  start: string
  /** Last day of the phase, ISO date. */
  end: string
  summary: string
  deliverables: string[]
  status?: PhaseStatus
}

export interface BetaMilestone {
  title: string
  target: string
  detail: string
}

export const BETA = {
  /** Shown in the header badge and on the page. */
  label: 'Beta',
  programName: 'Discoverable Trinidad',
  programSubtitle: 'Digital Storefronts Initiative, powered by Apotome Archetypes',
  period: { start: '2026-08-01', end: '2027-04-30' },
  /** Awarded in full by the Lodging Tax Advisory Board (October 2026). */
  grantStatus: 'awarded' as 'submitted' | 'awarded',
  grantBody: 'City of Trinidad Lodging Tax Advisory Board',
  acknowledgment: 'This project was made possible in part by funding provided by the City of Trinidad Lodging Tax Fund.',
  cohortSize: 15,
  surveyed: { listings: 107, withoutWebsite: 28 },
  feedbackEmail: 'hello@apotomelabs.com',

  phases: [
    {
      title: 'Onboarding and prioritization',
      start: '2026-08-01',
      end: '2026-09-30',
      summary: 'Working with the Chamber of Commerce and community partners to find the businesses in greatest need, starting with the ones that have no website at all.',
      deliverables: ['Cohort of businesses selected by need', 'Content, branding and photography needs collected'],
    },
    {
      title: 'Photography and content',
      start: '2026-09-01',
      end: '2026-11-30',
      summary: 'A shared professional photography package for storefronts, products and menus, plus hours, descriptions, menus and booking details from each business.',
      deliverables: ['Storefront, product and menu photography', 'Content gathered for every participating business'],
    },
    {
      title: 'Site generation and quality checks',
      start: '2026-10-01',
      end: '2027-01-31',
      summary: 'Each business runs through the Archetypes pipeline. Design and content are tuned, domains registered, search and Google Business Profiles configured, and every site checked on phone and desktop.',
      deliverables: ['Sites built and tuned', 'Domains, SEO and Google Business Profiles live', 'Mobile and desktop quality pass on every site'],
    },
    {
      title: 'Explore Trinidad directory and public launch',
      start: '2027-01-01',
      end: '2027-03-31',
      summary: 'A map-based, mobile-first directory that organizes participating businesses by Shop, Dine and Stay, QR-coded window decals on storefronts, and the launch campaign.',
      deliverables: ['Explore Trinidad directory hub live', 'QR window decals distributed', 'Press, social campaign and launch event'],
    },
    {
      title: 'Evaluation and handoff',
      start: '2027-03-01',
      end: '2027-04-30',
      summary: 'Search visibility, traffic and engagement reviewed, feedback gathered from businesses and visitors, outcomes documented, and the affordable renewal path set so sites stay live beyond the program.',
      deliverables: ['Outcomes report', 'Renewal and maintenance path in place', 'Beta closes; pricing and terms finalized'],
    },
  ] as BetaPhase[],

  milestones: [
    { title: 'First cohort online', target: 'By early 2027', detail: '15 tourism-facing businesses with a fast, mobile-first site of their own, at no cost to them.' },
    { title: 'Explore Trinidad directory', target: 'Early 2027', detail: 'One place for visitors to plan where to shop, dine and stay, linking every participating site.' },
    { title: 'Storefront decals', target: 'With the public launch', detail: 'QR-coded window decals so a passer-by can open the site and the directory on the spot.' },
    { title: 'Discoverability', target: 'Year one', detail: 'A conservative projection of 9,000 or more visitor sessions across the cohort from search, Google Business and the directory.' },
    { title: 'Beta closes', target: 'Spring 2027', detail: 'Outcomes reported, the renewal path established, and Apotome Archetypes moves from beta to its first full release.' },
  ] as BetaMilestone[],

  /** Confirmed partners only; add others once their support is official. */
  partners: [
    { name: 'Trinidad and Las Animas County Chamber of Commerce', role: 'Business recruitment and referrals, co-promotion' },
    { name: 'Emergent Campus', role: 'Organizational support and community network' },
    { name: 'City of Trinidad', role: 'Funding partner and tourism coordination' },
  ],
}

/** Date-driven phase state, unless the config pins one. */
export function phaseStatus(phase: BetaPhase, today = new Date()): PhaseStatus {
  if (phase.status) return phase.status
  const t = today.getTime()
  if (t < new Date(phase.start).getTime()) return 'upcoming'
  if (t > new Date(phase.end + 'T23:59:59').getTime()) return 'complete'
  return 'current'
}

/** "Aug 2026" style label for a phase edge. */
export function monthLabel(iso: string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso + 'T12:00:00Z'))
}
