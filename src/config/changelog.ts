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
    date: 'July 24, 2026',
    title: 'A calmer, stickier editor window',
    summary: 'Small refinements that make the pop-out editor feel right.',
    items: [
      { tag: 'Improved', text: 'Minimizing the floating editor now shrinks it to its own little bar right where it was, instead of jumping back to the corner.' },
      { tag: 'Improved', text: 'The window now glides smoothly and calmly between docked, floating, and full screen, with no more jumpy resizing.' },
      { tag: 'New', text: 'The editor remembers its state. Reopen your site and it is right where you left it, same size, same spot, same tab.' },
    ],
  },
  {
    date: 'July 23, 2026',
    title: 'A sharper editor, and a new partner',
    summary: 'The live editor gets more powerful and more reliable, and we welcome a hometown partner.',
    items: [
      { tag: 'Fixed', text: 'Publishing from the live editor now saves every time. It could previously say "Published" without keeping your change, and that is resolved.' },
      { tag: 'New', text: 'Pop the editor out into a floating window you can drag and resize, send it full screen, or dock it back to the corner. The window glides smoothly between each.' },
      { tag: 'Improved', text: 'Every heading on your site is now editable, not just the body text, so you have full control over every word on the page.' },
      { tag: 'Improved', text: 'Replacing a photo is now a clear "Replace photo" button when you hover an image, and empty image slots show an upload prompt instead of a blank space.' },
      { tag: 'Improved', text: 'Long paragraphs get a taller editing box with a live word count, so it is easy to keep your copy tight.' },
      { tag: 'New', text: 'Apotome Labs is partnering with Emergent Campus, the nonprofit business campus igniting innovation across rural Colorado. You will see the collaboration on our homepage.' },
    ],
  },
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
