import { useNavigate } from 'react-router-dom';
import { Reveal } from './Reveal';

export const ProofSection = () => (
  <section id="proof">
    <Reveal className="mx-auto max-w-[1100px] border-t border-[#ebebeb] px-5 py-[130px] text-center md:px-11">
      <div className="mb-[30px] inline-block rounded-full border border-[#ebebeb] px-[13px] py-[5px] text-[11px] font-medium uppercase tracking-[0.08em] text-[#6a6a6a]">
        Early feedback
      </div>
      <div className="mx-auto mb-[26px] max-w-[700px] text-[clamp(24px,3.2vw,40px)] font-bold leading-[1.2] tracking-[-0.03em] text-[#0a0a0a]">
        "I used to track applications in a <em className="italic text-[#f97316]">Google Sheet</em>{' '}
        with 11 columns. Landed replaced all of it in an afternoon."
      </div>
      <div className="flex items-center justify-center gap-3">
        <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-gradient-to-br from-[#f97316] to-[#8b5cf6] text-sm font-bold text-white">
          A
        </div>
        <div className="text-left">
          <div className="text-[13px] font-semibold text-[#0a0a0a]">Arjun Sharma</div>
          <div className="text-xs text-[#9a9a9a]">Software Engineer - Received 3 offers in 6 weeks</div>
        </div>
      </div>
    </Reveal>
  </section>
);

export const CtaSection = () => {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-[1100px] px-5 pb-[130px] md:px-11">
      <Reveal>
        <div className="relative overflow-hidden rounded-[20px] bg-[#0a0a0a] px-6 py-20 text-center md:px-[60px]">
          <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.3),transparent_70%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:56px_56px]" />
          <h2 className="relative z-[1] mb-4 text-[clamp(38px,5.5vw,68px)] font-extrabold leading-[1.02] tracking-[-0.045em] text-white">
            Stop guessing.
            <br />
            Start <em className="italic text-[#f97316]">landing.</em>
          </h2>
          <p className="relative z-[1] mx-auto mb-8 max-w-[460px] text-[15px] font-light leading-[1.7] text-white/50">
            Your first offer is closer than you think - start with a clear system.
          </p>
          <div className="relative z-[1] flex items-center justify-center gap-3.5">
            <button
              className="inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold tracking-[-0.02em] text-[#0a0a0a] transition hover:-translate-y-0.5 hover:bg-[#f0f0f0] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
              type="button"
              onClick={() => navigate('/login?mode=register')}
            >
              Early Access
              <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#f97316] text-[10px] transition group-hover:rotate-45">
                -&gt;
              </span>
            </button>
          </div>
          <p className="relative z-[1] mt-3.5 text-xs text-white/20">Free to start - No credit card required</p>
        </div>
      </Reveal>
    </section>
  );
};
