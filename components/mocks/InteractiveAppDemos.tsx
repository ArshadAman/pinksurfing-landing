"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { MockFrame, MockThumb } from "@/components/mocks/MockFrame";
import {
  ArrowLeftIcon,
  CameraIcon,
  CameraOffIcon,
  ChatBubbleIcon,
  MicIcon,
  MicOffIcon,
  PhoneEndIcon,
  PhoneIcon,
  SendIcon,
  SpeakerIcon,
} from "@/components/mocks/CallDemoIcons";
import { motionTokens } from "@/lib/motion";

type Msg = { id: string; from: "me" | "them"; text: string };

const inbox = [
  {
    id: "alex",
    name: "Alex Rivera",
    preview: "Can we jump on a quick call?",
    time: "2m",
    unread: true,
    tone: "pink" as const,
    seed: [
      { id: "a1", from: "them" as const, text: "Hey — free for a quick sync?" },
      {
        id: "a2",
        from: "them" as const,
        text: "Can we jump on a quick call?",
      },
    ],
  },
  {
    id: "north",
    name: "Northwind Ops",
    preview: "Contract draft looks good.",
    time: "18m",
    unread: false,
    tone: "violet" as const,
    seed: [
      {
        id: "n1",
        from: "them" as const,
        text: "Contract draft looks good.",
      },
      {
        id: "n2",
        from: "me" as const,
        text: "Great — I’ll review tonight.",
      },
    ],
  },
  {
    id: "maya",
    name: "Maya Chen",
    preview: "Sent the PayChat card ✓",
    time: "1h",
    unread: false,
    tone: "slate" as const,
    seed: [
      {
        id: "m1",
        from: "them" as const,
        text: "Sent the PayChat card ✓",
      },
    ],
  },
];

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-[#f472b6]"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}

/** Interactive inbox → thread → type/send/receive. */
export function InteractiveChatDemo({ bare = false }: { bare?: boolean }) {
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Record<string, Msg[]>>(() =>
    Object.fromEntries(inbox.map((c) => [c.id, [...c.seed]])),
  );
  const threadRef = useRef<HTMLDivElement>(null);
  const contact = inbox.find((c) => c.id === activeId);

  // Scroll only inside the thread — never scrollIntoView (that jumps the page / sticky chapters).
  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [messages, typing, activeId, reduce]);

  function send() {
    if (!activeId || !draft.trim()) return;
    const chatId = activeId;
    const text = draft.trim();
    const id = `m-${Date.now()}`;
    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] ?? []), { id, from: "me", text }],
    }));
    setDraft("");
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((prev) => ({
        ...prev,
        [chatId]: [
          ...(prev[chatId] ?? []),
          {
            id: `r-${Date.now()}`,
            from: "them",
            text:
              chatId === "alex"
                ? "Perfect — I’ll call you in a sec."
                : "Got it, thanks!",
          },
        ],
      }));
    }, reduce ? 200 : 1400);
  }

  return (
    <MockFrame
      domain="app.pinksurfing.com"
      title={contact ? contact.name : "Chats"}
      badge={contact ? "Chat" : "Live"}
      bare={bare}
    >
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {!contact ? (
            <motion.div
              key="inbox"
              initial={reduce ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: -16 }}
              transition={{
                duration: motionTokens.duration.normal,
                ease: motionTokens.easing.soft,
              }}
              className="flex flex-1 flex-col"
            >
              <p className="px-4 pt-3 text-[11px] text-[#8a8a8a] sm:px-5">
                Tap a chat to open · type and send
              </p>
              <ul className="flex-1 space-y-2 overflow-y-auto overscroll-contain p-3 sm:p-5">
                {inbox.map((row) => (
                  <li key={row.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(row.id)}
                      className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-[border-color,background,transform] duration-150 hover:border-white/16 active:scale-[0.98] ${
                        row.unread
                          ? "border-[#f472b6]/25 bg-[#1a1420]"
                          : "border-white/[0.08] bg-[#16171f]"
                      }`}
                    >
                      <span className="relative shrink-0">
                        <MockThumb
                          tone={row.tone}
                          label={row.name.slice(0, 1)}
                          size="sm"
                        />
                        {row.unread ? (
                          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#f472b6] ring-2 ring-[#0c0d12]" />
                        ) : null}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-semibold text-white">
                            {row.name}
                          </span>
                          <span className="text-[11px] tabular-nums text-[#8a8a8a]">
                            {row.time}
                          </span>
                        </span>
                        <span
                          className={`mt-0.5 block truncate text-xs ${
                            row.unread ? "text-[#f472b6]" : "text-[#b4b4b4]"
                          }`}
                        >
                          {row.preview}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : (
            <motion.div
              key="thread"
              initial={reduce ? false : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: 20 }}
              transition={{
                duration: motionTokens.duration.normal,
                ease: motionTokens.easing.soft,
              }}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex items-center gap-2 border-b border-white/[0.07] px-3 py-2.5">
                <button
                  type="button"
                  onClick={() => setActiveId(null)}
                  aria-label="Back"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#f472b6] hover:bg-white/5"
                >
                  <ArrowLeftIcon size={18} />
                </button>
                <MockThumb
                  tone={contact.tone}
                  label={contact.name.slice(0, 1)}
                />
                <p className="truncate text-sm font-semibold text-white">
                  {contact.name}
                </p>
              </div>

              <div
                ref={threadRef}
                className="min-h-0 flex-1 space-y-2.5 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5"
              >
                <AnimatePresence initial={false}>
                  {(messages[contact.id] ?? []).map((m) => (
                    <motion.div
                      key={m.id}
                      initial={
                        reduce ? false : { opacity: 0, y: 10, scale: 0.98 }
                      }
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: motionTokens.duration.fast,
                        ease: motionTokens.easing.soft,
                      }}
                      className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <span
                        className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                          m.from === "me"
                            ? "rounded-br-md bg-gradient-to-br from-[#9747ff]/50 to-[#ec4899]/40 text-white"
                            : "rounded-bl-md border border-white/10 bg-[#191924] text-[#e8e8e8]"
                        }`}
                      >
                        {m.text}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {typing ? (
                  <div className="flex justify-start">
                    <span className="rounded-2xl rounded-bl-md border border-white/10 bg-[#191924] px-3.5 py-2.5">
                      <TypingDots />
                    </span>
                  </div>
                ) : null}
              </div>

              <form
                className="border-t border-white/[0.07] p-3 sm:px-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  send();
                }}
              >
                <div className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#14151d] px-2.5 py-2">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    placeholder="Message…"
                    className="min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-[#8a8a8a]"
                    aria-label="Message"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim() || typing}
                    aria-label="Send"
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#f472b6] to-[#9747ff] text-white transition-transform enabled:active:scale-95 disabled:opacity-40"
                  >
                    <SendIcon size={18} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MockFrame>
  );
}

