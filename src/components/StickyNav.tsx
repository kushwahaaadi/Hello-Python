import React from 'react';

interface StickyNavProps {
  visible: boolean;
  onScrollToSection: (id: string) => void;
}

export const StickyNav: React.FC<StickyNavProps> = ({
  visible,
  onScrollToSection,
}) => {
  return (
    <header
      aria-label="Chapter navigation"
      className={`fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#030304]/85 backdrop-blur-md transition-all duration-300 ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-full opacity-0'
      }`}
    >
      <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between gap-8 px-6 sm:px-10">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-editorial text-lg italic tracking-tight text-white whitespace-nowrap shrink-0"
        >
          Hail CSI!
        </a>

        <nav className="hidden items-center gap-6 text-xs font-medium text-zinc-400 md:flex">
          <button
            type="button"
            onClick={() => onScrollToSection('register')}
            className="transition-colors hover:text-white whitespace-nowrap shrink-0"
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => onScrollToSection('curriculum')}
            className="transition-colors hover:text-white whitespace-nowrap shrink-0"
          >
            Curriculum
          </button>
          <button
            type="button"
            onClick={() => onScrollToSection('about')}
            className="transition-colors hover:text-white whitespace-nowrap shrink-0"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => onScrollToSection('hackaccino')}
            className="transition-colors hover:text-white whitespace-nowrap shrink-0"
          >
            Hackaccino
          </button>
          <button
            type="button"
            onClick={() => onScrollToSection('showcase-album')}
            className="transition-colors hover:text-white whitespace-nowrap shrink-0"
          >
            Showcase
          </button>
          <button
            type="button"
            onClick={() => onScrollToSection('faq')}
            className="transition-colors hover:text-white whitespace-nowrap shrink-0"
          >
            FAQ
          </button>
        </nav>

        <button
          type="button"
          onClick={() => onScrollToSection('register')}
          className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:border-white/50 hover:bg-white/5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Join Chapter
        </button>
      </div>
    </header>
  );
};
