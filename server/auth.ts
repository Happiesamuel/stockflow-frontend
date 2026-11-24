import { redirect } from "next/navigation";
import { ResetPasswordPayload, SignUp } from "../types/auth.types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
export type LoginResponse = {
  token?: string;
  user?: { id: string; name?: string; email: string };
};

export async function continueWithGoogle() {
  redirect(`${API_URL}/auth/google`);
  //  window.location.href = `${API_URL}/auth/google`;
}

export async function loginUserWithCredentials(values: {
  email: string;
  password: string;
}) {
  const { email, password } = values;

  return await postAuth<{ email: string; password: string }>(
    { email, password },
    "login",
  );
}
export async function signUpWithCredentials(values: SignUp) {
  return await postAuth<SignUp>(values, "register");
}

export async function verifyOtpRequest(values: { email: string; otp: string }) {
  return await postAuth<{ email: string; otp: string }>(values, "verify-otp");
}

export async function resendOtpRequest(values: {
  email: string;
  purpose: string;
}) {
  return await postAuth<{ email: string; purpose: string }>(
    values,
    "resend-otp",
  );
}
export async function forgotPasswordRequest(values: { email: string }) {
  return await postAuth<{ email: string }>(values, "forgotten-password");
}
export async function resetPasswordRequest(values: ResetPasswordPayload) {
  return await postAuth<ResetPasswordPayload>(values, "reset-password");
}

export async function postAuth<T>(values: T, endpoint: string) {
  try {
    const res = await fetch(`${API_URL}/auth/${endpoint}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();

    if (!res.ok) {
      console.error("Server error details:", data);
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Fetch Failed";
    throw new Error(message);
  }
}
