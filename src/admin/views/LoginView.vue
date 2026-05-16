<script setup lang="ts">
import { ref } from 'vue'
import { contentClient } from '../../platform/contentClient'

const email = ref('')
const sent = ref(false)
const sending = ref(false)
const error = ref<string | null>(null)

async function submit() {
  error.value = null
  sending.value = true
  try {
    await contentClient.requestMagicLink(email.value.trim())
    sent.value = true
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <section class="login">
    <h1>Sign in</h1>
    <p v-if="!sent">Enter your email and we'll send you a one-time sign-in link.</p>
    <form v-if="!sent" @submit.prevent="submit">
      <input v-model="email" type="email" required placeholder="you@example.com" autocomplete="email" />
      <button type="submit" :disabled="sending">{{ sending ? 'Sending…' : 'Email me a link' }}</button>
      <p v-if="error" class="err">{{ error }}</p>
    </form>
    <p v-else class="ok">Check <strong>{{ email }}</strong> for your sign-in link.</p>
  </section>
</template>

<style scoped>
.login { max-width: 420px; margin: 4rem auto; }
form { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; }
input, button { padding: 0.6rem 0.8rem; font: inherit; border-radius: 4px; border: 1px solid #444; background: #1a1a1c; color: inherit; }
button { background: #f5f5f5; color: #0f0f10; cursor: pointer; font-weight: 600; }
.err { color: #ff8080; }
.ok { color: #80ff80; margin-top: 1rem; }
</style>
