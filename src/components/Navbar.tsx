import { Bell, ChevronDown, Menu, Plus, Search } from 'lucide-react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Navbar = ({ title, onMenuClick }: { title: string; onMenuClick: () => void }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const onSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('query')?.toString().trim();
    navigate(query ? '/applications?search=' + encodeURIComponent(query) : '/applications');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-5 lg:px-6">
        <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm lg:hidden" type="button" onClick={onMenuClick} aria-label="Open navigation">
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden min-w-0 lg:block">
          <h1 className="sr-only">{title}</h1>
        </div>
        <form className="flex h-10 min-w-0 flex-1 items-center gap-3 rounded-2xl bg-slate-50 px-4 text-slate-500 ring-1 ring-slate-100" onSubmit={onSearchSubmit}>
          <Search className="h-5 w-5 shrink-0" />
          <input className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-slate-500" name="query" placeholder="Search applications" />
          <kbd className="hidden rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm sm:block">Enter</kbd>
        </form>
        <Link className="hidden items-center gap-2 rounded-xl bg-[#2f67dc] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2458c7] md:inline-flex" to="/applications">
          <Plus className="h-4 w-4" />
          New application
          <ChevronDown className="h-4 w-4" />
        </Link>
        <Link className="relative rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-50" to="/dashboard" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Link>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
          {user?.name?.slice(0, 1) ?? 'U'}
        </div>
      </div>
    </header>
  );
};
