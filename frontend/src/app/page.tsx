import Homepage from "@/components/global/Homepage";
import axios from "axios";

export default async function Home() {
  let user = null;

  try {
    const response = await axios.get("http://localhost:4000/me", {
      withCredentials: true,
    });
    user = response.data.user; 
  } catch (error) {
    console.error("Failed to fetch user:", error);
    // user stays null if API fails or 401
  }

  return (
    <Homepage
      userName={user?.name ?? null}  // null if not logged in
      userEmail={user?.email ?? null} // null if not logged in
    />
  );
}
