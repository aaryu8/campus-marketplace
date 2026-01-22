'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

interface ChatMessage {
    id: string;
    conversationId: string;
    senderId: string;
    text: string;
    createdAt: Date;
    sender: {
        id: string;
        name: string;
    };
}

type Props = {
    params : {
        chatId : string
    }
}

export default function ChatPage({params} : Props) {
    const {chatId} = params;
    const router = useRouter();

    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [text, setText] = useState('');
    const [currentUserId, setCurrentUserId] = useState('');
    const [currentUserName, setCurrentUserName] = useState('');
    const [otherUserName, setOtherUserName] = useState('');
    const [productTitle, setProductTitle] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(true);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    let chatInfo;

    // Get current user and conversation info
    useEffect(() => {
        if (!chatId) return; // ✅ INDUSTRY GUARD
        
        const fetchData = async () => {
        try {
            console.log("HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII")

            const userRes = await axios.get('http://localhost:4000/api/auth/me', {
                withCredentials: true
            });

            const userId = userRes.data.user.id;
            const userName = userRes.data.user.name;

            setCurrentUserId(userId);
            setCurrentUserName(userName);

            console.log(`LALALLALALALALALALLALALALALALALLA`);
            console.log(userRes.data);

            const convRes = await axios.get(
                `http://localhost:4000/api/chat/conversation/${chatId}`,
                { withCredentials: true }
            );

            chatInfo = convRes.data.conversation;

            {chatInfo.buyerId === userId ? setOtherUserName(chatInfo.seller.name) : setOtherUserName(chatInfo.buyer.name) }

            setLoading(false);

            } catch (error) {
                console.error('Error fetching data:', error);
                router.push('/signin');
            }
            };

            fetchData();
    }, [chatId, router]);


    // Connect to WebSocket
    useEffect(() => {
        if (!currentUserId) return;

        const newSocket = io('http://localhost:4000');
        setSocket(newSocket);
        // on connect hi baake events emit honge
        newSocket.on('connect', () => {
            console.log('Connected to chat server');
            newSocket.emit('joinChat', { chatId, userId: currentUserId });
                
            newSocket.on('chatHistory', (history: ChatMessage[]) => {
                setMessages(history);
                scrollToBottom();
            });

            newSocket.on('newMessage', (message: ChatMessage) => {
                setMessages((prev) => [...prev, message]);
                scrollToBottom();
            });

            newSocket.on('userTyping', () => {
                setIsTyping(true);
            });

            newSocket.on('userStoppedTyping', () => {
                setIsTyping(false);
            });

            newSocket.on('error', (error: { message: string }) => {
                console.error('Socket error:', error);
                alert(error.message);
            });
        });

        return () => {
            newSocket.off('joinChat');
            newSocket.off('chatHistory');
            newSocket.off('newMessage');
            newSocket.off('userTyping');
            newSocket.off('userStoppedTyping');
            newSocket.off('error');
            newSocket.disconnect();
        };
    }, [chatId, currentUserId]);







    // Handle typing indicator
   useEffect(() => {
    if (!socket) return;

    if (text) {
        // User is typing, emit typing
        socket.emit('typing', {
            chatId,
            userId: currentUserId,
            userName: currentUserName
        });

        // Clear old timer if exists
        if (timerRef.current) clearTimeout(timerRef.current);

        // Set a new timer to stop typing after 1s of inactivity
        timerRef.current = setTimeout(() => {
            socket.emit('stopTyping', {
                chatId,
                userId: currentUserId,
                userName: currentUserName
            });
        }, 1000);
    } else {
        // text is empty, user stopped typing immediately
        socket.emit('stopTyping', {
            chatId,
            userId: currentUserId,
            userName: currentUserName
        });

        // Clear timer just in case
        if (timerRef.current) clearTimeout(timerRef.current);
    }

    // Cleanup when component unmounts
    return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };
}, [text, socket, chatId, currentUserId, currentUserName]);



    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };



    const sendMessage = () => {
        if (!text.trim() || !socket) return;

        socket.emit('sendMessage', {
            chatId,
            senderId: currentUserId,
            text: text.trim()
        });

        setText('');
    };



    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };




    function formatTime(date: Date) {
        const d = new Date(date);
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        return `${hh}:${mm}`;
    }





    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-100">
                <div className="text-gray-600">Loading chat...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-100 p-4">
            <div className="w-full max-w-2xl h-[90vh] bg-white rounded-xl shadow-md flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
                    <button
                        onClick={() => router.back()}
                        className="text-gray-600 hover:text-gray-900 font-medium"
                    >
                        ← Back
                    </button>
                    <div className="h-10 w-10 rounded-full bg-[#075E54] flex items-center justify-center text-white font-semibold">
                        {otherUserName[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <div className="text-sm font-medium text-[#303030]">
                            {otherUserName}
                        </div>
                        <div className="text-xs text-gray-500">
                            {isTyping ? 'typing...' : productTitle}
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-100">
                    {messages.length === 0 ? (
                        <div className="text-center text-gray-500 mt-8">
                            No messages yet. Start the conversation!
                        </div>
                    ) : (
                        messages.map((m) => {
                            const isMine = m.senderId === currentUserId;
                            return (
                                <div
                                    key={m.id}
                                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[78%] p-3 my-2 rounded-[18px] text-sm leading-5 shadow-sm ${
                                            isMine
                                                ? 'bg-[#DCF8C6] text-[#303030] rounded-br-2xl'
                                                : 'bg-white text-[#303030] rounded-bl-2xl'
                                        }`}
                                    >
                                        <div className="break-words whitespace-pre-wrap">
                                            {m.text}
                                        </div>
                                        <div className="flex justify-between items-center mt-1 gap-16">
                                            <div className="text-[11px] font-bold">
                                                {m.sender.name}
                                            </div>
                                            <div className="text-[11px] text-gray-500 text-right">
                                                {formatTime(m.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="px-4 py-3 border-t border-gray-200 bg-white">
                    <div className="flex items-center justify-between gap-4 border border-gray-200 rounded-full">
                        <textarea
                            rows={1}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            className="w-full resize-none px-4 py-4 text-sm outline-none"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!text.trim()}
                            className="bg-green-500 text-white px-4 py-2 mr-2 rounded-full text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}