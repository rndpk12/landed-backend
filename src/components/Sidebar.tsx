import { Link, NavLink } from 'react-router-dom';
import {
  BarChart3,
  BriefcaseBusiness,
  FileSearch,
  FileText,
  Home,
  LogOut,
  NotebookTabs,
  Plus,
  Settings
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: Home },
  { label: 'Applications', path: '/applications', icon: BriefcaseBusiness },
  { label: 'Resume Vault', path: '/resumes', icon: FileText },
  { label: 'Resume Match', path: '/resume-match', icon: FileSearch },
  { label: 'Interview Notes', path: '/interview-notes', icon: NotebookTabs },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 }
];

export const Sidebar = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { user, logout } = useAuth();

  return (
    <>
      <div
        className={'fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden ' + (open ? 'block' : 'hidden')}
        onClick={onClose}
      />
      <aside
        className={
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r-[4px] border-black bg-[#fffaf1] transition-transform duration-200 lg:static lg:translate-x-0 ' +
          (open ? 'translate-x-0' : '-translate-x-full')
        }
      >
        <div className="flex h-[72px] items-center border-b-[4px] border-black px-5">
          <Link to="/dashboard" className="flex items-center gap-2 no-underline">
            <span className="grid h-10 w-10 place-items-center border-[3px] border-black bg-[#f97316] font-black text-white shadow-[4px_4px_0_#000]">
              L
            </span>
            <span className="text-[22px] font-black italic text-black">LANDED</span>
          </Link>
        </div>

        <nav className="space-y-3 px-4 py-5">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                'flex items-center gap-3 border-[3px] border-black px-4 py-3 text-sm font-black uppercase shadow-[4px_4px_0_#000] transition hover:-translate-y-0.5 ' +
                (isActive ? 'bg-[#f97316] text-white' : 'bg-white text-black hover:bg-[#f9d44a]')
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mx-4 border-[3px] border-black bg-white p-4 shadow-[5px_5px_0_#000]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-black uppercase text-black">Quick lists</h2>
            <Link
              className="grid h-8 w-8 place-items-center border-2 border-black bg-[#f9d44a] text-black transition hover:-translate-y-0.5"
              to="/applications"
              aria-label="Add application"
            >
              <Plus className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3 text-sm font-black uppercase text-[#555]">
            <Link className="flex items-center gap-3 no-underline hover:text-black" to="/applications">
              <span className="h-3 w-3 border-2 border-black bg-[#f5b8d4]" />
              Interview loops
            </Link>
            <Link className="flex items-center gap-3 no-underline hover:text-black" to="/resumes">
              <span className="h-3 w-3 border-2 border-black bg-[#96d35f]" />
              Resume versions
            </Link>
          </div>
        </div>

        <div className="mt-auto space-y-3 border-t-[4px] border-black px-4 py-5">
          <Link
            className="flex items-center gap-3 border-[3px] border-black bg-white px-4 py-3 text-sm font-black uppercase text-black shadow-[4px_4px_0_#000] transition hover:-translate-y-0.5 hover:bg-[#5dd6e4]"
            to="/settings"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <div className="border-[3px] border-black bg-[#f8efe2] p-3">
            <p className="truncate text-sm font-black text-black">{user?.name ?? 'Landed User'}</p>
            <p className="truncate text-xs font-bold text-[#555]">{user?.email ?? 'user@landed.ai'}</p>
          </div>
          <button
            className="flex w-full items-center gap-3 border-[3px] border-black bg-black px-4 py-3 text-sm font-black uppercase text-white shadow-[4px_4px_0_#f97316] transition hover:-translate-y-0.5"
            type="button"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};
