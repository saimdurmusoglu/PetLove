import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { updateUser, selectUser } from "../../redux/slices/authSlice";
import css from "./ModalEditUser.module.css";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .required("Email is required")
    .matches(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, "Invalid email"),
  avatar: yup
    .string()
    .matches(
      /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp))?$/i,
      "Invalid image URL",
    )
    .optional(),
  phone: yup
    .string()
    .matches(/^(\+38\d{10})?$/, "Format: +38XXXXXXXXXX")
    .optional(),
});

interface Props {
  onClose: () => void;
}

export default function ModalEditUser({ onClose }: Props) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  type FormData = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      avatar: user?.avatar || "",
    },
  });

  const avatarValue = watch("avatar");

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        avatar: data.avatar || undefined,
        phone: data.phone || undefined,
      };
      await dispatch(updateUser(payload)).unwrap();
      onClose();
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Update failed");
    }
  };

  return (
    <div className={css.overlay} onClick={onClose}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <div className={css.header}>
          <h2 className={css.title}>Edit information</h2>
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
        </div>

        <div className={css.avatarWrap}>
          {avatarValue ? (
            <img src={avatarValue} alt="avatar" className={css.avatarPreview} />
          ) : (
            <div className={css.avatarPlaceholder}>
              <svg className={css.avatarIcon} viewBox="0 0 20 20">
                <use href="/sprite/sprite.svg#icon-user" />
              </svg>
            </div>
          )}
        </div>

        <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={css.avatarRow}>
            <div className={css.fieldWrap}>
              <input
                className={`${css.input} ${css.inputUrl} ${errors.avatar ? css.inputError : ""}`}
                placeholder="https://img.example.com/photo.jpg"
                {...register("avatar")}
              />
              {errors.avatar && (
                <span className={css.errorMsg}>{errors.avatar.message}</span>
              )}
            </div>
            <button type="button" className={css.uploadBtn}>
              Upload photo
              <svg width={16} height={16}>
                <use href="/sprite/sprite.svg#icon-upload" />
              </svg>
            </button>
          </div>

          <div className={css.fieldWrap}>
            <input
              className={`${css.input} ${errors.name ? css.inputError : ""}`}
              placeholder="Anna"
              {...register("name")}
            />
            {errors.name && (
              <span className={css.errorMsg}>{errors.name.message}</span>
            )}
          </div>

          <div className={css.fieldWrap}>
            <input
              className={`${css.input} ${errors.email ? css.inputError : ""}`}
              placeholder="anna00@gmail.com"
              {...register("email")}
            />
            {errors.email && (
              <span className={css.errorMsg}>{errors.email.message}</span>
            )}
          </div>

          <div className={css.fieldWrap}>
            <input
              className={`${css.input} ${errors.phone ? css.inputError : ""}`}
              placeholder="+380 00 000 00 00"
              {...register("phone")}
            />
            {errors.phone && (
              <span className={css.errorMsg}>{errors.phone.message}</span>
            )}
          </div>

          <button type="submit" className={css.submitBtn}>
            Go to profile
          </button>
        </form>
      </div>
    </div>
  );
}
