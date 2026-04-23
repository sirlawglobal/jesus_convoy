import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Donation from "@/models/Donation";

// Paystack webhook/verify endpoint
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { reference } = body;

  if (!reference) return Response.json({ error: "Reference required" }, { status: 400 });

  // Verify with Paystack
  const paystackRes = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  const data = await paystackRes.json();

  if (!data.status || data.data.status !== "success") {
    await connectDB();
    await Donation.findOneAndUpdate({ reference }, { status: "failed" });
    return Response.json({ error: "Payment verification failed" }, { status: 400 });
  }

  await connectDB();
  const existing = await Donation.findOne({ reference });
  
  if (existing && existing.status === "success") {
    // Already verified via webhook
    return Response.json({ message: "Payment already verified", data: data.data });
  }

  await Donation.findOneAndUpdate({ reference }, { status: "success" });

  return Response.json({ message: "Payment verified", data: data.data });
}
