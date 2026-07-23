<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowUpRight } from 'lucide-vue-next'
import type { ShowcaseSite } from '../../config/site.config'
import { THEMES } from '@apotome/archetype-shared/themes/index'
import { SWATCHES } from '@apotome/archetype-shared/themes/swatches'
import OptimizedImage from '@apotome/archetype-shared/components/OptimizedImage.vue'

const props = defineProps<{
  eyebrow?: string
  title?: string
  intro?: string
  sites: ShowcaseSite[]
}>()

function swatchOf(name: string) {
  return SWATCHES[name as keyof typeof SWATCHES] ?? SWATCHES.sand
}

// One stage, five archetypes — pick one and the preview restyles to show
// "same engine, different body".
const active = ref(0)
const current = computed(() => props.sites[active.value]!)
function pick(i: number) { active.value = i }
</script>

<!--
  Template switcher: a single framed stage plus a rail of five archetype tabs.
  Same engine, restyled per business type — shown by swapping one preview
  rather than repeating five near-identical rows.
-->
<template>
  <section class="tsw ap-section">
    <div class="ap-container">
      <div class="ap-section-head">
        <span v-if="eyebrow" class="ap-eyebrow">{{ eyebrow }}</span>
        <h2>{{ title || 'One engine. Five kinds of business.' }}</h2>
        <p v-if="intro" class="tsw__intro">{{ intro }}</p>
      </div>

      <!-- Tab rail -->
      <div class="tsw__tabs" role="tablist">
        <button
          v-for="(s, i) in sites"
          :key="s.id"
          type="button" role="tab"
          class="tsw__tab"
          :class="{ 'is-active': i === active }"
          :aria-selected="i === active"
          @click="pick(i)"
        >
          <span class="tsw__tab-dot" :style="{ background: swatchOf(s.swatches[0]!).primary }" aria-hidden="true" />
          <span class="tsw__tab-name">{{ s.name }}</span>
          <span class="tsw__tab-arch">{{ s.archetype }}</span>
        </button>
      </div>

      <!-- Stage -->
      <div class="tsw__stage">
        <Transition name="tsw-fade" mode="out-in">
          <div class="tsw__panel" :key="current.id">
            <a
              class="tsw__frame"
              :href="current.liveUrl" target="_blank" rel="noopener"
              :aria-label="`Open the live ${current.name} demo`"
            >
              <span class="tsw__frame-bar" aria-hidden="true">
                <i /><i /><i />
                <span class="tsw__frame-url">{{ current.id }}.apotomelabs.com</span>
              </span>
              <OptimizedImage :src="current.image" :alt="`${current.name} homepage`" />
            </a>

            <div class="tsw__info">
              <p class="tsw__arch">{{ current.archetype }}</p>
              <h3 class="tsw__name">{{ current.name }}</h3>
              <p class="tsw__blurb">{{ current.blurb }}</p>

              <dl class="tsw__meta">
                <div>
                  <dt>Ships with</dt>
                  <dd>{{ current.themes.map(t => THEMES[t].label).join(' · ') }}</dd>
                </div>
                <div>
                  <dt>Palettes</dt>
                  <dd class="tsw__dots">
                    <span
                      v-for="sw in current.swatches" :key="sw"
                      class="tsw__dot"
                      :style="{ background: swatchOf(sw).primary }"
                      :title="swatchOf(sw).label"
                    />
                    <em>+ 20 more</em>
                  </dd>
                </div>
              </dl>

              <a v-if="current.liveUrl" :href="current.liveUrl" target="_blank" rel="noopener" class="tsw__cta">
                Visit {{ current.name }} live <ArrowUpRight :size="16" />
              </a>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tsw__intro { color: var(--ap-ink-muted); margin: 0; max-width: 56ch; }

/* ── Tab rail ── */
.tsw__tabs {
  display: grid; grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  margin: clamp(1.75rem, 4vw, 2.75rem) 0 clamp(1.25rem, 2.5vw, 1.75rem);
}
.tsw__tab {
  display: flex; flex-direction: column; align-items: flex-start; gap: 0.15rem;
  padding: 0.8rem 0.9rem;
  background: var(--ap-surface-alt);
  border: 1px solid var(--ap-line);
  border-radius: var(--ap-radius-lg, 14px);
  cursor: pointer; text-align: left;
  transition: border-color 200ms ease, background 200ms ease, transform 200ms ease;
}
.tsw__tab:hover { border-color: color-mix(in srgb, var(--ap-primary) 45%, var(--ap-line)); }
.tsw__tab.is-active {
  border-color: var(--ap-primary);
  background: var(--ap-surface);
  box-shadow: inset 0 -3px 0 var(--ap-primary);
}
.tsw__tab-dot { width: 12px; height: 12px; border-radius: 50%; margin-bottom: 0.35rem; }
.tsw__tab-name { font-family: var(--ap-font-heading); font-weight: 700; font-size: 1.05rem; letter-spacing: var(--ap-tracking-heading); }
.tsw__tab-arch { font-size: 0.66rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ap-ink-muted); }

