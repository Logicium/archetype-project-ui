<script setup lang="ts">
import { computed } from 'vue'
import { LayoutDashboard, Sparkles, Instagram, CalendarClock, Globe, LineChart, Check } from 'lucide-vue-next'
import { useSiteTheme } from '@apotome/archetype-shared/composables/useSiteTheme'
import { THEME_LIST } from '@apotome/archetype-shared/themes/index'
import { SWATCH_LIST } from '@apotome/archetype-shared/themes/swatches'
import { SWATCH_THEORIES } from '@apotome/archetype-shared/themes/tokens'

const { themeName, swatchName, setTheme, setSwatch, swatch } = useSiteTheme()

// Typographic personality per theme for the specimen cards. Fonts are
// loaded once via the @import below (same set the wizard preview uses).
const SPECIMEN: Record<string, { heading: string; body: string; note: string }> = {
  studio:   { heading: '"Inter Tight", "Inter", sans-serif', body: '"Inter", sans-serif', note: 'Hairline rules · mono details' },
  heritage: { heading: '"Fraunces", Georgia, serif', body: '"Lora", Georgia, serif', note: 'Editorial serifs · generous air' },
  vibrant:  { heading: '"Bricolage Grotesque", sans-serif', body: '"Space Grotesk", sans-serif', note: 'Chunky borders · sticker energy' },
  ironwood: { heading: '"Oswald", sans-serif', body: '"Roboto", sans-serif', note: 'Condensed caps · spec-sheet grit' },
}

const theories = computed(() =>
  SWATCH_THEORIES.map(t => ({ ...t, items: SWATCH_LIST.filter(s => s.group === t.id) })))

const activeFeel = computed(() => swatch.value?.feel ?? '')

const PREMIUM = [
  {
    icon: LayoutDashboard,
    name: 'Owner studio',
    desc: 'A private dashboard for every site — edit copy, photos, hours, and menus yourself. No code, no tickets, live in seconds.',
  },
  {
    icon: Sparkles,
    name: 'AI copywriter',
    desc: 'Stuck on a tagline or a dish description? One click drafts it in your brand voice, right inside the editor.',
  },
  {
    icon: Instagram,
    name: 'Living content embeds',
    desc: 'Your latest Instagram posts and live Google star ratings render on-site automatically — fresh content with zero upkeep.',
  },
  {
    icon: CalendarClock,
    name: 'Commerce modules',
    desc: 'Booking for stays, ordering for kitchens, ticketing for venues, dispatch for trades — each archetype ships with its own machinery.',
  },
  {
    icon: Globe,
    name: 'Domain & hosting, handled',
    desc: 'First-year .com included. Deployed on a global edge network with sub-3-second loads and SSL out of the box.',
  },
  {
    icon: LineChart,
    name: 'Analytics & inbox',
    desc: 'See your visitors, read your reviews, and answer inquiries from one place — proof the site is working for you.',
  },
]
</script>

<!--
  The design system, staged in three acts:
    I  · Themes — four typographic personalities, each card typeset in its
         own faces; clicking restyles the entire page live.
    II · Color theories — the swatch system with its psychology, tiles
         painted in their own surfaces; clicking retints the site live.
    III· Premium — an inverted, ink-ground band for the paid machinery.
