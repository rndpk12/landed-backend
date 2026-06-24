import { useNavigate } from 'react-router-dom';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-5 pb-24 pt-[120px] text-center md:px-10">
      <div className="relative z-[2] mb-5 inline-flex items-center gap-2.5 rounded-full border border-black/[0.07] bg-white/60 px-[18px] py-2 text-[13px] font-normal text-[#4a4a4a] backdrop-blur-lg animate-[fadeUp_0.8s_ease_both_0.1s]">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#f97316] shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" />
        In Beta Stage - Contains Bugs
      </div>

      <h1 className="relative z-[2] max-w-[820px] animate-[fadeUp_0.8s_ease_both_0.25s] text-[clamp(52px,7.5vw,96px)] font-extrabold leading-[0.97] tracking-[-0.045em] text-[#0a0a0a]">
        Every resume.
        <br />
        Every application.
        <br />
        <em className="font-bold italic text-transparent [-webkit-text-stroke:1.5px_rgba(0,0,0,0.3)]">
          One place.
        </em>
      </h1>

      <p className="relative z-[2] mx-auto mb-[34px] mt-[22px] max-w-[420px] animate-[fadeUp_0.8s_ease_both_0.4s] text-base font-light leading-[1.7] text-[#6a6a6a]">
        Stop losing track of which resume you sent where. Landed gives you a structured vault for
        every version, every application, every stage.
      </p>

      <div className="relative z-[2] flex animate-[fadeUp_0.8s_ease_both_0.55s] flex-wrap items-center justify-center gap-3.5">
        <button
          className="inline-flex items-center gap-2.5 rounded-xl bg-[#0a0a0a] px-6 py-[13px] text-sm font-semibold tracking-[-0.02em] text-white transition hover:-translate-y-0.5 hover:bg-[#1a1a1a] hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
          type="button"
          onClick={() => navigate('/register')}
        >
          Get Started
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f97316] text-[9px]">
            -&gt;
          </span>
        </button>
        <a
          className="flex items-center gap-1 text-sm text-[#6a6a6a] no-underline transition hover:text-[#0a0a0a]"
          href="#product"
        >
          See how it works -&gt;
        </a>
      </div>

      <div className="relative z-[2] mt-14 flex animate-[fadeUp_0.8s_ease_both_0.7s] flex-wrap items-center justify-center gap-7">
        {[
          ['3x', 'more callbacks'],
          ['40%', 'less time tracking'],
          ['2,400+', 'early members']
        ].map(([num, label], index) => (
          <div className="contents" key={label}>
            {index > 0 ? <div className="hidden h-9 w-px bg-[#d4d4d4] sm:block" /> : null}
            <div className="flex flex-col gap-[3px]">
              <div className="text-[28px] font-extrabold tracking-[-0.05em] text-[#0a0a0a]">
                {num}
              </div>
              <div className="text-[11px] uppercase tracking-[0.06em] text-[#9a9a9a]">
                {label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
