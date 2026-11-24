"use client";

import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/lib/helper";
import { cn } from "cn";

type Props = {
  /** Path in /public, e.g. "/onboarding/no-business.png" */
  image: string;
  title: string;
  description: React.ReactNode;
  showLogo?: boolean;
  onBack?: () => void;
  backLabel?: string;
  className?: string;
  children?: React.ReactNode;
};

/** Shared glass card used by every onboarding state. */
export function OnboardingCard({
  image,
  title,
  description,
  showLogo,
  onBack,
  backLabel = "Back",
  className,
  children,
}: Props) {
  return (
    <div
      className={cn(
        "relative w-full max-w-[500px] rounded-xl border border-white/15 bg-gradient-to-br from-white/[0.09] to-white/[0.02] p-8 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl",
        className,
      )}
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="absolute left-7 top-7 z-10 flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
        >
          <ArrowLeft size={18} strokeWidth={1.6} />
          {backLabel}
        </button>
      )}
      {showLogo && (
        <div className="mb-1 flex justify-center">
          <Logo />
        </div>
      )}

      <div className="relative mx-auto h-[180px] w-full">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="460px"
          className="object-contain"
          aria-hidden="true"
        />
      </div>

      <h1 className="mt-3 text-xl font-bold leading-tight tracking-tight">
        {title}
      </h1>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/70">
        {description}
      </p>

      <div className="mt-6 space-y-3 text-left">{children}</div>
    </div>
  );
}
