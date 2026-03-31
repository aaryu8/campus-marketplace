  import axios from "axios";
  import { cookies } from "next/headers";
  import Link from "next/link";
  import { formatDistanceToNow } from "date-fns";
  import { ImageSlider, MapsandChatbot, ButtonsComponent, DescriptionComponent } from "../_components/clientproduct";
  import s from "../_components/product.module.css";
  import { TrackView } from "../_components/trackview";
  import { ReportModal } from "./_components/Reportmodel";

  type Props = {
    params: { productId: string };
  };

  function conditionClass(condition: string | null) {
    if (!condition) return s.badgeGray;
    const c = condition.toLowerCase();
    if (c === "new" || c === "like new" || c === "excellent") return s.badgeGreen;
    if (c === "good") return s.badgeAmber;
    return s.badgeGray;
  }



let productData: {
  title: string;
  price: number;
  description: string;
  views: number;
  category: string;
  condition: string | null;
  image: string[];
  createdAt: string;
  moderationStatus: string;   // ← ADD THIS
  owner: { id: string; name: string; email: string; createdAt?: string };
};












  

  const ProductBuying = async ({ params }: Props) => {
    const { productId } = await params;
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session_id");

    let isAuthenticated = true;
    let buyerId: string | undefined;

    


    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/marketplace/${productId}`,
        headers: { Cookie: `session_id=${sessionCookie?.value}` },
      });

      if (!response.data.taskStatus) {
        return (
          <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5", color: "#65676b", fontFamily: "Manrope, sans-serif", fontSize: 14 }}>
            Could not load this listing.
          </div>
        );
      }

      // page.tsx
      productData = response.data.data.productInfo;
    } catch {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5", color: "#65676b", fontFamily: "Manrope, sans-serif", fontSize: 14 }}>
          Something went wrong. Please try again.
        </div>
      );
    }

    try {
      const me = await axios({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`,
        headers: { Cookie: `session_id=${sessionCookie?.value}` },
      });
      buyerId = me.data.user.id;
    } catch {
      isAuthenticated = false;
    }

    const { title, price, description, condition, category, image, createdAt, owner  ,views } = productData;

    const sellerId = owner.id;
    const sellerInitial = owner.name.charAt(0).toUpperCase();
    const postedAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
    

    // Seller join date — use owner.createdAt if your backend returns it, otherwise omit
    // When you add createdAt to owner in your backend select, this will auto-populate
    const sellerSince = productData.owner.createdAt
      ? `On DormDeal since ${new Date(productData.owner.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}`
      : "DormDeal member";

      


    // For the slider: currently backend returns 1 image in the array
    // When your backend returns multiple images, they'll all show up automatically
    // To test slider: images array below is hardcoded to repeat the same image 3 times
    // REMOVE this and just use `image` directly once backend sends multiple images
    const sliderImages = image;
    return (
      <div className={s.page}>
        <TrackView productId={productId} />
        {/* ── LEFT: image stage ─────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
          <div className={s.imageNav}>
            <Link href="/marketplace" className={s.backBtn}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Back
            </Link>
            <Link href="/" className={s.logoChip}>
              <span className={s.logoChipDot}>D</span>
              DormDeal
            </Link>
          </div>

          <div className={s.imageStage}>
            {sliderImages.length > 0 && (
              <ImageSlider images={sliderImages} alt={title} />
            )}
          </div>
        </div>

        {/* ── RIGHT: detail panel ──────────────────────────── */}
        <aside className={s.panel}>
          <div className={s.panelInner}>

          {/* Title */}
          {productData.moderationStatus === 'warned' && (
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fcd34d',
              borderRadius: 12,
              padding: '10px 14px',
              marginBottom: 12,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
            }}>
                <span style={{ fontSize: 14 }}>⚠️</span>
                <p style={{ fontSize: 12, color: '#92400e', margin: 0, lineHeight: 1.4 }}>
                  This listing has been flagged by the community. Proceed with caution.
                </p>
              </div>
            )}


            <h1 className={s.title}>{title}</h1>

            {/* Meta: time + views */}
            <div className={s.metaRow}>
              <span className={s.metaChip}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                {postedAgo}
              </span>
              <span className={s.metaDot} />
              <span className={s.metaChip}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                {views} views
              </span>
            </div>

            {/* Price — biggest, top */}
            <div className={s.price}>
              <span className={s.priceCurrency}>₹</span>
              {price.toLocaleString("en-IN")}
            </div>

            

            {/* Badges */}
            <div className={s.badgeRow}>
              {category && (
                <span className={`${s.badge} ${s.badgePurple}`}>{category}</span>
              )}
              {condition && (
                <span className={`${s.badge} ${conditionClass(condition)}`}>{condition}</span>
              )}
            </div>

            <div className={s.divider} />

            {/* Action buttons */}
            {isAuthenticated && buyerId ? (
              <ButtonsComponent
                buyerId={buyerId}
                sellerId={sellerId}
                productId={productId}
              />
            ) : (
              <div className={s.authNotice}>
                <p className={s.authNoticeText}>Sign in to message the seller.</p>
                <Link href="/sign-in" className={s.authNoticeLink}>Sign in</Link>
              </div>
            )}

            <div className={s.divider} />

            {/* Seller info — inline, no box */}
            <div className={s.sellerSection}>
              <p className={s.sectionLabel}>Seller</p>
              <div className={s.sellerRow}>
                <div className={s.sellerAvatar}>{sellerInitial}</div>
                <div className={s.sellerMeta}>
                  <p className={s.sellerName}>{owner.name}</p>
                  <p className={s.sellerSince}>{sellerSince}</p>
                </div>
              </div>
            </div>

            <div className={s.divider} />

            {isAuthenticated && buyerId && buyerId !== sellerId && (
              <>
                <ReportModal productId={productId} />
              </>
            )}
            

            {/* Details list */}
            <p className={s.sectionLabel}>Details</p>
            <div className={s.detailsList}>
              {condition && (
                <div className={s.detailRow}>
                  <div className={s.detailIcon}>✨</div>
                  <div>
                    <div className={s.detailText}>{condition}</div>
                    <div className={s.detailSub}>Condition</div>
                  </div>
                </div>
              )}
              {category && (
                <div className={s.detailRow}>
                  <div className={s.detailIcon}>🏷️</div>
                  <div>
                    <div className={s.detailText}>{category}</div>
                    <div className={s.detailSub}>Category</div>
                  </div>
                </div>
              )}
              <div className={s.detailRow}>
                <div className={s.detailIcon}>📍</div>
                <div>
                  <div className={s.detailText}>On campus</div>
                  <div className={s.detailSub}>Meet-up location</div>
                </div>
              </div>
            </div>

            <div className={s.divider} />

            {/* Description */}
            <DescriptionComponent description={description} />

            <div className={s.divider} />

            {/* Maps */}
            <p className={s.sectionLabel}>Meet-up Location</p>
            <MapsandChatbot />

          </div>
        </aside>
      </div>
    );
  };

  export default ProductBuying;