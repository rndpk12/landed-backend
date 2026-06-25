import { useQuery } from '@tanstack/react-query';
import {
  ArrowUpRight,
  BellRing,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  ListTodo,
  MessageSquareText,
  MoreHorizontal,
  Plus,
  Search,
  Share2,
  Sparkles,
  Target,
  TimerReset,
  Users
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useActivitiesQuery } from '../hooks/useActivitiesQuery';
import { useAuth } from '../hooks/useAuth';
import { applicationApi } from '../services/applicationApi';
import { resumeApi } from '../services/resumeApi';
import type { ApplicationStatus } from '../types/application';

const statusStyles: Record<ApplicationStatus, string> = {
  Saved: 'bg-slate-100 text-slate-700',
  Applied: 'bg-blue-100 text-blue-700',
  OA: 'bg-amber-100 text-amber-800',
  Interview: 'bg-emerald-100 text-emerald-700',
  Offer: 'bg-violet-100 text-violet-700',
  Rejected: 'bg-rose-100 text-rose-700',
  Accepted: 'bg-lime-100 text-lime-800'
};

const formatToday = () =>
  new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date());

const firstName = (name?: string | null) => name?.trim().split(/\s+/)[0] || 'there';

const formatShortDate = (date?: string) => {
  if (!date) {
    return 'No date set';
  }

  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(date));
};

const currentWeekDays = () => {
  const today = new Date();
  const monday = new Date(today);
  const day = today.getDay() || 7;
  monday.setDate(today.getDate() - day + 1);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return {
      key: date.toISOString().slice(0, 10),
      label: new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(date),
      day: new Intl.DateTimeFormat(undefined, { day: 'numeric' }).format(date),
      isToday: date.toDateString() === today.toDateString()
    };
  });
};

