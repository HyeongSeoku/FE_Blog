import { useEffect, useState } from "react";

interface TypewriterOptions {
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
}

export function useTypewriter(
  phrases: readonly string[],
  {
    typeSpeed = 38,
    deleteSpeed = 18,
    pauseDuration = 2200,
  }: TypewriterOptions = {},
) {
  const [displayed, setDisplayed] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[phraseIdx];
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayed.length < phrase.length) {
        timer = setTimeout(
          () => setDisplayed(phrase.slice(0, displayed.length + 1)),
          typeSpeed,
        );
      } else {
        timer = setTimeout(() => setIsDeleting(true), pauseDuration);
      }
    } else {
      if (displayed.length > 0) {
        timer = setTimeout(
          () => setDisplayed(displayed.slice(0, -1)),
          deleteSpeed,
        );
      } else {
        setIsDeleting(false);
        setPhraseIdx((i) => (i + 1) % phrases.length);
      }
    }

    return () => clearTimeout(timer);
  }, [
    displayed,
    isDeleting,
    phraseIdx,
    phrases,
    typeSpeed,
    deleteSpeed,
    pauseDuration,
  ]);

  return displayed;
}
