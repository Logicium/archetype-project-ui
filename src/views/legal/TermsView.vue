<script setup lang="ts">
import LegalDoc from '../../components/LegalDoc.vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <LegalDoc
    eyebrow="Legal"
    title="Terms of Service"
    updated="July 21, 2026"
    summary="The short version: you own your content, we build and host your site, be reasonable about how you use it, and either of us can end the arrangement."
  >
    <p>
      These Terms of Service (“Terms”) govern your use of the website-building service
      provided by Apotome Labs (“Apotome”, “we”, “us”). By creating an account or
      purchasing a site, you agree to these Terms and to our
      <RouterLink to="/privacy">Privacy Policy</RouterLink>.
    </p>

    <h2>1. The service</h2>
    <p>
      Apotome lets you create, publish, and manage a business website, with optional
      add-ons like online ordering, bookings, payments, and integrations with Instagram
      and Google. We may add, change, or remove features over time.
    </p>

    <h2>2. Your account</h2>
    <p>
      You're responsible for keeping your sign-in secure and for activity under your
      account. Provide accurate information and keep your email up to date so we can
      reach you.
    </p>

    <h2>3. Your content &amp; ownership</h2>
    <p>
      You own the content you add — text, images, logos, menus, and so on. You grant us
      the limited permission needed to host, display, and back up that content so we can
      run your site. You're responsible for making sure you have the rights to everything
      you upload.
    </p>

    <h2>4. Acceptable use</h2>
    <p>You agree not to use the service to:</p>
    <ul>
      <li>break the law or infringe someone else's rights;</li>
      <li>upload malware, spam, or deceptive content;</li>
      <li>abuse, overload, or attempt to disrupt the platform; or</li>
      <li>violate the terms of any connected provider (e.g. Meta/Instagram, Google, Stripe).</li>
    </ul>

    <h2>5. Payments &amp; refunds</h2>
    <p>
      Payments are processed by Stripe. Prices are shown before checkout. Because sites
      are provisioned and hosted for you, fees are generally non-refundable except where
      required by law — but if something goes wrong, email us and we'll make it right.
    </p>

    <h2>6. Third-party integrations</h2>
    <p>
      When you connect Instagram, Google, Stripe, or similar services, your use of those
      integrations is also subject to their terms. We're not responsible for third-party
      services, and they may change or become unavailable.
    </p>

    <h2>7. Availability &amp; warranty</h2>
    <p>
      We work hard to keep your site online, but the service is provided “as is” without
      warranties of any kind. We don't guarantee uninterrupted or error-free operation.
    </p>

    <h2>8. Limitation of liability</h2>
    <p>
      To the extent permitted by law, Apotome is not liable for indirect or consequential
      damages, and our total liability is limited to the amount you paid us in the 12
      months before the claim.
    </p>

    <h2>9. Termination</h2>
    <p>
      You can stop using the service and delete your account at any time. We may suspend
      or end accounts that violate these Terms. On termination, the data-retention rules
      below apply.
    </p>

    <h2 id="data-retention">10. Data Retention Policy</h2>
    <p>
      We keep your account and site data for as long as your account is active so your
      website keeps working. Here's how retention and deletion work:
    </p>
    <ul>
      <li><strong>Active accounts:</strong> we retain your content and settings while your site is live.</li>
      <li><strong>On deletion request:</strong> your sites are taken offline immediately and connected Instagram/Google data is disconnected right away.</li>
      <li><strong>Permanent purge:</strong> all remaining personal and site data is permanently deleted within <strong>30 days</strong> of your request.</li>
      <li><strong>Backups:</strong> residual copies in routine backups are overwritten on our normal backup cycle (no longer than 90 days).</li>
      <li><strong>Legal minimums:</strong> we may retain limited records (e.g. payment/tax records) only where the law requires it.</li>
    </ul>
    <p class="legal__note">
      To start a deletion, use <strong>Account → Delete account &amp; data</strong> in your
      dashboard, or follow the steps on our
      <RouterLink to="/data-deletion">Data Deletion</RouterLink> page.
    </p>

    <h2>11. Changes to these Terms</h2>
    <p>
      We may update these Terms from time to time. If changes are material, we'll update
      the date above and notify you where appropriate. Continued use means you accept the
      updated Terms.
    </p>

    <h2>12. Contact</h2>
    <p>Questions about these Terms? Email <a href="mailto:kisora@apotomelabs.com">kisora@apotomelabs.com</a>.</p>
  </LegalDoc>
</template>
