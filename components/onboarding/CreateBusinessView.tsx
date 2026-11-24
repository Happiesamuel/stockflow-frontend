"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Briefcase,
  CircleDollarSign,
  Info,
  Mail,
  MapPin,
  Phone,
  Rocket,
  Tag,
} from "lucide-react";
import { Form } from "@/components/ui/form";
import { useCreateBusiness } from "@/hooks/useBusinesses";
import { Banner, Logo, StatusBanner } from "@/lib/helper";
import { createBusinessSchema, CreateBusinessValues } from "@/schema";
import { OnboardingCard } from "./OnboadingCard";
import { FormInputField, FormSelectField } from "../auth/LoginSignupField";
import { GradientButton } from "@/lib/buttons";

const industries = [
  "Retail",
  "Wholesale",
  "Food & Beverage",
  "Pharmacy",
  "Electronics",
  "Fashion",
  "Manufacturing",
  "Other",
].map((v) => ({ value: v, label: v }));
const currencies = [
  { value: "NGN", label: "NGN (Naira)" },
  { value: "USD", label: "USD (US Dollar)" },
  { value: "GBP", label: "GBP (Pound)" },
  { value: "EUR", label: "EUR (Euro)" },
  { value: "GHS", label: "GHS (Cedi)" },
  { value: "KES", label: "KES (Shilling)" },
  { value: "ZAR", label: "ZAR (Rand)" },
];
const compact = "h-14";

export default function CreateBusinessView() {
  const router = useRouter();
  const create = useCreateBusiness();
  const [banner, setBanner] = useState<Banner>(null);

  const form = useForm<CreateBusinessValues>({
    resolver: zodResolver(createBusinessSchema),
    defaultValues: {
      name: "",
      industry: "",
      email: "",
      phone: "",
      address: "",
      currency: "NGN",
    },
  });

  function onSubmit(values: CreateBusinessValues) {
    setBanner(null);
    // Don't send empty optional fields
    const payload = Object.fromEntries(
      Object.entries(values).filter(([, v]) => v !== ""),
    );
    create.mutate(payload, {
      onSuccess: (data) => {
        setBanner({
          type: "success",
          text:
            data.message ?? "Business created! Taking you to your workspace…",
        });
        setTimeout(() => router.push("/onboarding"), 1200); // gate sends you to the dashboard
      },
      onError: (err) => {
        setBanner({ type: "error", text: err.message });
      },
    });
  }

  const busy = create.isPending || banner?.type === "success";

  return (
    <Wrapper>
      <OnboardingCard
        className="max-w-[640px]"
        onBack={() => router.push("/onboarding")}
        backLabel="Back"
        image="/no-business.png"
        title="Create a Business"
        description={
          <>
            Start your own business on StockFlow and
            <br />
            manage your inventory with ease.
          </>
        }
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="space-y-3 w-full"
          >
            <div className="flex items-center gap-4 w-full justify-between">
              <FormInputField
                control={form.control}
                name="name"
                label="Business name"
                icon={Briefcase}
                placeholder="Business Name"
                autoComplete="organization"
                wrapperClassName={compact}
                disabled={busy}
              />
              <FormSelectField
                control={form.control}
                name="industry"
                label="Industry"
                icon={Tag}
                placeholder="Industry (Optional)"
                options={industries}
                wrapperClassName={compact}
                disabled={busy}
              />
            </div>
            <div className="flex items-center gap-4 w-full justify-between">
              <FormInputField
                control={form.control}
                name="email"
                label="Business email"
                icon={Mail}
                type="email"
                placeholder="Business Email (Optional)"
                autoComplete="email"
                wrapperClassName={compact}
                disabled={busy}
              />
              <FormInputField
                control={form.control}
                name="phone"
                label="Business phone"
                icon={Phone}
                type="tel"
                placeholder="Business Phone (Optional)"
                autoComplete="tel"
                wrapperClassName={compact}
                disabled={busy}
              />
            </div>
            <FormInputField
              control={form.control}
              name="address"
              label="Business address"
              icon={MapPin}
              placeholder="Business Address (Optional)"
              autoComplete="street-address"
              wrapperClassName={compact}
              disabled={busy}
            />
            <FormSelectField
              control={form.control}
              name="currency"
              label="Currency"
              icon={CircleDollarSign}
              options={currencies}
              wrapperClassName={compact}
              disabled={busy}
            />

            <div className="empty:hidden">
              <StatusBanner banner={banner} />
            </div>

            <GradientButton type="submit" loading={busy}>
              <Rocket size={20} /> Create Business <ArrowRight size={20} />
            </GradientButton>
          </form>
        </Form>

        <div className="flex items-center gap-4 pt-2 text-sm text-white/80">
          <span className="h-px flex-1 bg-white/10" />
          OR
          <span className="h-px flex-1 bg-white/10" />
        </div>
        <p className="flex items-center justify-center gap-2 text-sm text-white/70">
          <Info size={18} className="text-[#3b9bff]" />
          You can also join an existing business{" "}
          <Link
            href="/onboarding/join-business"
            className="font-medium text-[#3b9bff] hover:text-[#7bbaff]"
          >
            Join a Business
          </Link>
        </p>
      </OnboardingCard>
    </Wrapper>
  );
}

export function Wrapper({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen px-6 py-8 sm:px-12">
      <Logo />
      <div className="flex justify-center py-8">{children}</div>
    </div>
  );
}
