import { useNavigate } from "react-router-dom";
import css from "./NotFoundPage.module.css";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className={css.main}>
      <div className={css.card}>
        <div className={css.titleRow}>
          <span className={css.number}>4</span>
          <div className={css.imageWrap}>
            <img
              src="/images/404-image@1x.png"
              srcSet="/images/404-image@1x.png 1x, /images/404-image@2x.png 2x"
              alt="404 cat"
              className={css.catImg}
            />
          </div>
          <span className={css.number}>4</span>
        </div>

        <p className={css.text}>Ooops! This page not found :(</p>

        <button className={css.homeBtn} onClick={() => navigate("/")}>
          To home page
        </button>
      </div>
    </main>
  );
}
