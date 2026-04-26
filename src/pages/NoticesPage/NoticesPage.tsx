import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {
  fetchNotices,
  fetchCategories,
  fetchSexOptions,
  fetchSpecies,
  toggleFavorite,
  setFilter,
  setPage,
  selectNotices,
  selectTotalPages,
  selectNoticesLoading,
  selectFilters,
  selectPage,
  selectCategories,
  selectSexOptions,
  selectSpeciesList,
  selectFavoriteIds,
} from "../../redux/slices/noticesSlice";
import {selectIsLoggedIn} from "../../redux/slices/authSlice";
import {getNoticeById, searchCities} from "../../services/noticesService";
import type {NoticeDetail, Notice} from "../../types/notices";
import type {NoticesParams} from "../../services/noticesService";
import ModalAttention from "../../components/ModalAttention/ModalAttention";
import ModalNotice from "../../components/ModalNotice/ModalNotice";
import NoticeCard from "../../components/NoticeCard/NoticeCard";
import styles from "./NoticesPage.module.css";

const SORT_OPTIONS = [
  {label: "Popular", value: "popular"},
  {label: "Unpopular", value: "unpopular"},
  {label: "Cheap", value: "cheap"},
  {label: "Expensive", value: "expensive"},
];

function buildParams(
  filters: ReturnType<typeof selectFilters>,
  page: number,
): NoticesParams {
  const params: NoticesParams = {
    keyword: filters.keyword || undefined,
    category: filters.category || undefined,
    species: filters.species || undefined,
    sex: filters.sex || undefined,
    locationId: filters.location || undefined,
    page,
    limit: 6,
  };

  if (filters.sortBy === "popular") params.byPopularity = true;
  if (filters.sortBy === "unpopular") {
    params.byPopularity = true;
    params.byDate = false;
  }
  if (filters.sortBy === "cheap") params.byPrice = true;
  if (filters.sortBy === "expensive") params.byPrice = true;

  return params;
}

