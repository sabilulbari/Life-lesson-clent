import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import PaymentSuccess from "@/components/PaymentSuccess";

export default async function SuccessPage({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  console.log(session, session_id, " session from succcess page");

  const { status, customer_details, amount_total, currency, payment_intent } = session;

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    const formattedAmount = (amount_total / 100).toLocaleString("en-BD", {
      style: "currency",
      currency: currency?.toUpperCase() || "BDT",
    });

    const txnId = typeof payment_intent === "object" ? payment_intent?.id : payment_intent || session.id;

    console.log(payment_intent.id, "txnId from success page");

    const customerEmail = customer_details?.email || "";

    return <PaymentSuccess transactionId={txnId} amount={formattedAmount} planName="Life Lessons Premium" customerEmail={customerEmail} />;
  }

  return null;
}
