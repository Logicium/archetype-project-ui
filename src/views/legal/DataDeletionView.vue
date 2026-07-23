<script setup lang="ts">
import LegalDoc from '../../components/LegalDoc.vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <LegalDoc
    eyebrow="Legal"
    title="Data Deletion"
    updated="July 21, 2026"
    summary="You can permanently delete your account and all your data at any time — from your dashboard in a couple of clicks, or by emailing us."
  >
    <p>
      This page explains how to delete the data Apotome Labs holds about you, including
      any information from connected services like Instagram and Google.
    </p>

    <h2>Option 1 — Delete it yourself (fastest)</h2>
    <p>If you have an Apotome account:</p>
    <ul>
      <li>Sign in to your dashboard and open <strong>Account</strong>.</li>
      <li>Scroll to <strong>Delete account &amp; data</strong>.</li>
      <li>Type <strong>DELETE</strong> to confirm, then choose <strong>Permanently delete</strong>.</li>
    </ul>
    <p>
      <RouterLink to="/admin">Go to your dashboard →</RouterLink>
    </p>

    <h2>Option 2 — Ask us to delete it</h2>
    <p>
      Prefer we handle it? Email
      <a href="mailto:kisora@apotomelabs.com?subject=Data%20deletion%20request">kisora@apotomelabs.com</a>
      from the address on your account with the subject “Data deletion request”. We'll
      verify it's you and complete the deletion.
    </p>

    <h2>What happens when you delete</h2>
    <ul>
      <li><strong>Immediately:</strong> your sites go offline and any connected Instagram and Google accounts are disconnected — we wipe those access tokens and cached data on the spot.</li>
      <li><strong>Within 30 days:</strong> your account and all remaining data (sites, content, orders, media) are permanently erased.</li>
      <li><strong>Confirmation:</strong> we email you when the request is received; you have a short window to reply if it was a mistake.</li>
    </ul>

    <h2>Removing Instagram access specifically</h2>
    <p>
      If you only want to revoke Instagram, you can disconnect it from the
      <strong>Instagram</strong> tab in your dashboard, or remove Apotome from your
      Instagram settings under <em>Apps and Websites</em>. Either way, we delete the
      stored token and cached posts. Deleting your whole account removes this data too.
    </p>

    <p class="legal__note">
      For the full picture, see our <RouterLink to="/privacy">Privacy Policy</RouterLink>
      and the <RouterLink to="/terms">Data Retention Policy</RouterLink>.
    </p>
  </LegalDoc>
</template>