/* ── Stage ── */
.tsw__stage { position: relative; }
.tsw__panel {
  display: grid; grid-template-columns: 1.55fr 1fr;
  gap: clamp(1.5rem, 4vw, 3.5rem);
  align-items: center;
}
.tsw__frame {
  display: block; border-radius: var(--ap-radius-lg);
  overflow: hidden; border: 1px solid var(--ap-line);
  background: var(--ap-surface);
  box-shadow: 0 30px 80px -34px color-mix(in srgb, var(--ap-ink) 45%, transparent);
  transition: transform 400ms cubic-bezier(0.2, 0.6, 0.2, 1), box-shadow 400ms ease;
}
.tsw__frame:hover { transform: translateY(-5px); box-shadow: 0 44px 92px -32px color-mix(in srgb, var(--ap-ink) 55%, transparent); }
.tsw__frame-bar { display: flex; align-items: center; gap: 0.35rem; padding: 0.55rem 0.8rem; border-bottom: 1px solid var(--ap-line); }
.tsw__frame-bar i { width: 9px; height: 9px; border-radius: 50%; background: color-mix(in srgb, var(--ap-ink) 18%, transparent); }
.tsw__frame-url {
  margin-left: 0.6rem; font-family: var(--ap-font-mono); font-size: 0.68rem;
  color: var(--ap-ink-muted); padding: 0.18rem 0.6rem;
  border: 1px solid var(--ap-line); border-radius: 999px;
}
.tsw__frame :deep(img) { width: 100%; aspect-ratio: 16 / 10; object-fit: cover; object-position: top; display: block; }

.tsw__info { min-width: 0; }
.tsw__arch { margin: 0 0 0.35rem; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--ap-primary); }
.tsw__name { margin: 0 0 0.5rem; font-size: clamp(2.2rem, 4.5vw, 3.4rem); line-height: 0.98; letter-spacing: var(--ap-tracking-heading); }
.tsw__blurb { margin: 0; color: var(--ap-ink-muted); line-height: 1.6; max-width: 40ch; }
.tsw__meta { margin: 1.4rem 0 0; padding: 1.1rem 0 0; display: grid; gap: 0.85rem; border-top: 1px solid var(--ap-line); }
.tsw__meta dt { font-size: 0.64rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ap-ink-muted); margin-bottom: 0.3rem; }
.tsw__meta dd { margin: 0; font-size: 0.92rem; }
.tsw__dots { display: flex; align-items: center; gap: 0.4rem; }
.tsw__dot { width: 16px; height: 16px; border-radius: 50%; box-shadow: 0 0 0 2px var(--ap-surface); }
.tsw__dots em { font-style: normal; font-size: 0.78rem; color: var(--ap-ink-muted); margin-left: 0.2rem; }
.tsw__cta {
  display: inline-flex; align-items: center; gap: 0.4rem; margin-top: 1.4rem;
  font-family: var(--ap-font-heading); font-weight: 600;
  letter-spacing: var(--ap-tracking-heading); text-transform: var(--ap-heading-transform);
  color: var(--ap-ink); border-bottom: 2px solid var(--ap-primary); padding-bottom: 0.2rem;
  transition: gap 160ms ease, color 160ms ease;
}
.tsw__cta:hover { gap: 0.7rem; color: var(--ap-primary); }

/* Transition */
.tsw-fade-enter-active, .tsw-fade-leave-active { transition: opacity 320ms ease, transform 320ms cubic-bezier(0.2, 0.6, 0.2, 1); }
.tsw-fade-enter-from { opacity: 0; transform: translateY(12px); }
.tsw-fade-leave-to { opacity: 0; transform: translateY(-12px); }

@media (max-width: 860px) {
  .tsw__panel { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .tsw__tabs { grid-template-columns: repeat(2, 1fr); }
}
@media (prefers-reduced-motion: reduce) {
  .tsw-fade-enter-active, .tsw-fade-leave-active { transition: opacity 200ms ease; }
  .tsw-fade-enter-from, .tsw-fade-leave-to { transform: none; }
  .tsw__frame:hover { transform: none; }
}
</style>
