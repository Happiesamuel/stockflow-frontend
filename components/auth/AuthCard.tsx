"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, UserPlus } from "lucide-react";
import LoginForm from "./LoginForm";
import { SignUpForm } from "./SignupForm";
import { Google } from "@/lib/svgConstant";
import { AuthShell } from "@/lib/helper";
import { continueWithGoogle } from "@/server/auth";

type Mode = "login" | "signup";

export default function AuthCard() {
  const [mode, setMode] = useState<Mode>("login");
  const isLogin = mode === "login";
  const buttons = ["login", "signup"] as Mode[];
  return (
    <AuthShell>
      <div
        role="tablist"
        className="relative grid grid-cols-2 rounded-2xl border border-white/5 bg-white/[0.04] p-0"
      >
        {buttons.map((m) => {
          const active = mode === m;
          const Icon = m === "login" ? Lock : UserPlus;
          return (
            <button
              key={m}
              role="tab"
              aria-selected={active}
              onClick={() => setMode(m)}
              className={`relative z-10 flex h-14 items-center justify-center gap-3 text-sm font-medium transition-colors ${active ? "text-white" : "text-white/70 hover:text-white"}`}
            >
              {active && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 -z-10 rounded-xl border border-[#5b8cff]/60 bg-gradient-to-b from-[#2a4aa8]/80 to-[#1c2f7a]/80 shadow-[0_0_30px_-6px_rgba(76,125,255,0.6)]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <Icon size={20} strokeWidth={1.6} />
              {m === "login" ? "Login" : "Sign Up"}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={mode}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="mt-10 text-3xl font-bold leading-none tracking-tight">
            {isLogin ? "Welcome Back" : "Create account"}
          </h2>
          <p className="mt-3 text-base text-white/70">
            {isLogin
              ? "Sign in to access your StockFlow account"
              : "Start managing your stock with StockFlow"}
          </p>

          {isLogin ? <LoginForm /> : <SignUpForm />}

          <div className="my-5 flex items-center gap-4 text-sm text-white/70">
            <span className="h-px flex-1 bg-white/10" />
            or continue with
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <motion.button
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={async () => await continueWithGoogle()}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-white text-sm font-medium text-[#1c2340] shadow-lg outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          >
            <Google />
            Continue with Google
          </motion.button>

          <p className="mt-7 text-center text-sm text-white/80">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setMode(isLogin ? "signup" : "login")}
              className="font-medium text-[#3b9bff] hover:text-[#7bbaff]"
            >
              {isLogin ? "Create one" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </AnimatePresence>
    </AuthShell>
  );
}
