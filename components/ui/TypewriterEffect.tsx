"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  const wordsArray = words.map((word) => ({
    ...word,
    text: word.text.split(""),
  }));

  return (
    <div className={cn("flex space-x-1 my-6", className)}>
      {wordsArray.map((word, idx) => (
        <div key={`word-${idx}`} className="inline-block">
          {word.text.map((char, index) => (
            <motion.span
              key={`char-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.25,
                delay: idx * 0.5 + index * 0.05,
              }}
              className={cn("text-slate-100", word.className)}
            >
              {char}
            </motion.span>
          ))}
          <span>&nbsp;</span>
        </div>
      ))}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "inline-block rounded-sm w-[4px] h-6 bg-neon-blue",
          cursorClassName
        )}
      ></motion.span>
    </div>
  );
};
