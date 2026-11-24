"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Ban,
  CalendarDays,
  Check,
  ChevronRight,
  Building2,
  Plus,
  Users,
} from "lucide-react";
import { cn, formatDate, timeAgo } from "@/lib/utils";
import {
  onboardingKey,
  useAcceptInvitation,
  useDeclineInvitation,
  useSelectBusiness,
} from "@/hooks/useBusinesses";
import { OnboardingCard } from "./OnboadingCard";
import { GradientButton, OutlineButton } from "@/lib/buttons";
import { BusinessType } from "@/types/business.types";
import { businessDashboardPath, StatusBanner } from "@/lib/helper";
import { Invitation } from "@/server/busines";

const errorBanner = (message?: string) =>
  message ? ({ type: "error", text: message } as const) : null;

/* 1. No business */
export function NoBusinessView() {
  const router = useRouter();
  return (
    <OnboardingCard
      showLogo
      image="/no-business.png"
      title="No Business Yet"
      description="You haven’t created or joined a business yet. Get started by creating a new business or joining an existing one."
    >
      <GradientButton
        onClick={() => router.push("/onboarding/create-business")}
      >
        <Plus size={20} /> Create a Business
      </GradientButton>
      <OutlineButton onClick={() => router.push("/onboarding/join-business")}>
        <Users size={20} /> Join a Business
      </OutlineButton>
      <p className="pt-2 text-center text-sm">
        <Link
          href="#"
          className="inline-flex items-center gap-2 text-[#3b9bff] hover:text-[#7bbaff]"
        >
          Learn more <ArrowRight size={14} />
        </Link>
      </p>
    </OnboardingCard>
  );
}

/* 2. Select a business */
export function SelectBusinessView({
  businesses,
}: {
  businesses: BusinessType[];
}) {
  const router = useRouter();
  const [restricted, setRestricted] = useState<BusinessType | null>(null);
  const select = useSelectBusiness();
  const [selectedId, setSelectedId] = useState(
    businesses.find((b) => b.status === "active")?.id ?? businesses[0].id,
  );

  function onContinue() {
    const business = businesses.find((b) => b.id === selectedId);
    if (!business) return;
    if (business.status === "suspended") return setRestricted(business);
    router.push(businessDashboardPath(business)); // /{role}/{id}/dashboard
  }

  // Picked a suspended business: show the restricted screen; Go Back returns to the list
  if (restricted) {
    return (
      <AccessRestrictedView
        business={restricted}
        onBack={() => setRestricted(null)}
      />
    );
  }

  return (
    <OnboardingCard
      onBack={() => router.push("/")}
      image="/select-business.png"
      title="Select a Business"
      description={
        <>
          You belong to multiple businesses.
          <br />
          Choose one to continue.
        </>
      }
    >
      <div role="radiogroup" className="space-y-3">
        {businesses.map((b) => {
          const active = b.id === selectedId;
          return (
            <button
              key={b.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setSelectedId(b.id)}
              className={cn(
                "flex w-full items-center gap-4 rounded-lg border px-4 py-3 text-left transition",
                active
                  ? "border-[#4c9bff] bg-[#1c3a9a]/40 shadow-[0_0_24px_-4px_rgba(76,155,255,0.55)]"
                  : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]",
              )}
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[#4c9bff] to-[#2457e6]">
                <Building2 size={22} />
              </span>
              <span className="min-w-0 space-y-1 flex-1">
                <span className="block text-sm truncate font-semibold">
                  {b.name}
                </span>
                <span className="block text-xs text-white/65">
                  {b.role} <span className="px-2">•</span> {b.membersCount}{" "}
                  member
                  {b.membersCount === 1 ? "" : "s"}
                  {b.status === "suspended" && (
                    <span className="text-red-300"> • Suspended</span>
                  )}
                </span>
              </span>
              {active ? (
                <span className="flex size-7 items-center justify-center rounded-full bg-[#3b9bff]">
                  <Check size={16} strokeWidth={3} />
                </span>
              ) : (
                <ChevronRight size={20} className="text-white/70" />
              )}
            </button>
          );
        })}
      </div>

      <StatusBanner banner={errorBanner(select.error?.message)} />
      <GradientButton loading={select.isPending} onClick={onContinue}>
        Continue <ArrowRight size={20} />
      </GradientButton>
    </OnboardingCard>
  );
}

