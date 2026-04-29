import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ModalCongrats.module.css";

interface ModalCongratsProps {
  onClose: () => void;
}

const ModalCongrats = ({ onClose }: ModalCongratsProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleGoToProfile = () => {
    navigate("/profile");
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          <svg width={18} height={18} viewBox="0 0 18 18" fill="none">
            <path
              d="M14 4L4 14M4 4l10 10"
              stroke="#262626"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className={styles.imageWrap}>
          <img
            src="/images/cat@1x.png"
            srcSet="/images/cat@1x.png 1x, /images/cat@2x.png 2x"
            alt="Congrats cat"
            className={styles.catImg}
          />
        </div>

        <h2 className={styles.title}>Congrats</h2>

        <p className={styles.text}>
          The first fluff in the favorites! May your friendship be the happiest
          and filled with fun.
        </p>

        <button className={styles.profileBtn} onClick={handleGoToProfile}>
          Go to profile
        </button>
      </div>
    </div>
  );
};

export default ModalCongrats;
