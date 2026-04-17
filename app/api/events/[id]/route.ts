import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthFromRequest } from "@/lib/auth";
import { EventSchema } from "@/lib/validations";
import Event from "@/models/Event";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const event = await Event.findById(id).lean();
  if (!event) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ event });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthFromRequest(req);
  if (!auth || auth.role !== "admin")
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const parsed = EventSchema.partial().safeParse(body);
  if (!parsed.success)
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });

  await connectDB();
  const updated = await Event.findByIdAndUpdate(id, parsed.data, { new: true }).lean();
  if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ event: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthFromRequest(req);
  if (!auth || auth.role !== "admin")
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await connectDB();
  await Event.findByIdAndDelete(id);
  return Response.json({ message: "Event deleted" });
}

// Event registration
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { name, email, phone } = body;

  if (!name || !email) return Response.json({ error: "Name and email required" }, { status: 400 });

  await connectDB();
  const event = await Event.findById(id);
  if (!event) return Response.json({ error: "Not found" }, { status: 404 });
  if (!event.registrationOpen)
    return Response.json({ error: "Registration is closed" }, { status: 400 });

  event.registrations.push({ name, email, phone, registeredAt: new Date() });
  await event.save();
  return Response.json({ message: "Registration successful" });
}
