import css from "./NoticeCard.module.css";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

export interface NoticeCardItem {
  _id: string;
  title: string;
  name: string;
  birthday: string;
  comment?: string;
  sex: string;
  species: string;
  category: string;
  imgURL: string;
  popularity: number;
  price?: number;
}

interface Props {
  notice: NoticeCardItem;
  showDelete?: boolean;
  onDelete?: () => void;
  onLearnMore?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  isLoggedIn?: boolean;
  hideActions?: boolean;
}

export default function NoticeCard({
  notice,
  showDelete,
  onDelete,
  onLearnMore,
  isFavorite,
  onToggleFavorite,
  isLoggedIn,
  hideActions,
}: Props) {
  return (
    <div className={css.card}>
      <div className={css.cardImgWrap}>
        <img src={notice.imgURL} alt={notice.title} className={css.cardImg} />
      </div>

      <div className={css.cardBody}>
        <div className={css.titleRow}>
          <h3 className={css.cardTitle}>{notice.title}</h3>
          <div className={css.popularityBadge}>
            <svg width={16} height={16} className={css.starIcon}>
              <use href="/sprite/sprite.svg#icon-star" />
            </svg>
            <span>{notice.popularity}</span>
          </div>
        </div>

        <div className={css.cardMeta}>
          <div className={css.metaItem}>
            <span className={css.metaLabel}>Name</span>
            <span className={css.metaValue}>{notice.name}</span>
          </div>
          <div className={css.metaItem}>
            <span className={css.metaLabel}>Birthday</span>
            <span className={css.metaValue}>{formatDate(notice.birthday)}</span>
          </div>
          <div className={css.metaItem}>
            <span className={css.metaLabel}>Sex</span>
            <span className={css.metaValue}>{notice.sex}</span>
          </div>
          <div className={css.metaItem}>
            <span className={css.metaLabel}>Species</span>
            <span className={css.metaValue}>{notice.species}</span>
          </div>
          <div className={css.metaItem}>
            <span className={css.metaLabel}>Category</span>
            <span className={css.metaValue}>{notice.category}</span>
          </div>
        </div>

        {notice.comment && <p className={css.cardComment}>{notice.comment}</p>}

        {notice.price !== undefined && (
          <p className={css.cardPrice}>${notice.price}</p>
        )}

        <div className={css.cardActions}>
          <button
            className={`${css.learnMoreBtn} ${hideActions || !isLoggedIn ? css.learnMoreFull : ""}`}
            onClick={onLearnMore}
          >
            Learn more
          </button>
          {!hideActions &&
            isLoggedIn &&
            (showDelete ? (
              <button
                className={css.deleteBtn}
                onClick={onDelete}
                aria-label="Delete"
              >
                <svg width={20} height={20}>
                  <use href="/sprite/sprite.svg#icon-trash" />
                </svg>
              </button>
            ) : (
              <button
                className={`${css.heartBtn} ${isFavorite ? css.heartActive : ""}`}
                onClick={onToggleFavorite}
                aria-label="Toggle favorite"
              >
                <svg width={18} height={18}>
                  <use href="/sprite/sprite.svg#icon-heart" />
                </svg>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
