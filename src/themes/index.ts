import type { ThemeName, ThemeTokens } from './tokens'
import { studio } from './studio'
import { heritage } from './heritage'
import { vibrant } from './vibrant'

export const THEMES: Record<ThemeName, ThemeTokens> = {
  studio,
  heritage,
  vibrant,
}

export const THEME_LIST: ThemeTokens[] = [studio, heritage, vibrant]

export * from './tokens'
export * from './swatches'
export * from './applyTheme'