/* 3. Pending invitation */
export function PendingInvitationView({
  invitation,
  onAccepted,
}: {
  invitation: Invitation;
  onAccepted: (businessName: string) => void;
}) {
  const qc = useQueryClient();
  const accept = useAcceptInvitation();
  const decline = useDeclineInvitation();
  const error = accept.error ?? decline.error;

  return (
    <OnboardingCard
      image="/onboarding/pending-invitation.png"
      title="You Have a Pending Invitation"
      description={
        <>
          You&apos;ve been invited to join
          <br />
          {invitation.businessName}.
        </>
      }
    >
      <div className="flex items-center gap-4 rounded-2xl border border-emerald-400/40 bg-white/[0.05] px-4 py-3">
        <span className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-xl font-bold">
          {invitation.businessName.charAt(0).toUpperCase()}
        </span>
        <div>
          <p className="font-medium">Invited by: {invitation.invitedBy}</p>
          <p className="text-sm text-white/65">
            {timeAgo(invitation.invitedAt)}
          </p>
        </div>
      </div>

      <StatusBanner banner={errorBanner(error?.message)} />

      <GradientButton
        loading={accept.isPending}
        disabled={decline.isPending}
        onClick={() =>
          accept.mutate(invitation.id, {
            onSuccess: () => onAccepted(invitation.businessName),
          })
        }
      >
        Accept Invitation
      </GradientButton>
      <OutlineButton
        loading={decline.isPending}
        disabled={accept.isPending}
        onClick={() =>
          decline.mutate(invitation.id, {
            onSuccess: () => qc.invalidateQueries({ queryKey: onboardingKey }),
          })
        }
      >
        Decline
      </OutlineButton>
      <p className="pt-1 text-center text-sm">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[#3b9bff] hover:text-[#7bbaff]"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </p>
    </OnboardingCard>
  );
}

/* 4. Invitation accepted */
export function InvitationAcceptedView({
  businessName,
}: {
  businessName: string;
}) {
  const router = useRouter();
  const qc = useQueryClient();
  return (
    <OnboardingCard
      image="/onboarding/invitation-accepted.png"
      title="Invitation Accepted!"
      description={
        <>
          You have successfully joined
          <br />
          {businessName}.
        </>
      }
    >
      <GradientButton
        onClick={() => {
          qc.invalidateQueries({ queryKey: onboardingKey });
          router.push("/dashboard");
        }}
      >
        Go to Business <ArrowRight size={20} />
      </GradientButton>
    </OnboardingCard>
  );
}

/* 5. Access restricted */
export function AccessRestrictedView({
  business,
  onBack,
}: {
  business: BusinessType;
  onBack: () => void;
}) {
  return (
    <OnboardingCard
      image="/onboarding/access-restricted.png"
      title="Access Restricted"
      description={
        <>
          Your account access to this business
          <br />
          has been suspended.
        </>
      }
    >
      <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm">
        <div className="flex items-start gap-4">
          <Ban size={26} className="shrink-0 text-red-400" />
          <div>
            <p className="text-white/60">Business Name</p>
            <p className="font-medium">{business.name}</p>
          </div>
        </div>
        {business.suspendedAt && (
          <div className="flex items-start gap-4">
            <CalendarDays size={26} className="shrink-0 text-white/70" />
            <div>
              <p className="text-white/60">Suspended on</p>
              <p className="font-medium">{formatDate(business.suspendedAt)}</p>
            </div>
          </div>
        )}
      </div>
      <p className="text-center text-sm text-white/70">
        Please contact your business administrator for more information.
      </p>
      <OutlineButton onClick={onBack}>Go Back</OutlineButton>
    </OnboardingCard>
  );
}
