import Homepage from "@/components/global/Homepage";
import axios from "axios";
import { cookies } from "next/headers";

export default async function Home() {
  let user = null;

  try {
    const cookieStore = await cookies();
    const all = cookieStore.getAll();
console.log("NEXT COOKIES:", all)
   // page.tsx
const cookieHeader = cookieStore.getAll()
  .map(c => `${c.name}=${c.value}`)
  .join("; ");

const response = await axios.get("http://localhost:4000/api/auth/me", {
  headers: {
    Cookie: cookieHeader  // ← proper format: "session_id=abc123; other=xyz"
  },
  validateStatus: (status) => status < 500
});

    if (response.status === 200) {
      user = response.data.user;
    }
  } catch (error) {
    // Silent fail for guest view
  }

  return (
    <Homepage
      userName={user?.name ?? null}
      userEmail={user?.email ?? null}
    />
  );
}