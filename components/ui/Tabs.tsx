"use client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Tab = {
  title: string;
  value: string;
  content?: string | React.ReactNode;
};

export const Tabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
  onChange,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
  onChange?: (value: string) => void;
}) => {
  const [active, setActive] = useState<Tab>(propTabs[0]);

  const moveSelectedTabToTop = (idx: number) => {
    const newTabs = [...propTabs];
    const selectedTab = newTabs.splice(idx, 1);
    newTabs.unshift(selectedTab[0]);
    setActive(newTabs[0]);
    if (onChange) {
      onChange(newTabs[0].value);
    }
  };

  return (
    <>
      <div
        className={cn(
          "flex flex-row items-center justify-start [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full gap-2",
          containerClassName
        )}
      >
        {propTabs.map((tab, idx) => (
          <button
            key={tab.value}
            onClick={() => moveSelectedTabToTop(idx)}
            className={cn(
              "relative px-6 py-3 rounded-xl font-semibold transition-all",
              tabClassName
            )}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {active.value === tab.value && (
              <motion.div
                layoutId="clickedbutton"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className={cn(
                  "absolute inset-0 bg-neon-blue/20 border-2 border-neon-blue rounded-xl shadow-[0_0_20px_hsl(var(--neon-blue)/0.5)]",
                  activeTabClassName
                )}
              />
            )}

            <span
              className={cn(
                "relative block text-slate-300 transition-colors",
                active.value === tab.value && "text-neon-blue"
              )}
            >
              {tab.title}
            </span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={active.value}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn("mt-8", contentClassName)}
        >
          {active.content}
        </motion.div>
      </AnimatePresence>
    </>
  );
};
