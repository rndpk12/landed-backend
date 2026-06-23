import { Bell, Menu, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Navbar = ({ title, onMenuClick }: { title: string; onMenuClick: () => void }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button className="btn-secondary px-3 py-2 lg:hidden" type="button" onClick={onMenuClick} aria-label="Open navigation">
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-bold tracking-tight text-slate-950">{title}</h1>
        </div>
        <div className="hidden w-full max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-500 md:flex">
          <Search className="h-4 w-4" />
          <input className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="Search applications, resumes, notes..." />
        </div>
        <button className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50" type="button" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
          {user?.name?.slice(0, 1) ?? 'U'}
        </div>
      </div>
    </header>
  );
};
