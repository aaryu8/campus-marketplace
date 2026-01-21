import axios from "axios";
import { cookies } from "next/headers";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";


type InboxConversation = {
  chatId: string;
  product: {
    id: string;
    title: string;
  };
  otherUser: {
    id: string;
    name: string;
  };
  messages: {
    text: string;
    createdAt: string;
    sender: {
      id: string;
      name: string;
    };
  }[];
};


const MessageHistory = async () => {
    
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session_id');

    let conversations: InboxConversation[] = [];
    try {
        const res = await axios({
            method : "GET",
            url : "http://localhost:4000/api/chat/inbox",
            headers : {
                Cookie : `session_id=${sessionCookie?.value}`
            }
        })

        conversations = res.data.data;
        
    } catch (error) {
        console.error(error);
    }

    

      // ✅ HARD GUARD (industry standard)
    if (!conversations.length) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
            No conversations found
            </div>
        );
    }



    return (
    <div className="min-h-screen bg-white">
      <main className="p-6 space-y-4">
        {conversations.map((chat) => {
  const lastMessage = chat.messages[0];
console.log(`here comes the chat id : ---> ${chat.chatId}`)
  return (
    <Link
      key={chat.chatId}
      href={`/chat/${chat.chatId}`}
      className="
        group flex items-center gap-4
        px-4 py-3
        rounded-xl
        hover:bg-gray-100
        transition
      "
    >
      {/* Avatar */}
      <div
        className="
          h-12 w-12
          rounded-full
          bg-gradient-to-br from-indigo-500 to-purple-500
          flex items-center justify-center
          text-white font-semibold
          shrink-0
        "
      >
        {chat.otherUser.name.charAt(0).toUpperCase()}
      </div>

      {/* Middle content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-900">
            {chat.otherUser.name}
          </span>

        {lastMessage && (
            <span className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(lastMessage.createdAt), {
                addSuffix: true,
                })}
            </span>
        )}

        </div>

        <p className="text-sm text-gray-500 truncate max-w-full">
        {lastMessage
            ? `${lastMessage.sender.name}: ${lastMessage.text}`
            : "No messages yet"}
        </p>

      </div>
    </Link>
  );
})}

      </main>
    </div>
    )
}

export default MessageHistory;


