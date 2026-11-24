import {
  forgotPasswordRequest,
  loginUserWithCredentials,
  resendOtpRequest,
  resetPasswordRequest,
  signUpWithCredentials,
  verifyOtpRequest,
} from "@/server/auth";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
  const {
    status,
    error,
    mutate: loginFun,
  } = useMutation({
    mutationFn: loginUserWithCredentials,
  });

  return { status, error, loginFun };
}
export function useSignup() {
  const {
    status,
    error,
    mutate: signUpFun,
  } = useMutation({
    mutationFn: signUpWithCredentials,
  });

  return { status, error, signUpFun };
}

export function useVerifyOtp() {
  const {
    status,
    error,
    mutate: verifyOtp,
  } = useMutation({
    mutationFn: verifyOtpRequest,
  });

  return { status, error, verifyOtp };
}

export function useResendOtp() {
  const {
    status,
    error,
    mutate: resendOtp,
  } = useMutation({
    mutationFn: resendOtpRequest,
  });

  return { status, error, resendOtp };
}

export function useForgotPassword() {
  const {
    status,
    error,
    mutate: forgotPassword,
  } = useMutation({
    mutationFn: forgotPasswordRequest,
  });

  return { status, error, forgotPassword };
}
export function useResetPassword() {
  const {
    status,
    error,
    mutate: resetPassword,
  } = useMutation({
    mutationFn: resetPasswordRequest,
  });

  return { status, error, resetPassword };
}