type CallPhase = "incoming" | "active" | "ended";

function RoundCallBtn({
  label,
  showLabel = false,
  tone = "neutral",
  size = "md",
  pressed,
  onClick,
  icon,
}: {
  label: string;
  showLabel?: boolean;
  tone?: "neutral" | "active" | "danger" | "success";
  size?: "md" | "lg";
  pressed?: boolean;
  onClick?: () => void;
  icon: ReactNode;
}) {
  const sizeCls = size === "lg" ? "h-[56px] w-[56px]" : "h-11 w-11 sm:h-12 sm:w-12";
  const toneCls =
    tone === "danger"
      ? "bg-[#e24b4a] text-white"
      : tone === "success"
        ? "bg-[#2ecc71] text-[#0e0f13]"
        : tone === "active"
          ? "bg-white text-[#0e0f13]"
          : "border border-white/20 bg-white/15 text-white";

  return (
    <span className="inline-flex flex-col items-center gap-1.5">
      <button
        type="button"
        aria-label={label}
        aria-pressed={pressed}
        onClick={onClick}
        className={`inline-flex shrink-0 items-center justify-center rounded-full outline-none transition-transform active:scale-[0.97] ${sizeCls} ${toneCls}`}
      >
        {icon}
      </button>
      {showLabel ? (
        <span className="text-[11px] font-medium text-white" aria-hidden>
          {label}
        </span>
      ) : null}
    </span>
  );
}

