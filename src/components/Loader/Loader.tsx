import styles from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={styles.loader}>
      <picture>
        <source
          media="(min-width: 1280px)"
          srcSet="/images/main-image-desktop@1x.png 1x, /images/main-image-desktop@2x.png 2x"
        />
        <source
          media="(min-width: 768px)"
          srcSet="/images/main-image-tablet@1x.png 1x, /images/main-image-tablet@2x.png 2x"
        />
        <img
          src="/images/main-image-mobile@1x.png"
          srcSet="/images/main-image-mobile@2x.png 2x"
          alt=""
          className={styles.bg}
        />
      </picture>
      <div className={styles.center}>
        <img
          src="/images/logo-mobile-white&yellow.svg"
          alt="PetLove"
          className={`${styles.logo} ${styles.visible}`}
        />
      </div>
    </div>
  );
};

export default Loader;
