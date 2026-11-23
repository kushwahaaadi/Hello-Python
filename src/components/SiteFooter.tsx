import React from 'react';
import { RotateCcw } from 'lucide-react';
import csiNavyLogo from '../assets/images/csi_logo_navy.png';

interface SiteFooterProps {
  showReplay: boolean;
  onReplayIntro: () => void;
  onScrollToSection: (id: string) => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({
  showReplay,
  onReplayIntro,
  onScrollToSection,
}) => {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0b] py-10 sm:py-14">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center sm:items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-10">
        <div className="flex items-center gap-3">
          <img
            src={csiNavyLogo}
            alt="Computer Society of India"
            className="h-8 w-8 rounded-full object-contain"
          />
          <div className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#f2f2f2]/55">
            <span className="text-zinc-200 font-semibold">Computer Society of India</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.05em] text-[#f2f2f2]/55">
          {showReplay && (
            <button
              type="button"
              onClick={onReplayIntro}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-white hover:underline underline-offset-4"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Replay intro</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="transition-colors hover:text-white hover:underline underline-offset-4"
          >
            Back to top
          </button>
          <button
            type="button"
            onClick={() => onScrollToSection('register')}
            className="transition-colors hover:text-white hover:underline underline-offset-4"
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => onScrollToSection('curriculum')}
            className="transition-colors hover:text-white hover:underline underline-offset-4"
          >
            Curriculum
          </button>
          <button
            type="button"
            onClick={() => onScrollToSection('about')}
            className="transition-colors hover:text-white hover:underline underline-offset-4"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => onScrollToSection('hackaccino')}
            className="transition-colors hover:text-white hover:underline underline-offset-4"
          >
            Hackaccino
          </button>
          <button
            type="button"
            onClick={() => onScrollToSection('faq')}
            className="transition-colors hover:text-white hover:underline underline-offset-4"
          >
            FAQ
          </button>
        </div>
      </div>
    </footer>
  );
};