-->
<template>
  <section class="ap-dsys" id="design-system">

    <!-- ── Act I · Themes ─────────────────────────────────── -->
    <div class="ap-container">
      <div class="ap-section-head">
        <span class="ap-eyebrow">The design system</span>
        <h2>One site. Four personalities.<br />Twenty-three palettes.</h2>
        <p class="ap-dsys__lead">
          Everything below is live — press it. The whole page, header to footer,
          restyles itself the same way every client site does.
        </p>
      </div>

      <div class="ap-dsys__themes">
        <button
          v-for="t in THEME_LIST"
          :key="t.name"
          type="button"
          class="ap-dsys__theme"
          :class="{ 'is-active': themeName === t.name }"
          @click="setTheme(t.name)"
        >
          <span class="ap-dsys__theme-specimen" :style="{ fontFamily: SPECIMEN[t.name]?.heading }">Aa</span>
          <span class="ap-dsys__theme-name" :style="{ fontFamily: SPECIMEN[t.name]?.heading }">The {{ t.label.replace(/^The\s+/i, '') }}</span>
          <span class="ap-dsys__theme-desc" :style="{ fontFamily: SPECIMEN[t.name]?.body }">{{ t.description }}</span>
          <span class="ap-dsys__theme-note">{{ SPECIMEN[t.name]?.note }}</span>
          <span class="ap-dsys__theme-state" aria-hidden="true">
            <Check v-if="themeName === t.name" :size="13" />
            {{ themeName === t.name ? 'Wearing it now' : 'Try it on' }}
          </span>
        </button>
      </div>
    </div>

    <!-- ── Act II · Color theories ────────────────────────── -->
    <div class="ap-container ap-dsys__color">
      <div class="ap-dsys__color-rail">
        <span class="ap-eyebrow">The color system</span>
        <h3 class="ap-dsys__color-title">Color, with a thesis.</h3>
        <p>
          Every palette belongs to a color theory — a researched harmony model
          with a documented psychological register. Warm palettes stoke appetite,
          serene blues signal competence, dark grounds read as luxury.
          You're not picking a color; you're picking a feeling.
        </p>
        <p class="ap-dsys__color-current">
          <span class="ap-dsys__color-chip" :style="{ background: swatch.primary }" aria-hidden="true" />
          Now wearing <strong>{{ swatch.label }}</strong><template v-if="activeFeel"> — {{ activeFeel.toLowerCase() }}</template>
        </p>
        <p class="ap-dsys__color-hint">
          Clients can also build and save their own palettes in the Color Lab —
          pick a hue and a harmony, we derive the rest.
        </p>
      </div>

      <div class="ap-dsys__theories">
        <div v-for="t in theories" :key="t.id" class="ap-dsys__theory">
          <div class="ap-dsys__theory-head">
            <h4>{{ t.label }}</h4>
            <span>{{ t.harmony }}</span>
          </div>
          <p class="ap-dsys__theory-psy">{{ t.psychology }}</p>
          <div class="ap-dsys__tiles">
            <button
              v-for="s in t.items"
              :key="s.name"
              type="button"
              class="ap-dsys__tile"
              :class="{ 'is-active': swatchName === s.name }"
              :style="{ background: s.surface, borderColor: swatchName === s.name ? s.primary : s.line }"
              :title="s.feel ? `${s.label} — ${s.feel}` : s.label"
              @click="setSwatch(s.name)"
            >
              <span class="ap-dsys__tile-dots" aria-hidden="true">
                <i :style="{ background: s.primary }" />
                <i :style="{ background: s.accent }" />
              </span>
              <span class="ap-dsys__tile-name" :style="{ color: s.ink }">{{ s.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Act III · Premium ──────────────────────────────── -->
    <div class="ap-dsys__premium">
      <div class="ap-container">
        <div class="ap-dsys__premium-head">
          <span class="ap-eyebrow ap-dsys__premium-eyebrow">Premium, standard</span>
          <h3>The machinery behind the pretty face.</h3>
          <p>
            A website that just sits there is a brochure. These ship with the
            platform — the parts that keep working after launch day.
          </p>
        </div>
        <div class="ap-dsys__premium-grid">
          <article v-for="f in PREMIUM" :key="f.name" class="ap-dsys__feature">
            <span class="ap-dsys__feature-icon">
              <component :is="f.icon" :size="20" :stroke-width="1.6" />
            </span>
            <h4>{{ f.name }}</h4>
            <p>{{ f.desc }}</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&family=Inter:wght@400;500&family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Lora:wght@400;500&family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&family=Space+Grotesk:wght@400;600&family=Oswald:wght@500;700&family=Roboto:wght@400;500&display=swap');

.ap-dsys { padding-top: var(--ap-section-py); }
.ap-dsys__lead { color: var(--ap-ink-muted); margin: 0; max-width: 52ch; }

/* ── Act I · Theme specimen cards ── */
.ap-dsys__themes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: clamp(0.75rem, 1.5vw, 1.25rem);
}
.ap-dsys__theme {
  position: relative;
  display: flex; flex-direction: column; align-items: flex-start;
  gap: 0.45rem;
  padding: clamp(1.25rem, 2.5vw, 1.75rem);
  min-height: 260px;
  background: var(--ap-surface-alt);
  border: 1px solid var(--ap-line);
  border-radius: var(--ap-radius-lg);
  cursor: pointer;
  text-align: left;
  font: inherit;
  color: var(--ap-ink);
  overflow: hidden;
  transition: transform 300ms cubic-bezier(0.2, 0.6, 0.2, 1), border-color 200ms ease, box-shadow 300ms ease;
}
.ap-dsys__theme:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 48px -24px color-mix(in srgb, var(--ap-ink) 35%, transparent);
}
.ap-dsys__theme.is-active {
  border-color: var(--ap-primary);
  box-shadow: 0 0 0 1px var(--ap-primary), 0 24px 48px -24px color-mix(in srgb, var(--ap-primary) 40%, transparent);
}
.ap-dsys__theme-specimen {
  font-size: clamp(3.5rem, 6vw, 5rem);
  line-height: 1;
  font-weight: 700;
  color: var(--ap-ink);
}
.ap-dsys__theme-name { font-size: 1.25rem; font-weight: 600; margin-top: auto; }
.ap-dsys__theme-desc { font-size: 0.85rem; color: var(--ap-ink-muted); line-height: 1.5; }
.ap-dsys__theme-note {
  font-family: var(--ap-font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--ap-ink-muted);
}
.ap-dsys__theme-state {
  display: inline-flex; align-items: center; gap: 0.35rem;
  margin-top: 0.4rem;
  padding: 0.28rem 0.7rem;
  border-radius: 999px;
  border: 1px solid var(--ap-line);
  font-size: 0.7rem; font-weight: 600;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--ap-ink-muted);
  transition: background 200ms ease, color 200ms ease, border-color 200ms ease;
}
.ap-dsys__theme.is-active .ap-dsys__theme-state {
  background: var(--ap-primary);
  border-color: var(--ap-primary);
  color: var(--ap-on-primary, var(--ap-surface-alt));
}

