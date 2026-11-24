"use client";

import { Logo } from "@/lib/helper";
import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroPanel() {
  return (
    <section className="flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Logo />
      </motion.div>

      <motion.h1
        className="mt-16 text-5xl  font-bold leading-[1.3]  sm:text-5xl lg:mt-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        Smarter Inventory.
        <br />
        Stronger{" "}
        <span className="text-[#3b82f6] tracking-[3px]">Business.</span>
      </motion.h1>

      <motion.p
        className="mt-6 max-w-sm text-lg leading-snug text-white/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        Manage your stock, sales and operations with ease.
      </motion.p>

      <motion.div
        className="h-[3px]  w-16 mt-3 origin-left rounded-full bg-[#3b82f6]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      />

      <motion.div
        className="relative aspect-video h-[260px] w-full"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src="/logistic.png"
          alt=""
          fill
          priority
          quality={100}
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-contain object-left"
          aria-hidden="true"
        />
      </motion.div>
    </section>
  );
}
