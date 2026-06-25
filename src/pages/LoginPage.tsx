import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, type FieldError, type UseFormRegisterReturn } from 'react-hook-form';
import { Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.')
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.')
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

const partners = ['Google', 'Adobe', 'Intel', 'Amazon', 'Sony'];

const AuthField = ({ label, type, placeholder, autoComplete, error, registration, compact }: FieldProps) => (
  <div className={`flex flex-col ${compact ? 'gap-1' : 'gap-[clamp(4px,0.7vh,8px)]'}`}>
    <label className={`${compact ? 'text-[10px]' : 'text-[11px]'} font-black uppercase text-slate-950`}>
      {label}
    </label>
    <input
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

export const LoginPage = () => {
  const { login, register: createAccount, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/dashboard';

  const [mode, setMode] = useState<AuthMode>(
    searchParams.get('mode') === 'register' ? 'register' : 'login'
  );

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

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  const onLoginSubmit = async (values: LoginValues) => {
    await login(values);
    navigate(from, { replace: true });
  };

  const onRegisterSubmit = async (values: RegisterValues) => {
    await createAccount(values);
    navigate('/dashboard', { replace: true });
  };

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setSearchParams(next === 'register' ? { mode: 'register' } : {});
    loginForm.clearErrors();
    registerForm.clearErrors();
  };

  const isRegister = mode === 'register';

  return (
    <main className="h-screen overflow-hidden bg-[#2c82b8] p-1 font-sans text-white">
      <section className="grid h-full w-full gap-2 overflow-hidden bg-[#2c82b8] lg:grid-cols-[0.98fr_1fr]">
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[3px] bg-white text-slate-950">
          <div className="flex h-[clamp(58px,8vh,72px)] shrink-0 items-center justify-between border-b-[10px] border-[#2c82b8] px-6 sm:px-8">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="bg-transparent text-2xl font-black text-slate-950"
            >
              landed.
            </button>
            <div className="grid h-11 w-11 grid-cols-2 gap-1" aria-hidden="true">
              <span className="bg-slate-950" />
              <span className="bg-slate-950" />
              <span className="bg-slate-950" />
              <span className="bg-slate-950" />
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-[clamp(18px,3vh,34px)] text-center sm:px-10">
            <div className="mb-[clamp(14px,2.5vh,28px)] flex gap-2" aria-hidden="true">
              <span className="h-3 w-3 bg-slate-950" />
              <span className="h-3 w-3 bg-slate-950" />
              <span className="h-3 w-3 bg-slate-950" />
            </div>

            <div className="w-full max-w-[430px]">
              <p className="mb-[clamp(6px,1vh,12px)] font-mono text-xs font-bold uppercase text-[#2c82b8]">
                {isRegister ? 'Start free' : 'Welcome back'}
              </p>
              <h1 className="text-[clamp(38px,7vh,56px)] font-black uppercase leading-[1.04] text-slate-950">
                {isRegister ? (
                  <>
                    Create
                    <span className="block font-serif text-[0.86em] italic normal-case leading-[0.9]">
                      your
                    </span>
                    Account
                  </>
                ) : (
                  <>
                    Sign in
                    <span className="block font-serif text-[0.86em] italic normal-case leading-[0.9]">
                      to
                    </span>
                    Landed
                  </>
                )}
              </h1>

              <p className="mx-auto mt-[clamp(12px,2.1vh,24px)] max-w-[330px] text-sm font-medium leading-5 text-slate-700">
                {isRegister
                  ? 'Build one calm workspace for applications, resumes, interview notes, and next moves.'
                  : 'Track every role, resume version, interview loop, and follow-up from one focused dashboard.'}
              </p>

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
                </form>
              )}

              <p className="mt-[clamp(12px,2vh,24px)] text-sm font-semibold text-slate-600">
                {isRegister ? 'Already have an account?' : 'New here?'}{' '}
                <button
                  type="button"
                  onClick={() => switchMode(isRegister ? 'login' : 'register')}
                  className="border-b-2 border-[#2c82b8] bg-transparent pb-0.5 font-black text-slate-950 focus:outline-none"
                >
                  {isRegister ? 'Sign in' : 'Create account'}
                </button>
              </p>
            </div>
          </div>

          <div className="shrink-0 border-t border-slate-200 px-6 py-[clamp(14px,2.2vh,24px)] text-center sm:px-8">
            <p className="font-mono text-[11px] font-bold uppercase text-slate-700">
              Trusted by ambitious job seekers globally
            </p>
            <div className="mt-[clamp(10px,1.8vh,20px)] flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-lg font-black text-slate-300 sm:text-xl">
              {partners.map((partner) => (
                <span key={partner}>{partner}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative hidden h-full min-h-0 overflow-hidden bg-[#1480bf] lg:block">
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

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_28%,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.48)_14%,rgba(89,182,220,0.3)_28%,rgba(20,128,191,0)_48%),radial-gradient(circle_at_20%_58%,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0)_23%),linear-gradient(160deg,#1984bf_0%,#2f9bd0_38%,#53b4dc_64%,#1f78af_100%)]" />
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:44px_44px]" />

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
