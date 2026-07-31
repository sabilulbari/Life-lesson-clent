import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import PaymentSuccess from "@/components/PaymentSuccess";
import { submitPricingData } from "@/lib/action/pricing";

export default async function SuccessPage({ searchParams }) {
  const { session_id } = await searchParams;

  // Check session ID
  if (!session_id) {
    throw new Error("Please provide a valid session_id");
  }

  // Retrieve Stripe checkout session
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  const { status, customer_details, amount_total, currency, payment_intent, metadata } = session;

  // If payment is still open
  if (status === "open") {
    redirect("/");
  }

  // Payment completed successfully
  if (status === "complete") {
    // Format payment amount
    const formattedAmount = (amount_total / 100).toLocaleString("en-BD", {
      style: "currency",
      currency: currency?.toUpperCase() || "BDT",
    });

    // Get transaction ID safely
    const txnId = typeof payment_intent === "object" && payment_intent !== null ? payment_intent.id : payment_intent || session.id;

    console.log(txnId, "txnId from success page");

    // Get customer email
    const customerEmail = customer_details?.email || "";

    // Get plan information
    const subsInfo = {
      email: customerEmail,
      planId: metadata?.planId || "",
    };

    // Update subscription data
    try {
      const updateSubscriptionResponse = await submitPricingData(subsInfo);

      console.log(updateSubscriptionResponse, "subscription update response");
    } catch (error) {
      console.error("Failed to update subscription:", error);
    }

    // Show success page
    return <PaymentSuccess transactionId={txnId} amount={formattedAmount} planName="Life Lessons Premium" customerEmail={customerEmail} />;
  }

  // Unknown payment status
  return null;
}
