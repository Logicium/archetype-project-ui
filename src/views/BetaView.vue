<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { BETA, monthLabel, phaseStatus, type PhaseStatus } from '../config/beta'

const STATUS_LABEL: Record<PhaseStatus, string> = { upcoming: 'Upcoming', current: 'In progress', complete: 'Complete' }

const phases = computed(() => BETA.phases.map((p, i) => ({
  ...p,
  index: i + 1,
  status: phaseStatus(p),
  range: `${monthLabel(p.start)} to ${monthLabel(p.end)}`,
})))

const currentPhase = computed(() => phases.value.find(p => p.status === 'current') ?? phases.value.find(p => p.status === 'upcoming') ?? phases.value[phases.value.length - 1])

const periodLabel = computed(() => `${monthLabel(BETA.period.start)} to ${monthLabel(BETA.period.end)}`)
</script>

<template>
  <section class="beta ap-section">
    <div class="ap-container beta__wrap">
      <RouterLink to="/" class="beta__back">← Back to Apotome</RouterLink>

      <header class="beta__head">
        <span class="beta__pill">{{ BETA.label }}</span>
        <h1 class="beta__title">Apotome Archetypes is in beta.</h1>
        <p class="beta__lede">
          The platform is live and building real websites for real businesses. What makes this a beta is the
          rollout: through spring 2027 we are bringing a first cohort of Trinidad businesses online, shipping
          improvements every week, and shaping the product around what those owners and their customers actually
          need. If you build with us now, you are part of that.
        </p>
        <p v-if="currentPhase" class="beta__now">
          <span class="beta__now-dot" aria-hidden="true" />
          Right now: <strong>{{ currentPhase.title }}</strong> <span class="beta__now-range">({{ currentPhase.range }})</span>
        </p>
      </header>

      <div class="beta__grid">
        <article class="beta__card">
          <h2>Your site is real, and yours</h2>
          <p>Every site runs on the production platform with its own domain, hosting and SSL, a dashboard for your words, photos and hours, and no subscription. Beta does not mean temporary. You keep what you launch.</p>
        </article>
        <article class="beta__card">
          <h2>Things improve weekly</h2>
          <p>Sites update themselves as the templates advance, so new features arrive without you lifting a finger. Newer areas like online ordering, shop checkout and payouts may still have rough edges. Tell us and we fix them, usually within days.</p>
        </article>
        <article class="beta__card">
          <h2>Beta pricing holds</h2>
          <p>The prices on this site are the prices you pay. Nothing changes retroactively when beta ends. Businesses selected for the Discoverable Trinidad cohort pay nothing at all; the program covers their site in full.</p>
        </article>
      </div>

      <section class="beta__program">
        <h2 class="beta__h2">The program behind the beta</h2>
        <p class="beta__body">
          <strong>{{ BETA.programName }}</strong> is the {{ BETA.programSubtitle }}. A survey of Trinidad's
          {{ BETA.surveyed.listings }} tourism-facing businesses found {{ BETA.surveyed.withoutWebsite }} with no website at all, and many more with
          pages that never show up when a traveler searches on a phone. The program selects the {{ BETA.cohortSize }} businesses in greatest need,
          builds each one a professional site at no charge, and ties them together in an Explore Trinidad directory
          organized by Shop, Dine and Stay.
        </p>
        <p class="beta__body">
          Implementation runs <strong>{{ periodLabel }}</strong>.
          <template v-if="BETA.grantStatus === 'awarded'">The program is funded by the {{ BETA.grantBody }}, with Apotome Labs contributing the platform, infrastructure and project management on top. {{ BETA.acknowledgment }}</template>
          <template v-else>Funding has been proposed to the {{ BETA.grantBody }}; Apotome Labs is contributing the platform, infrastructure and project management regardless.</template>
        </p>
      </section>

      <section class="beta__timeline">
        <h2 class="beta__h2">Timeline</h2>
        <ol class="beta__phases">
          <li v-for="p in phases" :key="p.title" class="beta__phase" :class="`is-${p.status}`">
            <div class="beta__phase-meta">
              <span class="beta__phase-num">{{ String(p.index).padStart(2, '0') }}</span>
              <span class="beta__phase-range">{{ p.range }}</span>
              <span class="beta__phase-status">{{ STATUS_LABEL[p.status] }}</span>
            </div>
            <div class="beta__phase-body">
              <h3>{{ p.title }}</h3>
              <p>{{ p.summary }}</p>
              <ul class="beta__deliverables">
                <li v-for="d in p.deliverables" :key="d">{{ d }}</li>
              </ul>
            </div>
          </li>
        </ol>
      </section>

      <section class="beta__milestones">
        <h2 class="beta__h2">Milestones</h2>
        <dl class="beta__ms">
          <div v-for="m in BETA.milestones" :key="m.title" class="beta__m">
            <dt>{{ m.title }}<span class="beta__m-target">{{ m.target }}</span></dt>
            <dd>{{ m.detail }}</dd>
          </div>
        </dl>
      </section>

      <section class="beta__partners">
        <h2 class="beta__h2">Who is involved</h2>
        <ul class="beta__partner-list">
          <li v-for="p in BETA.partners" :key="p.name">
            <strong>{{ p.name }}</strong>
            <span>{{ p.role }}</span>
          </li>
        </ul>
        <p class="beta__body beta__partners-note">Apotome Labs, a Trinidad studio, builds and operates the platform and is accountable for delivery.</p>
      </section>

      <footer class="beta__foot">
        <div class="beta__foot-text">
          <h2 class="beta__h2">Found something off? Say so.</h2>
          <p class="beta__body">A beta is only as good as the people using it. Email <a :href="`mailto:${BETA.feedbackEmail}`">{{ BETA.feedbackEmail }}</a> with anything that breaks or confuses you, and watch <RouterLink to="/changelog">What's new</RouterLink> for what shipped.</p>
        </div>
        <div class="beta__foot-actions">
          <RouterLink to="/wizard" class="ap-btn">Start a project</RouterLink>
          <RouterLink to="/contact" class="ap-btn ap-btn--ghost">Get in touch</RouterLink>
        </div>
      </footer>
    </div>
  </section>
