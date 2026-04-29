"use client";

import "./about.css";
import { AboutFooter } from "./_components/AboutFooter";
import { BlogCta } from "./_components/BlogCta";
import { Career } from "./_components/Career";
import { CursorSpotlight } from "./_components/CursorSpotlight";
import { Hero } from "./_components/Hero";
import { OpenSource } from "./_components/OpenSource";
import { Projects } from "./_components/Projects";
import { Skills } from "./_components/Skills";
import { Stats } from "./_components/Stats";
import { useHashScroll } from "./_hooks/useHashScroll";

export default function AboutPageClient() {
  useHashScroll();

  return (
    <div>
      <CursorSpotlight />
      <Hero />
      <Stats />
      <Skills />
      <Career />
      <Projects />
      <OpenSource />
      <BlogCta />
      <AboutFooter />
    </div>
  );
}
