<script setup lang="ts">
import { useSiteTheme } from '../composables/useSiteTheme'
import { THEME_LIST } from '../themes'
import { SWATCH_LIST } from '../themes/swatches'

const { themeName, swatchName, variant, heroStyle, setTheme, setSwatch, setVariant, setHeroStyle } = useSiteTheme()
const VARIANTS = ['essentials', 'portfolio'] as const
const HERO_STYLES = ['1', '2', '3', '4', '5', '6'] as const
const HERO_STYLE_LABELS: Record<string, string> = { '1': 'Default', '2': 'Overlay', '3': 'Broadsheet', '4': 'Split', '5': 'Marquee', '6': 'Float' }
</script>

<template>
  <details class="ap-switcher">
    <summary>
      <span>{{ themeName }} / {{ swatchName }} / {{ variant }}</span>
    </summary>
    <div class="ap-switcher__panel">
      <div>
        <p class="ap-eyebrow">Theme</p>
        <div class="ap-switcher__row">
          <button
            v-for="t in THEME_LIST"
            :key="t.name"
            type="button"
            class="ap-switcher__chip"
            :class="{ 'is-active': themeName === t.name }"
            @click="setTheme(t.name)"
          >{{ t.label }}</button>
        </div>
      </div>
      <div>
        <p class="ap-eyebrow">Swatch</p>
        <div class="ap-switcher__row">
          <button
            v-for="s in SWATCH_LIST"
            :key="s.name"
            type="button"
            class="ap-switcher__swatch"
            :class="{ 'is-active': swatchName === s.name }"
            :style="{ background: s.primary, outlineColor: s.accent }"
            :title="s.label"
            @click="setSwatch(s.name)"
          />
        </div>
      </div>
      <div>
        <p class="ap-eyebrow">Variant</p>
        <div class="ap-switcher__row">
          <button
            v-for="v in VARIANTS"
            :key="v"
            type="button"
            class="ap-switcher__chip"
            :class="{ 'is-active': variant === v }"
            @click="setVariant(v)"
          >{{ v }}</button>
        </div>
      </div>
      <div>
        <p class="ap-eyebrow">Hero style</p>
        <div class="ap-switcher__row">
          <button
            v-for="s in HERO_STYLES"
            :key="s"
            type="button"
            class="ap-switcher__chip"
            :class="{ 'is-active': heroStyle === s }"
            @click="setHeroStyle(s)"
          >{{ HERO_STYLE_LABELS[s] }}</button>
        </div>
      </div>
    </div>
  </details>
</template>

<style scoped>
.ap-switcher {
  position: fixed; bottom: 1rem; right: 1rem; z-index: 100;
  background: var(--ap-surface-alt);
  border: 1px solid var(--ap-line);
  border-radius: var(--ap-radius);
  box-shadow: var(--ap-shadow-lg);
  font-family: var(--ap-font-body);
  font-size: 0.85rem;
  max-width: 320px;
}
.ap-switcher summary {
  list-style: none; cursor: pointer; padding: 0.6rem 0.9rem;
  display: flex; gap: 0.5rem; align-items: center;
  text-transform: lowercase; color: var(--ap-ink-muted);
}
.ap-switcher summary::-webkit-details-marker { display: none; }
.ap-switcher__panel { padding: 0.75rem 0.9rem 1rem; display: grid; gap: 0.85rem; }
.ap-switcher__row { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.4rem; }
.ap-switcher__chip {
  background: transparent; color: var(--ap-ink);
  border: 1px solid var(--ap-line); border-radius: 999px;
  padding: 0.3rem 0.7rem; font-size: 0.78rem;
}
.ap-switcher__chip.is-active { background: var(--ap-ink); color: var(--ap-surface); border-color: var(--ap-ink); }
.ap-switcher__swatch {
  width: 28px; height: 28px; border-radius: 50%;
  border: 2px solid var(--ap-line); padding: 0;
}
.ap-switcher__swatch.is-active { outline: 2px solid; outline-offset: 2px; }
</style>
