import { NextRequest } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Donation from "@/models/Donation";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");
    const secret = process.env.PAYSTACK_SECRET_KEY;

    if (!secret || !signature) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");

    if (hash !== signature) {
      return Response.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === "charge.success") {
      const { reference, status } = event.data;

      if (status === "success") {
        await connectDB();
        await Donation.findOneAndUpdate({ reference }, { status: "success" });
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return Response.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
