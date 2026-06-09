import React, { useEffect, useState, useRef } from "react";

const WORDS = ["daliaxez", "daily", "dali", "dal", "dlx", "dalia"];
const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#%&0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const GlitchWord: React.FC = () => {
  const [currentWord, setCurrentWord] = useState("daliaxez");
  const [displayedText, setDisplayedText] = useState("daliaxez");
  const [isGlitching, setIsGlitching] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    let nextWordTimeout: NodeJS.Timeout;

    const startTransition = () => {
      // Pick a random word that is NOT the same as the current word
      const availableWords = WORDS.filter(w => w !== currentWord);
      const targetWord = availableWords[Math.floor(Math.random() * availableWords.length)];
      
      setIsGlitching(true);
      
      const duration = 400; // Transition duration in ms
      const startTime = performance.now();
      const originalWord = currentWord;

      const runScramble = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (progress < 1) {
          // Determine the temporary interpolated length as the word is decoding
          const currentLength = Math.round(
            originalWord.length + (targetWord.length - originalWord.length) * progress
          );

          let result = "";
          for (let i = 0; i < currentLength; i++) {
            // As progress increases, the probability of selecting the correct target letter boosts
            const targetCharProb = progress * 1.3;
            if (Math.random() < targetCharProb) {
              result += targetWord[i] || targetWord[Math.floor(Math.random() * targetWord.length)];
            } else if (Math.random() < 0.4) {
              result += originalWord[i] || GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
            } else {
              result += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
            }
          }

          setDisplayedText(result.toLowerCase());
          animationRef.current = requestAnimationFrame(runScramble);
        } else {
          setDisplayedText(targetWord);
          setCurrentWord(targetWord);
          setIsGlitching(false);
          
          // Schedule next word change randomly between 3.5s and 5.5s
          nextWordTimeout = setTimeout(startTransition, 3500 + Math.random() * 2000);
        }
      };

      animationRef.current = requestAnimationFrame(runScramble);
    };

    // First transition triggers after 4.5 seconds of static load
    nextWordTimeout = setTimeout(startTransition, 4500);

    return () => {
      clearTimeout(nextWordTimeout);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentWord]);

  return (
    <span className={`relative inline-block font-medium ${isGlitching ? "select-none text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" : "text-white transition-all duration-300"}`}>
      {displayedText}
      {isGlitching && (
        <>
          {/* Cyan/Blue chromatic displacement projection */}
          <span 
            className="absolute left-0 top-0 text-pink-500 opacity-60 select-none pointer-events-none" 
            style={{ 
              transform: `translate(${Math.random() * 4 - 2}px, ${Math.random() * 2 - 1}px)`,
              clipPath: "inset(15% 0 10% 0)"
            }}
          >
            {displayedText}
          </span>
          {/* Yellow/Indigo chromatic displacement projection */}
          <span 
            className="absolute left-0 top-0 text-cyan-400 opacity-60 select-none pointer-events-none" 
            style={{ 
              transform: `translate(${Math.random() * -4 + 2}px, ${Math.random() * -2 + 1}px)`,
              clipPath: "inset(45% 0 5% 0)"
            }}
          >
            {displayedText}
          </span>
        </>
      )}
    </span>
  );
};
