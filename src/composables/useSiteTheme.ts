import { ref, computed, watchEffect } from 'vue'
import type { ThemeName, SwatchName, ThemeTokens, ColorSwatch, SiteVariant, Archetype, HeroStyle, FooterStyle } from '../themes/tokens'
import { THEMES } from '../themes'
import { SWATCHES } from '../themes/swatches'
import { applyTheme } from '../themes/applyTheme'

const STORAGE_KEY = 'ap-theme-config'

function readStorage(): Partial<{ theme: ThemeName; swatch: SwatchName; variant: SiteVariant; heroStyle: HeroStyle; footerStyle: FooterStyle }> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') } catch { return {} }
}

const _saved = readStorage()

const themeRef = ref<ThemeName>(_saved.theme ?? 'studio')
const swatchRef = ref<SwatchName>(_saved.swatch ?? 'sand')
const variantRef = ref<SiteVariant>(_saved.variant ?? 'essentials')
const archetypeRef = ref<Archetype>('dine')
const heroStyleRef = ref<HeroStyle>(_saved.heroStyle ?? '1')
const footerStyleRef = ref<FooterStyle>(_saved.footerStyle ?? '1')

// Module-level effect — single instance, persists + syncs CSS vars on every change
watchEffect(() => {
  applyTheme(
    THEMES[themeRef.value],
    SWATCHES[swatchRef.value],
    variantRef.value,
    archetypeRef.value,
    heroStyleRef.value,
    footerStyleRef.value,
  )
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      theme: themeRef.value,
      swatch: swatchRef.value,
      variant: variantRef.value,
      heroStyle: heroStyleRef.value,
      footerStyle: footerStyleRef.value,
    }))
  } catch { /* storage unavailable */ }
})

/**
 * Reactive theme + swatch + variant + archetype controller.
 * Call `init()` once at app boot from the site config; any
 * component can then call `setTheme()` / `setSwatch()` / `setVariant()`.
 * Settings are persisted to localStorage and restored on refresh.
 */
export function useSiteTheme() {
  const theme = computed<ThemeTokens>(() => THEMES[themeRef.value])
  const swatch = computed<ColorSwatch>(() => SWATCHES[swatchRef.value])

  function setTheme(name: ThemeName) { themeRef.value = name }
  function setSwatch(name: SwatchName) { swatchRef.value = name }
  function setVariant(v: SiteVariant) { variantRef.value = v }
  function setArchetype(a: Archetype) { archetypeRef.value = a }
  function setHeroStyle(s: HeroStyle) { heroStyleRef.value = s }
  function setFooterStyle(s: FooterStyle) { footerStyleRef.value = s }
  function init(
    name: ThemeName,
    swatchName: SwatchName,
    variant: SiteVariant = 'essentials',
    archetype: Archetype = 'dine',
    heroStyle: HeroStyle = '1',
    footerStyle: FooterStyle = '1',
  ) {
    // Archetype is always from site config, never from user storage
    archetypeRef.value = archetype
    // User-configurable fields: only apply init defaults when nothing is saved
    if (!_saved.theme) themeRef.value = name
    if (!_saved.swatch) swatchRef.value = swatchName
    if (!_saved.variant) variantRef.value = variant
    if (!_saved.heroStyle) heroStyleRef.value = heroStyle
    if (!_saved.footerStyle) footerStyleRef.value = footerStyle
  }

  return {
    theme, swatch,
    themeName: themeRef, swatchName: swatchRef,
    variant: variantRef, archetype: archetypeRef, heroStyle: heroStyleRef, footerStyle: footerStyleRef,
    setTheme, setSwatch, setVariant, setArchetype, setHeroStyle, setFooterStyle, init,
  }
}
