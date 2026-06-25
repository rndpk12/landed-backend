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
      <div className={'fixed inset-0 z-30 bg-slate-950/20 backdrop-blur-sm lg:hidden ' + (open ? 'block' : 'hidden')} onClick={onClose} />
      <aside className={'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ' + (open ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex h-16 items-center px-6">
          <Link to="/dashboard" className="text-3xl font-black tracking-tight text-slate-950">
            landed.
          </Link>
        </div>
        <nav className="space-y-1.5 px-4 py-4">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition ' +
                (isActive ? 'bg-[#2f67dc] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950')
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 px-6 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-950">Quick lists</h2>
            <Link className="rounded-lg p-1 text-slate-950 hover:bg-slate-100" to="/applications" aria-label="Add application">
              <Plus className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3 text-sm font-medium text-slate-600">
            <Link className="flex items-center gap-3 hover:text-slate-950" to="/applications">
              <span className="h-3 w-3 rounded bg-fuchsia-300" />
              Interview loops
            </Link>
            <Link className="flex items-center gap-3 hover:text-slate-950" to="/resumes">
              <span className="h-3 w-3 rounded bg-emerald-300" />
              Resume versions
            </Link>
          </div>
        </div>

        <div className="mt-auto space-y-3 px-4 py-5">
          <Link className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950" to="/settings">
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="truncate text-sm font-semibold text-slate-950">{user?.name ?? 'Landed User'}</p>
            <p className="truncate text-xs text-slate-500">{user?.email ?? 'user@landed.ai'}</p>
          </div>
          <button className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50" type="button" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};
