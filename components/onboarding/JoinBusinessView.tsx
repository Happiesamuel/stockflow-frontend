"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lightbulb, LogIn, Ticket } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Banner, StatusBanner } from "@/lib/helper";
import { OnboardingCard } from "./OnboadingCard";
import { FormInputField } from "../auth/LoginSignupField";
import { GradientButton } from "@/lib/buttons";
import { useJoinBusiness } from "@/hooks/useBusinesses";
import { joinBusinessSchema, JoinBusinessValues } from "@/schema";
import { Wrapper } from "./CreateBusinessView";

const steps = [
  "Enter the invitation code",
  "Get access to the business",
  "Start managing inventory",
];

export default function JoinBusinessView() {
  const router = useRouter();
  const join = useJoinBusiness();
  const [banner, setBanner] = useState<Banner>(null);

  const form = useForm<JoinBusinessValues>({
    resolver: zodResolver(joinBusinessSchema),
    defaultValues: { code: "" },
  });

  function onSubmit({ code }: JoinBusinessValues) {
    setBanner(null);
    join.mutate(code, {
      onSuccess: (data) => {
        setBanner({
          type: "success",
          text: data.message ?? "You've joined the business! Taking you there…",
        });
        setTimeout(() => router.push("/onboarding"), 1200);
      },
      onError: (err) => {
        setBanner({ type: "error", text: err.message });
      },
    });
  }

  const busy = join.isPending || banner?.type === "success";

  return (
    <Wrapper>
      <OnboardingCard
        className="max-w-[640px]"
        onBack={() => router.push("/onboarding")}
        backLabel="Back"
        image="/join-business.png"
        title="Join a Business"
        description={
          <>
            Enter the invitation code you received
            <br />
            from a business owner or admin.
          </>
        }
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
            <FormInputField
              control={form.control}
              name="code"
              label="Invitation code"
              icon={Ticket}
              placeholder="Invitation Code"
              autoComplete="off"
              autoCapitalize="characters"
              disabled={busy}
            />

            <div className="empty:hidden">
              <StatusBanner banner={banner} />
            </div>

            <GradientButton
              type="submit"
              loading={busy}
              className="h-[60px] text-lg"
            >
              <LogIn size={22} /> Join Business
            </GradientButton>
          </form>
        </Form>

        <div className="mt-2 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <p className="flex items-center gap-3 text-lg font-semibold text-[#3b9bff]">
            <Lightbulb size={24} className="text-amber-400" /> How it works?
          </p>
          <ol className="mt-3 space-y-2.5 pl-1">
            {steps.map((text, i) => (
              <li key={text} className="flex items-center gap-3 text-white/85">
                <span className="flex size-6 items-center justify-center rounded-full border border-[#4c7dff]/60 bg-[#1c2f7a]/50 text-xs">
                  {i + 1}
                </span>
                {text}
              </li>
            ))}
          </ol>
        </div>
      </OnboardingCard>
    </Wrapper>
  );
}
