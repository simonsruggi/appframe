import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ pro: false });
    }

    const email = session.user.email;
    const sessions = await stripe.checkout.sessions.list({ limit: 100 });
    const paid = sessions.data.find(
      (s) =>
        s.payment_status === "paid" &&
        s.customer_details?.email?.toLowerCase() === email.toLowerCase()
    );

    return NextResponse.json({ pro: !!paid });
  } catch {
    return NextResponse.json({ pro: false });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (sessionId) {
      const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
      if (checkoutSession.payment_status === "paid") {
        return NextResponse.json({
          pro: true,
          email: checkoutSession.customer_details?.email,
        });
      }
    }

    return NextResponse.json({ pro: false });
  } catch {
    return NextResponse.json({ pro: false });
  }
}
