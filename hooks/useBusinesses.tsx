"use client";
import {
  acceptInvitation,
  createBusiness,
  declineInvitation,
  getAllBusiness,
  joinBusiness,
  selectBusiness,
} from "@/server/busines";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";

export const onboardingKey = ["onboarding"] as const;

export function useGetAllBusiness() {
  const { data, status, isPending, error, refetch } = useQuery({
    queryKey: onboardingKey,
    queryFn: getAllBusiness,
    retry: false,
  });
  return { data, status, error, refetch, isPending };
}

export const useSelectBusiness = () =>
  useMutation<{ message?: string }, ApiError, string>({
    mutationFn: selectBusiness,
  });

export const useAcceptInvitation = () =>
  useMutation<{ message?: string }, ApiError, string>({
    mutationFn: acceptInvitation,
  });

export const useDeclineInvitation = () =>
  useMutation<{ message?: string }, ApiError, string>({
    mutationFn: declineInvitation,
  });

export function useCreateBusiness() {
  const qc = useQueryClient();
  return useMutation<{ message?: string }, ApiError, Record<string, string>>({
    mutationFn: createBusiness,
    onSuccess: () => qc.invalidateQueries({ queryKey: onboardingKey }),
  });
}

export function useJoinBusiness() {
  const qc = useQueryClient();
  return useMutation<{ message?: string }, ApiError, string>({
    mutationFn: joinBusiness,
    onSuccess: () => qc.invalidateQueries({ queryKey: onboardingKey }),
  });
}