/** Interactive voice call — layout/icons matched to Ps-web-app CallOverlay / IncomingCallModal. */
export function InteractiveCallDemo() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<CallPhase>("incoming");
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (phase !== "active") return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "ended") return;
    const id = window.setTimeout(
      () => {
        setPhase("incoming");
        setSeconds(0);
        setMuted(false);
        setCamOff(false);
        setSpeakerOn(true);
      },
      reduce ? 600 : 1800,
    );
    return () => window.clearTimeout(id);
  }, [phase, reduce]);

  const clock = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const ringing = phase === "incoming";

  // Phone-ring cadence on the page while this demo is ringing + on screen.
  useEffect(() => {
    const root = document.documentElement;
    if (!ringing || reduce) {
      root.classList.remove("ps-ringing");
      return;
    }

    const el = rootRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const on =
          !!entry?.isIntersecting && (entry.intersectionRatio ?? 0) >= 0.25;
        root.classList.toggle("ps-ringing", on);
      },
      { threshold: [0, 0.25, 0.5, 0.75] },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      root.classList.remove("ps-ringing");
    };
  }, [ringing, reduce]);

  return (
    <div ref={rootRef} className="h-full min-h-0 min-w-0">
    <MockFrame
      domain="app.pinksurfing.com"
      title={phase === "incoming" ? "Incoming call" : "Voice call"}
      badge={
        phase === "active" ? clock : phase === "incoming" ? "Ringing" : "Ended"
      }
    >
      <div
        className="relative flex min-h-0 flex-1 flex-col overflow-hidden"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, #9747ff 38%, #0e0f13), #0e0f13 80%)",
        }}
      >
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#b4b4b4]">
            {phase === "incoming"
              ? "Incoming voice call"
              : phase === "active"
                ? "Voice call"
                : "Call ended"}
          </p>

          <div className="relative flex h-28 w-28 items-center justify-center">
            {ringing && !reduce ? (
              <>
                <span
                  aria-hidden
                  className="absolute inset-0 animate-[ping_2.4s_ease-out_infinite] rounded-full border border-[#f472b6]/35"
                />
                <span
                  aria-hidden
                  className="absolute inset-[-10px] animate-[ping_2.4s_ease-out_0.8s_infinite] rounded-full border border-[#9747ff]/25"
                />
              </>
            ) : null}
            <motion.div
              className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#f472b6] to-[#9747ff] text-3xl font-bold text-white shadow-[0_20px_60px_rgba(151,71,255,0.35)] ring-4 ring-white/10"
              initial={
                phase === "active" && !reduce ? { scale: 1.06 } : false
              }
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              key={phase === "active" ? "connected" : "idle"}
            >
              AR
            </motion.div>
          </div>

          <h2 className="mt-6 truncate text-xl font-semibold tracking-tight text-white">
            Alex Rivera
          </h2>
          <p
            className={`mt-1 text-sm tabular-nums ${
              phase === "ended" ? "text-[#e24b4a]" : "text-[#b4b4b4]"
            }`}
            role="status"
          >
            {phase === "incoming"
              ? "Ringing…"
              : phase === "active"
                ? clock
                : "Call ended"}
          </p>
        </div>

        <div className="relative z-10 flex shrink-0 flex-col items-center gap-5 px-4 pb-6 pt-2">
          <AnimatePresence mode="wait" initial={false}>
            {phase === "incoming" ? (
              <motion.div
                key="incoming-controls"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: 8 }}
                transition={{
                  duration: motionTokens.duration.normal,
                  ease: motionTokens.easing.soft,
                }}
                className="flex w-full max-w-xs flex-col items-center gap-5"
              >
                <button
                  type="button"
                  onClick={() => setPhase("ended")}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-transform active:scale-[0.97]"
                >
                  <ChatBubbleIcon size={16} />
                  Message
                </button>
                <div className="flex w-full items-start justify-between px-2">
                  <RoundCallBtn
                    size="lg"
                    tone="danger"
                    showLabel
                    label="Decline"
                    icon={<PhoneEndIcon size={26} />}
                    onClick={() => setPhase("ended")}
                  />
                  <RoundCallBtn
                    size="lg"
                    tone="success"
                    showLabel
                    label="Answer"
                    icon={<PhoneIcon size={26} />}
                    onClick={() => {
                      setSeconds(0);
                      setPhase("active");
                    }}
                  />
                </div>
              </motion.div>
            ) : null}

            {phase === "active" ? (
              <motion.div
                key="active-controls"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: 8 }}
                transition={{
                  duration: motionTokens.duration.normal,
                  ease: motionTokens.easing.soft,
                }}
                className="flex flex-col items-center gap-5"
                role="toolbar"
                aria-label="Call controls"
              >
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <RoundCallBtn
                    label={muted ? "Unmute" : "Mute"}
                    pressed={muted}
                    tone={muted ? "active" : "neutral"}
                    icon={
                      muted ? <MicOffIcon size={22} /> : <MicIcon size={22} />
                    }
                    onClick={() => setMuted((m) => !m)}
                  />
                  <RoundCallBtn
                    label={camOff ? "Turn camera on" : "Turn camera off"}
                    pressed={camOff}
                    tone={camOff ? "active" : "neutral"}
                    icon={
                      camOff ? (
                        <CameraOffIcon size={22} />
                      ) : (
                        <CameraIcon size={22} />
                      )
                    }
                    onClick={() => setCamOff((c) => !c)}
                  />
                  <RoundCallBtn
                    label={speakerOn ? "Use earpiece" : "Use loudspeaker"}
                    pressed={speakerOn}
                    tone={speakerOn ? "active" : "neutral"}
                    icon={<SpeakerIcon size={22} />}
                    onClick={() => setSpeakerOn((s) => !s)}
                  />
                </div>
                <RoundCallBtn
                  size="lg"
                  tone="danger"
                  label="End call"
                  icon={<PhoneEndIcon size={26} />}
                  onClick={() => setPhase("ended")}
                />
              </motion.div>
            ) : null}

            {phase === "ended" ? (
              <motion.p
                key="ended"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pb-2 text-xs text-[#8a8a8a]"
              >
                Ringing again in a moment…
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </MockFrame>
    </div>
  );
}

type PayPhase = "card" | "paying" | "paid";

/** Interactive PayChat: pay-per-message → success / unlimited replies. */
export function InteractivePayChatDemo() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<PayPhase>("card");

  useEffect(() => {
    if (phase !== "paying") return;
    const id = window.setTimeout(
      () => setPhase("paid"),
      reduce ? 300 : 1200,
    );
    return () => window.clearTimeout(id);
  }, [phase, reduce]);

  return (
    <MockFrame domain="app.pinksurfing.com" title="PayChat" badge="Square">
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="relative overflow-hidden rounded-[1.35rem] border border-white/[0.1] bg-gradient-to-br from-[#1e1530] via-[#16171f] to-[#1a1224] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
          <div
            aria-hidden
            className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(244,114,182,0.25),transparent_70%)]"
          />

          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f472b6]">
                PayChat card
              </p>
              <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-[#b4b4b4] ring-1 ring-white/10">
                US receive
              </span>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <MockThumb tone="pink" label="JB" />
              <div>
                <p className="text-xl font-semibold tracking-tight text-white">
                  Jordan Blake
                </p>
                <p className="mt-0.5 text-sm text-[#b4b4b4]">
                  Consultant · Strategy
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-2.5">
              <div className="rounded-2xl border border-white/[0.08] bg-black/25 px-4 py-3.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8a8a8a]">
                  Pricing
                </p>
                <p className="mt-1 text-base font-semibold text-white">
                  Pay per message
                </p>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-black/25 px-4 py-3.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8a8a8a]">
                  When you get paid
                </p>
                <p className="mt-1 text-base font-semibold text-white">
                  Unlimited messages you can send
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {phase === "card" ? (
                <motion.button
                  key="pay"
                  type="button"
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  onClick={() => setPhase("paying")}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-white py-3.5 text-sm font-semibold text-[#0e0f13] shadow-[0_12px_32px_rgba(0,0,0,0.25)] transition-transform active:scale-[0.98]"
                >
                  <svg width="16" height="16" viewBox="0 0 32 32" aria-hidden>
                    <path
                      fill="#0e0f13"
                      fillRule="evenodd"
                      d="M6 0h20a6 6 0 0 1 6 6v20a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6Zm3.5 9.5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-9Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Pay with Square
                </motion.button>
              ) : null}

              {phase === "paying" ? (
                <motion.div
                  key="paying"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 py-3.5 text-sm font-semibold text-white"
                >
                  <TypingDots />
                  Processing…
                </motion.div>
              ) : null}

              {phase === "paid" ? (
                <motion.div
                  key="paid"
                  initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-5 space-y-3"
                >
                  <div className="rounded-full bg-gradient-to-r from-[#2ecc71]/90 to-[#27ae60] py-3.5 text-center text-sm font-semibold text-white">
                    Paid · unlimited replies unlocked
                  </div>
                  <button
                    type="button"
                    onClick={() => setPhase("card")}
                    className="w-full text-center text-xs font-semibold text-[#f472b6] hover:underline"
                  >
                    Reset demo
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-[#8a8a8a]">
          Receiving PayChat is available in the United States only. Tap pay to
          try the flow.
        </p>
      </div>
    </MockFrame>
  );
}
