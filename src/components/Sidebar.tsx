import { Link, NavLink } from 'react-router-dom';
import { BarChart3, BriefcaseBusiness, FileSearch, FileText, Home, LogOut, NotebookTabs, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: Home },
  { label: 'Applications', path: '/applications', icon: BriefcaseBusiness },
  { label: 'Resume Vault', path: '/resumes', icon: FileText },
  { label: 'Resume Match', path: '/resume-match', icon: FileSearch },
  { label: 'Interview Notes', path: '/interview-notes', icon: NotebookTabs },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Settings', path: '/settings', icon: Settings }
];

export const Sidebar = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { user, logout } = useAuth();

  return (
    <>
      <div className={'fixed inset-0 z-30 bg-slate-950/20 backdrop-blur-sm lg:hidden ' + (open ? 'block' : 'hidden')} onClick={onClose} />
      <aside className={'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ' + (open ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <Link to="/dashboard" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-sm font-bold text-white">L</span>
            <span className="text-lg font-bold tracking-tight text-slate-950">Landed</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ' +
                (isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950')
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
              {user?.name?.slice(0, 1) ?? 'U'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-950">{user?.name ?? 'Landed User'}</p>
              <p className="truncate text-xs text-slate-500">{user?.email ?? 'user@landed.ai'}</p>
            </div>
          </div>
          <button className="btn-secondary w-full justify-start" type="button" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};
