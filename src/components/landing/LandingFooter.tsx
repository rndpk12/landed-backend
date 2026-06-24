import { useNavigate } from 'react-router-dom';

const columns = [
  ['Product', 'Resume versions', 'Application tracker', 'Diff viewer', 'Job link parser', 'Mobile access'],
  ['Resources', 'How it works', 'Pricing', 'FAQ', 'Contact'],
  ['Company', 'About', 'Blog', 'Careers', 'Twitter / X']
];

export const LandingFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="mx-auto max-w-[1100px] border-t border-[#ebebeb] px-5 pt-[60px] md:px-11">
      <div className="mb-[50px] grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-11">
        <div>
          <div className="mb-2.5 text-lg font-extrabold tracking-[-0.04em] text-[#0a0a0a]">landed</div>
          <p className="mb-[18px] max-w-[210px] text-[13px] leading-[1.65] text-[#9a9a9a]">
            Version control for your job search. One place for every resume, application, and offer.
          </p>
          <button
            className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] px-4 py-[7px] text-xs font-semibold tracking-[-0.01em] text-white transition hover:-translate-y-px hover:opacity-85"
            type="button"
            onClick={() => navigate('/register')}
          >
            Get Started
          </button>
        </div>
        {columns.map(([label, ...links]) => (
          <div key={label}>
            <div className="mb-3.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#d4d4d4]">
              {label}
            </div>
            <ul className="flex list-none flex-col gap-[9px]">
              {links.map((link) => (
                <li key={link}>
                  <a className="text-[13px] text-[#9a9a9a] no-underline transition hover:text-[#0a0a0a]" href="#">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="-mx-5 flex items-center justify-center border-y border-[#ebebeb] py-10 md:-mx-11">
        <div className="select-none whitespace-nowrap font-serif text-[clamp(120px,30vw,420px)] font-black leading-[0.9] tracking-[-0.04em] text-black">
          Landed
        </div>
      </div>
      <div className="flex flex-col gap-3 border-t border-[#ebebeb] py-[18px] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-[22px]">
          {['Terms', 'Privacy', 'Security'].map((item) => (
            <a className="text-xs text-[#9a9a9a] no-underline transition hover:text-[#0a0a0a]" href="#" key={item}>
              {item}
            </a>
          ))}
        </div>
        <div className="text-xs text-[#9a9a9a]">© 2026 Landed, Inc. All rights reserved.</div>
      </div>
    </footer>
  );
};
