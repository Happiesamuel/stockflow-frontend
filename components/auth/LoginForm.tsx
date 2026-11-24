"use client";
import { useLogin } from "@/hooks/useAuth";
import { loginSchema, LoginValues } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import {
  FormCheckboxField,
  FormInputField,
  PasswordField,
} from "./LoginSignupField";
import { Mail } from "lucide-react";
import { StatusBanner, SubmitButton } from "@/lib/helper";
import { useAuthStore } from "@/store/useAuth";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const { loginFun, status } = useLogin(); // 1. no longer need `error` from the hook
  const [errorr, setErrorr] = useState<string | null>(
    // 2. show a fixed message, never raw text from the URL
    useSearchParams().get("error")
      ? "Google sign-in failed. Please try again."
      : null,
  );
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  async function onSubmit(values: LoginValues) {
    setErrorr(null);
    loginFun(values, {
      onSuccess: async () => {
        form.reset();
        await useAuthStore.getState().loadUser();
        router.replace("/onboarding");
      },
      onError: (err) => {
        if (err.message.startsWith("Please verify your email first.")) {
          router.push(
            `/auth/verify-otp?email=${encodeURIComponent(values.email)}`,
          );
          return;
        }
        setErrorr(
          err.message === "Failed to fetch"
            ? "Can't reach the server. Check your connection and try again."
            : err.message,
        );
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onChange={() => errorr && setErrorr(null)} // 4. clear the banner when the user types
        noValidate
        className="mt-8 space-y-4"
      >
        <FormInputField
          control={form.control}
          name="email"
          label="Email address"
          icon={Mail}
          type="email"
          placeholder="Email Address"
          autoComplete="email"
        />
        <PasswordField
          control={form.control}
          name="password"
          label="Password"
          autoComplete="current-password"
        />
        <div className="flex items-center justify-between pt-1">
          <FormCheckboxField
            control={form.control}
            name="remember"
            label="Remember me"
          />
          <a
            href="/auth/forgot-password"
            className="text-sm font-medium text-[#3b9bff] transition hover:text-[#7bbaff]"
          >
            Forgot password?
          </a>
        </div>
        <StatusBanner banner={errorr} /> {/* 1. one source of truth */}
        <SubmitButton loading={status === "pending"}>Sign In</SubmitButton>
      </form>
    </Form>
  );
}
