import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';

const schema = z.object({
  name: z.string().min(2, 'Name is required.'),
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.')
});

type FormValues = z.infer<typeof schema>;

export const RegisterPage = () => {
  const { register: createAccount, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: 'Aarav Sharma', email: 'aarav@landed.ai', password: 'password123' }
  });

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (values: FormValues) => {
    await createAccount(values);
    navigate('/dashboard', { replace: true });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 font-bold text-white">L</span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">Create your Landed account</h1>
            <p className="text-sm text-slate-500">Start with a clean job-search command center.</p>
          </div>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm font-semibold text-slate-700">Name</label>
            <input className="input mt-2" {...register('name')} />
            {errors.name ? <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p> : null}
          </div>
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
            Create account
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link className="font-semibold text-primary-600 hover:text-primary-700" to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
};
