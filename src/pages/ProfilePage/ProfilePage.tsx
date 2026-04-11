import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  fetchCurrentUser,
  removePet,
  selectUser,
  selectIsLoggedIn,
} from '../../redux/slices/authSlice';
import { removeFromFavorites } from '../../services/noticesService';
import type { NoticeCardItem } from '../../components/NoticeCard/NoticeCard';
import NoticeCard from '../../components/NoticeCard/NoticeCard';
import ModalApproveAction from '../../components/ModalApproveAction/ModalApproveAction';
import ModalEditUser from '../../components/ModalEditUser/ModalEditUser';
import css from './ProfilePage.module.css';

type Tab = 'favorites' | 'viewed';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const [showLogout, setShowLogout] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('favorites');

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const handleRemovePet = async (id: string) => {
    try {
      await dispatch(removePet(id)).unwrap();
    } catch {
      toast.error('Failed to remove pet');
    }
  };

  const handleRemoveFavorite = async (id: string) => {
    try {
      await removeFromFavorites(id);
      dispatch(fetchCurrentUser());
    } catch {
      toast.error('Failed to remove from favorites');
    }
  };

  const favorites = (user?.noticesFavorites || []) as unknown as NoticeCardItem[];
  const viewed = (user?.noticesViewed || []) as unknown as NoticeCardItem[];
  const tabItems = activeTab === 'favorites' ? favorites : viewed;

  if (!isLoggedIn || !user) return null;

  return (
    <main className={`${css.main} container`}>
      <div className={css.layout}>
        {/* User Card */}
        <div className={css.userCard}>
          <div className={css.userCardTop}>
            <div className={css.userBadge}>
              <span>User</span>
              <svg width={16} height={16} style={{ filter: 'brightness(0) invert(1)' }}>
                <use href="/sprite/sprite.svg#icon-user" />
              </svg>
            </div>
            <button
              className={css.editBtn}
              onClick={() => setShowEditUser(true)}
              aria-label="Edit profile"
            >
              <svg width={16} height={16}>
                <use href="/sprite/sprite.svg#icon-edit" />
              </svg>
            </button>
          </div>

          <div className={css.avatarWrap}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className={css.avatarImg} />
            ) : (
              <div className={css.avatarCircle}>
                <svg width={54} height={54} viewBox="0 0 20 20" className={css.avatarIcon}>
                  <use href="/sprite/sprite.svg#icon-user" />
                </svg>
              </div>
            )}
            <span className={css.uploadText}>Upload photo</span>
          </div>

          <div className={css.infoSection}>
            <h2 className={css.sectionTitle}>My information</h2>
            <input readOnly value={user?.name || ''} className={css.infoInput} />
            <input readOnly value={user?.email || ''} className={css.infoInput} />
            <input readOnly value={user?.phone || ''} placeholder="+380" className={css.infoInput} />
          </div>

          <div className={css.sectionGap} />

          <div className={css.petsHeader}>
            <span className={css.petsTitle}>My pets</span>
            <Link to="/add-pet" className={css.addPetBtn}>
              Add pet
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                <path d="M8 2v12M2 8h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Link>
          </div>

          {user.pets && user.pets.length > 0 ? (
            <ul className={css.petsList}>
              {user.pets.map(pet => (
                <li key={pet._id} className={css.petItem}>
                  {pet.imgURL ? (
                    <img src={pet.imgURL} alt={pet.name} className={css.petImg} />
                  ) : (
                    <div className={css.petImgPlaceholder}>
                      <svg width={24} height={24}>
                        <use href="/sprite/sprite.svg#icon-pawprint" />
                      </svg>
                    </div>
                  )}
                  <div className={css.petInfo}>
                    <p className={css.petName}>{pet.name}</p>
                    <div className={css.petMetaRow}>
                      <div className={css.petMetaCol}>
                        <span className={css.petMetaLabel}>Name</span>
                        <span className={css.petMetaValue}>{pet.name}</span>
                      </div>
                      <div className={css.petMetaCol}>
                        <span className={css.petMetaLabel}>Birthday</span>
                        <span className={css.petMetaValue}>{pet.birthday}</span>
                      </div>
                      <div className={css.petMetaCol}>
                        <span className={css.petMetaLabel}>Sex</span>
                        <span className={css.petMetaValue}>{pet.sex}</span>
                      </div>
                    </div>
                    <div className={css.petMetaCol}>
                      <span className={css.petMetaLabel}>Species</span>
                      <span className={css.petMetaValue}>{pet.species}</span>
                    </div>
                  </div>
                  <button
                    className={css.petDeleteBtn}
                    onClick={() => handleRemovePet(pet._id)}
                    aria-label="Remove pet"
                  >
                    <svg width={20} height={20}>
                      <use href="/sprite/sprite.svg#icon-trash" />
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
              className={`${css.tab} ${activeTab === 'favorites' ? css.tabActive : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              My favorite pets
            </button>
            <button
              className={`${css.tab} ${activeTab === 'viewed' ? css.tabActive : ''}`}
              onClick={() => setActiveTab('viewed')}
            >
              Viewed
            </button>
          </div>

          {tabItems.length === 0 ? (
            <p className={css.emptyText}>No notices yet</p>
          ) : (
            <ul className={css.noticesList}>
              {tabItems.map(notice => (
                <li key={notice._id}>
                  <NoticeCard
                    notice={notice}
                    showDelete={activeTab === 'favorites'}
                    onDelete={() => handleRemoveFavorite(notice._id)}
                    isFavorite={true}
                    isLoggedIn={isLoggedIn}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {showLogout && <ModalApproveAction onClose={() => setShowLogout(false)} />}
      {showEditUser && <ModalEditUser onClose={() => setShowEditUser(false)} />}
    </main>
  );
}
