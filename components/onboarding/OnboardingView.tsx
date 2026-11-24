"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useGetAllBusiness } from "@/hooks/useBusinesses"; // returns Business[]
import {
  AccessRestrictedView,
  NoBusinessView,
  SelectBusinessView,
} from "./OnboardingViews";
import { businessDashboardPath, StatusBanner } from "@/lib/helper";
import { GradientButton } from "@/lib/buttons";

export default function OnboardingView() {
  const router = useRouter();
  const { data, error, isPending, refetch } = useGetAllBusiness();

  // Exactly one business and it's active -> straight to the dashboard
  const goToDashboard = data?.length === 1 && data[0].status === "active";
  useEffect(() => {
    if (goToDashboard && data) router.replace(businessDashboardPath(data[0]));
  }, [goToDashboard, data, router]);

  if (isPending || goToDashboard) {
    return (
      <Wrapper view="loading">
        <div className="flex flex-col items-center gap-4 text-white/70">
          <Loader2 size={36} className="animate-spin text-[#3b9bff]" />
          Checking your workspace…
        </div>
      </Wrapper>
    );
  }

  if (error) {
    const notLoggedIn = error.message === "Not authenticated.";
    return (
      <Wrapper view="error">
        <div className="w-full max-w-[420px] space-y-4 rounded-[32px] border border-white/15 bg-white/[0.05] p-8 backdrop-blur-2xl">
          <StatusBanner
            banner={{
              type: "error",
              text: error.message || "Couldn't load your workspace.",
            }}
          />
          <GradientButton
            onClick={() => (notLoggedIn ? router.push("/auth") : refetch())}
          >
            {notLoggedIn ? "Back to login" : "Try again"}
          </GradientButton>
        </div>
      </Wrapper>
    );
  }

  // No business
  if (!data?.length) {
    return (
      <Wrapper view="none">
        <NoBusinessView />
      </Wrapper>
    );
  }

  // One business, but it's suspended (an active one was redirected above)
  //   if (data.length === 1) {
  //     return (
  //       <Wrapper view="restricted">
  //         <AccessRestrictedView
  //           business={data[0]}
  //           onBack={() => router.push("/auth")}
  //         />
  //       </Wrapper>
  //     );
  //   }

  // Several businesses
  return (
    <Wrapper view="select">
      <SelectBusinessView businesses={data} />
    </Wrapper>
  );
}

/** Page background + centered fade-in. `view` (not `key`, which React reserves) replays the animation per screen. */
function Wrapper({
  children,
  view,
}: {
  children: React.ReactNode;
  view: string;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 py-10">
      <motion.div
        key={view}
        className="flex w-full justify-center"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
