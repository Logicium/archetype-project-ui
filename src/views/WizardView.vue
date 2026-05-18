<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import ContentWizardSection from '../components/sections/ContentWizardSection.vue'
import { PLATFORM_ENABLED } from '../platform/config'
import { contentClient } from '../platform/contentClient'

const route = useRoute()
const status = route.query.status as string | undefined
const orderId = route.query.order as string | undefined

const showSuccess = ref(PLATFORM_ENABLED && status === 'success' && !!orderId)
const showCancelled = ref(status === 'cancelled')

// Order polling
type OrderStatus = { id: string; status: string; siteId?: string; failureReason?: string }
const order = ref<OrderStatus | null>(null)
const pollError = ref<string | null>(null)
let pollTimer: ReturnType<typeof setInterval> | null = null

async function fetchOrder() {
  if (!orderId) return
  try {
    order.value = await contentClient.getOrder(orderId)
    if (order.value.status === 'live' || order.value.status === 'failed') {
      if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
    }
  } catch (e) {
    pollError.value = e instanceof Error ? e.message : String(e)
  }
}

onMounted(() => {
  if (showSuccess.value) {
    fetchOrder()
    pollTimer = setInterval(fetchOrder, 4000)
  }
})
onUnmounted(() => { if (pollTimer) clearInterval(pollTimer) })
</script>

<template>
  <!-- ── Stripe cancelled ── -->
  <div v-if="showCancelled" class="wiz-result">
    <div class="wiz-result__box">
      <p class="wiz-result__icon">✕</p>
      <h1>Payment cancelled</h1>
      <p>No charge was made. You can go back and try again.</p>
      <a href="/wizard" class="ap-btn">Back to wizard</a>
    </div>
  </div>

  <!-- ── Stripe success → provisioning status ── -->
  <div v-else-if="showSuccess" class="wiz-result">
    <div class="wiz-result__box">
      <template v-if="!order">
        <div class="wiz-result__spinner" />
        <p>Loading order status…</p>
      </template>
      <template v-else-if="order.status === 'live'">
        <p class="wiz-result__icon">✓</p>
        <h1>Your site is live!</h1>
        <p>Check your email — we sent a sign-in link so you can log in and manage your site.</p>
        <a href="/wizard" class="ap-btn ap-btn--ghost">Start another</a>
      </template>
      <template v-else-if="order.status === 'failed'">
        <p class="wiz-result__icon wiz-result__icon--err">✕</p>
        <h1>Provisioning failed</h1>
        <p v-if="order.failureReason" class="wiz-result__reason">{{ order.failureReason }}</p>
        <p>We've been alerted. You can retry from your account or reply to the confirmation email.</p>
        <a href="/wizard" class="ap-btn ap-btn--ghost">Back to wizard</a>
      </template>
      <template v-else>
        <div class="wiz-result__spinner" />
        <h1>Payment received — provisioning your site</h1>
        <p class="wiz-result__sub">Status: <strong>{{ order.status }}</strong></p>
        <p>This usually takes under 2 minutes. You'll get an email with a sign-in link as soon as it's live.</p>
        <p v-if="pollError" class="wiz-result__err">{{ pollError }}</p>
      </template>
    </div>
  </div>

  <!-- ── Normal wizard ── -->
  <ContentWizardSection v-else />
</template>

<style scoped>
.wiz-result {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
}
.wiz-result__box {
  max-width: 480px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.wiz-result__box h1 {
  font-size: clamp(1.5rem, 3vw, 2rem);
  margin: 0;
}
.wiz-result__box p { color: var(--ap-ink-muted); margin: 0; }
.wiz-result__icon {
  font-size: 3rem;
  line-height: 1;
  color: var(--ap-primary);
  margin: 0;
}
.wiz-result__icon--err { color: #c0392b; }
.wiz-result__sub { font-size: 0.9rem; }
.wiz-result__reason {
  background: #fdf2f2;
  border: 1px solid #f5c6c6;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  color: #c0392b;
  text-align: left;
  width: 100%;
}
.wiz-result__err { color: #c0392b; font-size: 0.82rem; }
.wiz-result__spinner {
  width: 40px; height: 40px;
  border: 3px solid var(--ap-line);
  border-top-color: var(--ap-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
