import styles from "./HomePage.module.css";

const HomePage = () => {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Take good <span className={styles.accent}>care</span> of your small
            pets
          </h1>
          <p className={styles.desc}>
            Choosing a pet for your home is a choice that is meant to enrich
            your life with immeasurable joy and tenderness.
          </p>
        </div>
        <div className={styles.heroImageWrap}>
          <picture>
            <source
              media="(min-width: 1280px)"
              srcSet="/images/hero-image-desktop@1x.jpg 1x, /images/hero-image-desktop@2x.jpg 2x"
            />
            <source
              media="(min-width: 768px)"
              srcSet="/images/hero-image-tablet@1x.jpg 1x, /images/hero-image-tablet@2x.jpg 2x"
            />
            <img
              src="/images/hero-image-mobile@1x.jpg"
              srcSet="/images/hero-image-mobile@2x.jpg 2x"
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