/* ── Act II · Color ── */
.ap-dsys__color {
  display: grid;
  grid-template-columns: minmax(260px, 5fr) 7fr;
  gap: clamp(2rem, 5vw, 5rem);
  padding-top: var(--ap-section-py);
  align-items: start;
}
.ap-dsys__color-rail {
  position: sticky; top: 96px;
  display: flex; flex-direction: column; gap: 0.9rem;
}
.ap-dsys__color-title { margin: 0; font-size: clamp(1.9rem, 3.4vw, 2.6rem); }
.ap-dsys__color-rail p { margin: 0; color: var(--ap-ink-muted); line-height: 1.65; }
.ap-dsys__color-current {
  display: flex; align-items: center; gap: 0.55rem; flex-wrap: wrap;
  padding: 0.8rem 1rem;
  border: 1px solid var(--ap-line);
  border-radius: var(--ap-radius);
  background: var(--ap-surface-alt);
  font-size: 0.92rem;
  color: var(--ap-ink) !important;
}
.ap-dsys__color-chip {
  width: 20px; height: 20px; border-radius: 50%;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ap-primary) 20%, transparent);
  flex-shrink: 0;
}
.ap-dsys__color-hint { font-size: 0.85rem; }

.ap-dsys__theories { display: flex; flex-direction: column; gap: 1.75rem; }
.ap-dsys__theory-head {
  display: flex; align-items: baseline; gap: 0.75rem; flex-wrap: wrap;
}
.ap-dsys__theory-head h4 {
  margin: 0;
  font-size: 1rem;
  letter-spacing: 0.14em; text-transform: uppercase;
}
.ap-dsys__theory-head span { font-size: 0.8rem; color: var(--ap-ink-muted); font-style: italic; }
.ap-dsys__theory-psy {
  margin: 0.2rem 0 0.65rem;
  font-size: 0.85rem; color: var(--ap-ink-muted);
  max-width: 62ch; line-height: 1.55;
}
.ap-dsys__tiles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));
  gap: 0.5rem;
}
.ap-dsys__tile {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.7rem 0.75rem;
  border: 1.5px solid;
  border-radius: var(--ap-radius);
  cursor: pointer;
  font: inherit;
  transition: transform 200ms cubic-bezier(0.2, 0.6, 0.2, 1), box-shadow 200ms ease;
}
.ap-dsys__tile:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px -12px color-mix(in srgb, var(--ap-ink) 45%, transparent);
}
.ap-dsys__tile.is-active { box-shadow: 0 0 0 2px color-mix(in srgb, var(--ap-primary) 35%, transparent); }
.ap-dsys__tile-dots { display: inline-flex; gap: 3px; flex-shrink: 0; }
.ap-dsys__tile-dots i {
  width: 14px; height: 14px; border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.12);
  display: block;
}
.ap-dsys__tile-name {
  font-size: 0.78rem; font-weight: 600;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

/* ── Act III · Premium (inverted band) ── */
.ap-dsys__premium {
  margin-top: var(--ap-section-py);
  background: var(--ap-ink);
  color: var(--ap-surface);
  padding-block: var(--ap-section-py);
}
.ap-dsys__premium-head { max-width: 640px; margin-bottom: clamp(2rem, 4vw, 3.5rem); }
.ap-dsys__premium-eyebrow { color: var(--ap-accent); }
.ap-dsys__premium-head h3 {
  color: var(--ap-surface);
  font-size: clamp(1.9rem, 3.6vw, 2.8rem);
  margin: 0.6rem 0;
}
.ap-dsys__premium-head p { color: color-mix(in srgb, var(--ap-surface) 65%, transparent); margin: 0; line-height: 1.65; }

.ap-dsys__premium-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1px;
  background: color-mix(in srgb, var(--ap-surface) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--ap-surface) 14%, transparent);
  border-radius: var(--ap-radius-lg);
  overflow: hidden;
}
.ap-dsys__feature {
  background: var(--ap-ink);
  padding: clamp(1.5rem, 3vw, 2rem);
  display: flex; flex-direction: column; gap: 0.6rem;
  transition: background 300ms ease;
}
.ap-dsys__feature:hover { background: color-mix(in srgb, var(--ap-surface) 6%, var(--ap-ink)); }
.ap-dsys__feature-icon {
  width: 42px; height: 42px;
  display: grid; place-items: center;
  border-radius: 50%;
  background: color-mix(in srgb, var(--ap-accent) 16%, transparent);
  color: var(--ap-accent);
  margin-bottom: 0.4rem;
}
.ap-dsys__feature h4 {
  margin: 0;
  color: var(--ap-surface);
  font-size: 1.02rem;
}
.ap-dsys__feature p {
  margin: 0;
  color: color-mix(in srgb, var(--ap-surface) 62%, transparent);
  font-size: 0.88rem; line-height: 1.6;
}

@media (max-width: 900px) {
  .ap-dsys__color { grid-template-columns: 1fr; }
  .ap-dsys__color-rail { position: static; }
}
</style>
