"use client";
import AuthCard from "@/components/auth/AuthCard";
import HeroPanel from "@/components/auth/HeroPanel";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <div className="relative mx-auto grid min-h-screen max-w-[1500px] items-center gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-20">
        <HeroPanel />
        <AuthCard />
      </div>
    </Suspense>
  );
}
