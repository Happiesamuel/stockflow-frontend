"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail } from "lucide-react";
import { Form } from "@/components/ui/form";

import {
  AuthShell,
  Banner,
  LeftView,
  StatusBanner,
  SubmitButton,
} from "@/lib/helper";
import { forgotPasswordSchema, ForgotPasswordValues } from "@/schema";
import { useForgotPassword } from "@/hooks/useAuth";
import { FormInputField } from "./LoginSignupField";

export default function ForgotPasswordView() {
  return (
    <div className="relative mx-auto grid min-h-screen max-w-[1500px] items-center gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1fr_1.05fr] lg:gap-8 lg:px-20">
      <LeftView image="/forgot-password.png" />
      <RightView />
    </div>
  );
}

function RightView() {
  const router = useRouter();
  const { forgotPassword, error, status } = useForgotPassword();
  const [banner, setBanner] = useState<Banner>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  // After success, move on to the reset screen so the message can be read first
  useEffect(() => {
    if (!sentTo) return;
    const t = setTimeout(
      () =>
        router.push(`/auth/reset-password?email=${encodeURIComponent(sentTo)}`),
      1800,
    );
    return () => clearTimeout(t);
  }, [sentTo, router]);

  function onSubmit(values: ForgotPasswordValues) {
    setBanner(null);
    forgotPassword(values, {
      onSuccess: (data) => {
        setSentTo(values.email);
        setBanner({
          type: "success",
          text: data.message ?? `We've sent a reset code to ${values.email}.`,
        });
      },
      onError: (err) =>
        setBanner({
          type: "error",
          text: error?.message || err.message,
        }),
    });
  }

  return (
    <AuthShell>
      <Link
        href="/auth"
        className="inline-flex items-center gap-3 text-base text-white/70 transition hover:text-white"
      >
        <ArrowLeft size={18} strokeWidth={1.6} />
        Back
      </Link>

      <h1 className="mt-10 text-center text-3xl font-bold tracking-tight sm:text-3xl">
        Forgot Password?
      </h1>
      <p className="mx-auto mt-5 max-w-md text-center text-base leading-snug text-white/70">
        Enter your email address and we&rsquo;ll send you a code to reset your
        password.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="mt-12"
        >
          <FormInputField
            control={form.control}
            name="email"
            label="Email Address"
            showLabel
            icon={Mail}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            disabled={status === "pending" || !!sentTo}
          />

          <div className="mt-5 empty:hidden">
            <StatusBanner banner={banner} />
          </div>

          <SubmitButton loading={status === "pending" || !!sentTo}>
            Send Reset Link
          </SubmitButton>
        </form>
      </Form>

      <div className="mt-8 flex items-center gap-4 text-sm text-white/80">
        <span className="h-px flex-1 bg-white/10" />
        <span>
          Remember your password?{" "}
          <Link
            href="/auth"
            className="font-medium text-[#3b9bff] transition hover:text-[#7bbaff]"
          >
            Login
          </Link>
        </span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
    </AuthShell>
  );
}
