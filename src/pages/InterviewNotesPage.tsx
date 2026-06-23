import { NotebookTabs } from 'lucide-react';
import { interviewNotes } from '../lib/mockData';

export const InterviewNotesPage = () => (
  <div className="page-shell">
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-slate-950">Interview Notes</h2>
      <p className="mt-1 text-sm text-slate-500">Keep round-specific notes grouped by company.</p>
    </div>
    <section className="grid gap-4 lg:grid-cols-2">
      {interviewNotes.map((company) => (
        <article key={company.company} className="card p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-primary-50 p-3 text-primary-600"><NotebookTabs className="h-5 w-5" /></div>
            <h3 className="text-xl font-bold text-slate-950">{company.company}</h3>
          </div>
          <div className="space-y-3">
            {company.notes.map((note) => (
              <div key={note.round} className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-950">{note.round}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{note.text}</p>
              </div>
            ))}
          </div>
        </article>
      ))}
    </section>
  </div>
);
