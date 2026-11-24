"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Form } from "@/components/ui/form";
import {
  AuthShell,
  Banner,
  LeftView,
  StatusBanner,
  SubmitButton,
} from "@/lib/helper";
import { resetPasswordSchema, ResetPasswordValues } from "@/schema";
import { useResendOtp, useResetPassword } from "@/hooks/useAuth";
import { OtpInput } from "@/lib/otpInputs";
import { PasswordField } from "./LoginSignupField";

const LENGTH = 6;
const RESEND_SECONDS = 59;
const emptyDigits = () => Array<string>(LENGTH).fill("");
const mmss = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function ResetPasswordView() {
  return (
    <div className="relative mx-auto grid min-h-screen max-w-[1500px] items-center gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1fr_1.05fr] lg:gap-8 lg:px-20">
      <LeftView image="/reset-password.png" />
      <RightView />
    </div>
  );
}

function RightView() {
  const router = useRouter();
  const email = useSearchParams().get("email") ?? "";

  const [digits, setDigits] = useState<string[]>(emptyDigits);
  const [banner, setBanner] = useState<Banner>(null);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [done, setDone] = useState(false);

  const {
    resetPassword,
    error: resetErr,
    status: resetStatus,
  } = useResetPassword();
  const { resendOtp, error: resendErr, status: resendStatus } = useResendOtp();

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { otp: "", password: "", confirmPassword: "" },
  });
  const otpError = form.formState.errors.otp?.message;

  // No email means the user skipped the first step
  useEffect(() => {
    if (!email) router.replace("/auth/forgot-password");
  }, [email, router]);

  // Resend countdown
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  // Back to login after success
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => router.push("/auth"), 2000);
    return () => clearTimeout(t);
  }, [done, router]);

  function handleOtpChange(next: string[]) {
    setDigits(next);
    form.setValue("otp", next.join(""), {
      shouldValidate: form.formState.isSubmitted,
    });
    if (banner?.type === "error") setBanner(null);
  }

  function onSubmit(values: ResetPasswordValues) {
    setBanner(null);
    resetPassword(
      { email, otp: values.otp, password: values.password },
      {
        onSuccess: (data) => {
          setDone(true);
          setBanner({
            type: "success",
            text:
              data.message ??
              "Password reset successful! Redirecting you to login…",
          });
        },
        onError: (err) => {
          setBanner({ type: "error", text: resetErr?.message ?? err.message });
        },
      },
    );
  }

  function onResend() {
    setBanner(null);
    resendOtp(
      { email,purpose:'PASSWORD_RESET' },
      {
        onSuccess: (data) => {
          setSeconds(RESEND_SECONDS);
          handleOtpChange(emptyDigits());
          setBanner({
            type: "success",
            text: data.message ?? `A new code has been sent to ${email}.`,
          });
          document.getElementById("otp-0")?.focus();
        },
        onError: (err) =>
          setBanner({ type: "error", text: resendErr?.message ?? err.message }),
      },
    );
  }

  const busy = resendStatus === "pending" || done || resetStatus === "pending";
  const otpStatus = done
    ? "success"
    : otpError || banner?.type === "error"
      ? "error"
      : "idle";
  return (
    <AuthShell>
      <Link
        href="/auth/forgot-password"
        className="inline-flex items-center gap-3 text-base text-white/70 transition hover:text-white"
      >
        <ArrowLeft size={18} strokeWidth={1.6} />
        Back
      </Link>

      <h1 className="mt-6 text-center text-3xl font-bold tracking-tight sm:text-3xl">
        Reset Password
      </h1>
      <p className="mx-auto mt-4 max-w-md text-center text-base leading-snug text-white/70">
        Enter the OTP sent to your email and create a new password.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="mt-5 space-y-6"
        >
          {/* OTP */}
          <div>
            <p className="mb-3 text-sm font-medium text-white">
              Enter 6-Digit OTP
            </p>
            <OtpInput
              value={digits}
              onChange={handleOtpChange}
              status={otpStatus}
              disabled={busy}
              autoFocus
            />
            {otpError && (
              <p className="mt-2 pl-2 text-sm text-red-300">{otpError}</p>
            )}

            <div className="mt-5 flex justify-center text-[17px] text-white/80">
              {seconds > 0 ? (
                <span className="flex text-sm items-center gap-3">
                  <RefreshCw
                    size={18}
                    strokeWidth={1.6}
                    className="text-white/70"
                  />
                  Resend OTP in{" "}
                  <span className="font-medium tabular-nums text-[#3b9bff]">
                    {mmss(seconds)}
                  </span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={onResend}
                  disabled={resendStatus === "pending" || busy}
                  className="flex items-center text-sm gap-3 font-medium text-[#3b9bff] transition hover:text-[#7bbaff] disabled:opacity-60"
                >
                  <RefreshCw
                    size={18}
                    strokeWidth={1.6}
                    className={resendStatus === "pending" ? "animate-spin" : ""}
                  />
                  Resend OTP
                </button>
              )}
            </div>
          </div>

          <PasswordField
            control={form.control}
            name="password"
            label="New Password"
            showLabel
            placeholder="Enter new password"
            autoComplete="new-password"
            disabled={busy}
          />
          <PasswordField
            control={form.control}
            name="confirmPassword"
            label="Confirm New Password"
            showLabel
            placeholder="Confirm new password"
            autoComplete="new-password"
            disabled={busy}
          />

          <div className="empty:hidden">
            <StatusBanner banner={banner} />
          </div>

          <SubmitButton loading={busy}>Reset Password</SubmitButton>
        </form>
      </Form>
    </AuthShell>
  );
}
