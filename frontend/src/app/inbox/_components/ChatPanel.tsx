'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import s from '../inbox.module.css';

interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: Date;
  sender: { id: string; name: string };
}

interface Props {
  chatId: string;
  otherUserName: string;
  productTitle: string;
  currentUserId: string;
  currentUserName: string;
}

export default function ChatPanel({
  chatId,
  otherUserName,
  productTitle,
  currentUserId,
  currentUserName,
}: Props) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  // Socket connection
  useEffect(() => {
    if (!currentUserId || !chatId) return;

    const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('joinChat', { chatId, userId: currentUserId });

      newSocket.on('chatHistory', (history: ChatMessage[]) => {
        setMessages(history);
        scrollToBottom();
      });

      newSocket.on('newMessage', (message: ChatMessage) => {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      });

      newSocket.on('userTyping', () => setIsTyping(true));
      newSocket.on('userStoppedTyping', () => setIsTyping(false));
      newSocket.on('error', (err: { message: string }) => alert(err.message));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [chatId, currentUserId]);

  // Reset messages when chat changes
  useEffect(() => {
    setMessages([]);
    setText('');
    setIsTyping(false);
  }, [chatId]);

  // Typing indicator
  useEffect(() => {
    if (!socket) return;
    if (text) {
      socket.emit('typing', { chatId, userId: currentUserId, userName: currentUserName });
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        socket.emit('stopTyping', { chatId, userId: currentUserId, userName: currentUserName });
      }, 1000);
    } else {
      socket.emit('stopTyping', { chatId, userId: currentUserId, userName: currentUserName });
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [text, socket, chatId, currentUserId, currentUserName]);

  const sendMessage = () => {
    if (!text.trim() || !socket) return;
    socket.emit('sendMessage', { chatId, senderId: currentUserId, text: text.trim() });
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
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  const initials = otherUserName.charAt(0).toUpperCase();

  return (
    <div className={s.chatPanel}>
      {/* Chat Header */}
      <div className={s.chatHeader}>
        <div className={s.chatHeaderAvatar}>{initials}</div>
        <div className={s.chatHeaderInfo}>
          <div className={s.chatHeaderName}>{otherUserName}</div>
          <div className={s.chatHeaderSub}>
            {isTyping ? (
              <span className={s.typingIndicator}>
                <span />
                <span />
                <span />
                typing
              </span>
            ) : (
              <span className={s.productLabel}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                {productTitle}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className={s.messageScroll}>
        {messages.length === 0 ? (
          <div className={s.noMessages}>No messages yet — say hello 👋</div>
        ) : (
          messages.map((m) => {
            const isMine = m.senderId === currentUserId;
            return (
              <div key={m.id} className={`${s.messageRow} ${isMine ? s.mine : s.theirs}`}>
                <div className={`${s.bubble} ${isMine ? s.bubbleMine : s.bubbleTheirs}`}>
                  <div className={s.bubbleText}>{m.text}</div>
                  <div className={s.bubbleMeta}>
                    <span className={s.bubbleSender}>{m.sender.name}</span>
                    <span className={s.bubbleTime}>{formatTime(m.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={s.inputBar}>
        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className={s.inputField}
        />
        <button
          onClick={sendMessage}
          disabled={!text.trim()}
          className={s.sendBtn}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}