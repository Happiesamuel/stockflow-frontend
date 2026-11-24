"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Status = "idle" | "error" | "success";

type Props = {
  value: string[];
  onChange: (digits: string[]) => void;
  status?: Status;
  disabled?: boolean;
  autoFocus?: boolean;
};

/** Reusable OTP boxes: typing, backspace, arrow keys and paste all work. */
export function OtpInput({
  value,
  onChange,
  status = "idle",
  disabled,
  autoFocus,
}: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const length = value.length;

  const focus = (i: number) =>
    refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();

  function setDigit(i: number, digit: string) {
    const next = [...value];
    next[i] = digit;
    onChange(next);
  }

  function handleChange(i: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    if (!digit) return;
    setDigit(i, digit);
    focus(i + 1);
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (value[i]) setDigit(i, "");
      else if (i > 0) {
        setDigit(i - 1, "");
        focus(i - 1);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focus(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focus(i + 1);
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!digits) return;
    onChange(Array.from({ length }, (_, k) => digits[k] ?? ""));
    focus(digits.length >= length ? length - 1 : digits.length);
  }

  return (
    <motion.div
      className="grid grid-cols-6 gap-2.5 sm:gap-5"
      animate={
        status === "error" ? { x: [0, -10, 10, -8, 8, -4, 0] } : { x: 0 }
      }
      transition={{ duration: 0.45 }}
      onPaste={handlePaste}
    >
      {value.map((digit, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onFocus={(e) => e.target.select()}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          autoFocus={autoFocus && i === 0}
          disabled={disabled}
          aria-label={`Digit ${i + 1} of ${length}`}
          maxLength={1}
          className={cn(
            "h-12 w-full min-w-0 rounded-2xl border bg-white/[0.04] text-center text-2xl font-semibold text-white caret-white outline-none transition sm:h-18",
            "border-white/15 focus:border-[#7fd4ff] focus:bg-white/[0.07] focus:shadow-[0_0_0_2px_rgba(127,212,255,0.35),0_0_24px_rgba(95,180,255,0.45)]",
            status === "error" &&
              "border-red-400/70 focus:border-red-400 focus:shadow-[0_0_0_2px_rgba(248,113,113,0.3),0_0_24px_rgba(248,113,113,0.3)]",
            status === "success" && "border-emerald-400/70 bg-emerald-400/10",
          )}
        />
      ))}
    </motion.div>
  );
}
