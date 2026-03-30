import { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import styles from './Header.module.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, user } = useAppSelector(state => state.auth);
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const getNavClass = (isActive: boolean) => {
    if (isHome) {
      return isActive
        ? `${styles.navLinkHome} ${styles.active}`
        : styles.navLinkHome;
    }
    return isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;
  };

  return (
    <header className={`${styles.header} ${isHome ? styles.headerHome : ''}`}>
      <div className={`${styles.container} ${isHome ? styles.containerHome : ''}`}>
        <Link to="/" className={styles.logo}>
          <img
            src={isHome ? '/images/logo-mobile-white.svg' : '/images/logo-mobile.svg'}
            alt="logo"
          />
        </Link>

        <button className={styles.burgerBtn} onClick={toggleMenu}>
          <svg width={28} height={28} className={isHome ? styles.iconWhite : ''}>
            <use href="/sprite/sprite.svg#icon-burger" />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className={styles.overlay} onClick={closeMenu}>
          <div
            className={`${styles.menu} ${isHome ? styles.menuHome : ''}`}
            onClick={e => e.stopPropagation()}
          >
            <button className={styles.closeBtn} onClick={closeMenu}>
              <svg
                width={32}
                height={32}
                className={isHome ? styles.iconWhite : ''}
              >
                <use href="/sprite/sprite.svg#icon-cross-small" />
              </svg>
            </button>

            <nav className={styles.nav}>
              <NavLink
                to="/news"
                className={({ isActive }) => getNavClass(isActive)}
                onClick={closeMenu}
              >
                News
              </NavLink>
              <NavLink
                to="/notices"
                className={({ isActive }) => getNavClass(isActive)}
                onClick={closeMenu}
              >
                Find pet
              </NavLink>
              <NavLink
                to="/friends"
                className={({ isActive }) => getNavClass(isActive)}
                onClick={closeMenu}
              >
                Our friends
              </NavLink>
            </nav>

            {isLoggedIn ? (
              <div className={styles.userNav}>
                <Link to="/profile" className={styles.userBar} onClick={closeMenu}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt="avatar" className={styles.avatar} />
                  ) : (
                    <svg width={40} height={40} className={styles.avatar}>
                      <use href="/sprite/sprite.svg#icon-user" />
                    </svg>
                  )}
                  <span>{user?.name}</span>
                </Link>
                <button className={styles.logoutBtn}>Log out</button>
              </div>
            ) : (
              <div className={styles.authNav}>
                <Link to="/login" className={styles.loginBtn} onClick={closeMenu}>
                  Log In
                </Link>
                <Link to="/register" className={styles.registerBtn} onClick={closeMenu}>
                  Registration
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;