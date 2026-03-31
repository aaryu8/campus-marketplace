'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import { type InboxConversation } from '../page';
import ChatPanel from './ChatPanel';
import s from '../inbox.module.css';
import { useSearchParams } from 'next/navigation';

const PALETTES = [
  { bg: '#f3e8ff', text: '#6d28d9' },
  { bg: '#fef3c7', text: '#b45309' },
  { bg: '#dcfce7', text: '#15803d' },
  { bg: '#dbeafe', text: '#1d4ed8' },
  { bg: '#ffe4e6', text: '#be123c' },
  { bg: '#e0f2fe', text: '#0369a1' },
  { bg: '#fce7f3', text: '#9d174d' },
  { bg: '#d1fae5', text: '#065f46' },
];

function getPalette(name: string) {
  return PALETTES[name.charCodeAt(0) % PALETTES.length];
}

function compactTime(dateStr: string) {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: false })
    .replace('about ', '')
    .replace('less than a minute', 'now')
    .replace(' hours', 'h').replace(' hour', 'h')
    .replace(' minutes', 'm').replace(' minute', 'm')
    .replace(' days', 'd').replace(' day', 'd')
    .replace(' months', 'mo').replace(' month', 'mo')
    .replace(' years', 'y').replace(' year', 'y');
}

interface Props {
  initialConversations: InboxConversation[];
}

