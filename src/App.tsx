import React, { useCallback, useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { PythonLogoParticleIntro } from './components/PythonLogoParticleIntro';
import { Floating3DCsiLogo } from './components/Floating3DCsiLogo';
import { StickyNav } from './components/StickyNav';
import { HeroSection } from './components/HeroSection';
import { RegistrationSection } from './components/RegistrationSection';
import { AboutSection } from './components/AboutSection';
import { HackaccinoSection } from './components/HackaccinoSection';
import { ScrollerAlbum } from './components/ScrollerAlbum';
import { FaqSection } from './components/FaqSection';
import { SiteFooter } from './components/SiteFooter';

export default function App() {
  const prefersReducedMotion = useReducedMotion();
  const [showPreloader, setShowPreloader] = useState(!prefersReducedMotion);
  const [introReady, setIntroReady] = useState(Boolean(prefersReducedMotion));
  const [introIteration, setIntroIteration] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showStickyNav, setShowStickyNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight || 900;
      const y = window.scrollY;
      setScrollProgress(Math.min(1, Math.max(0, y / (vh * 0.85))));
      setShowStickyNav(y > vh * 0.72);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    setShowPreloader(false);
    setIntroReady(true);
  }, []);

  const handleReplayIntro = () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setIntroReady(false);
    setIntroIteration((n) => n + 1);
    setShowPreloader(true);
  };

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#030304] text-[#F4F4F5]">
      <PythonLogoParticleIntro
        key={introIteration}
        active={showPreloader}
        onComplete={handlePreloaderComplete}
      />

      <Floating3DCsiLogo
        visible={introReady}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      <StickyNav
        visible={showStickyNav}
        onScrollToSection={scrollToSection}
      />

      <HeroSection
        introReady={introReady}
        introIteration={introIteration}
        scrollProgress={scrollProgress}
        onSelectLeader={() => scrollToSection('about')}
        onExploreWork={() => scrollToSection('register')}
      />

      <main>
        <RegistrationSection />
        <AboutSection />
        <HackaccinoSection />
        <ScrollerAlbum />
        <FaqSection />
      </main>

      <SiteFooter
        showReplay={!prefersReducedMotion}
        onReplayIntro={handleReplayIntro}
        onScrollToSection={scrollToSection}
      />
    </div>
  );
}
