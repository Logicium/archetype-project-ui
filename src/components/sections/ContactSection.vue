<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title?: string
  intro?: string
  address?: string
  phone?: string
  email?: string
  mapEmbedUrl?: string
  formAction?: string
}>()
</script>

<template>
  <section class="ap-section ap-contact">
    <div class="ap-container ap-contact__grid">
      <div>
        <div class="ap-section-head">
          <span v-if="eyebrow" class="ap-eyebrow">{{ eyebrow }}</span>
          <h2>{{ title || 'Get in touch' }}</h2>
          <p v-if="intro" style="color: var(--ap-ink-muted)">{{ intro }}</p>
        </div>
        <ul class="ap-contact__details">
          <li v-if="address"><span>Address</span><strong>{{ address }}</strong></li>
          <li v-if="phone"><span>Phone</span><a :href="'tel:' + phone">{{ phone }}</a></li>
          <li v-if="email"><span>Email</span><a :href="'mailto:' + email">{{ email }}</a></li>
        </ul>
        <div v-if="mapEmbedUrl" class="ap-contact__map">
          <iframe :src="mapEmbedUrl" loading="lazy" referrerpolicy="no-referrer-when-downgrade" />
        </div>
      </div>
      <form class="ap-contact__form" :action="formAction" method="post">
        <div class="ap-field">
          <label for="ap-name">Name</label>
          <input id="ap-name" name="name" required class="ap-input" />
        </div>
        <div class="ap-field">
          <label for="ap-email">Email</label>
          <input id="ap-email" name="email" type="email" required class="ap-input" />
        </div>
        <div class="ap-field">
          <label for="ap-message">Message</label>
          <textarea id="ap-message" name="message" rows="5" required class="ap-textarea" />
        </div>
        <button type="submit" class="ap-btn">Send message</button>
      </form>
    </div>
  </section>
</template>

<style scoped>
.ap-contact__grid {
  display: grid; gap: clamp(2rem, 4vw, 4rem);
  grid-template-columns: 5fr 6fr;
}
.ap-contact__details { list-style: none; padding: 0; margin: 0 0 1.5rem; display: grid; gap: 0.75rem; }
.ap-contact__details li {
  display: grid; grid-template-columns: 110px 1fr; gap: 1rem;
  padding-bottom: 0.6rem; border-bottom: 1px solid var(--ap-line);
}
.ap-contact__details span {
  font-size: 0.78rem; letter-spacing: 0.16em;
  text-transform: uppercase; color: var(--ap-ink-muted);
}
.ap-contact__map { aspect-ratio: 4 / 3; border-radius: var(--ap-radius); overflow: hidden; border: 1px solid var(--ap-line); }
.ap-contact__map iframe { width: 100%; height: 100%; border: 0; }
.ap-contact__form { background: var(--ap-surface-alt); padding: clamp(1.5rem, 3vw, 2.5rem); border-radius: var(--ap-radius-lg); border: 1px solid var(--ap-line); }
@media (max-width: 820px) { .ap-contact__grid { grid-template-columns: 1fr; } }
</style>
