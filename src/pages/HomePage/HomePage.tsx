import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Take good <span className={styles.accent}>care</span> of your small pets
          </h1>
          <p className={styles.desc}>
            Choosing a pet for your home is a choice that is meant to enrich your life with immeasurable joy and tenderness.
          </p>
        </div>
        <div className={styles.heroImageWrap}>
          <picture>
            <source srcSet="/images/hero-image@2x.jpg 2x, /images/hero-image@1x.jpg 1x" />
            <img
              src="/images/hero-image@1x.jpg"
              alt="Woman with dog"
              className={styles.heroImage}
            />
          </picture>
        </div>
      </section>
    </main>
  );
};

export default HomePage;