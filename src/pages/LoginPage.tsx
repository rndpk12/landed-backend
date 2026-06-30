import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, type FieldError, type UseFormRegisterReturn } from 'react-hook-form';
import { Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../services/authApi';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(8, 'Password must be at least 8 characters.')
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(8, 'Password must be at least 8 characters.')
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;
type AuthMode = 'login' | 'register';

type FieldProps = {
  label: string;
  type: string;
  placeholder: string;
  autoComplete: string;
  error?: FieldError;
  registration: UseFormRegisterReturn;
  compact?: boolean;
};

const partners = ['LinkedIn', 'Indeed', 'Workday', 'Greenhouse', 'Instahyre', 'Lever', 'Ashby', 'Naukri'];

const AuthField = ({ label, type, placeholder, autoComplete, error, registration, compact }: FieldProps) => {
  const inputId = 'auth-' + registration.name;

  return (
    <div className={`flex flex-col ${compact ? 'gap-1' : 'gap-[clamp(4px,0.7vh,8px)]'}`}>
      <label className={`${compact ? 'text-[10px]' : 'text-[11px]'} font-black uppercase text-slate-950`} htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className={`${compact ? 'h-[38px] px-3 text-xs' : 'h-[clamp(42px,5.8vh,48px)] px-4 text-sm'} w-full rounded-none border-2 bg-white font-semibold text-slate-950 outline-none transition placeholder:text-slate-300 focus:border-slate-950 ${
          error ? 'border-rose-500' : 'border-slate-950/15'
        }`}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...registration}
      />
      {error ? <p className={`${compact ? 'text-[10px]' : 'text-xs'} font-medium text-rose-600`}>{error.message}</p> : null}
    </div>
  );
};

