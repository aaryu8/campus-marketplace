import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation"; // Import redirect
import InboxClient from "./_components/InboxClient";

export type InboxConversation = {
  chatId: string;
  product: { id: string; title: string };
  otherUser: { id: string; name: string };
  messages: {
    text: string;
    createdAt: string;
    sender: { name: string };
  }[];
};

const InboxPage = async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session_id");

  // 1. Immediate local check: If no cookie exists, don't even bother calling the API
  if (!sessionCookie) {
    redirect("/sign-in");
  }

  let conversations: InboxConversation[] = [];
  
  try {
    const res = await axios({
      method: "GET",
      url: "https://campus-marketplace-production-c93f.up.railway.app/api/chat/inbox",
      headers: { Cookie: `session_id=${sessionCookie.value}` },
    });
    
    conversations = res.data.data;
  } catch (error) {
    // 2. If the API returns 401/403 or fails, redirect to sign-in
    console.error("Auth failed or API error:", error);
    redirect("/sign-in");
  }

  return <InboxClient initialConversations={conversations} />;
};

export default InboxPage;