</template>

<style scoped>
.beta { padding-top: clamp(2rem, 6vw, 4rem); }
.beta__wrap { max-width: 820px; }
.beta__back { display: inline-block; margin-bottom: 1.5rem; font-size: 0.9rem; color: var(--ap-ink-muted); border-bottom: 0; }
.beta__back:hover { color: var(--ap-primary); }

.beta__head { margin-bottom: 2.5rem; }
.beta__pill {
  display: inline-block; margin-bottom: 1rem;
  padding: 0.3rem 0.7rem; border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--ap-primary) 55%, transparent);
  background: color-mix(in srgb, var(--ap-primary) 12%, transparent);
  color: var(--ap-primary);
  font-family: var(--ap-font-mono, monospace); font-size: 0.68rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
}
.beta__title { margin: 0 0 1rem; font-size: clamp(2rem, 5vw, 3rem); line-height: 1.08; }
.beta__lede { margin: 0; font-size: 1.1rem; line-height: 1.6; color: var(--ap-ink-muted); max-width: 64ch; }
.beta__now { display: flex; align-items: center; gap: 0.55rem; margin: 1.4rem 0 0; font-size: 0.95rem; }
.beta__now-dot { width: 0.6rem; height: 0.6rem; border-radius: 50%; background: var(--ap-primary); box-shadow: 0 0 0 4px color-mix(in srgb, var(--ap-primary) 20%, transparent); }
.beta__now-range { color: var(--ap-ink-muted); }

.beta__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 3.5rem; }
.beta__card { padding: 1.3rem 1.3rem 1.4rem; border: 1px solid var(--ap-line); border-radius: var(--ap-radius, 10px); background: var(--ap-surface); }
.beta__card h2 { margin: 0 0 0.55rem; font-size: 1.05rem; }
.beta__card p { margin: 0; font-size: 0.93rem; line-height: 1.55; color: var(--ap-ink-muted); }

