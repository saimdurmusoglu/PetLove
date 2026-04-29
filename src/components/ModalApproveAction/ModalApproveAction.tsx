import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/redux";
import { signOut, logout } from "../../redux/slices/authSlice";
import css from "./ModalApproveAction.module.css";

interface Props {
  onClose: () => void;
}

export default function ModalApproveAction({ onClose }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleYes = async () => {
    await dispatch(signOut());
    dispatch(logout());
    onClose();
    navigate("/");
  };

  return (
    <div className={css.overlay} onClick={onClose}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <button className={css.closeBtn} onClick={onClose} aria-label="Close">
          <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
            <path
              d="M15 5L5 15M5 5l10 10"
              stroke="#262626"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className={css.imageWrap}>
          <img
            src="/PetLove/images/cat@1x.png"
            srcSet="/PetLove/images/cat@1x.png 1x, /images/cat@2x.png 2x"
            alt="Already leaving?"
            className={css.catImg}
          />
        </div>

        <h2 className={css.title}>Already leaving?</h2>

        <div className={css.btnRow}>
          <button className={css.yesBtn} onClick={handleYes}>
            Yes
          </button>
          <button className={css.cancelBtn} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
