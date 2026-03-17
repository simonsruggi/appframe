import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "AppFrame privacy policy. Learn how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#080808] relative overflow-hidden">
      <div className="absolute inset-0 bg-[#080808]" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-white/[0.015] rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 pt-24 pb-20">
        <div className="mb-10">
          <Link href="/" className="text-white/30 hover:text-white/60 text-sm transition-colors">&larr; Back to home</Link>
        </div>

        <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-white/30 text-sm mb-12">Effective date: March 17, 2026</p>

        <div className="space-y-10 text-white/60 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Introduction</h2>
            <p>
              AppFrame (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the website at{" "}
              <span className="text-white/80">appfra.me</span>. This Privacy Policy explains what information we collect,
              how we use it, and your rights regarding your data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Information We Collect</h2>
            <h3 className="text-white/80 font-medium mb-2">Account information</h3>
            <p className="mb-4">
              When you sign in with Google OAuth, we receive your name, email address, and profile picture
              from Google. This information is used solely to authenticate you and display your profile in the app.
              We do not store this information in any database beyond your active session.
            </p>
            <h3 className="text-white/80 font-medium mb-2">Payment information</h3>
            <p className="mb-4">
              Payments are processed entirely by Stripe. When you purchase AppFrame Pro, you are redirected to
              Stripe&apos;s checkout page. We never see, collect, or store your credit card number or payment details.
              We only receive confirmation of whether a payment was successful, along with the email address
              associated with the transaction.
            </p>
            <h3 className="text-white/80 font-medium mb-2">Local storage</h3>
            <p className="mb-4">
              Your Pro status is stored locally in your browser&apos;s localStorage. This data never leaves your device
              and is used only to determine whether to show a watermark on generated images.
            </p>
            <h3 className="text-white/80 font-medium mb-2">Analytics</h3>
            <p>
              We use PureAnalytics for anonymous, privacy-friendly website analytics. PureAnalytics does not use
              cookies, does not collect personal information, and does not track individual users. It only provides
              aggregate data such as page views and visitor counts.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Cookies</h2>
            <p>
              We do not use tracking cookies, advertising cookies, or any third-party cookies. The only cookie used
              is a session cookie set by NextAuth to maintain your authentication state. This cookie is strictly
              necessary for the service to function and is deleted when your session ends.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1.5">
              <li>To authenticate you via Google sign-in</li>
              <li>To verify your Pro purchase status through Stripe</li>
              <li>To display your profile information (name, avatar) in the navigation bar</li>
              <li>To provide and improve the AppFrame service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Third-Party Services</h2>
            <ul className="list-disc list-inside space-y-1.5">
              <li><span className="text-white/80">Google OAuth</span> — for authentication (<a href="https://policies.google.com/privacy" className="underline hover:text-white/80 transition-colors" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>)</li>
              <li><span className="text-white/80">Stripe</span> — for payment processing (<a href="https://stripe.com/privacy" className="underline hover:text-white/80 transition-colors" target="_blank" rel="noopener noreferrer">Stripe Privacy Policy</a>)</li>
              <li><span className="text-white/80">PureAnalytics</span> — for anonymous analytics (no personal data collected)</li>
              <li><span className="text-white/80">Apple iTunes API</span> — app data and images are fetched from Apple&apos;s public API and proxied through our server</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Image Proxying</h2>
            <p>
              App icons and screenshots displayed on AppFrame are fetched from Apple&apos;s CDN (mzstatic.com) and
              proxied through our server. This is done to enable proper rendering of showcase images. We do not
              store or cache these images permanently.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Data Retention</h2>
            <p>
              We do not maintain a user database. Your session data exists only while you are logged in. Stripe
              retains payment records according to their own retention policies. Generated showcase images are
              created client-side and are never uploaded to our servers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Your Rights</h2>
            <p>
              You can sign out at any time to end your session. You can clear your browser&apos;s localStorage to
              remove any locally stored data. Since we do not maintain a user database, there is no account
              to delete. For Stripe payment records, contact Stripe directly or reach out to us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Children&apos;s Privacy</h2>
            <p>
              AppFrame is not directed at children under 13. We do not knowingly collect personal information
              from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an
              updated effective date. Continued use of the service after changes constitutes acceptance of the
              updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">11. Contact</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:simone.ruggiero97@gmail.com" className="text-white/80 underline hover:text-white transition-colors">
                simone.ruggiero97@gmail.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
