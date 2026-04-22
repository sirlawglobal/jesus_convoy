import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthFromRequest } from "@/lib/auth";
import { DonationSchema } from "@/lib/validations";
import Donation from "@/models/Donation";

export async function GET(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth || auth.role !== "admin")
    return Response.json({ error: "Forbidden" }, { status: 403 });

  await connectDB();
  const donations = await Donation.find({ status: "success" }).sort({ createdAt: -1 }).lean();
  
  // Calculate totals per currency
  const totals = donations.reduce((acc: Record<string, number>, d) => {
    acc[d.currency] = (acc[d.currency] || 0) + d.amount;
    return acc;
  }, {});

  return Response.json({ donations, totals });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = DonationSchema.safeParse(body);
  if (!parsed.success)
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });

  await connectDB();
  const donation = await Donation.create({ ...parsed.data, status: "pending" });
  return Response.json({ donation }, { status: 201 });
}
