import { connectDB } from "@/lib/db";
import { comparePassword, makeAuthCookie, signToken } from "@/lib/auth";
import { LoginSchema } from "@/lib/validations";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectDB();
    const { email, password } = parsed.data;

    const user = await User.findOne({ email }).lean();
    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    return Response.json(
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      },
      {
        status: 200,
        headers: { "Set-Cookie": makeAuthCookie(token) },
      }
    );
  } catch (err) {
    console.error("[AUTH/LOGIN]", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
