import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface StickyNavProps {
  visible: boolean;
  onScrollToSection: (id: string) => void;
}

export const StickyNav: React.FC<StickyNavProps> = ({
  visible,
  onScrollToSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onScrollToSection(id);
  };

  return (
    <header
      aria-label="Chapter navigation"
      className={`fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#030304]/90 backdrop-blur-md transition-all duration-300 ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-full opacity-0'
      }`}
    >
      <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between gap-3 px-4 sm:px-10">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-editorial text-lg italic tracking-tight text-white whitespace-nowrap shrink-0"
        >
          Hail CSI!
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-xs font-medium text-zinc-400 md:flex">
          <button
            type="button"
            onClick={() => handleNavClick('register')}
            className="transition-colors hover:text-white whitespace-nowrap shrink-0"
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('curriculum')}
            className="transition-colors hover:text-white whitespace-nowrap shrink-0"
          >
            Curriculum
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('about')}
            className="transition-colors hover:text-white whitespace-nowrap shrink-0"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('hackaccino')}
            className="transition-colors hover:text-white whitespace-nowrap shrink-0"
          >
            Hackaccino
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('showcase-album')}
            className="transition-colors hover:text-white whitespace-nowrap shrink-0"
          >
            Showcase
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('faq')}
            className="transition-colors hover:text-white whitespace-nowrap shrink-0"
          >
            FAQ
          </button>
        </nav>

        {/* Actions: Register CTA + Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => handleNavClick('register')}
            className="rounded-full border border-white/20 px-3 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-xs font-medium text-white transition-colors hover:border-white/50 hover:bg-white/5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Register Now
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-zinc-300 md:hidden hover:border-white/30 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#08080a]/95 px-6 py-4 backdrop-blur-xl md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-3 font-sans text-sm font-medium text-zinc-300">
            <button
              type="button"
              onClick={() => handleNavClick('register')}
              className="text-left py-1 hover:text-white transition-colors flex items-center justify-between"
            >
              <span>Register</span>
              <span className="text-[10px] uppercase font-mono text-white/40">Event</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('curriculum')}
              className="text-left py-1 hover:text-white transition-colors flex items-center justify-between"
            >
              <span>Curriculum</span>
              <span className="text-[10px] uppercase font-mono text-white/40">Modules</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('about')}
              className="text-left py-1 hover:text-white transition-colors flex items-center justify-between"
            >
              <span>About CSI</span>
              <span className="text-[10px] uppercase font-mono text-white/40">Chapter</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('hackaccino')}
              className="text-left py-1 hover:text-white transition-colors flex items-center justify-between"
            >
              <span>Hackaccino</span>
              <span className="text-[10px] uppercase font-mono text-white/40">Hackathon</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('showcase-album')}
              className="text-left py-1 hover:text-white transition-colors flex items-center justify-between"
            >
              <span>Showcase</span>
              <span className="text-[10px] uppercase font-mono text-white/40">Archive</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('faq')}
              className="text-left py-1 hover:text-white transition-colors flex items-center justify-between"
            >
              <span>FAQ</span>
              <span className="text-[10px] uppercase font-mono text-white/40">Help</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