export const LoginPage = () => {
  const { login, register: createAccount, signInWithGoogle, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/dashboard';

  const [mode, setMode] = useState<AuthMode>(
    searchParams.get('mode') === 'register' ? 'register' : 'login'
  );
  const [authError, setAuthError] = useState<string | null>(null);
  const [googleSignInAvailable, setGoogleSignInAvailable] = useState(false);

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' }
  });

  useEffect(() => {
    setMode(searchParams.get('mode') === 'register' ? 'register' : 'login');
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;

    authApi.isGoogleSignInConfigured().then((isConfigured) => {
      if (isMounted) {
        setGoogleSignInAvailable(isConfigured);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  const onLoginSubmit = async (values: LoginValues) => {
    setAuthError(null);
    try {
      await login(values);
      navigate(from, { replace: true });
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Could not sign in. Please try again.');
    }
  };

  const onRegisterSubmit = async (values: RegisterValues) => {
    setAuthError(null);
    try {
      await createAccount(values);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Could not create your account. Please try again.');
    }
  };

  const onGoogleSignIn = async (credentialResponse: CredentialResponse) => {
    setAuthError(null);
    if (!credentialResponse.credential) {
      setAuthError('Google did not return a sign-in credential.');
      return;
    }

    try {
      await signInWithGoogle(credentialResponse.credential);
      navigate(from, { replace: true });
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Could not sign in with Google. Please try again.');
    }
  };

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setSearchParams(next === 'register' ? { mode: 'register' } : {});
    setAuthError(null);
    loginForm.clearErrors();
    registerForm.clearErrors();
  };

  const isRegister = mode === 'register';
  const AuthDivider = () => (
    <div className="flex items-center gap-3 text-center font-mono text-[10px] font-bold uppercase text-slate-400">
      <span className="h-px flex-1 bg-slate-200" />
      or
      <span className="h-px flex-1 bg-slate-200" />
    </div>
  );
  const GoogleSignInButton = () => (
    <div className={loading ? 'pointer-events-none opacity-70' : undefined}>
      <GoogleLogin
        onSuccess={onGoogleSignIn}
        onError={() => setAuthError('Google login failed. Please try again.')}
        shape="rectangular"
        size="large"
        text="signin_with"
        theme="outline"
        width="360"
      />
    </div>
  );

  return (
    <main className="h-screen overflow-hidden bg-[#010b19] p-1 font-sans text-white">
      <section className="grid h-full w-full gap-2 overflow-hidden bg-[#010b19] lg:grid-cols-[0.98fr_1fr]">
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[3px] bg-white text-slate-950">
          <div className="flex h-[clamp(58px,8vh,72px)] shrink-0 items-center justify-between border-b-[10px] border-[#010b19] px-6 sm:px-8">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="bg-transparent text-2xl font-black text-slate-950"
            >
              landed.
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-[clamp(18px,3vh,34px)] text-center sm:px-10 lg:items-start lg:pl-[18%] lg:pr-10">
            <div className="mb-[clamp(14px,2.5vh,28px)] flex gap-2" aria-hidden="true">
              <span className="h-3 w-3 bg-slate-950" />
              <span className="h-3 w-3 bg-slate-950" />
              <span className="h-3 w-3 bg-slate-950" />
            </div>

            <div className="w-full max-w-[430px] lg:max-w-[410px]">
              <p className="mb-[clamp(6px,1vh,12px)] font-mono text-xs font-bold uppercase text-[#010b19]">
                {isRegister ? 'Start free' : 'Welcome back'}
              </p>
              <h1 className="whitespace-nowrap text-[clamp(22px,2.85vw,40px)] font-black uppercase leading-none text-slate-950">
                {isRegister ? 'Create your account' : 'Sign in to Landed'}
              </h1>

              <p className="mx-auto mt-[clamp(12px,2.1vh,24px)] max-w-[330px] text-sm font-medium leading-5 text-slate-700 lg:mx-0">
                {isRegister
                  ? 'Build one calm workspace for applications, resumes, interview notes, and next moves.'
                  : 'Track every role, resume version, interview loop, and follow-up from one focused dashboard.'}
              </p>

              {authError ? (
                <div className="mx-auto mt-4 max-w-[360px] border border-rose-200 bg-rose-50 px-4 py-3 text-left text-sm font-semibold text-rose-700">
                  {authError}
                </div>
              ) : null}

              {isRegister ? (
                <form
                  className="mx-auto mt-[clamp(12px,2vh,22px)] flex w-full max-w-[360px] flex-col gap-[clamp(7px,1.1vh,11px)] text-left"
                  onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                  noValidate
                >
                  <AuthField
                    label="Name"
                    type="text"
                    placeholder="Aarav Sharma"
                    autoComplete="name"
                    error={registerForm.formState.errors.name}
                    registration={registerForm.register('name')}
                    compact
                  />
                  <AuthField
                    label="Email"
                    type="email"
                    placeholder="you@email.com"
                    autoComplete="email"
                    error={registerForm.formState.errors.email}
                    registration={registerForm.register('email')}
                    compact
                  />
                  <AuthField
                    label="Password"
                    type="password"
                    placeholder="Password"
                    autoComplete="new-password"
                    error={registerForm.formState.errors.password}
                    registration={registerForm.register('password')}
                    compact
                  />
                  <button
                    className="mt-1 inline-flex h-[44px] items-center justify-center gap-3 bg-[#010b19] px-7 font-mono text-sm font-bold uppercase text-white transition hover:bg-[#16385a] disabled:cursor-not-allowed disabled:opacity-70"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Creating account...' : 'Create account'}
                    {!loading ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
                  </button>
                  {googleSignInAvailable ? (
                    <>
                      <AuthDivider />
                      <GoogleSignInButton />
                    </>
                  ) : null}
                </form>
              ) : (
                <form
                  className="mx-auto mt-[clamp(16px,2.6vh,30px)] flex w-full max-w-[360px] flex-col gap-[clamp(10px,1.6vh,16px)] text-left"
                  onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                  noValidate
                >
                  <AuthField
                    label="Email"
                    type="email"
                    placeholder="you@email.com"
                    autoComplete="email"
                    error={loginForm.formState.errors.email}
                    registration={loginForm.register('email')}
                  />
                  <AuthField
                    label="Password"
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    error={loginForm.formState.errors.password}
                    registration={loginForm.register('password')}
                  />
                  <button
                    className="mt-[clamp(4px,0.7vh,8px)] inline-flex h-[clamp(48px,6.5vh,56px)] items-center justify-center gap-3 bg-[#010b19] px-7 font-mono text-sm font-bold uppercase text-white transition hover:bg-[#16385a] disabled:cursor-not-allowed disabled:opacity-70"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Login / sign in'}
                    {!loading ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
                  </button>
                  {googleSignInAvailable ? (
                    <>
                      <AuthDivider />
                      <GoogleSignInButton />
                    </>
                  ) : null}
                </form>
              )}

              <p className="mt-[clamp(12px,2vh,24px)] text-sm font-semibold text-slate-600">
                {isRegister ? 'Already have an account?' : 'New here?'}{' '}
                <button
                  type="button"
                  onClick={() => switchMode(isRegister ? 'login' : 'register')}
                  className="border-b-2 border-[#010b19] bg-transparent pb-0.5 font-black text-slate-950 focus:outline-none"
                >
                  {isRegister ? 'Sign in' : 'Create account'}
                </button>
              </p>
            </div>
          </div>

          <div className="shrink-0 border-t border-slate-200 px-6 py-[clamp(14px,2.2vh,24px)] text-center sm:px-8">
            <p className="font-mono text-[11px] font-bold uppercase text-slate-700">
              Works on top job platforms like
            </p>
            <div className="relative mt-[clamp(10px,1.8vh,20px)] overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
              <div className="flex w-max animate-[platform-marquee_22s_linear_infinite] items-center gap-10 text-lg font-black text-slate-300 sm:text-xl">
                {[...partners, ...partners].map((partner, index) => (
                  <span key={`${partner}-${index}`} className="shrink-0">
                    {partner}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative hidden h-full min-h-0 overflow-hidden bg-[#010b19] lg:block">
          <nav className="relative z-20 grid h-[clamp(58px,8vh,72px)] grid-cols-[1fr_auto] items-stretch bg-white/10 text-sm font-bold text-white">
            <div className="grid grid-cols-5">
              {['Roles', 'Resumes', 'Stages', 'Notes', 'Analytics'].map((item) => (
                <span key={item} className="flex items-center justify-center">
                  {item}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => switchMode(isRegister ? 'login' : 'register')}
              className="m-2 bg-white px-7 text-sm font-black text-slate-950 transition hover:bg-slate-100"
            >
              {isRegister ? 'Login / Sign in' : 'Create account'}
            </button>
          </nav>

          <div className="absolute inset-0 bg-[linear-gradient(160deg,#010b19_0%,#07111f_45%,#111827_100%)]" />
          <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:44px_44px]" />

          <div className="absolute bottom-8 left-8 z-20 w-[275px] bg-white/22 p-7 text-white backdrop-blur-sm">
            <div className="mb-24 grid w-16 grid-cols-3 gap-2" aria-hidden="true">
              {Array.from({ length: 9 }).map((_, index) => (
                <span
                  key={index}
                  className={`h-3 w-3 rotate-45 border border-white ${index % 4 === 0 ? 'bg-white' : ''}`}
                />
              ))}
            </div>
            <p className="font-mono text-xl font-bold uppercase">Pipeline clarity</p>
            <p className="mt-3 text-sm leading-5 text-white/85">
              Applications, versions, stages, and follow-ups stay visible as the search gets busy.
            </p>
          </div>

          <div className="absolute bottom-8 right-8 z-20 flex">
            <button className="flex h-12 w-12 items-center justify-center bg-white/18 text-xl text-white backdrop-blur transition hover:bg-white/28">
              ←
            </button>
            <button className="ml-px flex h-12 w-12 items-center justify-center bg-white/18 text-xl text-white backdrop-blur transition hover:bg-white/28">
              →
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};
