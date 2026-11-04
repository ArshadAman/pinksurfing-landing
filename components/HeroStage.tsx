"use client";

import {
  motion,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { MockChatUi } from "@/components/mocks/AppUiMocks";

type HeroStageProps = {
  phoneY?: MotionValue<number>;
  phoneRotate?: MotionValue<number>;
  cardY?: MotionValue<number>;
  cardX?: MotionValue<number>;
  bubbleY?: MotionValue<number>;
  bubbleX?: MotionValue<number>;
  ringScale?: MotionValue<number>;
  orbA?: MotionValue<number>;
  orbB?: MotionValue<number>;
};

/** Live motion-graphic stage — phone + orbiting UI chips, scrubbed by hero scroll. */
export function HeroStage({
  phoneY,
  phoneRotate,
  cardY,
  cardX,
  bubbleY,
  bubbleX,
  ringScale,
  orbA,
  orbB,
}: HeroStageProps) {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[360px] sm:max-w-[400px] lg:max-w-[440px] lg:aspect-square">
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
        style={reduce || !ringScale ? undefined : { scale: ringScale }}
      />
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[94%] w-[94%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/6"
        style={reduce || !ringScale ? undefined : { scale: ringScale }}
      />

      <motion.div
        aria-hidden
        className="absolute left-[4%] top-[10%]"
        style={reduce || !orbA ? undefined : { y: orbA }}
      >
        <motion.div
          className="h-14 w-14 rounded-full bg-gradient-to-br from-[#f472b6]/55 to-[#9747ff]/25 blur-[1px] sm:h-16 sm:w-16"
          animate={reduce ? undefined : { y: [0, -16, 0], x: [0, 8, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <motion.div
        aria-hidden
        className="absolute bottom-[12%] right-[2%]"
        style={reduce || !orbB ? undefined : { y: orbB }}
      >
        <motion.div
          className="h-12 w-12 rounded-full bg-gradient-to-br from-[#9747ff]/50 to-[#ec4899]/30 sm:h-14 sm:w-14"
          animate={reduce ? undefined : { y: [0, 18, 0], x: [0, -10, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Orbiting chips — desktop only; cramped on mobile */}
      <motion.div
        className="absolute left-[-4%] top-[20%] z-20 hidden lg:block"
        style={
          reduce || !bubbleY
            ? undefined
            : { y: bubbleY, x: bubbleX }
        }
        aria-hidden
      >
        <motion.div
          className="max-w-[140px] rounded-2xl border border-white/14 bg-[#191924]/95 px-3 py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-md sm:max-w-[158px] sm:px-3.5 sm:py-3"
          animate={
            reduce ? undefined : { y: [0, -14, 0], rotate: [-3, 2, -3] }
          }
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="mb-1.5 flex gap-1">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ps-pink-soft" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ps-pink-soft [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ps-pink-soft [animation-delay:300ms]" />
          </div>
          <p className="text-[11px] font-semibold text-ps-pink-soft">Live chat</p>
          <p className="mt-0.5 text-xs text-ps-white">Alex is typing…</p>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-[8%] right-[-2%] z-20 hidden lg:block"
        style={reduce || !cardY ? undefined : { y: cardY, x: cardX }}
        aria-hidden
      >
        <motion.div
          className="w-[148px] overflow-hidden rounded-2xl border border-white/14 bg-gradient-to-br from-[#2a1838] to-[#191924] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] sm:w-[168px] sm:p-3.5"
          animate={
            reduce ? undefined : { y: [0, 16, 0], rotate: [4, -2, 4] }
          }
          transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ps-purple-light">
            PayChat
          </p>
          <p className="mt-1.5 text-sm font-semibold text-white sm:mt-2 sm:text-lg">
            Per message
          </p>
          <p className="mt-0.5 text-[11px] text-ps-muted">Square</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full w-2/3 rounded-full bg-gradient-to-r from-ps-pink-soft to-ps-primary"
              animate={reduce ? undefined : { x: ["-30%", "50%", "-30%"] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden
        className="absolute right-0 top-[6%] z-20 hidden lg:block"
        animate={
          reduce ? undefined : { y: [0, -12, 0], scale: [1, 1.05, 1] }
        }
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center gap-2 rounded-full border border-white/14 bg-[#191924]/95 px-3 py-2 shadow-lg backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ps-green opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-ps-green" />
          </span>
          <span className="text-[11px] font-semibold text-ps-white">On call</span>
        </div>
      </motion.div>

      <motion.div
        className="absolute left-1/2 top-[52%] z-10 w-[74%] max-w-[270px] -translate-x-1/2 -translate-y-1/2 will-change-transform sm:max-w-[290px] sm:w-[70%]"
        style={
          reduce || !phoneY
            ? undefined
            : { y: phoneY, rotate: phoneRotate }
        }
      >
        <div className="rounded-[1.75rem] border border-white/18 bg-[#050507] p-[0.45rem] shadow-[0_40px_100px_rgba(0,0,0,0.65)] sm:rounded-[2.1rem] sm:p-[0.6rem]">
          <div className="relative overflow-hidden rounded-[1.35rem] bg-ps-bg sm:rounded-[1.6rem]">
            <div
              aria-hidden
              className="absolute left-1/2 top-2 z-10 h-1.5 w-12 -translate-x-1/2 rounded-full bg-black/85 sm:top-2.5 sm:w-16"
            />
            <div
              className="pointer-events-none select-none origin-top scale-[0.94] pt-3 sm:pt-4 [&_>div]:!min-h-[300px] sm:[&_>div]:!min-h-[380px]"
              aria-hidden
              inert
            >
              <MockChatUi bare />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