export default function NoticesPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const items = useAppSelector(selectNotices);
  const totalPages = useAppSelector(selectTotalPages);
  const isLoading = useAppSelector(selectNoticesLoading);
  const filters = useAppSelector(selectFilters);
  const page = useAppSelector(selectPage);
  const categories = useAppSelector(selectCategories);
  const sexOptions = useAppSelector(selectSexOptions);
  const speciesList = useAppSelector(selectSpeciesList).map(
    (s) => s.charAt(0).toUpperCase() + s.slice(1),
  );
  const favoriteIds = useAppSelector(selectFavoriteIds);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const [searchInput, setSearchInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<
    {_id: string; cityEn: string; stateEn: string}[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAttention, setShowAttention] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<NoticeDetail | null>(
    null,
  );

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSexOpen, setIsSexOpen] = useState(false);
  const [isSpeciesOpen, setIsSpeciesOpen] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const sexRef = useRef<HTMLDivElement>(null);
  const speciesRef = useRef<HTMLDivElement>(null);
  const skipLocationSearchRef = useRef(false);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchSexOptions());
    dispatch(fetchSpecies());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchNotices(buildParams(filters, page)));
  }, [dispatch, filters, page]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(e.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
      if (sexRef.current && !sexRef.current.contains(e.target as Node)) {
        setIsSexOpen(false);
      }
      if (
        speciesRef.current &&
        !speciesRef.current.contains(e.target as Node)
      ) {
        setIsSpeciesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (skipLocationSearchRef.current) {
      skipLocationSearchRef.current = false;
      return;
    }
    if (locationInput.length < 3) return;
    const timer = setTimeout(async () => {
      try {
        const results = await searchCities(locationInput);
        setLocationSuggestions(results);
        setShowSuggestions(true);
      } catch {
        setLocationSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [locationInput]);

  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setFilter({key: "keyword", value: searchInput}));
  };

  const handleClearSearch = () => {
    setSearchInput("");
    dispatch(setFilter({key: "keyword", value: ""}));
  };

  const handleLocationSelect = (city: {
    _id: string;
    cityEn: string;
    stateEn: string;
  }) => {
    skipLocationSearchRef.current = true;
    setLocationInput(`${city.cityEn}, ${city.stateEn}`);
    setShowSuggestions(false);
    dispatch(setFilter({key: "location", value: city._id}));
  };

  const handleLocationClear = () => {
    setLocationInput("");
    setShowSuggestions(false);
    dispatch(setFilter({key: "location", value: ""}));
  };

  const handleSortPill = (value: string) => {
    dispatch(
      setFilter({key: "sortBy", value: filters.sortBy === value ? "" : value}),
    );
  };

  const handleLearnMore = async (notice: Notice) => {
    if (!isLoggedIn) {
      setShowAttention(true);
      return;
    }
    try {
      const detail = await getNoticeById(notice._id);
      setSelectedNotice(detail);
    } catch {
      toast.error("Failed to load notice details");
    }
  };

  const handleHeartClick = (notice: Notice) => {
    if (!isLoggedIn) {
      setShowAttention(true);
      return;
    }
    const isFav = favoriteIds.includes(notice._id);
    dispatch(toggleFavorite({id: notice._id, isFavorite: isFav}))
      .unwrap()
      .then(() => {
        if (!isFav) {
          navigate('/profile', { state: { showCongrats: true } });
        }
      })
      .catch(() => toast.error("Failed to update favorites"));
  };

  const handleToggleFavoriteFromModal = () => {
    if (!selectedNotice) return;
    const isFav = favoriteIds.includes(selectedNotice._id);
    dispatch(toggleFavorite({id: selectedNotice._id, isFavorite: isFav}))
      .unwrap()
      .catch(() => toast.error("Failed to update favorites"));
  };

  return (
    <main className={styles.main}>
      <div className="container">
        <h1 className={styles.title}>Find your favorite pet</h1>

        <div className={styles.filterCard}>
          <form className={styles.searchRow} onSubmit={handleSearch}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={handleClearSearch}
              >
                <svg width={16} height={16}>
                  <use href="/sprite/sprite.svg#icon-cross-small" />
                </svg>
              </button>
            )}
            <button type="submit" className={styles.searchIconBtn}>
              <svg width={18} height={18}>
                <use href="/sprite/sprite.svg#icon-search" />
              </svg>
            </button>
          </form>

          <div className={styles.selectRow}>
            {/* Category dropdown */}
            <div className={styles.selectWrapper} ref={categoryRef}>
              <button
                type="button"
                className={styles.selectTrigger}
                onClick={() => setIsCategoryOpen((v) => !v)}
              >
                <span>{filters.category || "Category"}</span>
                <svg
                  width={16}
                  height={16}
                  className={
                    isCategoryOpen ? styles.chevronOpen : styles.chevron
                  }
                >
                  <use href="/sprite/sprite.svg#icon-chevron-down" />
                </svg>
              </button>
              {isCategoryOpen && (
                <div className={styles.dropdownMenu}>
                  {["Show all", ...categories].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`${styles.dropdownItem} ${
                        opt === "Show all"
                          ? styles.dropdownItemShowAll
                          : filters.category === opt
                            ? styles.dropdownItemActive
                            : ""
                      }`}
                      onClick={() => {
                        dispatch(
                          setFilter({
                            key: "category",
                            value: opt === "Show all" ? "" : opt,
                          }),
                        );
                        setIsCategoryOpen(false);
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* By gender dropdown */}
            <div className={styles.selectWrapper} ref={sexRef}>
              <button
                type="button"
                className={styles.selectTrigger}
                onClick={() => setIsSexOpen((v) => !v)}
              >
                <span>{filters.sex || "By gender"}</span>
                <svg
                  width={16}
                  height={16}
                  className={isSexOpen ? styles.chevronOpen : styles.chevron}
                >
                  <use href="/sprite/sprite.svg#icon-chevron-down" />
                </svg>
              </button>
              {isSexOpen && (
                <div className={styles.dropdownMenu}>
                  {["Show all", ...sexOptions].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`${styles.dropdownItem} ${
                        opt === "Show all"
                          ? styles.dropdownItemShowAll
                          : filters.sex === opt
                            ? styles.dropdownItemActive
                            : ""
                      }`}
                      onClick={() => {
                        dispatch(
                          setFilter({
                            key: "sex",
                            value: opt === "Show all" ? "" : opt,
                          }),
                        );
                        setIsSexOpen(false);
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* By type dropdown */}
          <div className={styles.selectWrapper} ref={speciesRef}>
            <button
              type="button"
              className={styles.selectTrigger}
              onClick={() => setIsSpeciesOpen((v) => !v)}
            >
              <span>{filters.species || "By type"}</span>
              <svg
                width={16}
                height={16}
                className={isSpeciesOpen ? styles.chevronOpen : styles.chevron}
              >
                <use href="/sprite/sprite.svg#icon-chevron-down" />
              </svg>
            </button>
            {isSpeciesOpen && (
              <div className={styles.dropdownMenu}>
                {["Show all", ...speciesList].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`${styles.dropdownItem} ${
                      opt === "Show all"
                        ? styles.dropdownItemShowAll
                        : filters.species === opt
                          ? styles.dropdownItemActive
                          : ""
                    }`}
                    onClick={() => {
                      dispatch(
                        setFilter({
                          key: "species",
                          value: opt === "Show all" ? "" : opt,
                        }),
                      );
                      setIsSpeciesOpen(false);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div
            className={styles.searchRow}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              className={styles.searchInput}
              placeholder="Location"
              value={locationInput}
              onChange={(e) => {
                const val = e.target.value;
                setLocationInput(val);
                if (val.length < 3) {
                  setLocationSuggestions([]);
                  setShowSuggestions(false);
                }
              }}
              onFocus={() =>
                locationSuggestions.length > 0 && setShowSuggestions(true)
              }
            />
            {locationInput && (
              <button className={styles.clearBtn} onClick={handleLocationClear}>
                <svg width={16} height={16}>
                  <use href="/sprite/sprite.svg#icon-cross-small" />
                </svg>
              </button>
            )}
            <button className={styles.searchIconBtn}>
              <svg width={18} height={18}>
                <use href="/sprite/sprite.svg#icon-search" />
              </svg>
            </button>
            {showSuggestions && locationSuggestions.length > 0 && (
              <div className={styles.suggestionMenu}>
                {locationSuggestions.map((city) => {
                  const label = `${city.cityEn}, ${city.stateEn}`;
                  const idx = label
                    .toLowerCase()
                    .indexOf(locationInput.toLowerCase());
                  return (
                    <button
                      key={city._id}
                      className={styles.suggestionItem}
                      onClick={() => handleLocationSelect(city)}
                    >
                      {idx >= 0 ? (
                        <>
                          <strong>
                            {label.slice(0, idx + locationInput.length)}
                          </strong>
                          {label.slice(idx + locationInput.length)}
                        </>
                      ) : (
                        label
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <hr className={styles.divider} />

          <div className={styles.sortRow}>
            {SORT_OPTIONS.map((opt) => {
              const isActive = filters.sortBy === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.sortPill} ${isActive ? styles.sortPillActive : ""}`}
                  onClick={() => handleSortPill(opt.value)}
                >
                  {opt.label}
                  {isActive && (
                    <span
                      className={styles.pillClearBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(setFilter({key: "sortBy", value: ""}));
                      }}
                    >
                      ✕
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {isLoading && <p className={styles.loading}>Loading...</p>}

        {!isLoading && items.length === 0 && (
          <p className={styles.empty}>No notices found.</p>
        )}

        {!isLoading && items.length > 0 && (
          <ul className={styles.list}>
            {items.map((notice) => {
              const isFav = favoriteIds.includes(notice._id);
              return (
                <li key={notice._id}>
                  <NoticeCard
                    notice={notice}
                    isFavorite={isFav}
                    onLearnMore={() => handleLearnMore(notice)}
                    onToggleFavorite={() => handleHeartClick(notice)}
                    isLoggedIn={isLoggedIn}
                  />
                </li>
              );
            })}
          </ul>
        )}

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <div className={styles.paginationGroup}>
              <button
                className={styles.pageBtn}
                onClick={() => dispatch(setPage(1))}
                disabled={page === 1}
              >
                <svg width={20} height={20}>
                  <use href="/sprite/sprite.svg#icon-left-double-mobile" />
                </svg>
              </button>
              <button
                className={styles.pageBtn}
                onClick={() => dispatch(setPage(Math.max(1, page - 1)))}
                disabled={page === 1}
              >
                <svg width={20} height={20}>
                  <use href="/sprite/sprite.svg#icon-left-mobile" />
                </svg>
              </button>
            </div>

            <div className={styles.paginationGroup}>
              {page <= 2 ? (
                <>
                  <button
                    className={`${styles.pageBtn} ${page === 1 ? styles.active : ""}`}
                    onClick={() => dispatch(setPage(1))}
                  >
                    1
                  </button>
                  <button
                    className={`${styles.pageBtn} ${page === 2 ? styles.active : ""}`}
                    onClick={() => dispatch(setPage(2))}
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
                    onClick={() => dispatch(setPage(totalPages - 1))}
                  >
                    {totalPages - 1}
                  </button>
                  <button
                    className={`${styles.pageBtn} ${page === totalPages ? styles.active : ""}`}
                    onClick={() => dispatch(setPage(totalPages))}
                  >
                    {totalPages}
                  </button>
                </>
              ) : (
                <>
                  <span className={styles.dots}>...</span>
                  <button
                    className={`${styles.pageBtn} ${styles.active}`}
                    onClick={() => dispatch(setPage(page))}
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
                onClick={() =>
                  dispatch(setPage(Math.min(totalPages, page + 1)))
                }
                disabled={page === totalPages}
              >
                <svg width={20} height={20}>
                  <use href="/sprite/sprite.svg#icon-right-mobile" />
                </svg>
              </button>
              <button
                className={styles.pageBtn}
                onClick={() => dispatch(setPage(totalPages))}
                disabled={page === totalPages}
              >
                <svg width={20} height={20}>
                  <use href="/sprite/sprite.svg#icon-right-double-mobile" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {showAttention && (
        <ModalAttention onClose={() => setShowAttention(false)} />
      )}

      {selectedNotice && (
        <ModalNotice
          notice={selectedNotice}
          isFavorite={favoriteIds.includes(selectedNotice._id)}
          onClose={() => setSelectedNotice(null)}
          onToggleFavorite={handleToggleFavoriteFromModal}
        />
      )}
    </main>
  );
}
