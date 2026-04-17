import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  return Response.json(
    { message: "Logged out" },
    {
      status: 200,
      headers: { "Set-Cookie": clearAuthCookie() },
    }
  );
}
