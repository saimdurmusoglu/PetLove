import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import { signOut, logout } from '../../redux/slices/authSlice';
import css from './ModalApproveAction.module.css';

interface Props {
  onClose: () => void;
}

export default function ModalApproveAction({ onClose }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleYes = async () => {
    await dispatch(signOut());
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className={css.overlay} onClick={onClose}>
      <div className={css.modal} onClick={e => e.stopPropagation()}>
        <button className={css.closeBtn} onClick={onClose} aria-label="Close">
          <svg width={16} height={16}>
            <use href="/sprite/sprite.svg#icon-cross-small" />
          </svg>
        </button>

        <svg width={60} height={60} className={css.icon}>
          <use href="/sprite/sprite.svg#icon-pawprint" />
        </svg>

        <h2 className={css.title}>Already leaving?</h2>
        <p className={css.text}>We hope to see you again soon!</p>

        <div className={css.btnRow}>
          <button className={css.yesBtn} onClick={handleYes}>Yes</button>
          <button className={css.cancelBtn} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
