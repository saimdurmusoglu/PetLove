import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { registerUser, selectAuthError, selectAuthLoading } from '../../redux/slices/authSlice';
import styles from './RegisterPage.module.css';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const schema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email is required')
    .matches(
      /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
      'Enter a valid Email'
    ),
  password: yup
    .string()
    .required('Password is required')
    .min(7, 'Password must be at least 7 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
    mode: 'onTouched',
  });

  useEffect(() => {
    if (authError) {
      toast.error(authError);
    }
  }, [authError]);

  const onSubmit = async (data: RegisterFormData) => {
    const result = await dispatch(
      registerUser({ name: data.name, email: data.email, password: data.password })
    );
    if (registerUser.fulfilled.match(result)) {
      navigate('/profile');
    }
  };

  return (
    <main className={`${styles.main} container`}>
      <div className={styles.petBlock}>
        <img
          src="/images/register-rectangl@1x.png"
          srcSet="/images/register-rectangele@2x.png 2x"
          alt=""
          className={styles.rectangle}
        />
        <img
          src="/images/register-pet@1x.png"
          srcSet="/images/register-pet@2x.png 2x"
          alt="cat"
          className={styles.pet}
        />
      </div>

      <div className={styles.formBlock}>
        <h1 className={styles.title}>Register</h1>
        <p className={styles.subtitle}>
          Thank you for your interest in our platform.
        </p>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.fieldWrap}>
            <input
              {...register('name')}
              type="text"
              placeholder="Name"
              className={`${styles.input} ${errors.name ? styles.inputError : ''} ${!errors.name && touchedFields.name ? styles.inputSuccess : ''}`}
            />
            {errors.name && (
              <>
                <span className={styles.errorMsg}>{errors.name.message}</span>
                <svg width={18} height={18} className={styles.iconError}>
                  <use href="/sprite/sprite.svg#icon-cross" />
                </svg>
              </>
            )}
            {!errors.name && touchedFields.name && (
              <svg width={18} height={18} className={styles.iconSuccess}>
                <use href="/sprite/sprite.svg#icon-check" />
              </svg>
            )}
          </div>

          <div className={styles.fieldWrap}>
            <input
              {...register('email')}
              type="email"
              placeholder="Email"
              className={`${styles.input} ${errors.email ? styles.inputError : ''} ${!errors.email && touchedFields.email ? styles.inputSuccess : ''}`}
            />
            {errors.email && (
              <>
                <span className={styles.errorMsg}>{errors.email.message}</span>
                <svg width={18} height={18} className={styles.iconError}>
                  <use href="/sprite/sprite.svg#icon-cross" />
                </svg>
              </>
            )}
            {!errors.email && touchedFields.email && (
              <svg width={18} height={18} className={styles.iconSuccess}>
                <use href="/sprite/sprite.svg#icon-check" />
              </svg>
            )}
          </div>

          <div className={styles.fieldWrap}>
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className={`${styles.input} ${errors.password ? styles.inputError : ''} ${!errors.password && touchedFields.password ? styles.inputSuccess : ''}`}
            />
            {!errors.password && touchedFields.password && (
              <svg width={18} height={18} className={styles.iconSuccess}>
                <use href="/sprite/sprite.svg#icon-check" />
              </svg>
            )}
            <svg
              width={18}
              height={18}
              className={`${styles.iconEye} ${errors.password ? styles.iconEyeShifted : ''}`}
              onClick={() => setShowPassword(prev => !prev)}
            >
              <use href={`/sprite/sprite.svg#${showPassword ? 'icon-eye' : 'icon-eye-off'}`} />
            </svg>
            {errors.password && (
              <span className={styles.errorMsg}>{errors.password.message}</span>
            )}
          </div>

          <div className={styles.fieldWrap}>
            <input
              {...register('confirmPassword')}
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''} ${!errors.confirmPassword && touchedFields.confirmPassword ? styles.inputSuccess : ''}`}
            />
            {!errors.confirmPassword && touchedFields.confirmPassword && (
              <svg width={18} height={18} className={styles.iconSuccess}>
                <use href="/sprite/sprite.svg#icon-check" />
              </svg>
            )}
            <svg
              width={18}
              height={18}
              className={`${styles.iconEye} ${errors.confirmPassword ? styles.iconEyeShifted : ''}`}
              onClick={() => setShowConfirm(prev => !prev)}
            >
              <use href={`/sprite/sprite.svg#${showConfirm ? 'icon-eye' : 'icon-eye-off'}`} />
            </svg>
            {errors.confirmPassword && (
              <span className={styles.errorMsg}>{errors.confirmPassword.message}</span>
            )}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className={styles.switchText}>
          Already have an account?{' '}
          <Link to="/login" className={styles.switchLink}>
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;
