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
    date: 'October 29, 2026',
    title: 'Your name in every tab, and sites built to be found',
    summary: 'Every site now introduces itself properly to browsers, search engines and link previews, using the details you keep in your dashboard.',
    items: [
      { tag: 'New', text: 'Browser tabs and search results show your business, not the template. The home page reads as your name and tagline, and every other page as the page and your name, like "The full menu · Mesa Trinidad".' },
      { tag: 'New', text: 'Search descriptions come from your blurb, shared links show your hero photo in texts and social posts, and your uploaded favicon sits in the tab.' },
      { tag: 'New', text: 'Search engines get your business details in the format they read best: what kind of business you are, plus your phone, email, address and social profiles. It helps you show up as a local business.' },
      { tag: 'New', text: 'Every site ships a sitemap of its public pages, and keeps the dashboard, checkout and order pages out of search results.' },
      { tag: 'Improved', text: 'Change your name, tagline, description, contact details or favicon in the dashboard and all of the above follows. Adding a custom domain points your sitemap at it with your next site update.' },
      { tag: 'New', text: 'Restaurants can deliver. Offer pickup, delivery or both from Ordering settings, with a delivery fee, a minimum order and your delivery area. Delivery orders take an address at checkout, print it on the kitchen ticket, and email the customer when the order is on its way.' },
      { tag: 'Improved', text: 'Shops choose pickup, shipping or both with one setting instead of two switches, and checkout only shows the options you offer.' },
    ],
  },
  {
    date: 'October 28, 2026',
    title: 'A real checkout, order tracking, and payments your way',
    summary: 'Shops and restaurants got a proper checkout and an order page, owners got a fulfillment tracker that keeps customers posted, and Square joined Stripe. Apotome Archetypes is now officially in beta.',
    items: [
      { tag: 'New', text: 'Checkout is a real page now, on shop and restaurant sites alike: contact details, pickup or shipping with a full address form, a note, and an order summary you can still adjust, then on to payment. The old pop-up cart is gone.' },
      { tag: 'New', text: 'Every order has its own page: what was bought, where it is going, whether it is paid, and a live tracker of where it is. The link is in every email, so a customer can check back any time.' },
      { tag: 'New', text: 'Order fulfillment for shops. From the dashboard, move an order through Received, Label printed, Shipped and Delivered (or Ready for pickup and Picked up), add the tracking number and carrier, and leave a note. The customer gets an email at every step, with a tracking link once it ships.' },
      { tag: 'New', text: 'Restaurant customers now hear from you too: an email when the kitchen confirms the order, when it is ready, and if it has to be cancelled.' },
      { tag: 'New', text: 'Take payments with Square or Stripe. Already run your business on Square? Connect the account you have and online orders settle straight into it. Stripe accounts now come with a full Stripe dashboard of your own. Connect both and choose which one runs checkout.' },
      { tag: 'New', text: 'Online payment for pickup orders. Restaurants with a connected account take payment at checkout; pay at pickup stays the fallback when payment is switched off.' },
      { tag: 'New', text: 'A catalog menu for shops. Switch the Shop link in your header to a dropdown of your categories, each with its subcategories, and every entry opens the shop already filtered. Products can carry a category, and the shop page filters by it.' },
      { tag: 'New', text: 'Apotome Archetypes is in beta, and now says so: a Beta badge beside the brand on this site, and a Beta page with the program, timeline and milestones through spring 2027.' },
      { tag: 'Improved', text: 'The dashboard now tells you when a site update is waiting and lets you apply it on the spot. Words, photos and theme changes have always been instant; new features ship as site updates, and the notice makes the difference plain.' },
      { tag: 'Improved', text: 'The theme picker fits a laptop screen, scrolls when docked, sizes itself to each tab, and the color studio reads with far less text.' },
      { tag: 'Improved', text: 'Long menus no longer fold courses away. Every dish is on the page, with the course rail still there to jump around.' },
      { tag: 'Fixed', text: 'Saving words or photos in the dashboard could quietly switch a site to the Atlas theme. Content saves no longer touch your look.' },
      { tag: 'Fixed', text: 'Dashboard pages scroll with the mouse wheel again, and photo upload boxes in the menu editor are no longer squashed.' },
    ],
  },
  {
    date: 'September 21, 2026',
    title: 'Dishes that know their sizes',
    summary: 'Menus sold by size show as one dish, and the Portfolio tier lands correctly however it was bought.',
    items: [
      { tag: 'New', text: 'Dishes sold in sizes, like Cup and Bowl or 12 inch and 16 inch, now appear as one dish with a size to pick, on the menu and in online ordering. Menus set up as separate items are combined automatically; the editor shows the sizes on each dish.' },
      { tag: 'Fixed', text: 'Sites bought with the Portfolio tier, or upgraded to it later, reliably get the Portfolio layout, gallery page and photo carousel the moment the plan applies.' },
    ],
  },
  {
    date: 'August 24, 2026',
    title: 'Kitchen tickets from your POS, and domains that just work',
    summary: 'Online orders print in the kitchen through Clover, and a custom domain is live the moment you save it.',
    items: [
      { tag: 'New', text: 'Connect a Clover point of sale from Ordering settings. Online orders land in Clover like any other order and print a kitchen ticket, and the dashboard shows whether each ticket printed, with a resend button when it did not.' },
      { tag: 'Improved', text: 'A custom domain works the moment it is saved. Your site starts talking to its dashboard and ordering tools on the new address right away, with no wait for a restart.' },
      { tag: 'Improved', text: 'POS failures are explained in plain words in the dashboard, including the permission fixes Clover sometimes needs, instead of a bare error.' },
    ],
  },
  {
    date: 'August 2, 2026',
    title: 'Every word on your site is now yours to edit',
    summary: 'Section headings across all five templates became editable, long menus got a proper layout, and pickup times fit on one screen.',
    items: [
      { tag: 'New', text: 'Every heading, intro line and button label on your site is now editable from Content. Copy that used to be baked into the template \u2014 things like your visit note, your hours line, or a room count \u2014 shows up as a normal field you can change.' },
      { tag: 'New', text: 'Long menus have their own layout: courses collapse, each shows its item count, a course rail jumps you straight to one, and dishes flow into columns instead of a single endless list.' },
      { tag: 'New', text: 'Choosing a pickup time no longer means scrolling a wall of buttons. Take the next available slot in one tap, or pick a day and a time of day \u2014 a full week of openings now fits on one screen.' },
      { tag: 'Improved', text: 'Your Products page feeds the Shop add-on automatically, the same way your Menu feeds online ordering. No retyping your catalog to start selling.' },
      { tag: 'Fixed', text: 'Room searches on booking-enabled sites returned "no rooms" even with rooms listed. Availability now reads your Rooms page directly, so booking works as soon as the add-on is on.' },
      { tag: 'Fixed', text: 'Updating a site no longer flashes a false "build failed" a second after you click. The dashboard waits for your actual new build instead of reporting the previous one.' },
      { tag: 'Fixed', text: 'New sites provision reliably again after a credential and template-name mix-up, and site builds no longer fail on their styling step.' },
    ],
  },
  {
    date: 'July 28, 2026',
    title: 'The color instrument, an editorial theme index, and a $50 Portfolio upgrade',
    summary: 'Color theory you can spin, themes typeset in their own faces, and honest upgrade pricing.',
    items: [
      { tag: 'New', text: 'Color, with a thesis: an interactive 3D color wheel on the home page. Spin it, trace real harmony geometry, and apply any palette to the whole site live.' },
      { tag: 'New', text: 'Every palette now shows its full anatomy: primary, accent, surface, ink and hairline colors, labeled by where each is used, with a light/dark switch built into the wheel.' },
      { tag: 'New', text: 'The theme picker on the home page is now an editorial index: each personality set huge in its own typefaces, description alongside, one tap to wear it.' },
      { tag: 'New', text: 'Two more harmony models on the wheel: Square and Monochrome, and every model now explores from your palette’s actual primary color.' },
      { tag: 'New', text: 'Delivery and Reservations are coming soon to Add-ons: local delivery zones on top of ordering, and table reservations with seating windows.' },
      { tag: 'Improved', text: 'Upgrading an existing site to Portfolio now costs the difference, $50, not the full new-site price.' },
      { tag: 'Improved', text: 'Signal and Cadmium palettes lightened up: tinted paper instead of a full-color page, with the loud color kept for buttons and accents.' },
      { tag: 'Improved', text: 'Oxblood is now Garnet, and the reviews map now zooms to your listing instead of showing the whole world.' },
      { tag: 'Fixed', text: 'Dashboard pages now scroll with the sidebar staying put and a proper scrollbar at the window edge; closing the dashboard no longer breaks the page behind it.' },
      { tag: 'Fixed', text: 'Sites build and publish reliably again after our styling engine update.' },
      { tag: 'Fixed', text: 'The settings gear no longer tilts the divider beside it while you hover the site settings pill.' },
    ],
  },
  {
    date: 'July 26, 2026',
    title: 'A new flagship look, richer color, and a smarter dashboard',
    summary: 'The biggest design release yet: a fifth theme, a rebuilt color system, and a dashboard that works the way you do.',
    items: [
      { tag: 'New', text: 'Meet The Atlas, our new flagship theme: oversized editorial type, hairline grids, and numbered sections. It leads the theme picker.' },
      { tag: 'New', text: 'The color system was rebuilt: 18 iconic palettes across six moods, and every one now comes in a light and a dark version.' },
      { tag: 'New', text: 'New layout options everywhere: hero styles for The Atlas, four About-section layouts, and four navbar styles, all live-switchable.' },
      { tag: 'New', text: 'Your dashboard now opens as a fullscreen overlay over your site, with a close button to drop straight back to the page.' },
      { tag: 'New', text: 'A grouped sidebar replaces the long tab row: site tools on top, workspace below, collapsible to a slim icon rail.' },
      { tag: 'New', text: 'Photos got their own page: every upload slot now says exactly where it appears on your site, and empty slots show a clean placeholder.' },
      { tag: 'New', text: 'Add-ons page: turn on any premium tool for your site, free while in beta. Beta users keep them when pricing begins.' },
      { tag: 'New', text: 'Upgrade to Portfolio right from the dashboard: hero photo carousel, photo-forward layouts, and a 16-photo gallery. Photo campaigns can be booked and paid the same way.' },
      { tag: 'New', text: 'Reviews now defaults to live Google reviews with a one-click switch to hand-written testimonials, plus a guided path for setting up or sharing your Google Business Profile.' },
      { tag: 'Improved', text: 'Online ordering links to your Menu: import every dish with one click instead of retyping.' },
      { tag: 'Improved', text: 'The Ironwood theme got a full redesign: engineered plates and clean rules instead of the old hazard stripes.' },
      { tag: 'Improved', text: 'The editor window now opens with one fluid motion and keeps itself fully on screen when expanded near an edge.' },
      { tag: 'Fixed', text: 'Site cards now show when each site last deployed, dropdown menus are no longer cut off, and every icon sits perfectly centered.' },
      { tag: 'Fixed', text: 'Cleaned up stray garbled characters that could appear in dashboard text.' },
    ],
  },
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
