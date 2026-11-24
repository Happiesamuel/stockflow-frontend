"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useResendOtp, useVerifyOtp } from "@/hooks/useAuth";
import { OtpInput } from "@/lib/otpInputs";
import {
  AuthShell,
  Banner,
  LeftView,
  StatusBanner,
  SubmitButton,
} from "@/lib/helper";

const LENGTH = 6;
const RESEND_SECONDS = 59;
const empty = () => Array<string>(LENGTH).fill("");
const mmss = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function VerifyOtpView() {
  return (
    <div className="relative mx-auto grid min-h-screen max-w-[1500px] items-center gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1fr_1.05fr] lg:gap-8 lg:px-20">
      <LeftView image="/verify-otp.png" />
      <RightView />
    </div>
  );
}

function RightView() {
  const router = useRouter();
  const email = useSearchParams().get("email") ?? "you@example.com";

  const [digits, setDigits] = useState<string[]>(empty);
  const [banner, setBanner] = useState<Banner>(null);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [verified, setVerified] = useState(false);

  const {
    verifyOtp,
    error: verifyError,
    status: verifyStatus,
  } = useVerifyOtp();

  const {
    resendOtp,
    error: resendError,
    status: resendStatus,
  } = useResendOtp();

  // Resend countdown
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  useEffect(() => {
    if (!verified) return;
    const t = setTimeout(() => {
      router.push("/auth");
      setVerified(false)}, 1800); // change to your route
    return () => clearTimeout(t);
  }, [verified, router]);

  function handleChange(next: string[]) {
    setDigits(next);
    if (banner?.type === "error") setBanner(null);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBanner(null);

    const otp = digits.join("");
    if (otp.length < LENGTH) {
      setBanner({
        type: "error",
        text: "Please enter the complete 6-digit code.",
      });
      return;
    }

    verifyOtp(
      { email, otp },
      {
        onSuccess: (data) => {
          setVerified(true);
          setBanner({
            type: "success",
            text:
              data.message ?? "Email verified successfully! Redirecting you…",
          });
          setDigits(empty)
        },
        onError: (err) =>
          setBanner({
            type: "error",
            text: verifyError?.message || err.message,
          }),
      },
    );
  }

  function onResend() {
    setBanner(null);
    resendOtp(
      { email,purpose:'EMAIL_VERIFICATION' },
      {
        onSuccess: (data) => {
          setSeconds(RESEND_SECONDS);
          setDigits(empty());
          setBanner({
            type: "success",
            text: data.message ?? `A new code has been sent to ${email}.`,
          });
          document.getElementById("otp-0")?.focus();
        },
        onError: (err) =>
          setBanner({
            type: "error",
            text: resendError?.message || err.message,
          }),
      },
    );
  }

  const status = verified
    ? "success"
    : banner?.type === "error"
      ? "error"
      : "idle";

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
        Verify Your Email
      </h1>
      <p className="mt-5 text-center text-base leading-snug text-white/70">
        We&rsquo;ve sent a 6-digit OTP to
        <br />
        <span className="font-semibold text-white">{email}</span>
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-8">
        <OtpInput
          value={digits}
          onChange={handleChange}
          status={status}
          disabled={verifyStatus === "pending" || verified}
          autoFocus
        />

        <p className="mt-6 text-center text-[15px] text-white/45">
          Enter the 6-digit code sent to your email address.
        </p>

        <div className="mt-6 flex justify-center text-sm text-white/80">
          {seconds > 0 ? (
            <span className="flex text-sm items-center gap-3">
              <RefreshCw
                size={18}
                strokeWidth={1.6}
                className="text-white/70"
              />
              Resend code in{" "}
              <span className="font-medium tabular-nums text-[#3b9bff]">
                {mmss(seconds)}
              </span>
            </span>
          ) : (
            <button
              type="button"
              onClick={onResend}
              disabled={resendStatus === "pending" || verified}
              className="flex items-center gap-3 text-sm font-medium text-[#3b9bff] transition hover:text-[#7bbaff] disabled:opacity-60"
            >
              <RefreshCw
                size={18}
                strokeWidth={1.6}
                className={resendStatus === "pending" ? "animate-spin" : ""}
              />
              Resend code
            </button>
          )}
        </div>

        <div className="mt-6 empty:mt-0">
          <StatusBanner banner={banner} />
        </div>

        <SubmitButton loading={verifyStatus === "pending" || verified}>
          Verify OTP
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
