<script setup lang="ts">
defineProps<{
  brand: string
  blurb?: string
  address?: string
  phone?: string
  email?: string
  social?: Array<{ label: string; href: string }>
  links?: Array<{ to: string; label: string }>
}>()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="ap-footer">
    <div class="ap-container ap-footer__grid">
      <div>
        <p class="ap-footer__brand">{{ brand }}</p>
        <p v-if="blurb" class="ap-footer__blurb">{{ blurb }}</p>
      </div>
      <div v-if="address || phone || email">
        <p class="ap-eyebrow">Visit</p>
        <p v-if="address">{{ address }}</p>
        <p v-if="phone"><a :href="'tel:' + phone">{{ phone }}</a></p>
        <p v-if="email"><a :href="'mailto:' + email">{{ email }}</a></p>
      </div>
      <div v-if="links?.length">
        <p class="ap-eyebrow">Explore</p>
        <ul>
          <li v-for="l in links" :key="l.to"><router-link :to="l.to">{{ l.label }}</router-link></li>
        </ul>
      </div>
      <div v-if="social?.length">
        <p class="ap-eyebrow">Follow</p>
        <ul>
          <li v-for="s in social" :key="s.href">
            <a :href="s.href" target="_blank" rel="noopener">{{ s.label }}</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="ap-container ap-footer__base">
      <small>&copy; {{ year }} {{ brand }}. All rights reserved.</small>
      <small>Built by <a href="https://apotomelabs.com" target="_blank" rel="noopener">Apotome Labs</a></small>
    </div>
  </footer>
</template>

<style scoped>
.ap-footer {
  background: var(--ap-surface-alt);
  border-top: 1px solid var(--ap-line);
  padding-top: clamp(3rem, 6vw, 5rem);
  padding-bottom: 2rem;
  margin-top: clamp(3rem, 6vw, 5rem);
}
.ap-footer__grid {
  display: grid; gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  margin-bottom: 2.5rem;
}
.ap-footer__brand {
  font-family: var(--ap-font-heading); font-size: 1.4rem; margin: 0 0 0.5rem;
  letter-spacing: var(--ap-tracking-heading); text-transform: var(--ap-heading-transform);
}
.ap-footer__blurb { color: var(--ap-ink-muted); max-width: 32ch; }
.ap-footer ul { list-style: none; padding: 0; margin: 0.5rem 0 0; display: grid; gap: 0.4rem; }
.ap-footer a { color: var(--ap-ink); border-bottom-color: var(--ap-line); }
.ap-footer__base {
  display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
  padding-top: 1.5rem; border-top: 1px solid var(--ap-line); color: var(--ap-ink-muted);
}
</style>
