/**
 * Product changelog shown at /changelog. Newest entry first. Keep entries
 * short and user-facing — what changed and why it helps, not internal detail.
 */
export type ChangeTag = 'New' | 'Improved' | 'Fixed'

export interface ChangelogItem {
  tag: ChangeTag
  text: string
}

export interface ChangelogEntry {
  date: string
  title: string
  summary?: string
  items: ChangelogItem[]
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: 'July 21, 2026',
    title: 'Edit your site right on the page',
    summary: 'Your site now updates itself, a new live editor, a homepage that shows off everything you get, and the legal pieces to connect Instagram.',
    items: [
      { tag: 'New', text: 'Automatic updates: your site now keeps itself current — new template improvements roll out to you on their own, no button to press. You can still update on demand or opt out from the site menu.' },
      { tag: 'New', text: 'Turn on Edit mode in the theme picker and edit any text straight on your live page — with a matching form panel that jumps to whatever you\'re editing. Changes show instantly.' },
      { tag: 'New', text: 'You can now delete your account and all your data yourself, plus new Privacy Policy, Terms, and Data Deletion pages.' },
      { tag: 'Improved', text: 'The homepage now shows the full picture — Google Maps, Instagram, top-of-search ranking, and a real Trinidad photo campaign.' },
    ],
  },
  {
    date: 'July 21, 2026',
    title: 'A cleaner, faster dashboard',
    summary: 'A broad refresh of the editing experience — plus the tools you need to run your site with less friction.',
    items: [
      { tag: 'New', text: 'Redesigned Analytics — traffic, top pages, devices, and uptime now render as clean charts, with a one-click switch to a plain table.' },
      { tag: 'New', text: 'Scan a photo of your printed menu and we fill in the items for you — no more retyping every dish.' },
      { tag: 'New', text: 'Menu items and categories can now have their own photos.' },
      { tag: 'New', text: 'A friendly clock time-picker for pickup hours, and you can now send new-order alerts to multiple email addresses.' },
      { tag: 'New', text: 'Pick an icon for each of your social links.' },
      { tag: 'New', text: 'Delete your account and all your data yourself, any time, from Account.' },
      { tag: 'New', text: 'Added Privacy Policy, Terms of Service, and a Data Deletion page.' },
      { tag: 'Improved', text: 'Reviews and Testimonials are now one tab — choose hand-written testimonials or live Google reviews in one place.' },
      { tag: 'Improved', text: 'A simpler Brand page, custom upload buttons, roomier description fields with a character countdown, and consistent rounded corners throughout.' },
      { tag: 'Improved', text: 'The map now zooms straight to the exact address you enter.' },
      { tag: 'Improved', text: 'Image action buttons in the gallery are always visible and mobile-friendly.' },
      { tag: 'Improved', text: 'Notifications now appear in the top-right, out of the way of the theme picker.' },
      { tag: 'Fixed', text: 'Scrolling over the Billing table no longer gets stuck.' },
    ],
  },
]
