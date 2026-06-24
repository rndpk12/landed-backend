import { Link as LinkIcon } from 'lucide-react';
import { Reveal } from './Reveal';

const badge = 'rounded-full px-[9px] py-[3px] text-[10px] font-semibold';

export const StorySection = () => (
  <section>
    <Reveal className="mx-auto max-w-[1100px] px-5 py-[130px] md:px-11">
      <div className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#f97316]">
        What Landed does
      </div>
      <h2 className="mb-[18px] max-w-[640px] text-[clamp(38px,5vw,62px)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#0a0a0a]">
        Every tool you need,
        <br />
        none you <em className="font-bold italic text-[#f97316]">don't.</em>
      </h2>
      <p className="max-w-[460px] text-base font-light leading-[1.75] text-[#6a6a6a]">
        Job hunting is already hard enough. Landed removes the administrative friction so you can
        spend time on what actually moves the needle.
      </p>

      <Reveal className="mt-[72px] grid overflow-hidden rounded-2xl bg-[#ebebeb] p-px md:grid-cols-2" delay="d1">
        <StoryCell number="01 - Resume vault" title={<>Every version.<br />Instant recall.</>} body="Tag resumes by role, stack, or company type. Never guess which file you sent - the answer is one click away.">
          <div className="flex flex-col gap-[7px]">
            {[
              ['SWE - Big Tech', 'v4 · Sent to 6 jobs · Updated 2d ago', 'Active', 'bg-[rgba(249,115,22,0.1)]'],
              ['SWE - Startup', 'v2 · Sent to 3 jobs · Updated 5d ago', 'v2', 'bg-[rgba(99,102,241,0.1)]'],
              ['Frontend - React', 'v1 · Sent to 5 jobs · Updated 1w ago', 'v1', 'bg-[rgba(34,197,94,0.1)]']
            ].map(([name, meta, state, iconClass], index) => (
              <div
                className={`flex cursor-pointer items-center gap-2.5 rounded-[9px] border px-3 py-[9px] text-xs transition ${
                  index === 0
                    ? 'border-[rgba(249,115,22,0.25)] bg-[rgba(249,115,22,0.04)]'
                    : 'border-[#ebebeb] bg-[#fafafa] hover:border-[rgba(249,115,22,0.25)] hover:bg-[rgba(249,115,22,0.04)]'
                }`}
                key={name}
              >
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] ${iconClass}`}>
                  DOC
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-[#0a0a0a]">{name}</div>
                  <div className="mt-px text-[10px] text-[#9a9a9a]">{meta}</div>
                </div>
                <span
                  className={`${badge} ${
                    index === 0 ? 'bg-[rgba(249,115,22,0.1)] text-[#ea580c]' : 'bg-[#f5f5f5] text-[#9a9a9a]'
                  }`}
                >
                  {state}
                </span>
              </div>
            ))}
          </div>
        </StoryCell>

        <StoryCell number="02 - Diff viewer" title={<>See exactly<br />what changed.</>} body="Compare any two versions line by line. Know what you improved, why it worked, and what to iterate next.">
          <div className="mb-2 text-[11px] font-medium text-[#d4d4d4]">Comparing v2 -&gt; v4</div>
          <div className="rounded-[9px] border border-[#ebebeb] bg-[#fafafa] p-[13px] font-mono text-[11px] leading-8">
            <span className="block rounded bg-[rgba(220,38,38,0.06)] px-2 text-[#dc2626]">- 2 yrs experience in React</span>
            <span className="block rounded bg-[rgba(22,163,74,0.06)] px-2 text-[#16a34a]">+ 3 yrs exp in React & Next.js</span>
            <span className="block rounded bg-[rgba(220,38,38,0.06)] px-2 text-[#dc2626]">- Built internal tools</span>
            <span className="block rounded bg-[rgba(22,163,74,0.06)] px-2 text-[#16a34a]">+ Built tools used by 50k+ users</span>
          </div>
          <div className="mt-2.5 flex gap-2">
            <div className="flex-1 rounded-[7px] border border-[rgba(220,38,38,0.12)] bg-[rgba(220,38,38,0.06)] p-[7px] text-center text-[11px] font-semibold text-[#dc2626]">
              - 4 removed
            </div>
            <div className="flex-1 rounded-[7px] border border-[rgba(22,163,74,0.12)] bg-[rgba(22,163,74,0.06)] p-[7px] text-center text-[11px] font-semibold text-[#16a34a]">
              + 6 added
            </div>
          </div>
        </StoryCell>

        <StoryCell number="03 - Application tracker" title={<>Applied. Interviewed.<br /><em className="italic text-[#f97316]">Offered.</em></>} body="Track every application through each stage. Know where you stand at every company without a single spreadsheet.">
          <div className="flex flex-col gap-[7px]">
            {[
              ['Google - SWE L4', 'Resume v4 · Updated today', 'Offer', 'bg-[#22c55e]', 'bg-[rgba(34,197,94,0.1)] text-[#16a34a]', true],
              ['Razorpay - SDE-1', 'Resume v2 · Round 2', 'Interview', 'bg-[#f97316]', 'bg-[rgba(249,115,22,0.1)] text-[#ea580c]'],
              ['Swiggy - Platform', 'Resume v3 · Waiting', 'Applied', 'bg-[#d4d4d4]', 'bg-[#f5f5f5] text-[#9a9a9a]']
            ].map(([name, sub, state, dotClass, stateClass, active]) => (
              <div
                className={`flex items-center justify-between rounded-[9px] border px-3 py-[9px] text-xs ${
                  active ? 'border-[rgba(249,115,22,0.25)] bg-[rgba(249,115,22,0.04)]' : 'border-[#ebebeb] bg-[#fafafa]'
                }`}
                key={name as string}
              >
                <div>
                  <div className="font-medium text-[#0a0a0a]">{name}</div>
                  <div className="mt-px text-[10px] text-[#9a9a9a]">{sub}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`h-[7px] w-[7px] rounded-full ${dotClass}`} />
                  <span className={`${badge} ${stateClass}`}>{state}</span>
                </div>
              </div>
            ))}
          </div>
        </StoryCell>

        <StoryCell number="04 - Job link parser" title={<>Paste a link.<br />We do the rest.</>} body="Paste any URL from LinkedIn, Naukri, or Greenhouse - Landed auto-fills the company, role, and description for you.">
          <div className="mb-2.5 flex items-center gap-2 rounded-[9px] border border-[#ebebeb] bg-[#fafafa] px-3 py-[9px] text-[11px] text-[#9a9a9a]">
            <LinkIcon className="h-3 w-3 shrink-0" />
            <span className="truncate">linkedin.com/jobs/view/google-swe-bangalore</span>
          </div>
          <div className="rounded-[9px] border border-[rgba(249,115,22,0.2)] bg-[#fafafa] p-[13px]">
            <div className="mb-0.5 text-[13px] font-semibold text-[#0a0a0a]">Google</div>
            <div className="mb-2 text-[11px] text-[#6a6a6a]">Software Engineer L4 · Bangalore · Full-time</div>
            <div className="mb-2.5 flex flex-wrap gap-1.5">
              {['Python', 'Distributed systems', '5+ yrs'].map((tag) => (
                <span className="rounded bg-[#f5f5f5] px-2 py-[3px] text-[10px] text-[#6a6a6a]" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <button
              className="w-full rounded-md border border-[rgba(249,115,22,0.18)] bg-[rgba(249,115,22,0.08)] px-3 py-[7px] text-center text-[11px] font-medium text-[#f97316]"
              type="button"
            >
              Save & link resume -&gt;
            </button>
          </div>
        </StoryCell>
      </Reveal>
    </Reveal>
  </section>
);

type StoryCellProps = {
  number: string;
  title: React.ReactNode;
  body: string;
  children: React.ReactNode;
};

const StoryCell = ({ number, title, body, children }: StoryCellProps) => (
  <div className="bg-white p-[30px] md:p-[38px]">
    <div className="mb-[22px] text-[11px] font-semibold uppercase tracking-[0.08em] text-[#d4d4d4]">
      {number}
    </div>
    <div className="mb-[9px] text-[26px] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#0a0a0a]">
      {title}
    </div>
    <p className="text-[13px] leading-[1.7] text-[#6a6a6a]">{body}</p>
    <div className="mt-[26px]">{children}</div>
  </div>
);
