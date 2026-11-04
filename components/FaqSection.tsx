"use client";

import { useId, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { faqs } from "@/lib/faqs";
import { motionTokens } from "@/lib/motion";
import { URLS } from "@/lib/urls";

function FaqItem({
  question,
  answer,
  open,
  onToggle,
  index,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
  index: number;
}) {
  const reduce = useReducedMotion();
  const panelId = useId();
  const buttonId = useId();

  return (
    <motion.div
      className="border-b border-white/10 first:border-t"
      initial={reduce ? false : { opacity: 0, y: motionTokens.distance.medium }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{
        duration: motionTokens.duration.moderate,
        delay: Math.min(index * 0.045, 0.28),
        ease: motionTokens.easing.soft,
      }}
    >
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full min-h-11 cursor-pointer list-none items-start justify-between gap-4 py-5 text-left transition-colors duration-200 hover:text-ps-pink-soft md:py-6"
        >
          <span className="text-balance text-base font-semibold tracking-tight text-ps-white sm:text-lg">
            {question}
          </span>
          <motion.span
            aria-hidden
            className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/12 text-ps-dim"
            animate={{ rotate: open ? 45 : 0 }}
            transition={{
              duration: motionTokens.duration.fast,
              ease: motionTokens.easing.standard,
            }}
          >
            +
          </motion.span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={
              reduce
                ? false
                : { height: 0, opacity: 0 }
            }
            animate={{ height: "auto", opacity: 1 }}
            exit={
              reduce
                ? undefined
                : { height: 0, opacity: 0 }
            }
            transition={{
              height: {
                duration: motionTokens.duration.moderate,
                ease: motionTokens.easing.soft,
              },
              opacity: {
                duration: motionTokens.duration.fast,
                ease: motionTokens.easing.enter,
              },
            }}
            className="overflow-hidden"
          >
            <p className="max-w-3xl pb-5 pr-10 text-base leading-relaxed text-ps-muted md:pb-6">
              {answer}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="ps-section bg-[#0a0b10]"
      aria-labelledby="faq-heading"
    >
      <div className="ps-container">
        <Reveal className="max-w-2xl">
          <p className="ps-eyebrow">FAQ</p>
          <h2
            id="faq-heading"
            className="mt-3 text-balance text-[1.75rem] font-semibold leading-tight tracking-tight text-ps-white sm:text-4xl"
          >
            Straight answers.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ps-muted">
            How the products work today — no invented metrics.
          </p>
        </Reveal>

        <div className="mt-12">
          {faqs.map((item, index) => (
            <FaqItem
              key={item.q}
              question={item.q}
              answer={item.a}
              index={index}
              open={openIndex === index}
              onToggle={() =>
                setOpenIndex((prev) => (prev === index ? null : index))
              }
            />
          ))}
        </div>

        <p className="mt-10 text-sm text-ps-dim">
          Still need help?{" "}
          <a
            href={URLS.contactEmail}
            className="inline-flex min-h-11 items-center font-semibold text-ps-pink-soft underline-offset-2 hover:underline"
          >
            marketing@pinksurfing.com
          </a>
        </p>
      </div>
    </section>
  );
}
