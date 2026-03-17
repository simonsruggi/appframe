import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const email = session.user.email;

    // Check if already paid
    try {
      const sessions = await stripe.checkout.sessions.list({ limit: 100 });
      const alreadyPaid = sessions.data.some(
        (s) => s.payment_status === "paid" && s.customer_details?.email?.toLowerCase() === email.toLowerCase()
      );
      if (alreadyPaid) {
        return NextResponse.json({ alreadyPro: true });
      }
    } catch {
      // Continue to checkout if check fails
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: email,
      allow_promotion_codes: true,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "AppFrame Pro",
              description: "One-time payment — no watermark, high-res exports forever",
            },
            unit_amount: 500,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.nextUrl.origin}/pro/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
