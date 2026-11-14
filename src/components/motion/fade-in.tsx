"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import {
  EASE_OUT_PREMIUM,
  REVEAL_DURATION,
  REVEAL_Y,
  STAGGER_CHILD,
} from "@/components/motion/motion-tokens";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Conteúdo sempre visível (opacity 1). Animação opcional de translateY leve no scroll.
 */
export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      data-fade-in=""
      initial={{ opacity: 1, y: REVEAL_Y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: REVEAL_DURATION, delay, ease: EASE_OUT_PREMIUM }}
    >
      {children}
    </motion.div>
  );
}

interface FadeInStaggerProps {
  children: ReactNode;
  className?: string;
  as?: "ul" | "div";
}

export function FadeInStagger({
  children,
  className,
  as = "div",
}: FadeInStaggerProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const MotionTag = as === "ul" ? motion.ul : motion.div;

  return (
    <MotionTag
      className={className}
      data-fade-in=""
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.05 }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: STAGGER_CHILD, delayChildren: 0.05 },
        },
      }}
    >
      {children}
    </MotionTag>
  );
}

export function FadeInStaggerItem({
  children,
  className,
  as = "li",
}: {
  children: ReactNode;
  className?: string;
  as?: "li" | "div";
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    const El = as;
    return <El className={className}>{children}</El>;
  }

  const MotionItem = as === "li" ? motion.li : motion.div;

  return (
    <MotionItem
      className={className}
      variants={{
        hidden: { opacity: 1, y: REVEAL_Y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: REVEAL_DURATION, ease: EASE_OUT_PREMIUM },
        },
      }}
    >
      {children}
    </MotionItem>
  );
}