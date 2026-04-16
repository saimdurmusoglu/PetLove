import styles from './Loader.module.css';

const Loader = () => {
  return (
    <div className={styles.loader}>
      <img
        src="/images/main-image-mobile@1x.png"
        srcSet="/images/main-image-mobile@2x.png 2x"
        alt=""
        className={styles.bg}
      />
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
