import axios from "axios";
import { cookies } from "next/headers";
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

  let conversations: InboxConversation[] = [];
  try {
    const res = await axios({
      method: "GET",
      url: "http://localhost:4000/api/chat/inbox",
      headers: { Cookie: `session_id=${sessionCookie?.value}` },
    });
    conversations = res.data.data;
  } catch (error) {
    console.error(error);
  }

  return <InboxClient initialConversations={conversations} />;
};

export default InboxPage;