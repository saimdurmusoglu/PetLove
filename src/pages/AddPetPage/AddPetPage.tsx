import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hooks/redux";
import { addPet } from "../../redux/slices/authSlice";
import { getNotices } from "../../services/noticesService";
import type { Notice } from "../../types/notices";
import styles from "./AddPetPage.module.css";

interface AddPetFormData {
  imgURL: string;
  title: string;
  name: string;
  birthday: string;
  species: string;
  sex: "female" | "male" | "unknown";
}

const schema = yup.object({
  imgURL: yup
    .string()
    .required("Photo URL is required")
    .matches(
      /^https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp)$/i,
      "Invalid image URL",
    ),
  title: yup.string().required("Title is required"),
  name: yup.string().required("Name is required"),
  birthday: yup
    .string()
    .required("Birthday is required")
    .matches(/^\d{2}\.\d{2}\.\d{4}$/, "Format: DD.MM.YYYY"),
  species: yup.string().required("Species is required"),
  sex: yup
    .string()
    .oneOf(["female", "male", "unknown"] as const)
    .required("Sex is required"),
});

type FormData = yup.InferType<typeof schema>;

const SPECIES = [
  "Dog",
  "Cat",
  "Monkey",
  "Bird",
  "Snake",
  "Turtle",
  "Lizard",
  "Frog",
  "Fish",
  "Ants",
  "Bees",
  "Butterfly",
  "Spider",
  "Scorpion",
];

