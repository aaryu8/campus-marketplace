import axios from "axios";
import { cookies } from "next/headers";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ImageListing } from "../_components/ImageListing";
import {
  MapsandChatbot,
  ButtonsComponent,
  DescriptionComponent,
} from "../_components/clientproduct";
import s from "../_components/product.module.css";

type Props = {
  params: { productId: string };
};

// ─── Condition badge colour ───────────────────────────────────────────────────
function conditionClass(condition: string | null) {
  if (!condition) return s.badgeGray;
  const c = condition.toLowerCase();
  if (c === "new") return s.badgeGreen;
  if (c === "like new" || c === "excellent") return s.badgeGreen;
  if (c === "good") return s.badgeAmber;
  return s.badgeGray;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const ProductBuying = async ({ params }: Props) => {
  const { productId } = await params;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session_id");

  let isAuthenticated = true;
  let buyerId: string | undefined;

  // ── Fetch product ──────────────────────────────────────────────────────────
  let productData: {
    title: string;
    price: number;
    description: string;
    rating: number;
    category: string;
    condition: string | null;
    image: string[];
    createdAt: string;
    owner: { id: string; name: string; email: string };
  };

  try {
    const response = await axios({
      method: "GET",
      url: `http://localhost:4000/api/marketplace/${productId}`,
      headers: { Cookie: `session_id=${sessionCookie?.value}` },
    });

    if (!response.data.taskStatus) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#faf8f4] text-gray-500 text-sm">
          Could not load this listing.
        </div>
      );
    }

    productData = response.data.data.productInfo;
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f4] text-gray-500 text-sm">
        Something went wrong. Please try again.
      </div>
    );
  }

  // ── Fetch current user ─────────────────────────────────────────────────────
  try {
    const me = await axios({
      method: "GET",
      url: "http://localhost:4000/api/auth/me",
      headers: { Cookie: `session_id=${sessionCookie?.value}` },
    });
    buyerId = me.data.user.id;
  } catch {
    isAuthenticated = false;
  }

  const {
    title,
    price,
    description,
    condition,
    category,
    image,
    createdAt,
    owner,
  } = productData;

  const sellerId = owner.id;
  const sellerInitial = owner.name.charAt(0).toUpperCase();
  const postedAgo = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
  });

  return (
    <div className={s.page}>

      {/* ── LEFT: image ─────────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
        {/* Top-left nav overlay */}
        <div className={s.imageNav}>
          <Link href="/marketplace" className={s.backBtn}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back
          </Link>
          <Link href="/" className={s.logoChip}>
            <span className={s.logoChipDot}>D</span>
            DormDeal
          </Link>
        </div>

        {image?.[0] && <ImageListing src={image[0]} alt={title} />}
      </div>

      {/* ── RIGHT: detail panel ──────────────────────────────────── */}
      <aside className={s.panel}>
        <div className={s.panelInner}>

          {/* Badges */}
          <div className={s.badgeRow}>
            {category && (
              <span className={`${s.badge} ${s.badgePurple}`}>
                {category}
              </span>
            )}
            {condition && (
              <span className={`${s.badge} ${conditionClass(condition)}`}>
                {condition}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className={s.title}>{title}</h1>

          {/* Price */}
          <div className={s.priceRow}>
            <span className={s.priceCurrency}>₹</span>
            <span className={s.price}>{price.toLocaleString("en-IN")}</span>
          </div>

          {/* Posted */}
          <p className={s.postedDate}>Listed {postedAgo}</p>

          <div className={s.divider} />

          {/* Seller */}
          <div className={s.sellerCard}>
            <div className={s.sellerAvatar}>{sellerInitial}</div>
            <div className={s.sellerInfo}>
              <p className={s.sellerLabel}>Seller</p>
              <p className={s.sellerName}>{owner.name}</p>
              <p className={s.sellerEmail}>{owner.email}</p>
            </div>
          </div>

          {/* Actions */}
          {isAuthenticated && buyerId ? (
            <ButtonsComponent
              buyerId={buyerId}
              sellerId={sellerId}
              productId={productId}
            />
          ) : (
            <div className={s.authNotice}>
              <p className={s.authNoticeText}>
                Sign in to message the seller or save this listing.
              </p>
              <Link href="/sign-in" className={s.authNoticeLink}>
                Sign in →
              </Link>
            </div>
          )}

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