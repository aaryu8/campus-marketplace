"use client";

import axios from "axios";
import { Bookmark, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import s from "./product.module.css";

// ─── Message + Save + Share buttons ──────────────────────────────────────────

interface ButtonsComponentProps {
  buyerId: string;
  sellerId: string;
  productId: string;
}

export const ButtonsComponent = ({
  buyerId,
  sellerId,
  productId,
}: ButtonsComponentProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isSameUser = buyerId === sellerId;

  const onMessageClick = async () => {
    if (isSameUser) return;
    try {
      setLoading(true);
      const res = await axios({
        method: "post",
        url: "http://localhost:4000/api/chat/createId",
        withCredentials: true,
        data: { buyerId, sellerId, productId },
      });

      if (!res.data.status) {
        alert("Could not start chat.");
        return;
      }

      router.push(`/chat/${res.data.data}`);
    } catch {
      alert("Could not start chat.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.actionsRow}>
      {/* Primary: Message */}
      {!isSameUser && (
        <button
          type="button"
          onClick={onMessageClick}
          disabled={loading}
          className={s.btnPrimary}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          {loading ? "Opening chat…" : "Message Seller"}
        </button>
      )}

      {isSameUser && (
        <div className={s.authNotice} style={{ textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#6d28d9", fontWeight: 500 }}>
            This is your listing.
          </p>
        </div>
      )}

      {/* Secondary row: Save + Share */}
      <div className={s.btnSecondaryRow}>
        <button type="button" className={s.btnSecondary}>
          <Bookmark size={15} />
          Save
        </button>
        <button type="button" className={s.btnSecondary}>
          <Share2 size={15} />
          Share
        </button>
      </div>
    </div>
  );
};

// ─── Description with expand/collapse ────────────────────────────────────────

export const DescriptionComponent = ({
  description,
}: {
  description: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const WORD_LIMIT = 30;

  const words = description.trim().split(/\s+/);
  const isLong = words.length > WORD_LIMIT;
  const preview = isLong
    ? words.slice(0, WORD_LIMIT).join(" ") + "…"
    : description;

  return (
    <div>
      <p className={s.sectionLabel}>Seller's Description</p>
      <p className={s.descriptionText}>{expanded ? description : preview}</p>
      {isLong && (
        <button
          className={s.seeMoreBtn}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "See less ↑" : "See more ↓"}
        </button>
      )}
    </div>
  );
};

// ─── Maps placeholder ─────────────────────────────────────────────────────────

export const MapsandChatbot = () => {
  return (
    <div className={s.mapsPlaceholder}>
      <span className={s.mapsIcon}>📍</span>
      <span>Google Maps · Coming soon</span>
    </div>
  );
};