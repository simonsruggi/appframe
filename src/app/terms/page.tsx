import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "AppFrame terms of service. Read the terms that govern your use of the service.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto px-4 pt-24 pb-20">
        <div className="mb-10">
          <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">&larr; Back to home</Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-400 text-sm mb-12">Effective date: March 17, 2026</p>

        <div className="space-y-10 text-gray-600 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using AppFrame at <span className="text-gray-800">appfra.me</span> (&quot;the Service&quot;),
              you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Description of Service</h2>
            <p>
              AppFrame is a web application that generates showcase images for iOS apps using publicly available
              data from Apple&apos;s iTunes Search API. Users can search for apps, customize the appearance of
              showcase cards, and download the generated images as PNG files.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Accounts</h2>
            <p>
              To use AppFrame, you must sign in with a Google account. You are responsible for maintaining the
              security of your Google account. You must not share your account access or use the Service for
              any unlawful purpose.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Free and Pro Tiers</h2>
            <p className="mb-3">
              AppFrame offers two tiers:
            </p>
            <ul className="list-disc list-inside space-y-1.5 mb-3">
              <li><span className="text-gray-800">Free</span> — Unlimited showcase image creation. Downloads include a small &quot;@AppFrame&quot; watermark.</li>
              <li><span className="text-gray-800">Pro ($5 one-time)</span> — Removes the watermark from all downloads. This is a one-time payment with lifetime access.</li>
            </ul>
            <p>
              Features and pricing may change in the future. Existing Pro users will retain their access regardless
              of future pricing changes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Payments and Refunds</h2>
            <p className="mb-3">
              All payments are processed securely through Stripe. We do not store your payment information.
            </p>
            <p>
              If you are not satisfied with your Pro purchase, you may request a full refund within 7 days of
              payment by contacting us at{" "}
              <a href="mailto:simone.ruggiero97@gmail.com" className="text-gray-800 underline hover:text-gray-900 transition-colors">
                simone.ruggiero97@gmail.com
              </a>. After 7 days, refunds are not available.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Intellectual Property</h2>
            <h3 className="text-gray-800 font-medium mb-2">Generated images</h3>
            <p className="mb-4">
              You own the showcase images you generate using AppFrame. You are free to use, share, and publish
              them for any purpose, including commercial use.
            </p>
            <h3 className="text-gray-800 font-medium mb-2">App data and icons</h3>
            <p className="mb-4">
              App names, icons, screenshots, and other metadata displayed in AppFrame are sourced from Apple&apos;s
              publicly available iTunes Search API. This content is the property of the respective app developers
              and Apple Inc. AppFrame does not claim ownership of this content.
            </p>
            <h3 className="text-gray-800 font-medium mb-2">AppFrame branding</h3>
            <p>
              The AppFrame name, logo, and website design are the property of AppFrame. You may not use our
              branding in a way that implies endorsement or affiliation without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Acceptable Use</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc list-inside space-y-1.5">
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Attempt to reverse-engineer, decompile, or disassemble the Service</li>
              <li>Interfere with or disrupt the Service or its servers</li>
              <li>Scrape, crawl, or use automated tools to access the Service in bulk</li>
              <li>Impersonate another person or entity</li>
              <li>Use generated images to mislead or deceive others about app ownership</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to the Service at any time, with or without
              cause, and with or without notice. Upon termination, your right to use the Service will immediately
              cease. If you have purchased Pro and your account is terminated without cause, you may request a
              refund.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Disclaimer of Warranties</h2>
            <p>
              The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, express or
              implied. We do not guarantee that the Service will be uninterrupted, error-free, or secure. We do
              not warrant the accuracy or completeness of app data sourced from Apple&apos;s API.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, AppFrame and its owner shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages arising from your use of the Service. Our
              total liability shall not exceed the amount you paid for the Service (i.e., $5 for Pro, or $0 for
              Free users).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">11. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. Changes will be posted on this page with an updated effective
              date. Continued use of the Service after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">12. Governing Law</h2>
            <p>
              These Terms are governed by the laws of Italy. Any disputes shall be resolved in the courts of Italy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">13. Contact</h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <a href="mailto:simone.ruggiero97@gmail.com" className="text-gray-800 underline hover:text-gray-900 transition-colors">
                simone.ruggiero97@gmail.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