.beta__h2 { margin: 0 0 1rem; font-size: clamp(1.35rem, 2.6vw, 1.7rem); }
.beta__body { margin: 0 0 1rem; line-height: 1.65; color: var(--ap-ink-muted); }
.beta__body strong { color: var(--ap-ink); }
.beta__body a { color: var(--ap-primary); text-decoration: underline; text-underline-offset: 2px; }
.beta__program { margin-bottom: 3.5rem; }

.beta__timeline { margin-bottom: 3.5rem; }
.beta__phases { list-style: none; margin: 0; padding: 0; }
.beta__phase { display: grid; grid-template-columns: 150px 1fr; gap: 1.5rem; padding: 0 0 2.25rem; position: relative; }
.beta__phase::before { content: ''; position: absolute; left: 158px; top: 0.6rem; bottom: -0.4rem; width: 1px; background: var(--ap-line); }
.beta__phase:last-child::before { display: none; }
.beta__phase.is-complete::before { background: var(--ap-ink); }
.beta__phase-meta { display: flex; flex-direction: column; gap: 0.3rem; }
.beta__phase-num { font-family: var(--ap-font-mono, monospace); font-size: 0.72rem; letter-spacing: 0.12em; color: var(--ap-ink-muted); }
.beta__phase-range { font-size: 0.85rem; font-weight: 600; }
.beta__phase-status { display: inline-block; width: max-content; font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.15rem 0.5rem; border-radius: 999px; border: 1px solid var(--ap-line); color: var(--ap-ink-muted); }
.is-current .beta__phase-status { border-color: var(--ap-primary); color: var(--ap-primary); background: color-mix(in srgb, var(--ap-primary) 10%, transparent); }
.is-complete .beta__phase-status { background: var(--ap-ink); border-color: var(--ap-ink); color: var(--ap-surface); }
.beta__phase-body h3 { margin: 0 0 0.45rem; font-size: 1.2rem; }
.beta__phase-body p { margin: 0 0 0.8rem; line-height: 1.6; color: var(--ap-ink-muted); }
.beta__deliverables { margin: 0; padding-left: 1.1rem; display: grid; gap: 0.3rem; font-size: 0.92rem; }
.is-upcoming .beta__phase-body { opacity: 0.85; }
@media (max-width: 640px) {
  .beta__phase { grid-template-columns: 1fr; gap: 0.6rem; }
  .beta__phase::before { display: none; }
  .beta__phase-meta { flex-direction: row; flex-wrap: wrap; align-items: center; gap: 0.6rem; }
}

.beta__milestones { margin-bottom: 3.5rem; }
.beta__ms { margin: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1rem; }
.beta__m { padding: 1.1rem 1.2rem; border: 1px solid var(--ap-line); border-radius: var(--ap-radius, 10px); background: var(--ap-surface-alt, var(--ap-surface)); }
.beta__m dt { font-weight: 700; display: flex; flex-direction: column; gap: 0.15rem; margin-bottom: 0.5rem; }
.beta__m-target { font-weight: 500; font-size: 0.78rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ap-ink-muted); }
.beta__m dd { margin: 0; font-size: 0.92rem; line-height: 1.55; color: var(--ap-ink-muted); }

.beta__partners { margin-bottom: 3.5rem; }
.beta__partner-list { list-style: none; margin: 0 0 1rem; padding: 0; display: grid; gap: 0.6rem; }
.beta__partner-list li { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr); gap: 1rem; padding: 0.7rem 0; border-bottom: 1px solid var(--ap-line); font-size: 0.93rem; }
.beta__partner-list li span { color: var(--ap-ink-muted); }
@media (max-width: 640px) { .beta__partner-list li { grid-template-columns: 1fr; gap: 0.15rem; } }
.beta__partners-note { font-size: 0.88rem; }

.beta__foot { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 2rem; align-items: center; padding-top: 2.5rem; border-top: 1px solid var(--ap-line); }
.beta__foot-text .beta__body { margin: 0; }
.beta__foot-actions { display: flex; gap: 0.6rem; flex-wrap: wrap; }
@media (max-width: 720px) { .beta__foot { grid-template-columns: 1fr; } }
</style>
