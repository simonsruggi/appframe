import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "AppFrame pricing plans. Generate stunning showcase images for your iOS apps for free, or go Pro for clean exports without watermarks.",
  alternates: {
    canonical: "/pricing",
  },
};

const faqs = [
  {
    q: "What do I get for free?",
    a: "You can create unlimited showcase images for any iOS app. Free downloads include a small appfra.me watermark in the corner.",
  },
  {
    q: "What does Pro unlock?",
    a: "Pro removes the watermark from all downloads and gives you high-resolution PNG exports, perfect for social media and press kits.",
  },
  {
    q: "Is it a subscription?",
    a: "No. Pro is a one-time payment of $5. You pay once and it works forever, no recurring charges.",
  },
  {
    q: "How do I pay?",
    a: "Payments are handled securely through Stripe. You can pay with any credit or debit card.",
  },
  {
    q: "Can I get a refund?",
    a: "If you are not satisfied, contact us within 7 days and we will issue a full refund, no questions asked.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#080808] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#080808]" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-white/[0.015] rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-white/[0.01] rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-24 pb-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Simple pricing
          </h1>
          <p className="text-white/40 text-lg max-w-md mx-auto">
            Create beautiful app showcases for free. Go Pro when you need clean exports.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-24">
          {/* Free */}
          <div className="rounded-3xl bg-white/[0.03] border border-white/[0.06] p-8">
            <p className="text-white/50 text-sm font-medium uppercase tracking-wider mb-4">Free</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-white">$0</span>
            </div>
            <p className="text-white/30 text-sm mb-8">Free forever</p>
            <ul className="space-y-3 mb-8">
              {[
                { text: "Unlimited showcase images", included: true },
                { text: "5 themes", included: true },
                { text: "Basic PNG export", included: true },
                { text: "Watermark on downloads", included: true },
                { text: "20+ premium themes", included: false },
                { text: "No watermark", included: false },
                { text: "High-resolution export (3x)", included: false },
              ].map((item, i) => (
                <li key={i} className={`flex items-start gap-3 text-sm ${item.included ? "text-white/60" : "text-white/25"}`}>
                  {item.included ? (
                    <svg className="w-4 h-4 text-white/30 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white/20 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  )}
                  {item.text}
                </li>
              ))}
            </ul>
            <Link
              href="/"
              className="block w-full text-center py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-semibold text-sm hover:bg-white/[0.08] transition-all"
            >
              Get started
            </Link>
          </div>

          {/* Pro */}
          <div className="rounded-3xl bg-white/[0.05] border border-white/[0.12] p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white text-black text-xs font-semibold">
              Recommended
            </div>
            <p className="text-white/70 text-sm font-medium uppercase tracking-wider mb-4">Pro</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-white">$5</span>
            </div>
            <p className="text-white/30 text-sm mb-8">One-time payment</p>
            <ul className="space-y-3 mb-8">
              {[
                "Everything in Free",
                "20+ premium themes",
                "No watermark on downloads",
                "High-resolution PNG export (3x)",
                "All fonts included",
                "Lifetime access",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                  <svg className="w-4 h-4 text-white mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/"
              className="block w-full text-center py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all"
            >
              Search an app to get started
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-white/[0.06] pb-6">
                <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
