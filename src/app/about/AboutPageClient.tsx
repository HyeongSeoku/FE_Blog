"use client";

import { useEffect } from "react";
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

export default function AboutPageClient() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const target = document.getElementById(hash.replace("#", ""));
    if (!target) return;
    window.scrollTo(0, 0);
    setTimeout(
      () => target.scrollIntoView({ behavior: "smooth", block: "start" }),
      100,
    );
  }, []);

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
