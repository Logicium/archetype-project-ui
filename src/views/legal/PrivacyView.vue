<script setup lang="ts">
import LegalDoc from '../../components/LegalDoc.vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <LegalDoc
    eyebrow="Legal"
    title="Privacy Policy"
    updated="July 21, 2026"
    summary="Plain-language version: we only collect what we need to build and run your website, we never sell your data, and you can delete everything at any time."
  >
    <p>
      This Privacy Policy explains what information Apotome Labs (“Apotome”, “we”, “us”)
      collects when you use our website-building service, why we collect it, and the
      choices you have. If anything here is unclear, email us at
      <a href="mailto:kisora@apotomelabs.com">kisora@apotomelabs.com</a>.
    </p>

    <h2>What we collect</h2>
    <ul>
      <li><strong>Account info</strong> — your email address and (optionally) your name, so we can sign you in and contact you about your site.</li>
      <li><strong>Site content</strong> — the text, images, hours, menus, and other content you enter to build your website.</li>
      <li><strong>Payment info</strong> — handled by <a href="https://stripe.com/privacy" target="_blank" rel="noopener">Stripe</a>. We never see or store your full card number.</li>
      <li><strong>Connected accounts</strong> — if you choose to connect Instagram or Google, we store the access tokens needed to display your posts or reviews. You can disconnect at any time.</li>
      <li><strong>Basic analytics</strong> — privacy-friendly, cookieless visit counts for your site (page views, referrers, device type). No personal profiles, no cross-site tracking.</li>
    </ul>

    <h2>How we use it</h2>
    <ul>
      <li>To build, host, and operate your website.</li>
      <li>To process payments and deliver what you purchased.</li>
      <li>To show the Instagram posts or Google reviews you asked us to display.</li>
      <li>To send you essential account and service emails.</li>
    </ul>
    <p>We do <strong>not</strong> sell your personal information, and we don't use it for advertising.</p>

    <h2>Instagram &amp; Meta data</h2>
    <p>
      When you connect an Instagram account, we request only the permissions needed to
      show your recent media on your website. We store the access token and the media
      we display, and nothing else from your Instagram account. This data is used solely
      to render your feed. When you disconnect Instagram — or delete your account — the
      token and cached media are removed. Our use of Instagram data complies with the
      Meta Platform Terms and Developer Policies.
    </p>

    <h2>Who we share it with</h2>
    <p>We rely on a small set of trusted providers to run the service:</p>
    <ul>
      <li><strong>Stripe</strong> — payments.</li>
      <li><strong>Vercel</strong> — website hosting and deployment.</li>
      <li><strong>Google</strong> — maps, geocoding, and (if you connect it) your business reviews.</li>
      <li><strong>Meta / Instagram</strong> — if you connect Instagram.</li>
      <li><strong>Email provider</strong> — to deliver sign-in links and notifications.</li>
    </ul>
    <p>Each provider only receives what's needed to do its job.</p>

    <h2>Cookies</h2>
    <p>
      We use a single session cookie to keep you signed in to your dashboard. Our
      analytics are cookieless. We don't use advertising or tracking cookies.
    </p>

    <h2>How long we keep it</h2>
    <p>
      We keep your data while your account is active. When you delete your account, your
      sites go offline immediately and all associated data is permanently removed within
      <strong>30 days</strong>. See the full
      <RouterLink to="/terms">Data Retention Policy</RouterLink> in our Terms.
    </p>

    <h2>Your rights &amp; deleting your data</h2>
    <p>
      You can access, correct, or delete your data at any time. The easiest way is the
      <strong>Delete account &amp; data</strong> option in your dashboard under Account.
      Full instructions are on our
      <RouterLink to="/data-deletion">Data Deletion</RouterLink> page. You can also email
      <a href="mailto:kisora@apotomelabs.com">kisora@apotomelabs.com</a> and we'll handle it for you.
    </p>

    <h2>Children</h2>
    <p>Our service is for businesses and is not directed at children under 13.</p>

    <h2>Changes</h2>
    <p>
      If we make material changes to this policy, we'll update the date above and, where
      appropriate, notify you by email.
    </p>

    <h2>Contact</h2>
    <p>Questions? Email <a href="mailto:kisora@apotomelabs.com">kisora@apotomelabs.com</a>.</p>
  </LegalDoc>
</template>