export default function InboxClient({ initialConversations }: Props) {
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(
    searchParams.get('chatId')
  );
  const [currentUserId, setCurrentUserId] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  // ← NEW: track if we're showing chat panel on mobile
  const [mobileShowChat, setMobileShowChat] = useState(!!searchParams.get('chatId'));

  useEffect(() => {
    axios.get('https://campus-marketplace-production-c93f.up.railway.app/api/auth/me', { withCredentials: true })
      .then(res => {
        setCurrentUserId(res.data.user.id);
        setCurrentUserName(res.data.user.name);
      })
      .catch(() => {});
  }, []);

  const selectedChat = conversations.find(c => c.chatId === selectedChatId);

  // ← NEW: selecting a chat on mobile also flips to chat view
  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setMobileShowChat(true);
  };

  const handleDelete = async (chatId: string) => {
    setDeleting(true);
    try {
      await axios.delete(`https://campus-marketplace-production-c93f.up.railway.app/api/chat/conversation/${chatId}`, {
        withCredentials: true,
      });
      setConversations(prev => prev.filter(c => c.chatId !== chatId));
      if (selectedChatId === chatId) {
        setSelectedChatId(null);
        setMobileShowChat(false);
      }
    } catch {
      alert('Could not delete conversation. Please try again.');
    } finally {
      setDeleting(false);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className={s.shell}>

      {/* ── LEFT (thread list) ── hidden on mobile when chat is open */}
      <aside className={`${s.left} ${mobileShowChat ? s.leftHidden : ''}`}>
        <div className={s.leftHeader}>
          <Link href="/dashboard" className={s.backLink}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Dashboard
          </Link>
          <div className={s.pageTitle}>Inbox</div>
          {conversations.length > 0 && (
            <div className={s.convCount}>
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        <div className={s.threadScroll}>
          {conversations.length === 0 ? (
            <div className={s.emptyThreads}>
              <div className={s.emptyThreadIcon}>🗂️</div>
              <p className={s.emptyThreadTitle}>Nothing here yet</p>
              <p className={s.emptyThreadSub}>
                Your conversations with buyers and sellers will appear here.
              </p>
              <Link href="/marketplace" className={s.emptyThreadLink}>Browse listings</Link>
            </div>
          ) : (
            conversations.map((chat, i) => {
              const last = chat.messages[0];
              const pal = getPalette(chat.otherUser.name);
              const isSelected = chat.chatId === selectedChatId;
              const isPendingDelete = deleteConfirm === chat.chatId;

              return (
                <div key={chat.chatId}>
                  {isPendingDelete ? (
                    <div className={s.deleteConfirmRow}>
                      <p className={s.deleteConfirmText}>Delete this conversation?</p>
                      <div className={s.deleteConfirmBtns}>
                        <button className={s.deleteCancelBtn}
                          onClick={() => setDeleteConfirm(null)} disabled={deleting}>
                          Cancel
                        </button>
                        <button className={s.deleteConfirmBtn}
                          onClick={() => handleDelete(chat.chatId)} disabled={deleting}>
                          {deleting ? 'Deleting…' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`${s.threadRow} ${isSelected ? s.threadRowActive : ''}`}
                      style={{ animationDelay: `${i * 45}ms` }}
                      onClick={() => handleSelectChat(chat.chatId)}
                    >
                      <div className={s.avatar} style={{ background: pal.bg, color: pal.text }}>
                        {chat.otherUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div className={s.threadBody}>
                        <div className={s.threadTop}>
                          <span className={s.threadName}>{chat.otherUser.name}</span>
                          {last && <span className={s.threadTime}>{compactTime(last.createdAt)}</span>}
                        </div>
                        <div className={s.productChip}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                            <line x1="7" y1="7" x2="7.01" y2="7" />
                          </svg>
                          {chat.product.title}
                        </div>
                        <div className={s.threadPreview}>
                          {last ? <><b>{last.sender.name}:</b> {last.text}</> : <em>No messages yet</em>}
                        </div>
                      </div>
                      <button className={s.deleteBtn} title="Delete conversation"
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirm(chat.chatId); }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                        </svg>
                      </button>
                      {isSelected && <div className={s.activeIndicator} />}
                    </div>
                  )}
                  {i < conversations.length - 1 && <div className={s.threadSep} />}
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* ── RIGHT (chat panel) ── hidden on mobile when list is showing */}
      <div className={`${s.right} ${!mobileShowChat ? s.rightHidden : ''}`}>
        {/* ← NEW: back button on mobile */}
        {mobileShowChat && (
          <button
            className={s.mobileBackBtn}
            onClick={() => { setMobileShowChat(false); setSelectedChatId(null); }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            All chats
          </button>
        )}

        {selectedChat && currentUserId ? (
          <ChatPanel
            key={selectedChatId!}
            chatId={selectedChatId!}
            otherUserName={selectedChat.otherUser.name}
            productTitle={selectedChat.product.title}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
          />
        ) : conversations.length === 0 ? (
          <EmptyRight />
        ) : (
          <PlaceholderRight />
        )}
      </div>
    </div>
  );
}

function PlaceholderRight() {
  return (
    <div className={s.rightPlaceholder}>
      <div className={s.rightCard}>
        <div className={s.rightCardIcon}>💬</div>
        <h2 className={s.rightCardTitle}>Your campus<br />conversations</h2>
        <p className={s.rightCardSub}>Select a chat on the left to pick up where you left off.</p>
        <div className={s.rightCardDivider} />
        <div className={s.rightCardTip}>
          <span className={s.tipDot} />
          <span>Each chat is tied to a specific listing — so you always know what's being discussed.</span>
        </div>
        <div className={s.rightCardTip}>
          <span className={s.tipDot} />
          <span>Agreed on a price? Mark the item sold from your dashboard.</span>
        </div>
      </div>
    </div>
  );
}

function EmptyRight() {
  return (
    <div className={s.rightPlaceholder}>
      <div className={s.rightCard}>
        <div className={s.rightCardIcon}>📭</div>
        <h2 className={s.rightCardTitle}>No messages yet</h2>
        <p className={s.rightCardSub}>
          When someone reaches out about your listing — or you message a seller — it shows up here.
        </p>
        <div className={s.rightCardDivider} />
        <div className={s.rightCardTip}>
          <span className={s.tipDot} />
          <span>List an item and buyers can message you directly from the listing page.</span>
        </div>
      </div>
    </div>
  );
}