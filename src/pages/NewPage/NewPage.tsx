import { useState, useEffect } from "react";
import type { NewsItem } from "../../types/news";
import { getNews } from "../../services/newsService";
import styles from "./NewPage.module.css";

export default function NewPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    getNews(page, keyword).then((data) => {
      if (!cancelled) {
        setNews(data.results);
        setTotalPages(data.totalPages);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [page, keyword]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setKeyword(search);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr)
      .toLocaleDateString("uk-UA", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\./g, "/");

  return (
    <main className={`${styles.main} container`}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>News</h1>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => {
                setSearch("");
                setKeyword("");
                setPage(1);
              }}
            >
              <svg width={16} height={16}>
                <use href="/sprite/sprite.svg#icon-cross-small" />
              </svg>
            </button>
          )}
          <button type="submit" className={styles.searchBtn}>
            <svg width="18" height="18">
              <use href="/sprite/sprite.svg#icon-search" />
            </svg>
          </button>
        </form>
      </div>

      <ul className={styles.list}>
        {news.map((item) => (
          <li key={item._id} className={styles.card}>
            <img
              src={item.imgUrl}
              alt={item.title}
              className={styles.cardImg}
            />
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>{item.title}</h2>
              <p className={styles.cardText}>{item.text}</p>
              <div className={styles.cardFooter}>
                <span className={styles.date}>{formatDate(item.date)}</span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.readMore}
                >
                  Read more
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.pagination}>
        <div className={styles.paginationGroup}>
          <button
            className={styles.pageBtn}
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            <svg width="20" height="20">
              <use href="/sprite/sprite.svg#icon-left-double-mobile" />
            </svg>
          </button>
          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <svg width="20" height="20">
              <use href="/sprite/sprite.svg#icon-left-mobile" />
            </svg>
          </button>
        </div>

        <div className={styles.paginationGroup}>
          {page <= 2 ? (
            <>
              <button
                className={`${styles.pageBtn} ${page === 1 ? styles.active : ""}`}
                onClick={() => setPage(1)}
              >
                1
              </button>
              <button
                className={`${styles.pageBtn} ${page === 2 ? styles.active : ""}`}
                onClick={() => setPage(2)}
              >
                2
              </button>
              <span className={styles.dots}>...</span>
            </>
          ) : page >= totalPages - 1 ? (
            <>
              <span className={styles.dots}>...</span>
              <button
                className={`${styles.pageBtn} ${page === totalPages - 1 ? styles.active : ""}`}
                onClick={() => setPage(totalPages - 1)}
              >
                {totalPages - 1}
              </button>
              <button
                className={`${styles.pageBtn} ${page === totalPages ? styles.active : ""}`}
                onClick={() => setPage(totalPages)}
              >
                {totalPages}
              </button>
            </>
          ) : (
            <>
              <span className={styles.dots}>...</span>
              <button
                className={`${styles.pageBtn} ${styles.active}`}
                onClick={() => setPage(page)}
              >
                {page}
              </button>
              <span className={styles.dots}>...</span>
            </>
          )}
        </div>

        <div className={styles.paginationGroup}>
          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <svg width="20" height="20">
              <use href="/sprite/sprite.svg#icon-right-mobile" />
            </svg>
          </button>
          <button
            className={styles.pageBtn}
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
          >
            <svg width="20" height="20">
              <use href="/sprite/sprite.svg#icon-right-double-mobile" />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}
