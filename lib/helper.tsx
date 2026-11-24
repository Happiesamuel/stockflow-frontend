"use client";
import { BusinessType } from "@/types/business.types";
import { cn } from "cn";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";

/** e.g. /admin/64f1.../dashboard */
export const businessDashboardPath = (b: Pick<BusinessType, "id" | "role">) =>
  `/${encodeURIComponent(b.role.toLowerCase())}/${encodeURIComponent(b.id)}/dashboard`;

export type Banner = {
  type?: "error" | "success";
  text: string;
} | null;

export function StatusBanner({
  banner,
  size = "default",
}: {
  banner?: Banner | string | null;
  size?: "sm" | "default";
}) {
  // Normalize string inputs to default to an error banner
  const normalized =
    typeof banner === "string"
      ? banner
        ? { type: "error" as const, text: banner }
        : null
      : banner;

  const isSuccess = normalized?.type === "success";
  const Icon = isSuccess ? CheckCircle2 : AlertCircle;
  const isSmall = size === "sm";

  return (
    <AnimatePresence initial={false} mode="wait">
      {normalized?.text && (
        <motion.div
          key={`${normalized.type ?? "error"}-${normalized.text}`}
          role={isSuccess ? "status" : "alert"}
          initial={{ opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div
            className={cn(
              "flex items-start gap-3 border px-4 py-3",
              isSmall ? "rounded-lg text-xs" : "rounded-lg text-sm",
              isSuccess
                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                : "border-red-400/30 bg-red-500/10 text-red-200",
            )}
          >
            <Icon
              size={isSmall ? 15 : 20}
              className={cn("shrink-0", !isSmall && "mt-0.5")}
            />
            <span>{normalized.text}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function SubmitButton({
  loading,
  children,
}: {
  loading: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      type="submit"
      disabled={loading}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#5667ff] to-[#2f8cff] text-sm font-medium text-white shadow-[0_12px_32px_-8px_rgba(59,130,246,0.7)] outline-none focus-visible:ring-4 focus-visible:ring-white/30 disabled:opacity-70"
    >
      {children}
      {loading ? (
        <Loader2 className="animate-spin text-sm" size={20} />
      ) : (
        <ArrowRight className="text-sm" size={20} />
      )}
    </motion.button>
  );
}

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <svg width="44" height="50" viewBox="0 0 44 50" fill="none" aria-hidden>
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#6aa8ff" />
            <stop offset="1" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        <path d="M22 2 42 13v24L22 48 2 37V13z" fill="url(#lg)" />
        <path d="M22 2 42 13 22 24 2 13z" fill="#9cc4ff" opacity=".9" />
        <path
          d="M22 24v24"
          stroke="#0b1b5e"
          strokeOpacity=".35"
          strokeWidth="2"
        />
      </svg>
      <span className="text-2xl font-bold tracking-tight">
        Stock<span className="text-[#4c9bff]">Flow</span>
      </span>
    </div>
  );
}

export function LeftView({ image }: { image: string }) {
  return (
    <section className="flex flex-col lg:h-[640px] lg:justify-between">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Logo />
      </motion.div>

      <motion.div
        className="relative mx-auto hidden h-[420px] w-full max-w-[560px] lg:block"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="560px"
          className="object-contain"
          aria-hidden="true"
        />
      </motion.div>
      <div className="hidden lg:block" />
    </section>
  );
}

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-[550px] justify-self-center rounded-[28px] border border-white/15 bg-gradient-to-br from-white/[0.09] to-white/[0.02] p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl max-sm:p-6 lg:justify-self-end"
    >
      {children}
    </motion.div>
  );
}
