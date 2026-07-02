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
    <header className="sticky top-0 z-20 border-b-[4px] border-black bg-[#fffaf1]/95 backdrop-blur">
      <div className="flex h-[72px] items-center gap-4 px-4 sm:px-5 lg:px-6">
        <button
          className="border-[3px] border-black bg-white px-3 py-2 text-black shadow-[4px_4px_0_#000] lg:hidden"
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden min-w-0 lg:block">
          <h1 className="sr-only">{title}</h1>
        </div>
        <form
          className="flex h-12 min-w-0 flex-1 items-center gap-3 border-[3px] border-black bg-white px-4 text-[#555] shadow-[4px_4px_0_#000]"
          onSubmit={onSearchSubmit}
        >
          <Search className="h-5 w-5 shrink-0 text-black" />
          <input
            className="w-full border-0 bg-transparent text-sm font-bold outline-none placeholder:text-[#777]"
            name="query"
            placeholder="Search applications"
          />
          <kbd className="hidden border-2 border-black bg-[#f8efe2] px-2 py-1 text-xs font-black text-black sm:block">
            Enter
          </kbd>
        </form>
        <Link
          className="hidden items-center gap-2 border-[3px] border-black bg-[#f97316] px-4 py-3 text-sm font-black uppercase text-white shadow-[4px_4px_0_#000] transition hover:-translate-y-0.5 md:inline-flex"
          to="/applications"
        >
          <Plus className="h-4 w-4" />
          New application
          <ChevronDown className="h-4 w-4" />
        </Link>
        <Link
          className="relative border-[3px] border-black bg-white p-3 text-black shadow-[4px_4px_0_#000] transition hover:-translate-y-0.5 hover:bg-[#f9d44a]"
          to="/dashboard"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </Link>
        <div className="flex h-11 w-11 items-center justify-center border-[3px] border-black bg-black text-sm font-black uppercase text-white shadow-[4px_4px_0_#f97316]">
          {user?.name?.slice(0, 1) ?? 'U'}
        </div>
      </div>
    </header>
  );
};
