<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { ChevronDown, Settings, Copy, Check, Download } from 'lucide-vue-next'
import { useSiteTheme } from '../composables/useSiteTheme'
import { THEME_LIST } from '../themes'
import { SWATCH_LIST } from '../themes/swatches'

const {
  themeName, swatchName, variant,
  heroStyle, footerStyle,
  contactStyle, hoursStyle, galleryStyle, reviewsStyle, subheroStyle,
  siteStyle,
  setTheme, setSwatch, setVariant,
  setHeroStyle, setFooterStyle,
  setContactStyle, setHoursStyle, setGalleryStyle, setReviewsStyle, setSubheroStyle,
  setSiteStyle,
} = useSiteTheme()

const VARIANTS = ['essentials', 'portfolio'] as const
const HERO_STYLES = ['1', '2', '3', '4', '5', '6'] as const
const HERO_STYLE_LABELS: Record<string, string> = { '1': 'Default', '2': 'Overlay', '3': 'Broadsheet', '4': 'Split', '5': 'Marquee', '6': 'Float' }
const FOOTER_STYLES = ['1', '2', '3', '4', '5'] as const
const FOOTER_STYLE_LABELS: Record<string, string> = { '1': 'Classic', '2': 'Editorial', '3': 'Billboard', '4': 'Minimal', '5': 'Dark Stage' }
const CONTACT_STYLES = ['1', '2', '3', '4', '5'] as const
const CONTACT_STYLE_LABELS: Record<string, string> = { '1': 'Studio Split', '2': 'Atlas Card', '3': 'Marquee', '4': 'Atlas Wide', '5': 'Brutalist' }
const HOURS_STYLES = ['1', '2', '3', '4', '5'] as const
const HOURS_STYLE_LABELS: Record<string, string> = { '1': 'Ledger', '2': 'Marquee', '3': 'Pillar', '4': 'Tiles', '5': 'Ribbon' }
const GALLERY_STYLES = ['1', '2', '3', '4', '5'] as const
const GALLERY_STYLE_LABELS: Record<string, string> = { '1': 'Default', '2': 'Mosaic', '3': 'Marquee', '4': 'Strip', '5': 'Polaroid' }
const REVIEWS_STYLES = ['1', '2', '3', '4', '5'] as const
const REVIEWS_STYLE_LABELS: Record<string, string> = { '1': 'Default', '2': 'Spotlight', '3': 'Carousel', '4': 'Wall', '5': 'Ticker' }
const SUBHERO_STYLES = ['1', '2', '3', '4', '5'] as const
const SUBHERO_STYLE_LABELS: Record<string, string> = { '1': 'Compact', '2': 'Banner', '3': 'Centered', '4': 'Broadsheet', '5': 'Split' }
const SITE_STYLES = ['1', '2', '3'] as const
// project = studio: site style not applicable
const SITE_STYLE_LABEL = 'Site style'
const SITE_STYLE_LABELS: Record<string, string> = { '1': 'Default', '2': 'Alt', '3': 'Bold' }

type Tab = 'theme' | 'style' | 'sections' | 'media' | 'config'
const tab = ref<Tab>('theme')
const open = ref(false)
function toggle() { open.value = !open.value }

/* ── Config export (mirrors the original archetype-project switcher) ── */
const copied = ref(false)
const configSnippet = computed(() => JSON.stringify({
  theme: themeName.value,
  swatch: swatchName.value,
  variant: variant.value,
  heroStyle: heroStyle.value,
  subheroStyle: subheroStyle.value,
  footerStyle: footerStyle.value,
  siteStyle: siteStyle.value,
  sections: {
    contact: contactStyle.value,
    hours: hoursStyle.value,
    gallery: galleryStyle.value,
    reviews: reviewsStyle.value,
  },
}, null, 2))

function copyConfig() {
  navigator.clipboard.writeText(configSnippet.value).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  })
}

