import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios from "axios";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session_id");

  if (!session) {
    redirect("/sign-in");
  }

  try {
    // We verify the session on the server before showing ANYTHING
    await axios.get("http://localhost:4000/api/auth/me", {
      headers: { Cookie: `session_id=${session.value}` },
    });
  } catch (error) {
    // If the backend says the cookie is fake or expired
    redirect("/sign-in");
  }

  return <>{children}</>;
}