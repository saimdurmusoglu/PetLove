import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  fetchCurrentUser,
  removePet,
  selectUser,
  selectIsLoggedIn,
} from "../../redux/slices/authSlice";
import {
  removeFromFavorites,
  getNoticeById,
  addToFavorites,
} from "../../services/noticesService";
import type { NoticeCardItem } from "../../components/NoticeCard/NoticeCard";
import type { NoticeDetail } from "../../types/notices";
import NoticeCard from "../../components/NoticeCard/NoticeCard";
import ModalNotice from "../../components/ModalNotice/ModalNotice";
import ModalCongrats from "../../components/ModalCongrats/ModalCongrats";
import ModalApproveAction from "../../components/ModalApproveAction/ModalApproveAction";
import ModalEditUser from "../../components/ModalEditUser/ModalEditUser";
import css from "./ProfilePage.module.css";

type Tab = "favorites" | "viewed";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const location = useLocation();
  const [showLogout, setShowLogout] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showCongrats, setShowCongrats] = useState(() => {
    const show = !!location.state?.showCongrats;
    if (show) window.history.replaceState({}, document.title);
    return show;
  });
  const [activeTab, setActiveTab] = useState<Tab>("favorites");
  const [selectedNotice, setSelectedNotice] = useState<NoticeDetail | null>(
    null,
  );

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const handleRemovePet = async (id: string) => {
    try {
      await dispatch(removePet(id)).unwrap();
    } catch {
      toast.error("Failed to remove pet");
    }
  };

  const handleRemoveFavorite = async (id: string) => {
    try {
      await removeFromFavorites(id);
      dispatch(fetchCurrentUser());
    } catch {
      toast.error("Failed to remove from favorites");
    }
  };

  const handleLearnMore = async (id: string) => {
    try {
      const notice = await getNoticeById(id);
      setSelectedNotice(notice);
    } catch {
      toast.error("Failed to load notice details");
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      const isFav = favorites.some((n) => n._id === id);
      if (isFav) {
        await removeFromFavorites(id);
      } else {
        await addToFavorites(id);
      }
      dispatch(fetchCurrentUser());
    } catch {
      toast.error("Failed to update favorites");
    }
  };

  const favorites = (user?.noticesFavorites ||
    []) as unknown as NoticeCardItem[];
  const viewed = (user?.noticesViewed || []) as unknown as NoticeCardItem[];
  const tabItems = activeTab === "favorites" ? favorites : viewed;

  if (!isLoggedIn || !user) return null;

  return (
    <main className={`${css.main} container`}>
      <div className={css.layout}>
        {/* User Card */}
        <div className={css.userCard}>
          {/* Üst satır: User badge solda. Edit butonu absolute sağ üstte. */}
          <div className={css.userCardTop}>
            <div className={css.userBadge}>
              <span>User</span>
              <svg
                width={16}
                height={16}
                style={{ filter: "brightness(0) invert(1)" }}
              >
                <use href="/PetLove/sprite/sprite.svg#icon-user" />
              </svg>
            </div>
            <button
              className={css.editBtn}
              onClick={() => setShowEditUser(true)}
              aria-label="Edit profile"
            >
              <svg width={16} height={16}>
                <use href="/PetLove/sprite/sprite.svg#icon-edit" />
              </svg>
            </button>
          </div>

          {/* Avatar — mobilde ortalı aşağıda, tablette absolute ile ortalanmış yukarıda */}
          <div className={css.avatarWrap}>
            <button
              className={css.avatarBtn}
              onClick={() => setShowEditUser(true)}
              aria-label="Upload photo"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className={css.avatarImg}
                />
              ) : (
                <div className={css.avatarCircle}>
                  <svg
                    width={54}
                    height={54}
                    viewBox="0 0 20 20"
                    className={css.avatarIcon}
                  >
                    <use href="/PetLove/sprite/sprite.svg#icon-user" />
                  </svg>
                </div>
              )}
            </button>

            {/* Upload photo: sadece avatar yoksa */}
            {!user.avatar && (
              <button
                className={css.uploadText}
                onClick={() => setShowEditUser(true)}
              >
                Upload photo
              </button>
            )}
          </div>

          {/* My Information */}
          <h2 className={css.sectionTitle}>My information</h2>
          <div className={css.infoSection}>
            <input
              readOnly
              value={user?.name || ""}
              className={`${css.infoInput} ${user?.name ? css.infoInputFilled : ""}`}
            />
            <input
              readOnly
              value={user?.email || ""}
              className={`${css.infoInput} ${user?.email ? css.infoInputFilled : ""}`}
            />
            <input
              readOnly
              value={user?.phone || ""}
              placeholder="+380"
              className={`${css.infoInput} ${user?.phone ? css.infoInputFilled : ""}`}
            />
          </div>

          <div className={css.sectionGap} />

          <div className={css.petsHeader}>
            <span className={css.petsTitle}>My pets</span>
            <Link to="/add-pet" className={css.addPetBtn}>
              Add pet
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 2v12M2 8h12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </Link>
          </div>

          {user.pets && user.pets.length > 0 ? (
            <ul className={css.petsList}>
              {user.pets.map((pet) => (
                <li key={pet._id} className={css.petItem}>
                  {pet.imgURL ? (
                    <img
                      src={pet.imgURL}
                      alt={pet.name}
                      className={css.petImg}
                    />
                  ) : (
                    <div className={css.petImgPlaceholder}>
                      <svg width={24} height={24}>
                        <use href="/PetLove/sprite/sprite.svg#icon-pawprint" />
                      </svg>
                    </div>
                  )}
                  <div className={css.petInfo}>
                    <p className={css.petName}>{pet.title || pet.name}</p>
                    <div className={css.petMetaRow}>
                      <div
                        className={`${css.petMetaCol} ${css.petMetaColName}`}
                      >
                        <span className={css.petMetaLabel}>Name</span>
                        <span className={css.petMetaValue}>{pet.name}</span>
                      </div>
                      <div
                        className={`${css.petMetaCol} ${css.petMetaColBirthday}`}
                      >
                        <span className={css.petMetaLabel}>Birthday</span>
                        <span className={css.petMetaValue}>{pet.birthday}</span>
                      </div>
                      <div className={`${css.petMetaCol} ${css.petMetaColSex}`}>
                        <span className={css.petMetaLabel}>Sex</span>
                        <span className={css.petMetaValue}>{pet.sex}</span>
                      </div>
                    </div>
                    <div
                      className={`${css.petMetaCol} ${css.petMetaColSpecies}`}
                    >
                      <span className={css.petMetaLabel}>Species</span>
                      <span className={css.petMetaValue}>{pet.species}</span>
                    </div>
                  </div>
                  <button
                    className={css.petDeleteBtn}
                    onClick={() => handleRemovePet(pet._id)}
                    aria-label="Remove pet"
                  >
                    <svg
                      width={16}
                      height={16}
                      style={{ flexShrink: 0, display: "block" }}
                    >
                      <use href="/PetLove/sprite/sprite.svg#icon-trash" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className={css.emptyPets}>No pets yet</p>
          )}

          <button className={css.logoutBtn} onClick={() => setShowLogout(true)}>
            Log out
          </button>
        </div>

        {/* My Notices */}
        <div className={css.myNotices}>
          <div className={css.tabRow}>
            <button
              className={`${css.tab} ${activeTab === "favorites" ? css.tabActive : ""}`}
              onClick={() => setActiveTab("favorites")}
            >
              My favorite pets
            </button>
            <button
              className={`${css.tab} ${activeTab === "viewed" ? css.tabActive : ""}`}
              onClick={() => setActiveTab("viewed")}
            >
              Viewed
            </button>
          </div>

          {tabItems.length === 0 ? (
            <p className={css.emptyText}>No notices yet</p>
          ) : (
            <ul className={css.noticesList}>
              {tabItems.map((notice) => (
                <li key={notice._id}>
                  <NoticeCard
                    notice={notice}
                    showDelete={activeTab === "favorites"}
                    onDelete={() => handleRemoveFavorite(notice._id)}
                    onLearnMore={() => handleLearnMore(notice._id)}
                    isFavorite={favorites.some((f) => f._id === notice._id)}
                    onToggleFavorite={() => handleToggleFavorite(notice._id)}
                    isLoggedIn={isLoggedIn}
                    hideActions={activeTab === "viewed"}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {showLogout && (
        <ModalApproveAction onClose={() => setShowLogout(false)} />
      )}
      {showEditUser && <ModalEditUser onClose={() => setShowEditUser(false)} />}
      {showCongrats && <ModalCongrats onClose={() => setShowCongrats(false)} />}
      {selectedNotice && (
        <ModalNotice
          notice={selectedNotice}
          isFavorite={favorites.some((f) => f._id === selectedNotice._id)}
          onClose={() => setSelectedNotice(null)}
          onToggleFavorite={() => handleToggleFavorite(selectedNotice._id)}
        />
      )}
    </main>
  );
}
