import VerifyOtpView from "@/components/auth/OtpForm";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense>
      <VerifyOtpView />
    </Suspense>
  );
}
