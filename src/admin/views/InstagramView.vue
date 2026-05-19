<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { contentClient } from '../../platform/contentClient'
import { useActiveSiteStore } from '../../platform/activeSiteStore'

const activeSites = useActiveSiteStore()
const siteId = computed(() => activeSites.activeId)
const connectUrl = ref<string | null>(null)
const error = ref<string | null>(null)

async function loadConnect() {
  if (!siteId.value) return
  try { connectUrl.value = (await contentClient.getInstagramConnect(siteId.value)).url }
  catch (e) { error.value = e instanceof Error ? e.message : String(e) }
}
async function disconnect() {
  await contentClient.disconnectInstagram(siteId.value)
  await loadConnect()
}
onMounted(loadConnect)
watch(siteId, loadConnect)
</script>

<template>
  <section>
    <h1>Instagram</h1>
    <p v-if="!siteId" class="err">Select a site from the header dropdown.</p>
    <template v-else>
      <p v-if="connectUrl">
        <a :href="connectUrl" class="btn">Connect Instagram</a>
        <button type="button" @click="disconnect">Disconnect</button>
      </p>
      <p v-if="error" class="err">{{ error }}</p>
    </template>
  </section>
</template>

<style scoped>
label { display: block; margin: 1rem 0; }
select, button, .btn { padding: 0.4rem 0.8rem; background: #1a1a1c; color: inherit; border: 1px solid #444; border-radius: 4px; text-decoration: none; cursor: pointer; }
.btn { background: #f5f5f5; color: #0f0f10; font-weight: 500; margin-right: 0.5rem; }
.err { color: #ff8080; }
</style>