export const DashboardPage = () => {
  const { user } = useAuth();
  const [shareLabel, setShareLabel] = useState('Share');
  const applicationsQuery = useQuery({ queryKey: ['applications'], queryFn: applicationApi.list });
  const resumesQuery = useQuery({ queryKey: ['resumes'], queryFn: resumeApi.list });
  const activitiesQuery = useActivitiesQuery();

  if (applicationsQuery.isLoading || resumesQuery.isLoading) {
    return <LoadingSpinner />;
  }

  const applications = applicationsQuery.data ?? [];
  const resumes = resumesQuery.data ?? [];
  const displayApplications = applications.slice(0, 5);
  const interviews = applications.filter((item) => item.status === 'Interview').length;
  const activeApplications = applications.filter((item) => !['Rejected', 'Accepted'].includes(item.status)).length;
  const offers = applications.filter((item) => item.status === 'Offer' || item.status === 'Accepted').length;
  const recentActivities = activitiesQuery.data ?? [];
  const weekDays = currentWeekDays();
  const scheduledApplications = applications
    .filter((application) => ['Interview', 'OA', 'Offer'].includes(application.status))
    .slice(0, 3);
  const applicationNotes = applications
    .filter((application) => application.notes?.trim())
    .slice(0, 3);
  const shareDashboard = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title: 'Landed dashboard', url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareLabel('Copied');
        window.setTimeout(() => setShareLabel('Share'), 1600);
      }
    } catch {
      setShareLabel('Share');
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-4 py-4 sm:px-5 lg:px-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{formatToday()}</p>
          <h2 className="mt-2 text-[clamp(1.8rem,4.4vw,3rem)] font-semibold leading-none tracking-tight text-slate-950">
            Good evening, {firstName(user?.name)}.
          </h2>
          <div className="mt-4 flex w-fit flex-wrap items-center gap-0 overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600">
              <TimerReset className="h-4 w-4 text-slate-950" />
              <span className="text-lg font-semibold text-slate-950">{activeApplications}</span>
              active applications
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600">
              <CheckCircle2 className="h-4 w-4 text-slate-950" />
              <span className="text-lg font-semibold text-slate-950">{interviews}</span>
              interviews
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600">
              <FileText className="h-4 w-4 text-slate-950" />
              <span className="text-lg font-semibold text-slate-950">{resumes.length}</span>
              resumes
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50" type="button" onClick={shareDashboard}>
            <Share2 className="h-4 w-4" />
            {shareLabel}
          </button>
          <Link className="inline-flex items-center gap-2 rounded-xl bg-[#2f67dc] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2458c7]" to="/applications">
            <Plus className="h-4 w-4" />
            Add application
          </Link>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <ListTodo className="h-5 w-5 text-slate-950" />
            <h3 className="text-lg font-semibold tracking-tight text-slate-950">Application Pipeline</h3>
            <span className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600">This week</span>
          </div>
          <Link className="rounded-full bg-slate-50 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100" to="/applications">
            See all
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-sm font-semibold text-slate-950">
                <th className="border-b border-slate-200 px-4 py-3">
                  <span className="inline-flex items-center gap-2"><BriefcaseBusiness className="h-4 w-4" />Role</span>
                </th>
                <th className="border-b border-l border-slate-200 px-4 py-3">
                  <span className="inline-flex items-center gap-2"><Users className="h-4 w-4" />Company</span>
                </th>
                <th className="border-b border-l border-slate-200 px-4 py-3">
                  <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4" />Status</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {displayApplications.length ? displayApplications.map((application, index) => (
                <tr key={application.id} className="text-sm text-slate-600">
                  <td className="border-b border-slate-100 px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-950">{application.role}</p>
                        <p className="mt-1 truncate text-xs text-slate-500">{application.resume || 'Resume not selected'}</p>
                      </div>
                      <div className="hidden items-center gap-3 text-xs text-slate-500 sm:flex">
                        <span className="inline-flex items-center gap-1"><MessageSquareText className="h-3.5 w-3.5" />{index + 2}</span>
                        <span className="inline-flex items-center gap-1"><ArrowUpRight className="h-3.5 w-3.5" />{index + 5}</span>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-l border-slate-100 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                        {application.company.slice(0, 1)}
                      </span>
                      <div>
                        <p className="font-medium text-slate-950">{application.company}</p>
                        <p className="text-xs text-slate-500">{application.location || 'Location flexible'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-l border-slate-100 px-4 py-3">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[application.status]}`}>
                      {application.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td className="px-4 py-8 text-center text-sm text-slate-500" colSpan={3}>
                    No applications yet. Add your first real application to start tracking your pipeline.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-slate-950" />
              <h3 className="text-lg font-semibold tracking-tight text-slate-950">Schedule</h3>
            </div>
            <MoreHorizontal className="h-5 w-5 text-slate-500" />
          </div>
          <div className="grid grid-cols-7 gap-2 border-b border-slate-200 px-4 py-3 text-center text-xs font-semibold text-slate-700">
            {weekDays.map((day) => (
              <span key={day.key} className={day.isToday ? 'rounded-xl bg-fuchsia-200 py-2 text-slate-950' : 'py-2'}>
                {day.label} {day.day}
              </span>
            ))}
          </div>
          <div className="divide-y divide-slate-100 px-4 py-1">
            {scheduledApplications.length ? scheduledApplications.map((application) => (
              <div key={application.id} className="flex items-center gap-4 py-3">
                <span className="h-10 w-1 rounded-full bg-emerald-300" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-950">{application.role}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {application.company} - {application.status} - {formatShortDate(application.appliedDate)}
                  </p>
                </div>
                <MoreHorizontal className="h-5 w-5 text-slate-500" />
              </div>
            )) : (
              <div className="py-8 text-center text-sm text-slate-500">
                No interview or assessment items yet.
              </div>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-3">
              <BellRing className="h-5 w-5 text-slate-950" />
              <h3 className="text-lg font-semibold tracking-tight text-slate-950">Notes</h3>
            </div>
            <Link className="text-sm font-semibold text-slate-500 hover:text-slate-950" to="/interview-notes">Open notes</Link>
          </div>
          <div className="divide-y divide-slate-100 px-4 py-1">
            {applicationNotes.length ? applicationNotes.map((application) => (
              <div key={application.id} className="flex gap-4 py-3">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-300">
                  <MessageSquareText className="h-3.5 w-3.5 text-slate-500" />
                </span>
                <div>
                  <p className="font-semibold text-slate-950">{application.company} - {application.role}</p>
                  <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">{application.notes}</p>
                </div>
              </div>
            )) : (
              <div className="py-8 text-center text-sm text-slate-500">
                Notes you add to applications will appear here.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <Target className="h-5 w-5 text-slate-500" />
          <p className="mt-3 text-2xl font-semibold text-slate-950">{offers}</p>
          <p className="mt-1 text-sm text-slate-500">Offers or accepted roles</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <Search className="h-5 w-5 text-slate-500" />
          <p className="mt-3 text-2xl font-semibold text-slate-950">{recentActivities.length}</p>
          <p className="mt-1 text-sm text-slate-500">Recent activity</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <Clock3 className="h-5 w-5 text-slate-500" />
          <p className="mt-3 text-2xl font-semibold text-slate-950">{applications.length ? Math.round((interviews / applications.length) * 100) : 0}%</p>
          <p className="mt-1 text-sm text-slate-500">Interview conversion</p>
        </div>
      </section>
    </div>
  );
};
