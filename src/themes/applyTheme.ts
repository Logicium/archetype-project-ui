import type { ColorSwatch, ThemeTokens, SiteVariant, Archetype, HeroStyle } from './tokens'

/**
 * Writes a theme + swatch + variant + archetype into CSS custom properties
 * on <html>. Stylesheets reference these via `var(--ap-*)` and via the
 * `[data-theme]` / `[data-variant]` / `[data-mode]` / `[data-archetype]`
 * selectors.
 */
export function applyTheme(
  theme: ThemeTokens,
  swatch: ColorSwatch,
  variant: SiteVariant = 'essentials',
  archetype: Archetype = 'dine',
  heroStyle: HeroStyle = '1'
): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const set = (k: string, v: string) => root.style.setProperty(k, v)

  // Colors
  set('--ap-primary', swatch.primary)
  set('--ap-accent', swatch.accent)
  set('--ap-surface', swatch.surface)
  set('--ap-surface-alt', swatch.surfaceAlt)
  set('--ap-ink', swatch.ink)
  set('--ap-ink-muted', swatch.inkMuted)
  set('--ap-line', swatch.line)
  // On-primary text (used inside primary buttons).
  set('--ap-on-primary', swatch.mode === 'dark' ? swatch.surface : swatch.surfaceAlt)

  // Typography
  set('--ap-font-heading', theme.fontHeading)
  set('--ap-font-body', theme.fontBody)
  set('--ap-font-mono', theme.fontMono)
  set('--ap-type-scale', String(theme.typeScale))
  set('--ap-tracking-heading', theme.letterSpacingHeading)
  set('--ap-tracking-body', theme.letterSpacingBody)
  set('--ap-heading-transform', theme.uppercaseHeadings ? 'uppercase' : 'none')
  set('--ap-heading-weight', String(theme.headingWeight))

  // Shape & space
  set('--ap-radius', theme.radius)
  set('--ap-radius-lg', theme.radiusLg)
  set('--ap-shadow', theme.shadow)
  set('--ap-shadow-lg', theme.shadowLg)
  set('--ap-section-py', theme.sectionPaddingY)
  set('--ap-container', theme.containerMax)

  // Identifying attributes for scoped CSS overrides
  root.setAttribute('data-theme', theme.name)
  root.setAttribute('data-swatch', swatch.name)
  root.setAttribute('data-mode', swatch.mode)
  root.setAttribute('data-variant', variant)
  root.setAttribute('data-archetype', archetype)
  root.setAttribute('data-hero-style', heroStyle)
  root.style.colorScheme = swatch.mode

  ensureFontLink(theme)
}

const FONT_LINK_ID = 'ap-theme-fonts'

function ensureFontLink(theme: ThemeTokens): void {
  if (typeof document === 'undefined' || !theme.fontUrl) return
  let link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null
  if (!link) {
    link = document.createElement('link')
    link.id = FONT_LINK_ID
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }
  if (link.href !== theme.fontUrl) link.href = theme.fontUrl
}
