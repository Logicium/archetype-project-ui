import { ref, computed, watchEffect } from 'vue'
import type { ThemeName, SwatchName, ThemeTokens, ColorSwatch, SiteVariant, Archetype, HeroStyle } from '../themes/tokens'
import { THEMES } from '../themes'
import { SWATCHES } from '../themes/swatches'
import { applyTheme } from '../themes/applyTheme'

const themeRef = ref<ThemeName>('studio')
const swatchRef = ref<SwatchName>('sand')
const variantRef = ref<SiteVariant>('essentials')
const archetypeRef = ref<Archetype>('dine')
const heroStyleRef = ref<HeroStyle>('1')

/**
 * Reactive theme + swatch + variant + archetype controller.
 * Call `init()` once at app boot from the site config; any
 * component can then call `setTheme()` / `setSwatch()` / `setVariant()`.
 */
export function useSiteTheme() {
  const theme = computed<ThemeTokens>(() => THEMES[themeRef.value])
  const swatch = computed<ColorSwatch>(() => SWATCHES[swatchRef.value])

  function setTheme(name: ThemeName) { themeRef.value = name }
  function setSwatch(name: SwatchName) { swatchRef.value = name }
  function setVariant(v: SiteVariant) { variantRef.value = v }
  function setArchetype(a: Archetype) { archetypeRef.value = a }
  function setHeroStyle(s: HeroStyle) { heroStyleRef.value = s }
  function init(
    name: ThemeName,
    swatchName: SwatchName,
    variant: SiteVariant = 'essentials',
    archetype: Archetype = 'dine',
    heroStyle: HeroStyle = '1',
  ) {
    themeRef.value = name
    swatchRef.value = swatchName
    variantRef.value = variant
    archetypeRef.value = archetype
    heroStyleRef.value = heroStyle
  }

  watchEffect(() =>
    applyTheme(theme.value, swatch.value, variantRef.value, archetypeRef.value, heroStyleRef.value),
  )

  return {
    theme, swatch,
    themeName: themeRef, swatchName: swatchRef,
    variant: variantRef, archetype: archetypeRef, heroStyle: heroStyleRef,
    setTheme, setSwatch, setVariant, setArchetype, setHeroStyle, init,
  }
}