export default function AddPetPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSpeciesOpen, setIsSpeciesOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Notice[]>([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  const imgURLValue = watch("imgURL");
  useEffect(() => {
    setPreviewUrl(imgURLValue || "");
  }, [imgURLValue]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("title", value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 2) {
      setSuggestions([]);
      setIsSuggestionsOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await getNotices({ keyword: value, limit: 5 });
        setSuggestions(res.results);
        setIsSuggestionsOpen(res.results.length > 0);
      } catch {
        setSuggestions([]);
        setIsSuggestionsOpen(false);
      }
    }, 400);
  };

  const handleSelectSuggestion = (notice: Notice) => {
    const [year, month, day] = notice.birthday.split("-");
    setValue("title", notice.title);
    setValue("name", notice.name);
    setValue("imgURL", notice.imgURL);
    setValue("birthday", `${day}.${month}.${year}`);
    setValue(
      "species",
      notice.species.charAt(0).toUpperCase() + notice.species.slice(1),
    );
    setValue("sex", notice.sex as "female" | "male" | "unknown");
    setSuggestions([]);
    setIsSuggestionsOpen(false);
  };

  const onSubmit = async (data: AddPetFormData) => {
    const [day, month, year] = data.birthday.split(".");
    const formattedBirthday = `${year}-${month}-${day}`;
    const result = await dispatch(
      addPet({
        name: data.name,
        title: data.title,
        imgURL: data.imgURL,
        species: data.species.toLowerCase(),
        birthday: formattedBirthday,
        sex: data.sex,
      }),
    );
    if (addPet.fulfilled.match(result)) {
      navigate("/profile");
    } else {
      toast.error("Failed to add pet");
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.heroWrap}>
        <img
          src="/PetLove/images/login-rectangle@1x.png"
          srcSet="/PetLove/images/login-rectangle@2x.png 2x"
          alt=""
          className={styles.rectangle}
        />
        <picture>
          <source
            media="(min-width: 1280px)"
            srcSet="/PetLove/images/add-pet-desktop@1x.png 1x, /images/add-pet-desktop@2x.png 2x"
          />
          <source
            media="(min-width: 768px)"
            srcSet="/PetLove/images/add-pet-tablet@1x.png 1x, /images/add-pet-tablet@2x.png 2x"
          />
          <img
            src="/PetLove/images/add-pet-mobile@1x.png"
            srcSet="/PetLove/images/add-pet-mobile@1x.png 1x, /images/add-pet-mobile@2x.png 2x"
            alt=""
            className={styles.heroImg}
          />
        </picture>
      </div>

      <div className={styles.formWrap}>
        <h1 className={styles.title}>
          Add my pet / <span className={styles.titleSub}>Personal details</span>
        </h1>

        <div className={styles.sexAndPreviewRow}>
          <div className={styles.sexRow}>
            {[
              {
                value: "female",
                bgClass: styles.sexBtnFemale,
                activeClass: styles.sexBtnFemaleActive,
                iconClass: styles.sexIconFemale,
                icon: "icon-female",
              },
              {
                value: "male",
                bgClass: styles.sexBtnMale,
                activeClass: styles.sexBtnMaleActive,
                iconClass: styles.sexIconMale,
                icon: "icon-male",
              },
              {
                value: "unknown",
                bgClass: styles.sexBtnUnknown,
                activeClass: styles.sexBtnUnknownActive,
                iconClass: styles.sexIconUnknown,
                icon: "icon-other",
              },
            ].map(({ value, bgClass, activeClass, iconClass, icon }) => {
              // eslint-disable-next-line react-hooks/incompatible-library
              const isActive = watch("sex") === value;
              return (
                <label
                  key={value}
                  className={`${styles.sexBtn} ${bgClass} ${isActive ? activeClass : ""}`}
                >
                  <input
                    type="radio"
                    {...register("sex")}
                    value={value}
                    className={styles.sexInput}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className={isActive ? styles.sexIconActive : iconClass}
                  >
                    <use
                      href={`/sprite/sprite.svg#${isActive ? `${icon}-white` : icon}`}
                    />
                  </svg>
                </label>
              );
            })}
          </div>

          <div className={styles.avatarPreview}>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="preview"
                className={styles.previewImg}
              />
            ) : (
              <div className={styles.previewPlaceholder}>
                <svg
                  width="25.5"
                  height="23.38"
                  className={styles.previewIcon}
                  aria-hidden="true"
                >
                  <use href="/PetLove/sprite/sprite.svg#icon-paw" />
                </svg>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.urlRow}>
            <div className={styles.urlInputWrap}>
              <input
                {...register("imgURL")}
                placeholder="Enter URL"
                className={`${styles.urlInput} ${errors.imgURL ? styles.inputError : ""}`}
              />
              {errors.imgURL && (
                <span className={styles.errorMsg}>{errors.imgURL.message}</span>
              )}
            </div>
            <button type="button" className={styles.uploadBtn}>
              Upload photo
              <svg className={styles.uploadIcon}>
                <use href="/PetLove/sprite/sprite.svg#icon-upload" />
              </svg>
            </button>
          </div>

          <div className={styles.fieldWrap}>
            <input
              {...register("title")}
              placeholder="Title"
              className={`${styles.input} ${errors.title ? styles.inputError : ""}`}
              onChange={handleTitleChange}
              autoComplete="off"
            />
            {isSuggestionsOpen && (
              <div className={styles.suggestionsMenu}>
                {suggestions.map((notice) => (
                  <button
                    key={notice._id}
                    type="button"
                    className={styles.suggestionItem}
                    onClick={() => handleSelectSuggestion(notice)}
                  >
                    {notice.imgURL && (
                      <img
                        src={notice.imgURL}
                        alt={notice.name}
                        className={styles.suggestionImg}
                      />
                    )}
                    <span className={styles.suggestionText}>
                      <span className={styles.suggestionTitle}>
                        {notice.title}
                      </span>
                      <span className={styles.suggestionSub}>
                        {notice.name} · {notice.species}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
            {errors.title && (
              <span className={styles.errorMsg}>{errors.title.message}</span>
            )}
          </div>

          <div className={styles.fieldWrap}>
            <input
              {...register("name")}
              placeholder="Pet's Name"
              className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
            />
            {errors.name && (
              <span className={styles.errorMsg}>{errors.name.message}</span>
            )}
          </div>

          <div className={styles.bottomRow}>
            <div className={styles.fieldWrap}>
              <input
                {...register("birthday")}
                type="text"
                placeholder="00.00.0000"
                className={`${styles.dateInput} ${errors.birthday ? styles.inputError : ""}`}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length >= 3)
                    value = value.slice(0, 2) + "." + value.slice(2);
                  if (value.length >= 6)
                    value = value.slice(0, 5) + "." + value.slice(5);
                  value = value.slice(0, 10);
                  e.target.value = value;
                  register("birthday").onChange(e);
                }}
              />
              <svg
                width={18}
                height={18}
                className={styles.calendarIcon}
                aria-hidden="true"
              >
                <use href="/PetLove/sprite/sprite.svg#icon-calendar" />
              </svg>
              {errors.birthday && (
                <span className={styles.errorMsg}>
                  {errors.birthday.message}
                </span>
              )}
            </div>

            <div className={styles.selectWrapper}>
              <button
                type="button"
                className={`${styles.selectTrigger} ${errors.species ? styles.inputError : ""} ${watch("species") ? styles.selectTriggerFilled : ""}`}
                onClick={() => setIsSpeciesOpen((prev) => !prev)}
              >
                <span>{watch("species") || "Type of pet"}</span>
                <svg
                  width={16}
                  height={16}
                  className={
                    isSpeciesOpen ? styles.chevronOpen : styles.chevron
                  }
                >
                  <use href="/PetLove/sprite/sprite.svg#icon-chevron-down" />
                </svg>
              </button>
              {isSpeciesOpen && (
                <div className={styles.dropdownMenu}>
                  {SPECIES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={styles.dropdownItem}
                      onClick={() => {
                        setValue("species", s);
                        setIsSpeciesOpen(false);
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {errors.species && (
                <span className={styles.errorMsg}>
                  {errors.species.message}
                </span>
              )}
            </div>
          </div>

          <div className={styles.btnRow}>
            <button
              type="button"
              className={styles.backBtn}
              onClick={() => navigate("/profile")}
            >
              Back
            </button>
            <button type="submit" className={styles.submitBtn}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
