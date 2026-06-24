import { BarChart3, BriefcaseBusiness, CalendarCheck, Trophy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ActivityTimeline } from '../components/ActivityTimeline';
import { ApplicationsTable } from '../components/ApplicationsTable';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ResumePerformanceCard } from '../components/ResumePerformanceCard';
import { StatCard } from '../components/StatCard';
import { useActivitiesQuery } from '../hooks/useActivitiesQuery';
import { useAuth } from '../hooks/useAuth';
import { applicationApi } from '../services/applicationApi';
import { resumeApi } from '../services/resumeApi';

export const DashboardPage = () => {
  const { user } = useAuth();
  const applicationsQuery = useQuery({ queryKey: ['applications'], queryFn: applicationApi.list });
  const resumesQuery = useQuery({ queryKey: ['resumes'], queryFn: resumeApi.list });
  const activitiesQuery = useActivitiesQuery();

  if (applicationsQuery.isLoading || resumesQuery.isLoading) {
    return <LoadingSpinner />;
  }

  const applications = applicationsQuery.data ?? [];
  const interviews = applications.filter((item) => item.status === 'Interview').length;
  const offers = applications.filter((item) => item.status === 'Offer' || item.status === 'Accepted').length;
  const responseRate = applications.length ? Math.round(((interviews + offers) / applications.length) * 100) : 0;

  return (
    <div className="page-shell">
      <section className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white md:p-8">
        <p className="text-sm font-semibold text-primary-100">Career command center</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Welcome back, {user?.name ?? 'there'}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Your pipeline is moving. Keep the next action obvious, the data honest, and the tiny career goblins out of your calendar.</p>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BriefcaseBusiness} value={applications.length} label="Applications" helper="+6 this month" />
        <StatCard icon={CalendarCheck} value={interviews} label="Interviews" helper="3 scheduled this week" />
        <StatCard icon={Trophy} value={offers} label="Offers" helper="1 active negotiation" />
        <StatCard icon={BarChart3} value={responseRate + '%'} label="Response Rate" helper="Interview + offer rate" />
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="card p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Recent Applications</h2>
              <p className="text-sm text-slate-500">The latest roles in your pipeline.</p>
            </div>
          </div>
          <ApplicationsTable applications={applications.slice(0, 5)} compact />
        </div>
        <ActivityTimeline
          activities={(activitiesQuery.data ?? []).slice(0, 20)}
          error={activitiesQuery.error}
          isError={activitiesQuery.isError}
          isLoading={activitiesQuery.isLoading}
          onRetry={() => {
            void activitiesQuery.refetch();
          }}
        />
      </section>
      <ResumePerformanceCard resumes={resumesQuery.data ?? []} />
    </div>
  );
};
