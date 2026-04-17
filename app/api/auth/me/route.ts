import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthFromRequest } from "@/lib/auth";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const user = await User.findById(auth.userId)
      .select("-password")
      .populate("ministry", "name")
      .lean();

    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    return Response.json({ user });
  } catch (err) {
    console.error("[AUTH/ME]", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
