import { useEffect } from 'react';
import type { NoticeDetail } from '../../types/notices';
import styles from './ModalNotice.module.css';

interface ModalNoticeProps {
  notice: NoticeDetail;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

const ModalNotice = ({ notice, isFavorite, onClose, onToggleFavorite }: ModalNoticeProps) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg width={16} height={16}>
            <use href="/sprite/sprite.svg#icon-cross" />
          </svg>
        </button>

        <div className={styles.imgWrap}>
          <img src={notice.imgURL} alt={notice.title} className={styles.img} />
          <div className={styles.popularityBadge}>
            <svg width={14} height={14} className={styles.starIcon}>
              <use href="/sprite/sprite.svg#icon-star" />
            </svg>
            <span>{notice.popularity}</span>
          </div>
        </div>

        <h2 className={styles.title}>{notice.title}</h2>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>Location: </span>
            <span className={styles.metaValue}>{notice.location.cityEn}, {notice.location.stateEn}</span>
          </span>
          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>Birthday: </span>
            <span className={styles.metaValue}>{formatDate(notice.birthday)}</span>
          </span>
          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>Sex: </span>
            <span className={styles.metaValue}>{notice.sex}</span>
          </span>
          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>Species: </span>
            <span className={styles.metaValue}>{notice.species}</span>
          </span>
          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>Category: </span>
            <span className={styles.metaValue}>{notice.category}</span>
          </span>
        </div>

        {notice.price !== undefined && (
          <p className={styles.price}>${notice.price}</p>
        )}

        <p className={styles.comment}>{notice.comment}</p>

        <div className={styles.actions}>
          <button className={styles.favoriteBtn} onClick={onToggleFavorite}>
            {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          </button>
          <a
            href={`tel:${notice.user.phone}`}
            className={styles.contactBtn}
          >
            Contact
          </a>
        </div>
      </div>
    </div>
  );
};

export default ModalNotice;
