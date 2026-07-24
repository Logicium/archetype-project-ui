<script setup lang="ts">
/**
 * Apotome Labs × Emergent Campus — a real co-brand lockup rendered in both
 * partners' actual identities on the Apotome Labs "paper" ground:
 *   · Apotome Labs   — the navbar treatment from apotome-labs-neo-ui:
 *                      "APOTOME LABS" in JetBrains Mono + the tricolor slashes.
 *   · Emergent Campus — their real green serif wordmark (emergentcampus.org),
 *                      downloaded to /partners so it isn't a fragile hotlink.
 * Grounded in fact: Apotome Labs works out of Emergent Campus, the award-winning
 * nonprofit business campus in rural Colorado.
 */
</script>

<template>
  <section class="collab">
    <div class="collab__inner">
      <p class="collab__eyebrow"><span class="collab__sq" aria-hidden="true" /> In partnership</p>

      <div class="collab__lockup">
        <span class="collab__apotome">
          <span class="collab__apotome-word">APOTOME&nbsp;LABS</span>
          <svg class="collab__slashes" viewBox="14.38 17 35.24 30" aria-hidden="true">
            <g transform="translate(32 32) skewX(-18) translate(-32 -32)">
              <rect x="19.25" y="17" width="5.5" height="30" fill="#2447e8" />
              <rect x="29.25" y="17" width="5.5" height="30" fill="#ffc900" />
              <rect x="39.25" y="17" width="5.5" height="30" fill="#ff3d00" />
            </g>
          </svg>
        </span>

        <span class="collab__x" aria-hidden="true">&#215;</span>

        <img
          class="collab__ec"
          src="/partners/emergent-campus-green.png"
          alt="Emergent Campus"
          width="1300"
          height="358"
          loading="lazy"
          decoding="async"
        />
      </div>

      <p class="collab__body">
        Apotome Labs works out of Emergent Campus, the award-winning nonprofit campus
        igniting innovation across rural Colorado. A local studio inside a local incubator,
        both set on getting Trinidad's businesses online and growing. Home-grown tech for a
        home-grown economy.
      </p>

      <div class="collab__rule" aria-hidden="true" />
      <p class="collab__meta">612 Park Street · Emergent Campus · Trinidad, CO 81082</p>
    </div>
  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&family=Work+Sans:wght@400;500&display=swap');

/* Inherits the site's active color style (swatch/theme) via the --ap-* tokens,
   so the band retints with the rest of the page. The partner logos stay in
   their own brand colors (Emergent green + Apotome tricolor slashes). */
.collab {
  background: var(--ap-surface-alt);
  color: var(--ap-ink);
  border-top: 1px solid var(--ap-line);
  border-bottom: 1px solid var(--ap-line);
  padding-block: clamp(3.5rem, 8vw, 6rem);
  overflow: clip;
}
.collab__inner {
  max-width: 860px; margin: 0 auto;
  padding-inline: clamp(1.25rem, 4vw, 2.5rem);
  text-align: center;
}

.collab__eyebrow {
  display: inline-flex; align-items: center; gap: 0.5rem;
  margin: 0 0 clamp(1.5rem, 4vw, 2.25rem);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem; font-weight: 500;
  letter-spacing: 0.26em; text-transform: uppercase;
  color: var(--ap-ink-muted);
}
.collab__sq { width: 0.5rem; height: 0.5rem; background: var(--ap-primary); display: inline-block; }

.collab__lockup {
  display: flex; align-items: center; justify-content: center;
  flex-wrap: wrap; gap: clamp(1rem, 3vw, 2.25rem);
}
.collab__apotome { display: inline-flex; align-items: center; gap: 0.5rem; }
.collab__apotome-word {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: clamp(1.15rem, 2.6vw, 1.9rem);
  letter-spacing: 0.12em;
  color: var(--ap-ink);
  white-space: nowrap;
}
.collab__slashes { height: clamp(1.3rem, 3vw, 2.1rem); width: auto; display: block; }
.collab__x {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  font-size: clamp(1.3rem, 3vw, 2rem);
  color: var(--ap-primary);
  line-height: 1;
}
.collab__ec {
  height: clamp(2.4rem, 6vw, 4rem); width: auto; display: block;
}

.collab__body {
  margin: clamp(1.75rem, 4vw, 2.5rem) auto 0;
  max-width: 58ch;
  font-family: 'Work Sans', sans-serif;
  font-size: clamp(0.98rem, 1.4vw, 1.1rem);
  line-height: 1.7;
  color: var(--ap-ink-muted);
}
.collab__rule {
  width: 60px; height: 1px;
  margin: clamp(1.75rem, 4vw, 2.4rem) auto clamp(0.9rem, 2vw, 1.3rem);
  background: var(--ap-line);
}
.collab__meta {
  margin: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem; font-weight: 500;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ap-ink-muted);
}
</style>
