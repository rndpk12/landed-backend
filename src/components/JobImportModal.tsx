import { useMutation } from '@tanstack/react-query';
import { CheckCircle2, Link, Loader2, X } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { jobImportApi } from '../services/jobImportApi';
import type { JobImportResponse } from '../types/jobImport';

interface JobImportModalProps {
  onClose: () => void;
  onImported: (url: string, job: JobImportResponse) => void;
}

export const JobImportModal = ({ onClose, onImported }: JobImportModalProps) => {
  const [url, setUrl] = useState('');
  const importMutation = useMutation({ mutationFn: jobImportApi.importJob });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await importMutation.mutateAsync({ url: url.trim() });
    onImported(url.trim(), result);
  };

  const imported = importMutation.data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 px-4 py-5 backdrop-blur-sm">
      <form className="max-h-[86vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-4 shadow-xl" onSubmit={onSubmit}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-950">Import from Job URL</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">Paste a posting from LinkedIn, Greenhouse, Lever, Workday, Ashby, Naukri, or a company career page.</p>
          </div>
          <button className="btn-secondary px-3 py-2 text-xs" type="button" onClick={onClose} aria-label="Close import modal">
            <X className="h-4 w-4" />
          </button>
        </div>

        <label className="text-xs font-semibold text-slate-700" htmlFor="job-import-url">Job URL</label>
        <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
          <Link className="h-4 w-4 text-slate-400" />
          <input
            id="job-import-url"
            className="w-full text-xs outline-none"
            placeholder="https://company.com/careers/jobs/..."
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            required
          />
        </div>

        {importMutation.isPending ? (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-primary-100 bg-primary-50 px-3 py-2 text-xs text-primary-700">
            <Loader2 className="h-4 w-4 animate-spin" />
            Importing job details...
          </div>
        ) : null}

        {importMutation.isError ? (
          <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {importMutation.error.message}
          </div>
        ) : null}

        {imported ? (
          <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            <div className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-semibold">Job imported</p>
                <p className="mt-1">{[imported.role, imported.company].filter(Boolean).join(' at ') || 'The create form has been populated.'}</p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-4 flex justify-end gap-3">
          <button className="btn-secondary px-3 py-2 text-xs" type="button" onClick={onClose}>Cancel</button>
          <button className="btn-primary px-3 py-2 text-xs" type="submit" disabled={importMutation.isPending || !url.trim()}>
            {importMutation.isPending ? 'Importing...' : 'Import Job'}
          </button>
        </div>
      </form>
    </div>
  );
};
