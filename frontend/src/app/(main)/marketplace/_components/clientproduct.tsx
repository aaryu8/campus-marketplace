'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import s from './product.module.css';

/* ══════════════════════════════════════════════════════════════════════════
   IMAGE SLIDER — Facebook Marketplace style
   Props: images string[], activeIndex + setActiveIndex managed by parent
══════════════════════════════════════════════════════════════════════════ */

interface ImageSliderProps {
  images: string[];
  alt?: string;
}

export const ImageSlider = ({ images, alt }: ImageSliderProps) => {
  const [active, setActive] = useState(0);
  const count = images.length;
  const src = images[active];

  const prev = () => setActive((i) => (i - 1 + count) % count);
  const next = () => setActive((i) => (i + 1) % count);

  return (
    <>
      {/* Blurred background — same image as active */}
      <div
        className={s.imageBg}
        style={{ backgroundImage: `url(${src})` }}
      />
      <div className={s.imageOverlay} />

      {/* Prev / Next — only if multiple images */}
      {count > 1 && (
        <>
          <button
            className={`${s.sliderArrow} ${s.sliderArrowLeft}`}
            onClick={prev}
            aria-label="Previous image"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            className={`${s.sliderArrow} ${s.sliderArrowRight}`}
            onClick={next}
            aria-label="Next image"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      {/* Main image */}
      <div className={s.imageMain}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Image
            src={src}
            alt={alt ?? 'Product image'}
            fill
            className="object-contain drop-shadow-xl"
            priority
            sizes="(max-width: 820px) 100vw, 60vw"
          />
        </div>
      </div>

      {/* Counter pill */}
      {count > 1 && (
        <div className={s.imageCounter}>
          {active + 1} / {count}
        </div>
      )}

      {/* Thumbnail strip — only if multiple images */}
      {count > 1 && (
        <div className={s.thumbStrip}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`${s.thumb} ${i === active ? s.thumbActive : ''}`}
              aria-label={`View image ${i + 1}`}
              style={{ background: 'none', border: i === active ? '2px solid #fff' : '2px solid transparent', padding: 0 }}
            >
              <Image
                src={img}
                alt={`Thumbnail ${i + 1}`}
                width={48}
                height={48}
                style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: 6 }}
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
};


/* ══════════════════════════════════════════════════════════════════════════
   BUTTONS — Message + Share (no save, no broken features)
══════════════════════════════════════════════════════════════════════════ */

interface ButtonsComponentProps {
  buyerId: string;
  sellerId: string;
  productId: string;
}

export const ButtonsComponent = ({ buyerId, sellerId, productId }: ButtonsComponentProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isSameUser = buyerId === sellerId;

  const onMessageClick = async () => {
    if (isSameUser) return;
    try {
      setLoading(true);
      const res = await axios({
        method: 'post',
        url: 'http://localhost:4000/api/chat/createId',
        withCredentials: true,
        data: { buyerId, sellerId, productId },
      });
      if (!res.data.status) { alert('Could not start chat.'); return; }
      router.push(`/chat/${res.data.data}`);
    } catch {
      alert('Could not start chat.');
    } finally {
      setLoading(false);
    }
  };

  const onShare = () => {
    if (navigator.share) {
      navigator.share({ title: document.title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isSameUser) {
    return (
      <div className={s.actionsRow}>
        <div style={{ fontSize: 13, color: '#65676b', textAlign: 'center', padding: '6px 0' }}>
          This is your listing.
        </div>
      </div>
    );
  }

  return (
    <div className={s.actionsRow}>
      <button type="button" onClick={onMessageClick} disabled={loading} className={s.btnPrimary}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        {loading ? 'Opening chat…' : 'Message Seller'}
      </button>
      <button type="button" onClick={onShare} className={s.btnSecondary}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        Share
      </button>
    </div>
  );
};


/* ══════════════════════════════════════════════════════════════════════════
   DESCRIPTION with expand/collapse
══════════════════════════════════════════════════════════════════════════ */

export const DescriptionComponent = ({ description }: { description: string }) => {
  const [expanded, setExpanded] = useState(false);
  const WORD_LIMIT = 40;
  const words = description.trim().split(/\s+/);
  const isLong = words.length > WORD_LIMIT;
  const preview = isLong ? words.slice(0, WORD_LIMIT).join(' ') + '…' : description;

  return (
    <div>
      <p className={s.sectionLabel}>Description</p>
      <p className={s.descriptionText}>{expanded ? description : preview}</p>
      {isLong && (
        <button className={s.seeMoreBtn} onClick={() => setExpanded(!expanded)}>
          {expanded ? 'See less' : 'See more'}
        </button>
      )}
    </div>
  );
};


/* ══════════════════════════════════════════════════════════════════════════
   MAPS PLACEHOLDER
══════════════════════════════════════════════════════════════════════════ */

export const MapsandChatbot = () => (
  <div className={s.mapsPlaceholder}>
    <span className={s.mapsIcon}>📍</span>
    <span>Meet-up location</span>
    <span className={s.mapsLabel}>Google Maps · Coming soon</span>
  </div>
);