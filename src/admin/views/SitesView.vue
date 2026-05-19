<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { contentClient } from '../../platform/contentClient'

const sites = ref<Awaited<ReturnType<typeof contentClient.listSites>>>([])
const loading = ref(false)
const error = ref<string | null>(null)
const redeploying = ref<Record<string, boolean>>({})
const redeployMsg = ref<Record<string, string>>({})
const updateStatus = ref<Record<string, { current: string | null; latest: string; hasUpdate: boolean; neverChecked: boolean } | null>>({})
const updateChecking = ref<Record<string, boolean>>({})
const updating = ref<Record<string, boolean>>({})
const updateMsg = ref<Record<string, string>>({})

async function redeploy(siteId: string) {
  redeploying.value[siteId] = true
  redeployMsg.value[siteId] = ''
  try {
    const r = await contentClient.redeploySite(siteId)
    redeployMsg.value[siteId] = `Triggered (${r.deploymentId})`
  } catch (e) {
    redeployMsg.value[siteId] = e instanceof Error ? e.message : String(e)
  } finally {
    redeploying.value[siteId] = false
  }
}

async function checkUpdate(siteId: string) {
  updateChecking.value[siteId] = true
  updateMsg.value[siteId] = ''
  try {
    updateStatus.value[siteId] = await contentClient.getUpdateStatus(siteId)
  } catch (e) {
    updateMsg.value[siteId] = e instanceof Error ? e.message : String(e)
  } finally {
    updateChecking.value[siteId] = false
  }
}

async function updateNow(siteId: string) {
  updating.value[siteId] = true
  updateMsg.value[siteId] = ''
  try {
    const r = await contentClient.updateSite(siteId)
    updateMsg.value[siteId] = `Update queued (${r.jobId})`
  } catch (e) {
    updateMsg.value[siteId] = e instanceof Error ? e.message : String(e)
  } finally {
    updating.value[siteId] = false
  }
}

onMounted(async () => {
  loading.value = true
  try {
    sites.value = await contentClient.listSites()
    // fire-and-forget initial status check for each deployed site
    for (const s of sites.value) {
      if (s.productionUrl) void checkUpdate(s.id)
    }
  }
  catch (e) { error.value = e instanceof Error ? e.message : String(e) }
  finally { loading.value = false }
})
</script>

<template>
  <section>
    <h1>Your sites</h1>
    <p v-if="loading">Loading…</p>
    <p v-if="error" class="err">{{ error }}</p>
    <table v-if="sites.length">
      <thead>
        <tr><th>Slug</th><th>Archetype</th><th>Status</th><th>URL</th><th>Updates</th><th>Actions</th></tr>
      </thead>
      <tbody>
        <tr v-for="s in sites" :key="s.id">
          <td>{{ s.slug }}</td>
          <td>{{ s.archetype }}</td>
          <td>{{ s.status }}</td>
          <td>
            <a v-if="s.customDomain" :href="`https://${s.customDomain}`" target="_blank" rel="noopener">{{ s.customDomain }}</a>
            <a v-else-if="s.productionUrl" :href="s.productionUrl" target="_blank" rel="noopener">{{ s.productionUrl }}</a>
            <span v-else>—</span>
          </td>
          <td>
            <template v-if="s.productionUrl">
              <span v-if="updateChecking[s.id]" class="muted">Checking…</span>
              <template v-else-if="updateStatus[s.id]">
                <span v-if="updateStatus[s.id]!.hasUpdate" class="upd">Update available</span>
                <span v-else-if="updateStatus[s.id]!.neverChecked" class="muted">Unknown</span>
                <span v-else class="ok">Up to date</span>
              </template>
              <button class="btn-sm" :disabled="updateChecking[s.id]" @click="checkUpdate(s.id)">Check</button>
              <button
                v-if="updateStatus[s.id]?.hasUpdate || updateStatus[s.id]?.neverChecked"
                class="btn-sm btn-primary"
                :disabled="updating[s.id]"
                @click="updateNow(s.id)"
              >{{ updating[s.id] ? 'Queuing…' : 'Update Now' }}</button>
              <span v-if="updateMsg[s.id]" class="msg">{{ updateMsg[s.id] }}</span>
            </template>
            <span v-else>—</span>
          </td>
          <td>
            <template v-if="s.productionUrl">
              <button :disabled="redeploying[s.id]" @click="redeploy(s.id)">
                {{ redeploying[s.id] ? 'Triggering…' : 'Redeploy' }}
              </button>
              <span v-if="redeployMsg[s.id]" class="msg">{{ redeployMsg[s.id] }}</span>
            </template>
            <span v-else>—</span>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else-if="!loading && !error">No sites yet.</p>
  </section>
</template>

<style scoped>
table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
th, td { padding: 0.5rem 0.75rem; border-bottom: 1px solid #2a2a2c; text-align: left; vertical-align: middle; }
button { padding: 0.3rem 0.6rem; background: #f5f5f5; color: #0f0f10; border: none; border-radius: 4px; cursor: pointer; font: inherit; font-size: 0.85rem; font-weight: 500; margin-right: 0.25rem; }
.btn-sm { padding: 0.2rem 0.5rem; font-size: 0.78rem; background: transparent; color: inherit; border: 1px solid #444; }
.btn-primary { background: #80c0ff; color: #0f0f10; border-color: #80c0ff; }
button:disabled { opacity: 0.5; cursor: not-allowed; }
.msg { margin-left: 0.5rem; font-size: 0.8rem; color: #80c0ff; }
.muted { color: #888; font-size: 0.85rem; margin-right: 0.5rem; }
.ok { color: #80ff80; font-size: 0.85rem; margin-right: 0.5rem; }
.upd { color: #ffd080; font-size: 0.85rem; margin-right: 0.5rem; }
.err { color: #ff8080; }
a { color: #80c0ff; }
</style>
