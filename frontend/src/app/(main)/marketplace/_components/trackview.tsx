"use client";
import { useEffect, useRef } from "react";

export function TrackView({ productId }: { productId: string }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    async function track() {
      const sessionRes = await fetch('/api/session', { credentials: 'include' });
      const { sessionId } = await sessionRes.json();

      const res = await fetch(
        `http://localhost:4000/api/marketplace/${productId}/view`,
        {
          method: 'POST',
          headers: { 'x-session-id': sessionId },  
        }
      );
      const data = await res.json();
      console.log('✅ View response:', data);
    }

    track().catch(console.error);
  }, [productId]);

  return null;
}