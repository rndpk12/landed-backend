import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';

const schema = z.object({
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.')
});

type FormValues = z.infer<typeof schema>;

const asciiCloud = `
       *#$S%%%$+-.
    -&$%%%$S#&&*++=--
  +%SS%%%%$#&*++====--
 #S%%%%%$#&&*+++====---
 $S%%%%%$#&**++++====----
+S%%%%$$#&&**+++++===-----
#%%%%$$##&&***+++++====----
-$%%%$$##&&***++++++===-----
 S%%$$###&&***+++++++====---
 #$$####&&&***+++++====----
  $####&&&&***++++====---
   &##&&&&&&***+++====--
    *&&&&&&***++===--
      =&&&&**++=--
         ----
`.trim();

export const LoginPage = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'aarav@landed.ai', password: 'password123' }
  });

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (values: FormValues) => {
    await login(values);
    navigate(from, { replace: true });
  };

  return (
    <main className="flex min-h-screen bg-white font-sans antialiased">
      <div className="grid min-h-screen w-full lg:grid-cols-2">
        <section className="flex min-h-screen flex-col justify-between bg-white px-6 py-10 sm:px-12 sm:py-[52px]">
          <div>
            <div className="mb-12 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#0d1b2e]">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <circle cx="7" cy="9" r="6" fill="white" />
                  <circle cx="12" cy="9" r="6" fill="none" stroke="white" strokeWidth="1.5" />
                </svg>
              </div>
              <span className="text-lg font-extrabold tracking-[-0.04em] text-slate-950">landed</span>
            </div>

            <h1 className="m-0 text-[26px] font-bold tracking-[-0.03em] text-slate-950">
              Welcome back
            </h1>
            <p className="mt-1 text-sm leading-normal text-slate-500">Sign in to continue to Landed.</p>

            <form className="mt-[30px] flex flex-col gap-[18px]" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.04em] text-slate-700">
                  Email
                </label>
                <input
                  className={`h-11 rounded-[10px] border-[1.5px] bg-slate-50 px-3.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#0d1b2e] focus:bg-white focus:ring-4 focus:ring-[#0d1b2e]/10 ${
                    errors.email ? 'border-red-500' : 'border-slate-200'
                  }`}
                  type="email"
                  placeholder="you@email.com"
                  autoComplete="email"
                  {...register('email')}
                />
                {errors.email ? <p className="mt-0.5 text-[11px] text-red-500">{errors.email.message}</p> : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.04em] text-slate-700">
                  Password
                </label>
                <input
                  className={`h-11 rounded-[10px] border-[1.5px] bg-slate-50 px-3.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#0d1b2e] focus:bg-white focus:ring-4 focus:ring-[#0d1b2e]/10 ${
                    errors.password ? 'border-red-500' : 'border-slate-200'
                  }`}
                  type="password"
                  placeholder="********"
                  autoComplete="current-password"
                  {...register('password')}
                />
                {errors.password ? (
                  <p className="mt-0.5 text-[11px] text-red-500">{errors.password.message}</p>
                ) : null}
              </div>

              <button
                className="mt-1 flex h-[46px] items-center justify-center gap-2 rounded-[10px] bg-[#0d1b2e] text-sm font-semibold tracking-[-0.01em] text-white transition hover:bg-[#1a3a5c] disabled:cursor-not-allowed disabled:opacity-70"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
                {!loading ? (
                  <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#f97316] text-[11px]">
                    -&gt;
                  </span>
                ) : null}
              </button>
            </form>

            <p className="mt-5 text-center text-[13px] text-slate-500">
              New here?{' '}
              <Link
                className="border-b-[1.5px] border-[#f97316] pb-px font-semibold text-[#0d1b2e] no-underline"
                to="/register"
              >
                Create an account
              </Link>
            </p>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-8">
            <span className="text-[11px] leading-normal text-slate-400">
              MVP mode - realistic local data
              <br />
              when the API is offline
            </span>
            <span className="rounded-full border border-[rgba(249,115,22,0.2)] bg-[rgba(249,115,22,0.12)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#f97316]">
              Beta
            </span>
          </div>
        </section>

        <section className="relative hidden min-h-screen overflow-hidden bg-[#0d1b2e] p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 z-0 bg-[linear-gradient(160deg,#1a6fa8_0%,#2980b9_20%,#5dade2_45%,#85c1e9_65%,#aed6f1_80%,#d6eaf8_95%,#eaf4fb_100%)] after:absolute after:inset-0 after:z-[1] after:bg-[linear-gradient(to_bottom,rgba(13,27,46,0.55)_0%,rgba(13,27,46,0.08)_45%,rgba(13,27,46,0.5)_100%)]" />
          <pre className="pointer-events-none absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-[58%] select-none whitespace-pre font-mono text-[7.5px] leading-[1.35] tracking-[0.05em] text-white/80 text-shadow-sm animate-[cloudDrift_8s_ease-in-out_infinite]">
            {asciiCloud}
          </pre>
          <div className="absolute left-1/2 top-1/2 z-[3] h-20 w-[110px] -translate-x-[30%] -translate-y-[54%] animate-[chipFloat_6s_ease-in-out_infinite] rounded-lg bg-[linear-gradient(135deg,#f8d7c8,#f4b8a0,#e8967a)] shadow-[0_8px_32px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.3)]">
            <div className="absolute inset-2 grid grid-cols-6 grid-rows-4 gap-[3px]">
              {Array.from({ length: 24 }).map((_, i) => (
                <span className="h-full w-full rounded-[1px] bg-[rgba(140,50,10,0.22)]" key={i} />
              ))}
            </div>
          </div>

          <div className="relative z-[4] flex items-start justify-between">
            <div>
              <span className="mb-1.5 block font-serif text-[11px] font-bold uppercase tracking-[0.22em] text-white/50">
                The Evolution
              </span>
              <h2 className="m-0 font-serif text-[28px] font-extrabold leading-[1.1] tracking-[-0.02em] text-white">
                of Job
                <br />
                <em className="italic text-white/65">Searching.</em>
              </h2>
            </div>
            <div className="flex gap-1">
              <span className="h-[9px] w-[9px] rounded-full border border-white/25" />
              <span className="h-[9px] w-[9px] rounded-full border border-white/25" />
              <span className="h-[9px] w-[9px] rounded-full border border-white/25" />
            </div>
          </div>

          <div className="relative z-[4] rounded-[14px] border border-white/10 bg-[#0d1b2e]/70 px-[22px] py-5 text-white backdrop-blur-2xl">
            <div className="mb-2.5 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50">
              <span className="h-1.5 w-1.5 animate-[ldPulse_2s_ease_infinite] rounded-full bg-[#f97316]" />
              Application pipeline
            </div>
            <div className="mb-1.5 text-xl font-bold leading-[1.2] tracking-[-0.03em]">
              Track every role,
              <br />
              every version.
            </div>
            <p className="text-xs leading-[1.6] text-white/50">
              Resumes, stages, and next actions - all in one calm workspace built for serious job
              seekers.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};
