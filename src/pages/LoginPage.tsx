import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';

const schema = z.object({
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.')
});

type FormValues = z.infer<typeof schema>;

export const LoginPage = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/dashboard';
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
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
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card lg:grid-cols-2">
        <div className="hidden bg-slate-950 p-10 text-white lg:block">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="mb-10 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 font-bold">L</div>
              <h1 className="text-4xl font-bold tracking-tight">Run your job search like a serious operating system.</h1>
              <p className="mt-4 text-slate-300">Track roles, resumes, interviews, conversion, and next actions in one calm workspace.</p>
            </div>
            <p className="text-sm text-slate-400">MVP mode uses realistic local data when the API is offline.</p>
          </div>
        </div>
        <div className="p-8 sm:p-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500">Sign in to continue to Landed.</p>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <input className="input mt-2" type="email" {...register('email')} />
              {errors.email ? <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p> : null}
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <input className="input mt-2" type="password" {...register('password')} />
              {errors.password ? <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p> : null}
            </div>
            <button className="btn-primary w-full" type="submit" disabled={loading}>
              Sign in
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            New here? <Link className="font-semibold text-primary-600 hover:text-primary-700" to="/register">Create an account</Link>
          </p>
        </div>
      </section>
    </main>
  );
};
