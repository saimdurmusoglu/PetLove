import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ModalAttention.module.css';

interface ModalAttentionProps {
  onClose: () => void;
}

const ModalAttention = ({ onClose }: ModalAttentionProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  const handleRegister = () => {
    onClose();
    navigate('/register');
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg width={16} height={16}>
            <use href="/sprite/sprite.svg#icon-cross" />
          </svg>
        </button>

        <svg width={48} height={48} className={styles.icon}>
          <use href="/sprite/sprite.svg#icon-heart" />
        </svg>

        <h2 className={styles.title}>Attention</h2>
        <p className={styles.text}>
          We would like to note that certain functionality is available only to
          authorized users. If you want to get the most out of our site, please
          register or log in.
        </p>

        <div className={styles.buttons}>
          <button className={styles.loginBtn} onClick={handleLogin}>
            Login
          </button>
          <button className={styles.registerBtn} onClick={handleRegister}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAttention;
