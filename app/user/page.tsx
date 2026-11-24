"use client";
import { useAuthStore } from "@/store/useAuth";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { user } = useAuthStore();
  console.log(user);
  return (
    <div>
      page
      <button
        onClick={async () => {
          await useAuthStore.getState().logout();
          router.replace("/auth");
        }}
      >
        Log out
      </button>
    </div>
  );
}
