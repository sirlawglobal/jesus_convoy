import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthFromRequest } from "@/lib/auth";
import { ContactSchema } from "@/lib/validations";
import ContactMessage from "@/models/ContactMessage";

export async function GET(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth || auth.role !== "admin")
    return Response.json({ error: "Forbidden" }, { status: 403 });

  await connectDB();
  const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
  return Response.json({ messages });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success)
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });

  await connectDB();
  const message = await ContactMessage.create(parsed.data);
  return Response.json({ message: "Message sent", id: message._id }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth || auth.role !== "admin")
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { id, read } = body;
  await connectDB();
  await ContactMessage.findByIdAndUpdate(id, { read });
  return Response.json({ message: "Updated" });
}
