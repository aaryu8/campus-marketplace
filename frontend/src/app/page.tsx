import Homepage from "@/components/global/Homepage";
import axios from "axios";
import { cookies } from "next/headers";

export default async function Home() {
  let user = null;

  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();
    
    // Using validateStatus to handle 401/403 gracefully without the catch block overhead
    const response = await axios.get("http://localhost:4000/api/auth/me", {
      withCredentials: true,
      headers: {
        Cookie: cookieString
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