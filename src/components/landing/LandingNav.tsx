import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingNav = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-[199] flex h-14 items-center justify-between border-b px-5 transition duration-300 md:px-11 ${
        scrolled
          ? 'border-[#ebebeb] bg-white/90 backdrop-blur-2xl'
          : 'border-transparent bg-transparent'
      }`}
    >
      <a className="text-2xl font-extrabold tracking-[-0.04em] text-[#0a0a0a] no-underline" href="#">
        landed
      </a>
      <ul className="hidden list-none gap-1 md:flex">
        {[
          ['Product', '#product'],
          ['Features', '#features'],
          ['Pricing', '#proof'],
          ['Resources', '#learn']
        ].map(([label, href]) => (
          <li key={label}>
            <a
              className="rounded-[7px] px-[13px] py-1.5 text-[13px] text-[#6a6a6a] no-underline transition hover:bg-[#f5f5f5] hover:text-[#0a0a0a]"
              href={href}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2.5">
        <button
          className="px-3 py-1.5 text-[13px] text-[#6a6a6a] transition hover:text-[#0a0a0a]"
          type="button"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
        <button
          className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] px-[18px] py-2 text-[13px] font-semibold tracking-[-0.01em] text-white no-underline transition hover:-translate-y-px hover:opacity-85"
          type="button"
          onClick={() => navigate('/login?mode=register')}
        >
          Get Started
        </button>
      </div>
    </nav>
  );
};
