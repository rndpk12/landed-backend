import { insights, features, roles } from './landingData';
import { Reveal } from './Reveal';

export const FeaturesSection = () => (
  <section className="mx-auto max-w-[1100px] px-5 pb-[120px] pt-4 md:px-11" id="features">
    <Reveal className="mb-12 text-center">
      <div className="mb-3.5 inline-block rounded-full border border-[#ebebeb] px-[13px] py-[5px] text-[11px] font-medium uppercase tracking-[0.08em] text-[#6a6a6a]">
        Built different
      </div>
      <h2 className="mb-2.5 text-[clamp(30px,4vw,48px)] font-extrabold leading-[1.04] tracking-[-0.035em] text-[#0a0a0a]">
        Clarity from day one
      </h2>
      <p className="mx-auto max-w-[420px] text-[15px] font-light leading-[1.7] text-[#6a6a6a]">
        Everything in Landed is designed to answer one question:{' '}
        <strong className="font-semibold text-[#0a0a0a]">what should I do next?</strong>
      </p>
    </Reveal>
    <Reveal className="grid overflow-hidden rounded-2xl bg-[#ebebeb] p-px sm:grid-cols-2 lg:grid-cols-3" delay="d1">
      {features.map(({ title, body, icon: Icon, iconClass }) => (
        <div className="bg-white p-[30px] transition hover:bg-[#fafafa]" key={title}>
          <div className={`mb-[18px] flex h-9 w-9 items-center justify-center rounded-[10px] ${iconClass}`}>
            <Icon className="h-[18px] w-[18px]" />
          </div>
          <div className="mb-[7px] text-sm font-semibold tracking-[-0.01em] text-[#0a0a0a]">
            {title}
          </div>
          <p className="text-[13px] leading-[1.65] text-[#6a6a6a]">{body}</p>
        </div>
      ))}
    </Reveal>
  </section>
);

export const RolesSection = () => (
  <section className="mx-auto max-w-[1100px] px-5 pb-[130px] pt-[130px] md:px-11" id="roles">
    <Reveal className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0a0a0a]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#0a0a0a]" />
      Roles
    </Reveal>
    <Reveal>
      <h2 className="mb-3.5 text-[clamp(36px,5vw,64px)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#0a0a0a]">
        Solutions for every
        <br />
        job seeker.
      </h2>
      <p className="mb-14 max-w-[460px] text-[15px] font-light leading-[1.7] text-[#6a6a6a]">
        Whether you're a fresh grad, a senior engineer, or a career switcher - Landed fits your
        workflow.
      </p>
    </Reveal>
    <Reveal className="grid overflow-hidden rounded-2xl bg-[#ebebeb] p-px md:grid-cols-3" delay="d1">
      {roles.map(({ title, body, icon: Icon }) => (
        <div className="bg-white p-8" key={title}>
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#0a0a0a]">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <h3 className="mb-[9px] text-[15px] font-bold tracking-[-0.02em] text-[#0a0a0a]">{title}</h3>
          <p className="text-[13px] leading-[1.65] text-[#6a6a6a]">{body}</p>
        </div>
      ))}
    </Reveal>
  </section>
);

export const InsightsSection = () => (
  <section id="learn">
    <div className="mx-auto max-w-[1100px] border-t border-[#ebebeb] px-5 pt-20 md:px-11">
      <Reveal className="mb-12 grid gap-8 md:grid-cols-2 md:gap-20 md:items-end">
        <h2 className="text-[clamp(30px,4vw,48px)] font-extrabold leading-[1.1] tracking-[-0.035em] text-[#0a0a0a]">
          Expert Insights, AI Tools, Smarter Job Search.
        </h2>
        <p className="text-[15px] font-light leading-[1.7] text-[#6a6a6a]">
          Discover expert analysis, AI-driven guidance, and practical resources designed to help you
          land faster and grow confidently.
        </p>
      </Reveal>
      <div className="grid gap-3.5 pb-20 sm:grid-cols-2 lg:grid-cols-4">
        {insights.map((item, index) => (
          <Reveal
            className={`relative flex min-h-[270px] cursor-pointer flex-col justify-between overflow-hidden rounded-2xl p-[26px] transition hover:-translate-y-1 hover:shadow-[0_14px_44px_rgba(0,0,0,0.1)] ${item.className}`}
            delay={index === 1 ? 'd1' : index === 2 ? 'd2' : index === 3 ? 'd3' : undefined}
            key={item.title}
          >
            <h3 className="relative z-[2] text-[17px] font-bold leading-[1.2] tracking-[-0.02em]">
              {item.title}
            </h3>
            <p className="relative z-[2] text-xs leading-[1.6] opacity-70">{item.body}</p>
            <a className="relative z-[2] inline-flex items-center gap-1 text-[13px] font-semibold no-underline" href="#">
              Start Learning -&gt;
            </a>
            <DecorativeSvg kind={item.deco} light={item.title === 'Academy'} />
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const DecorativeSvg = ({ kind, light }: { kind: string; light: boolean }) => {
  const stroke = light ? 'white' : 'black';
  return (
    <svg className="pointer-events-none absolute -bottom-2 -right-2 opacity-10" width="110" height="110" viewBox="0 0 100 100" fill="none">
      {kind === 'line' ? (
        <>
          <path d="M10 90 L90 10" stroke={stroke} strokeWidth="1.5" />
          <path d="M90 90 Q90 10 10 10" stroke={stroke} strokeWidth="1.5" />
        </>
      ) : kind === 'target' ? (
        <>
          <circle cx="50" cy="50" r="40" stroke={stroke} strokeWidth="1.5" />
          <circle cx="50" cy="50" r="20" stroke={stroke} strokeWidth="1.5" />
          <line x1="10" y1="50" x2="90" y2="50" stroke={stroke} strokeWidth="1.5" />
          <line x1="50" y1="10" x2="50" y2="90" stroke={stroke} strokeWidth="1.5" />
        </>
      ) : kind === 'globe' ? (
        <>
          <circle cx="50" cy="50" r="40" stroke={stroke} strokeWidth="1.5" />
          <path d="M50 10 Q85 50 50 90 Q15 50 50 10" stroke={stroke} strokeWidth="1.5" />
          <line x1="10" y1="50" x2="90" y2="50" stroke={stroke} strokeWidth="1.5" />
        </>
      ) : (
        <>
          <path d="M20 80 L50 20 L80 80" stroke={stroke} strokeWidth="1.5" />
          <path d="M10 60 L90 60" stroke={stroke} strokeWidth="1.5" />
        </>
      )}
    </svg>
  );
};
