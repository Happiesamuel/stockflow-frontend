"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type BtnProps = Omit<React.ComponentProps<typeof motion.button>, "children"> & {
  children: React.ReactNode;
  loading?: boolean;
};

const base =
  "flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold text-white outline-none transition focus-visible:ring-4 focus-visible:ring-white/30 disabled:opacity-60";

export function GradientButton({
  children,
  loading,
  className,
  disabled,
  ...props
}: BtnProps) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      disabled={disabled || loading}
      className={cn(
        base,
        "bg-gradient-to-r from-[#3b6bff] to-[#38b6ff] shadow-[0_12px_32px_-8px_rgba(59,130,246,0.7)]",
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 size={20} className="animate-spin" /> : children}
    </motion.button>
  );
}

export function OutlineButton({
  children,
  loading,
  className,
  disabled,
  ...props
}: BtnProps) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      disabled={disabled || loading}
      className={cn(
        base,
        "h-[48px] border border-[#3b6bff]/50 bg-[#0a1240]/40 hover:bg-[#1c2f7a]/40",
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 size={20} className="animate-spin" /> : children}
    </motion.button>
  );
}
