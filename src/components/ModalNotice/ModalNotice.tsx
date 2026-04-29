import { useEffect } from "react";
import type { NoticeDetail } from "../../types/notices";
import styles from "./ModalNotice.module.css";

interface ModalNoticeProps {
  notice: NoticeDetail;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

const ModalNotice = ({
  notice,
  isFavorite,
  onClose,
  onToggleFavorite,
}: ModalNoticeProps) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const filledStars = Math.min(Math.round(notice.popularity), 5);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          <svg width={14} height={14}>
            <use href="/PetLove/sprite/sprite.svg#icon-cross-small" />
          </svg>
        </button>

        <div className={styles.avatarWrap}>
          <img
            src={notice.imgURL}
            alt={notice.title}
            className={styles.avatar}
          />
          <span className={styles.categoryBadge}>{notice.category}</span>
        </div>

        <h2 className={styles.title}>{notice.title}</h2>

        <div className={styles.popularityRow}>
          {Array.from({ length: 5 }, (_, i) => (
            <svg
              key={i}
              width={16}
              height={16}
              className={i < filledStars ? styles.starFilled : styles.starEmpty}
            >
              <use href="/PetLove/sprite/sprite.svg#icon-star" />
            </svg>
          ))}
          <span className={styles.popularityCount}>{notice.popularity}</span>
        </div>

        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Name</span>
            <span className={styles.metaValue}>{notice.name}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Birthday</span>
            <span className={styles.metaValue}>
              {formatDate(notice.birthday)}
            </span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Sex</span>
            <span className={styles.metaValue}>{notice.sex}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Species</span>
            <span className={styles.metaValue}>{notice.species}</span>
          </div>
        </div>

        {notice.comment && <p className={styles.comment}>{notice.comment}</p>}

        {notice.price !== undefined && (
          <p className={styles.price}>${notice.price}</p>
        )}

        <div className={styles.actions}>
          <button className={styles.favoriteBtn} onClick={onToggleFavorite}>
            {isFavorite ? "Remove" : "Add to"}
            <svg
              width={18}
              height={18}
              viewBox="0 0 18 18"
              fill="none"
              className={styles.heartIcon}
            >
              <path
                d="M15.6306 3.4575C15.2475 3.07425 14.7927 2.77023 14.2921 2.56281C13.7915 2.35539 13.2549 2.24863 12.7131 2.24863C12.1712 2.24863 11.6347 2.35539 11.1341 2.56281C10.6335 2.77023 10.1786 3.07425 9.79558 3.4575L9.00058 4.2525L8.20558 3.4575C7.43181 2.68373 6.38235 2.24903 5.28808 2.24903C4.1938 2.24903 3.14435 2.68373 2.37058 3.4575C1.59681 4.23127 1.16211 5.28072 1.16211 6.375C1.16211 7.46927 1.59681 8.51873 2.37058 9.2925L3.16558 10.0875L9.00058 15.9225L14.8356 10.0875L15.6306 9.2925C16.0138 8.90943 16.3178 8.45461 16.5253 7.95401C16.7327 7.45342 16.8394 6.91686 16.8394 6.375C16.8394 5.83313 16.7327 5.29657 16.5253 4.79598C16.3178 4.29539 16.0138 3.84056 15.6306 3.4575Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <a href={`tel:${notice.user.phone}`} className={styles.contactBtn}>
            Contact
          </a>
        </div>
      </div>
    </div>
  );
};

export default ModalNotice;