function downloadConfig() {
  const blob = new Blob([configSnippet.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `archetype-config-${themeName.value}-${swatchName.value}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/* ── Single-source height animation (no bounce) ──
   Measure the active panel's natural height and write it to a CSS variable on
   the wrapper. The wrapper transitions `height` from 0 (collapsed) → measured
   px (open). Switching tabs only changes the same height variable, so the
   transition is a single fluid motion. */
const panelEl = ref<HTMLElement | null>(null)
const panelHeight = ref(0)

async function measure() {
  await nextTick()
  if (panelEl.value) panelHeight.value = panelEl.value.scrollHeight
}

onMounted(() => {
  measure()
  if (panelEl.value && 'ResizeObserver' in window) {
    const ro = new ResizeObserver(() => { panelHeight.value = panelEl.value!.scrollHeight })
    ro.observe(panelEl.value)
  }
})
watch([tab, open], () => { measure() })
</script>

<template>
  <div
    class="ap-switcher"
    :class="{ 'is-open': open }"
    :style="{ '--ap-switcher-h': panelHeight + 'px' }"
  >
    <!-- Collapsed pill (hidden while open) -->
    <button v-show="!open" type="button" class="ap-switcher__pill" @click="toggle" aria-label="Open site settings">
      <span class="ap-switcher__pill-info">
        <span class="ap-switcher__pill-dot" :style="{ background: SWATCH_LIST.find(s => s.name === swatchName)?.primary }" />
        <span>{{ themeName }} · {{ swatchName }} · {{ variant }}</span>
      </span>
      <span class="ap-switcher__pill-icon" aria-hidden="true"><Settings :size="16" /></span>
    </button>

    <!-- Expandable area — height transitions from 0 → measured px on the inner panel.
         Only the active tab panel mounts via v-show, so the wrapper sees one
         single height value at a time and animates in a single fluid motion. -->
    <div class="ap-switcher__expand">
      <div ref="panelEl" class="ap-switcher__panel-wrap">
        <div class="ap-switcher__head">
          <span class="ap-switcher__title">Site settings</span>
          <button type="button" class="ap-switcher__close" @click="toggle" aria-label="Close">
            <ChevronDown :size="18" />
          </button>
        </div>

        <div class="ap-switcher__tabs" role="tablist">
          <button type="button" role="tab" class="ap-switcher__tab" :class="{ 'is-active': tab === 'theme' }" @click="tab = 'theme'">Theme</button>
          <button type="button" role="tab" class="ap-switcher__tab" :class="{ 'is-active': tab === 'style' }" @click="tab = 'style'">Style</button>
          <button type="button" role="tab" class="ap-switcher__tab" :class="{ 'is-active': tab === 'sections' }" @click="tab = 'sections'">Sections</button>
          <button type="button" role="tab" class="ap-switcher__tab" :class="{ 'is-active': tab === 'media' }" @click="tab = 'media'">Media</button>
          <button type="button" role="tab" class="ap-switcher__tab" :class="{ 'is-active': tab === 'config' }" @click="tab = 'config'">Config</button>
        </div>

        <!-- Theme -->
        <div v-show="tab === 'theme'" class="ap-switcher__panel">
          <div>
            <p class="ap-eyebrow">Theme</p>
            <div class="ap-switcher__row">
              <button v-for="t in THEME_LIST" :key="t.name" type="button" class="ap-switcher__chip" :class="{ 'is-active': themeName === t.name }" @click="setTheme(t.name)">{{ t.label }}</button>
            </div>
          </div>
          <div>
            <p class="ap-eyebrow">Variant</p>
            <div class="ap-switcher__row">
              <button v-for="v in VARIANTS" :key="v" type="button" class="ap-switcher__chip" :class="{ 'is-active': variant === v }" @click="setVariant(v)">{{ v }}</button>
            </div>
          </div>
          <div class="ap-switcher__span">
            <p class="ap-eyebrow">Swatch</p>
            <div class="ap-switcher__row">
              <button v-for="s in SWATCH_LIST" :key="s.name" type="button" class="ap-switcher__swatch" :class="{ 'is-active': swatchName === s.name }" :style="{ background: s.primary, outlineColor: s.accent }" :title="s.label" @click="setSwatch(s.name)" />
            </div>
          </div>
        </div>

        <!-- Style -->
        <div v-show="tab === 'style'" class="ap-switcher__panel">
          <div class="ap-switcher__span">
            <p class="ap-eyebrow">Hero style</p>
            <div class="ap-switcher__row">
              <button v-for="s in HERO_STYLES" :key="s" type="button" class="ap-switcher__chip" :class="{ 'is-active': heroStyle === s }" @click="setHeroStyle(s)">{{ HERO_STYLE_LABELS[s] }}</button>
            </div>
          </div>
          <div class="ap-switcher__span">
            <p class="ap-eyebrow">Subpage hero</p>
            <div class="ap-switcher__row">
              <button v-for="s in SUBHERO_STYLES" :key="s" type="button" class="ap-switcher__chip" :class="{ 'is-active': subheroStyle === s }" @click="setSubheroStyle(s)">{{ SUBHERO_STYLE_LABELS[s] }}</button>
            </div>
          </div>
          <div class="ap-switcher__span">
            <p class="ap-eyebrow">Footer style</p>
            <div class="ap-switcher__row">
              <button v-for="s in FOOTER_STYLES" :key="s" type="button" class="ap-switcher__chip" :class="{ 'is-active': footerStyle === s }" @click="setFooterStyle(s)">{{ FOOTER_STYLE_LABELS[s] }}</button>
            </div>
          </div>
          <div class="ap-switcher__span">
            <p class="ap-eyebrow">{{ SITE_STYLE_LABEL }}</p>
            <div class="ap-switcher__row">
              <button v-for="s in SITE_STYLES" :key="s" type="button" class="ap-switcher__chip" :class="{ 'is-active': siteStyle === s }" @click="setSiteStyle(s)">{{ SITE_STYLE_LABELS[s] }}</button>
            </div>
          </div>
        </div>

        <!-- Sections -->
        <div v-show="tab === 'sections'" class="ap-switcher__panel">
          <div class="ap-switcher__span">
            <p class="ap-eyebrow">Contact section</p>
            <div class="ap-switcher__row">
              <button v-for="s in CONTACT_STYLES" :key="s" type="button" class="ap-switcher__chip" :class="{ 'is-active': contactStyle === s }" @click="setContactStyle(s)">{{ CONTACT_STYLE_LABELS[s] }}</button>
            </div>
          </div>
          <div class="ap-switcher__span">
            <p class="ap-eyebrow">Hours section</p>
            <div class="ap-switcher__row">
              <button v-for="s in HOURS_STYLES" :key="s" type="button" class="ap-switcher__chip" :class="{ 'is-active': hoursStyle === s }" @click="setHoursStyle(s)">{{ HOURS_STYLE_LABELS[s] }}</button>
            </div>
          </div>
        </div>

        <!-- Media -->
        <div v-show="tab === 'media'" class="ap-switcher__panel">
          <div class="ap-switcher__span">
            <p class="ap-eyebrow">Gallery section</p>
            <div class="ap-switcher__row">
              <button v-for="s in GALLERY_STYLES" :key="s" type="button" class="ap-switcher__chip" :class="{ 'is-active': galleryStyle === s }" @click="setGalleryStyle(s)">{{ GALLERY_STYLE_LABELS[s] }}</button>
            </div>
          </div>
          <div class="ap-switcher__span">
            <p class="ap-eyebrow">Reviews section</p>
            <div class="ap-switcher__row">
              <button v-for="s in REVIEWS_STYLES" :key="s" type="button" class="ap-switcher__chip" :class="{ 'is-active': reviewsStyle === s }" @click="setReviewsStyle(s)">{{ REVIEWS_STYLE_LABELS[s] }}</button>
            </div>
          </div>
        </div>

        <!-- Config -->
        <div v-show="tab === 'config'" class="ap-switcher__panel">
          <div class="ap-switcher__span">
            <p class="ap-eyebrow">Current configuration</p>
            <pre class="ap-switcher__code">{{ configSnippet }}</pre>
            <div class="ap-switcher__row">
              <button type="button" class="ap-switcher__chip ap-switcher__chip--icon" @click="copyConfig">
                <component :is="copied ? Check : Copy" :size="14" />
                {{ copied ? 'Copied' : 'Copy JSON' }}
              </button>
              <button type="button" class="ap-switcher__chip ap-switcher__chip--icon" @click="downloadConfig">
                <Download :size="14" />
                Download .json
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Single-source height animation: the wrapper measures its content via JS and
   sets --ap-switcher-h; the expand region transitions `height` from 0 → that
   value in one fluid motion. Switching tabs simply re-measures and animates
   to the new height. No grid-template-rows tricks → no bounce. */
.ap-switcher {
  position: fixed; bottom: 1rem; right: 1rem; z-index: 100;
  font-family: var(--ap-font-body); font-size: 0.85rem;
  background: color-mix(in srgb, var(--ap-surface) 78%, transparent);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  border: 1px solid color-mix(in srgb, var(--ap-line) 85%, transparent);
  border-radius: 14px;
  box-shadow: 0 10px 40px -10px color-mix(in srgb, var(--ap-ink) 35%, transparent),
              0 2px 8px -2px color-mix(in srgb, var(--ap-ink) 20%, transparent);
  overflow: hidden;
  width: auto; max-width: min(640px, calc(100vw - 2rem));
  transition: width 320ms cubic-bezier(0.2, 0.7, 0.3, 1),
              max-width 320ms cubic-bezier(0.2, 0.7, 0.3, 1),
              border-radius 240ms ease;
}
.ap-switcher.is-open {
  width: 640px;
  border-radius: 16px;
}

/* ── Collapsed pill ────────────────────────────────────── */
.ap-switcher__pill {
  display: flex; align-items: center; gap: 0.65rem;
  width: 100%;
  background: transparent; border: 0; cursor: pointer;
  padding: 0.55rem 0.75rem 0.55rem 0.85rem;
  color: var(--ap-ink); font: inherit;
  text-align: left;
}
.ap-switcher__pill-info {
  display: flex; align-items: center; gap: 0.5rem;
  color: var(--ap-ink-muted);
  text-transform: lowercase; font-size: 0.78rem;
  white-space: nowrap;
}
.ap-switcher__pill-dot {
  width: 10px; height: 10px; border-radius: 50%;
  border: 1px solid color-mix(in srgb, var(--ap-ink) 30%, transparent);
  flex-shrink: 0;
}
.ap-switcher__pill-icon {
  margin-left: auto;
  display: inline-flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; border-radius: 50%;
  background: color-mix(in srgb, var(--ap-ink) 8%, transparent);
  color: var(--ap-ink);
  transition: background 160ms ease;
}
.ap-switcher__pill:hover .ap-switcher__pill-icon { background: color-mix(in srgb, var(--ap-ink) 14%, transparent); }

/* ── Expand region — single height transition ── */
.ap-switcher__expand {
  height: 0;
  overflow: hidden;
  transition: height 320ms cubic-bezier(0.2, 0.7, 0.3, 1);
}
.ap-switcher.is-open .ap-switcher__expand {
  height: var(--ap-switcher-h, auto);
}

/* ── Expanded wrapper ──────────────────────────────────── */
.ap-switcher__panel-wrap {
  display: flex; flex-direction: column;
}
.ap-switcher__head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.7rem 0.9rem 0.5rem;
  border-bottom: 1px solid color-mix(in srgb, var(--ap-line) 60%, transparent);
}
.ap-switcher__title {
  font-family: var(--ap-font-heading);
  font-size: 0.88rem; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--ap-ink);
}
.ap-switcher__close {
  background: transparent; border: 0; cursor: pointer;
  width: 28px; height: 28px; border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--ap-ink-muted);
  transition: background 160ms ease, color 160ms ease, transform 240ms ease;
}
.ap-switcher__close:hover {
  background: color-mix(in srgb, var(--ap-ink) 10%, transparent);
  color: var(--ap-ink);
}
/* Chevron points down by default (in open state — clicking collapses).
   Pre-rotate so the icon visually invites "click to close". */
.ap-switcher.is-open .ap-switcher__close { transform: rotate(0deg); }

/* ── Tabs ──────────────────────────────────────────────── */
.ap-switcher__tabs {
  display: flex; gap: 0;
  padding: 0 0.6rem; margin: 0;
  border-bottom: 1px solid color-mix(in srgb, var(--ap-line) 60%, transparent);
}
.ap-switcher__tab {
  flex: 1;
  background: transparent; border: 0;
  padding: 0.7rem 0.4rem;
  font-family: inherit; font-size: 0.78rem;
  color: var(--ap-ink-muted); cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  letter-spacing: 0.04em;
  transition: color 160ms ease, border-color 160ms ease;
}
.ap-switcher__tab:hover { color: var(--ap-ink); }
.ap-switcher__tab.is-active {
  color: var(--ap-ink);
  border-bottom-color: var(--ap-primary);
  font-weight: 600;
}

/* ── Panel (2-col by default; full-width groups via __span) ── */
.ap-switcher__panel {
  padding: 0.9rem 1rem 1.1rem;
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 0.9rem 1.25rem;
}
.ap-switcher__row { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.4rem; }
.ap-switcher__chip {
  background: transparent; color: var(--ap-ink);
  border: 1px solid color-mix(in srgb, var(--ap-line) 80%, transparent);
  border-radius: 999px;
  padding: 0.3rem 0.7rem; font-size: 0.78rem;
  cursor: pointer;
  transition: background 140ms ease, color 140ms ease, border-color 140ms ease;
}
.ap-switcher__chip:hover { border-color: var(--ap-ink); }
.ap-switcher__chip.is-active {
  background: var(--ap-ink); color: var(--ap-surface); border-color: var(--ap-ink);
}
.ap-switcher__chip--icon {
  display: inline-flex; align-items: center; gap: 0.4rem;
}
.ap-switcher__swatch {
  width: 28px; height: 28px; border-radius: 50%;
  border: 2px solid color-mix(in srgb, var(--ap-line) 70%, transparent);
  padding: 0; cursor: pointer;
}
.ap-switcher__swatch.is-active { outline: 2px solid; outline-offset: 2px; }
.ap-switcher__span { grid-column: 1 / -1; }

/* Config tab: code preview */
.ap-switcher__code {
  margin: 0.5rem 0 0.75rem;
  padding: 0.65rem 0.8rem;
  background: color-mix(in srgb, var(--ap-ink) 6%, transparent);
  border: 1px solid color-mix(in srgb, var(--ap-line) 70%, transparent);
  border-radius: 8px;
  font-family: var(--ap-font-mono, ui-monospace, monospace);
  font-size: 0.72rem;
  line-height: 1.55;
  max-height: 240px;
  overflow: auto;
  white-space: pre;
  color: var(--ap-ink);
}

@media (max-width: 720px) {
  .ap-switcher.is-open { width: calc(100vw - 2rem); }
  .ap-switcher__panel { grid-template-columns: 1fr; }
}
</style>