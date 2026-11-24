"use client";

import { MotionConfig } from "framer-motion";

import Image from "next/image";
import { ReactNode } from "react";

export default function AuthLayout({
  children,
  bg,
}: {
  bg: string;
  children: ReactNode;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <main className="relative isolate overflow-hidden  min-h-screen  bg-[radial-gradient(120%_100%_at_30%_40%,#0b1240_0%,#060a1f_60%,#04061a_100%)] text-white">
        <Image
          src={bg}
          alt=""
          fill
          priority={false}
          sizes="100vw"
          className="-z-20 object-cover blur"
          aria-hidden="true"
        />

        {children}
      </main>
    </MotionConfig>
  );
}
