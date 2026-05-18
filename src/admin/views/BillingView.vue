<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { contentClient } from '../../platform/contentClient'

type Order = Awaited<ReturnType<typeof contentClient.listOrders>>[number]
type LogEntry = { step: string; status: string; message?: string; durationMs?: number; createdAt: string }

const orders = ref<Order[]>([])
const error = ref<string | null>(null)
const expandedSite = ref<string | null>(null)
const logs = ref<LogEntry[]>([])
const logsError = ref<string | null>(null)

async function load() {
  try { orders.value = await contentClient.listOrders() }
  catch (e) { error.value = e instanceof Error ? e.message : String(e) }
}
async function retry(id: string) {
  await contentClient.retryOrder(id)
  await load()
}
async function toggleLogs(siteId: string) {
  if (expandedSite.value === siteId) { expandedSite.value = null; return }
  expandedSite.value = siteId
  logsError.value = null
  try { logs.value = await contentClient.getDeployLogs(siteId) }
  catch (e) { logsError.value = e instanceof Error ? e.message : String(e) }
}
onMounted(load)
</script>

<template>
  <section>
    <h1>Billing &amp; orders</h1>
    <p v-if="error" class="err">{{ error }}</p>
    <table v-if="orders.length">
      <thead><tr><th>Created</th><th>Archetype</th><th>Plan</th><th>Status</th><th>Notes</th><th /></tr></thead>
      <tbody>
        <template v-for="o in orders" :key="o.id">
          <tr>
            <td>{{ new Date(o.createdAt).toLocaleString() }}</td>
            <td>{{ o.archetype }}</td>
            <td>{{ o.plan }}</td>
            <td :class="{ 'status--failed': o.status === 'failed', 'status--live': o.status === 'live' }">{{ o.status }}</td>
            <td>{{ o.failureReason || '' }}</td>
            <td class="actions">
              <button v-if="o.siteId" type="button" class="btn-sm" @click="toggleLogs(o.siteId!)">
                {{ expandedSite === o.siteId ? 'Hide logs' : 'Logs' }}
              </button>
              <button v-if="o.status === 'failed'" type="button" class="btn-sm btn-retry" @click="retry(o.id)">Retry</button>
            </td>
          </tr>
          <tr v-if="expandedSite === o.siteId" class="log-row">
            <td colspan="6">
              <p v-if="logsError" class="err">{{ logsError }}</p>
              <table v-else-if="logs.length" class="log-table">
                <thead><tr><th>Step</th><th>Status</th><th>Duration</th><th>Message</th></tr></thead>
                <tbody>
                  <tr v-for="l in logs" :key="l.createdAt + l.step" :class="{ 'log--fail': l.status === 'failure' }">
                    <td>{{ l.step }}</td>
                    <td>{{ l.status }}</td>
                    <td>{{ l.durationMs != null ? l.durationMs + 'ms' : '—' }}</td>
                    <td class="log-msg">{{ l.message || '' }}</td>
                  </tr>
                </tbody>
              </table>
              <p v-else>No deploy logs yet.</p>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <p v-else>No orders yet.</p>
  </section>
</template>

<style scoped>
table { width: 100%; border-collapse: collapse; }
th, td { padding: 0.4rem 0.6rem; border-bottom: 1px solid #2a2a2c; text-align: left; }
.actions { display: flex; gap: 0.4rem; }
.btn-sm { padding: 0.2rem 0.55rem; background: transparent; color: inherit; border: 1px solid #444; border-radius: 4px; cursor: pointer; font-size: 0.8rem; }
.btn-retry { border-color: #c05; color: #c05; }
.status--failed { color: #ff8080; }
.status--live { color: #6fcf97; }
.log-row td { background: #111; padding: 0.75rem 0.6rem; }
.log-table { font-size: 0.8rem; }
.log-table th, .log-table td { border-color: #1e1e20; }
.log--fail td { color: #ff8080; }
.log-msg { max-width: 500px; white-space: pre-wrap; word-break: break-all; }
.err { color: #ff8080; }
</style>
