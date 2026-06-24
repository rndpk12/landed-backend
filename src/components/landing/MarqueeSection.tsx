import { jobBoards } from './landingData';

export const MarqueeSection = () => (
  <div className="overflow-hidden border-y border-[#ebebeb] bg-[#f9f9f9] py-[22px]">
    <div className="mb-5 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-[#c8c8c8]">
      Works with every job board
    </div>
    <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent_0%,#000_7%,#000_93%,transparent_100%)]">
      <div className="flex w-max items-center animate-[mq-rtl_28s_linear_infinite] hover:[animation-play-state:paused]">
        {[...jobBoards, ...jobBoards].map((name, index) => (
          <div className="flex shrink-0 items-center px-14" key={`${name}-${index}`}>
            <span className="whitespace-nowrap text-[22px] font-bold tracking-[-0.01em] text-[#c8c8c8] transition hover:text-[#888]">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);
