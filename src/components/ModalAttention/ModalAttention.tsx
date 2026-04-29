import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ModalAttention.module.css";

interface ModalAttentionProps {
  onClose: () => void;
}

const ModalAttention = ({ onClose }: ModalAttentionProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleLogin = () => {
    navigate("/login");
    onClose();
  };

  const handleRegister = () => {
    navigate("/register");
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
          <svg width={14} height={14}>
            <use href="/PetLove/sprite/sprite.svg#icon-cross-small" />
          </svg>
        </button>

        <div className={styles.iconWrap}>
          <span className={styles.emoji}>🐶</span>
        </div>

        <h2 className={styles.title}>Attention</h2>
        <p className={styles.text}>
          We would like to remind you that certain functionality is available
          only to authorized users. If you have an account, please log in with
          your credentials. If you do not already have an account, you must
          register to access these features.
        </p>

        <div className={styles.buttons}>
          <button className={styles.loginBtn} onClick={handleLogin}>
            Log In
          </button>
          <button className={styles.registerBtn} onClick={handleRegister}>
            Registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAttention;
