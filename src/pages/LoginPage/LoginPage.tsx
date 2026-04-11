import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { loginUser, selectAuthError, selectAuthLoading } from '../../redux/slices/authSlice';
import styles from './LoginPage.module.css';

interface LoginFormData {
  email: string;
  password: string;
}

const schema = yup.object({
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
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    mode: 'onTouched',
  });

  useEffect(() => {
    if (authError) {
      toast.error(authError);
    }
  }, [authError]);

  const onSubmit = async (data: LoginFormData) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      navigate('/profile');
    }
  };

  return (
    <main className={`${styles.main} container`}>
      <div className={styles.petBlock}>
        <img
          src="/images/login-rectangle@1x.png"
          srcSet="/images/login-rectangle@2x.png 2x"
          alt=""
          className={styles.rectangle}
        />
        <img
          src="/images/login-pet@1x.png"
          srcSet="/images/login-pet@2x.png 2x"
          alt="dog"
          className={styles.pet}
        />
      </div>

      <div className={styles.formBlock}>
        <h1 className={styles.title}>Log in</h1>
        <p className={styles.subtitle}>
          Welcome! Please enter your credentials to login to the platform.
        </p>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className={styles.switchText}>
          Don't have an account?{' '}
          <Link to="/register" className={styles.switchLink}>
            Register
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
