import {useState} from "react";
import {NavLink, Link, useLocation} from "react-router-dom";
import {useAppSelector} from "../../hooks/redux";
import ModalApproveAction from "../ModalApproveAction/ModalApproveAction";
import styles from "./Header.module.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const {isLoggedIn, user} = useAppSelector((state) => state.auth);
  const {pathname} = useLocation();
  const isHome = pathname === "/";

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const getNavClass = (isActive: boolean) => {
    if (isLoggedIn) {
      return isActive
        ? `${styles.navLink} ${styles.active}`
        : styles.navLink;
    }
    return isActive ? `${styles.navLinkLight} ${styles.active}` : styles.navLinkLight;
  };

  const getDesktopNavClass = (isActive: boolean) => {
    if (isHome) {
      return isActive
        ? `${styles.desktopNavLinkWhite} ${styles.desktopActive}`
        : styles.desktopNavLinkWhite;
    }
    return isActive
      ? `${styles.desktopNavLink} ${styles.desktopActive}`
      : styles.desktopNavLink;
  };

  return (
    <header className={`${styles.header} ${isHome ? styles.headerHome : ""}`}>
      <div
        className={`${styles.container} ${isHome ? styles.containerHome : ""}`}
      >
        <Link to="/" className={styles.logo}>
          <img
            src={
              isHome
                ? "/images/logo-mobile-white.svg"
                : "/images/logo-mobile.svg"
            }
            alt="logo"
          />
        </Link>

        {/* desktop nav - sadece 1280px+ */}
        <nav className={styles.desktopNav}>
          <NavLink
            to="/news"
            className={({isActive}) => getDesktopNavClass(isActive)}
          >
            News
          </NavLink>
          <NavLink
            to="/notices"
            className={({isActive}) => getDesktopNavClass(isActive)}
          >
            Find pet
          </NavLink>
          <NavLink
            to="/friends"
            className={({isActive}) => getDesktopNavClass(isActive)}
          >
            Our friends
          </NavLink>
        </nav>

        <div className={styles.headerRight}>
          {/* tablet + desktop: login olmamış */}
          {!isLoggedIn && (
            <div className={styles.authButtons}>
              <Link to="/login" className={styles.loginBtnHeader}>
                Log In
              </Link>
              <Link to="/register" className={styles.registerBtnHeader}>
                Registration
              </Link>
            </div>
          )}

          {/* desktop only: login olmuş */}
          {isLoggedIn && (
            <div className={`${styles.authButtons} ${styles.desktopOnly}`}>
              <button className={styles.logoutBtnHeader} onClick={() => setShowLogout(true)}>Log out</button>
            </div>
          )}

          {/* desktop: login olmuş user */}
          {isLoggedIn && (
            <Link to="/profile" className={styles.desktopUserBtn}>
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className={styles.avatarSmall}
                />
              ) : (
                <div className={styles.userIconBtn}>
                  <svg width={20} height={20} className={styles.userIcon}>
                    <use href="/sprite/sprite.svg#icon-user" />
                  </svg>
                </div>
              )}
              <span className={styles.userName}>{user?.name}</span>
            </Link>
          )}

          {/* mobile + tablet: login olmuş user ikonu */}
          {isLoggedIn && (
            <Link to="/profile" className={styles.mobileUserBtn}>
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className={styles.mobileUserAvatar}
                />
              ) : (
                <svg width={20} height={20} className={styles.mobileUserIcon}>
                  <use href="/sprite/sprite.svg#icon-user" />
                </svg>
              )}
            </Link>
          )}

          {/* burger - mobile + tablet */}
          <button className={styles.burgerBtn} onClick={toggleMenu}>
            <svg width={32} height={32}>
              <use
                href={
                  isHome
                    ? "/sprite/sprite.svg#icon-burger-white"
                    : "/sprite/sprite.svg#icon-burger"
                }
              />
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className={styles.overlay} onClick={closeMenu}>
          <div
            className={`${styles.menu} ${!isLoggedIn ? styles.menuLoggedOut : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeBtn} onClick={closeMenu}>
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>

            <nav className={styles.nav}>
              <NavLink
                to="/news"
                className={({isActive}) => getNavClass(isActive)}
                onClick={closeMenu}
              >
                News
              </NavLink>
              <NavLink
                to="/notices"
                className={({isActive}) => getNavClass(isActive)}
                onClick={closeMenu}
              >
                Find pet
              </NavLink>
              <NavLink
                to="/friends"
                className={({isActive}) => getNavClass(isActive)}
                onClick={closeMenu}
              >
                Our friends
              </NavLink>
            </nav>

            {isLoggedIn ? (
              <div className={styles.userNav}>
                <Link
                  to="/profile"
                  className={styles.userBar}
                  onClick={closeMenu}
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className={styles.avatar}
                    />
                  ) : (
                    <div className={styles.userIconBtn}>
                      <svg width={20} height={20} className={styles.userIcon}>
                        <use href="/sprite/sprite.svg#icon-user" />
                      </svg>
                    </div>
                  )}
                  <span>{user?.name}</span>
                </Link>
                <button className={styles.logoutBtn} onClick={() => { closeMenu(); setShowLogout(true); }}>Log out</button>
              </div>
            ) : (
              <div className={styles.authNav}>
                <Link
                  to="/login"
                  className={styles.loginBtn}
                  onClick={closeMenu}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className={styles.registerBtn}
                  onClick={closeMenu}
                >
                  Registration
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      {showLogout && <ModalApproveAction onClose={() => setShowLogout(false)} />}
    </header>
  );
};

export default Header;
