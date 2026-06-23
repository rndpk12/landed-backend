import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, Eye, FileText, Plus, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { resumeApi } from '../services/resumeApi';
import type { Resume } from '../types/resume';

const schema = z.object({
  name: z.string().min(1, 'Resume name is required.'),
  version: z.string().min(1, 'Version is required.'),
  roleTag: z.string().min(1, 'Role tag is required.'),
  file: z.instanceof(FileList).refine((files) => files.length > 0, 'Upload a PDF.').refine((files) => files[0]?.type === 'application/pdf', 'Only PDF files are accepted.')
});
type FormValues = z.infer<typeof schema>;

export const ResumeVaultPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const resumesQuery = useQuery({ queryKey: ['resumes'], queryFn: resumeApi.list });
  const resumeDetailsQuery = useQuery({ queryKey: ['resume', selectedResumeId], queryFn: () => resumeApi.get(selectedResumeId ?? ''), enabled: Boolean(selectedResumeId) });
  const uploadMutation = useMutation({ mutationFn: resumeApi.upload, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resumes'] }) });
  const deleteMutation = useMutation({ mutationFn: resumeApi.remove, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resumes'] }) });
  const downloadMutation = useMutation({ mutationFn: resumeApi.downloadVersion });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    await uploadMutation.mutateAsync(values);
    reset();
    setModalOpen(false);
  };

  const onDelete = (resume: Resume) => {
    if (selectedResumeId === resume.id) {
      setSelectedResumeId(null);
    }

    deleteMutation.mutate(resume.id);
  };

  const mutationError = uploadMutation.error ?? deleteMutation.error ?? downloadMutation.error;

  if (resumesQuery.isLoading) {
    return <LoadingSpinner label="Loading resumes" />;
  }

  if (resumesQuery.isError) {
    return (
      <div className="page-shell">
        <div className="card p-8">
          <h2 className="text-xl font-bold text-slate-950">Could not load resumes</h2>
          <p className="mt-2 text-sm text-slate-500">{resumesQuery.error.message}</p>
          <button className="btn-primary mt-5" type="button" onClick={() => resumesQuery.refetch()}>Try again</button>
        </div>
      </div>
    );
  }

  const resumes = resumesQuery.data ?? [];

  return (
    <div className="page-shell">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">Resume Vault</h2>
          <p className="mt-1 text-sm text-slate-500">Version and compare resumes for different roles.</p>
        </div>
        <button className="btn-primary" type="button" onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" />Upload Resume</button>
      </div>
      {mutationError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {mutationError.message}
        </div>
      ) : null}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {resumes.map((resume) => {
          const selectedResume = selectedResumeId === resume.id ? (resumeDetailsQuery.data ?? resume) : null;
          const latestVersion = resume.versions[0];

          return (
          <article key={resume.id} className="card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="rounded-2xl bg-primary-50 p-3 text-primary-600"><FileText className="h-6 w-6" /></div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{resume.roleTag}</span>
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-950">{resume.name}</h3>
            <p className="mt-1 text-sm text-slate-500">Version {resume.version} · Uploaded {resume.uploadDate}</p>
            <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-slate-50 p-3 text-center">
              <Metric value={resume.applications} label="Apps" />
              <Metric value={resume.interviews} label="Interviews" />
              <Metric value={resume.conversionRate + '%'} label="Conv." />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button className="btn-secondary px-3 py-2" type="button" onClick={() => setSelectedResumeId(selectedResumeId === resume.id ? null : resume.id)}><Eye className="h-4 w-4" />View</button>
              <button className="btn-secondary px-3 py-2" type="button" disabled={!latestVersion || downloadMutation.isPending} onClick={() => latestVersion ? downloadMutation.mutate(latestVersion.id) : undefined}><Download className="h-4 w-4" />Download</button>
              <button className="btn-secondary px-3 py-2 text-rose-600" type="button" disabled={deleteMutation.isPending && deleteMutation.variables === resume.id} onClick={() => onDelete(resume)}><Trash2 className="h-4 w-4" />Delete</button>
            </div>
            {selectedResume ? (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                {resumeDetailsQuery.isFetching ? <LoadingSpinner label="Loading metadata" /> : null}
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Metadata</p>
                    <p className="mt-1 text-xs text-slate-500">{selectedResume.versions.length} version{selectedResume.versions.length === 1 ? '' : 's'} · Updated {new Date(selectedResume.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">{selectedResume.tags.join(', ') || 'No tags'}</span>
                </div>
                <div className="mt-4 space-y-2">
                  {selectedResume.versions.map((version) => (
                    <div key={version.id} className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-950">v{version.version} · {version.filename}</p>
                        <p className="text-xs text-slate-500">{formatFileSize(version.fileSize)} · {new Date(version.createdAt).toLocaleDateString()} · {version.sha256.slice(0, 7)}</p>
                      </div>
                      <button className="btn-secondary px-3 py-2" type="button" onClick={() => downloadMutation.mutate(version.id)}><Download className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </article>
          );
        })}
      </section>
      {!resumes.length ? (
        <EmptyState icon={FileText} title="No resumes yet" description="Upload your first resume to start building a clean version history." />
      ) : null}
      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 px-4 py-8 backdrop-blur-sm">
          <form className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-5 flex items-center justify-between">
              <div><h3 className="text-xl font-bold text-slate-950">Upload Resume</h3><p className="text-sm text-slate-500">PDF only. Add naming context for tracking.</p></div>
              <button className="btn-secondary" type="button" onClick={() => setModalOpen(false)}>Close</button>
            </div>
            <div className="space-y-4">
              <div><label className="text-sm font-semibold text-slate-700">Resume Name</label><input className="input mt-2" {...register('name')} />{errors.name ? <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p> : null}</div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="text-sm font-semibold text-slate-700">Version</label><input className="input mt-2" placeholder="v5" {...register('version')} />{errors.version ? <p className="mt-1 text-xs text-rose-600">{errors.version.message}</p> : null}</div>
                <div><label className="text-sm font-semibold text-slate-700">Role Tag</label><input className="input mt-2" placeholder="Backend" {...register('roleTag')} />{errors.roleTag ? <p className="mt-1 text-xs text-rose-600">{errors.roleTag.message}</p> : null}</div>
              </div>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center hover:bg-slate-100">
                <Upload className="mb-3 h-6 w-6 text-slate-500" />
                <span className="text-sm font-semibold text-slate-700">Choose PDF file</span>
                <input className="sr-only" type="file" accept="application/pdf" {...register('file')} />
              </label>
              {errors.file ? <p className="text-xs text-rose-600">{errors.file.message}</p> : null}
            </div>
            {uploadMutation.error ? <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{uploadMutation.error.message}</p> : null}
            <div className="mt-6 flex justify-end gap-3"><button className="btn-secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn-primary" type="submit" disabled={uploadMutation.isPending}>{uploadMutation.isPending ? 'Uploading...' : 'Upload'}</button></div>
          </form>
        </div>
      ) : null}
    </div>
  );
};

const Metric = ({ value, label }: { value: string | number; label: string }) => (
  <div><p className="text-sm font-bold text-slate-950">{value}</p><p className="text-xs text-slate-500">{label}</p></div>
);

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) {
    return bytes + ' B';
  }

  if (bytes < 1024 * 1024) {
    return Math.round(bytes / 1024) + ' KB';
  }

  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
};
