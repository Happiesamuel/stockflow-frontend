import type { BusinessType } from "@/types/business.types";
import { API_URL as BASE_URL, apiFetch } from "./client";

const API_URL = `${BASE_URL}/business`;

export type Business = BusinessType;

export type Invitation = {
  id: string;
  businessName: string;
  invitedBy: string;
  invitedAt: string; // ISO date
};

export async function getAllBusiness() {
  const data = await apiFetch<{ businesses: BusinessType[] }>(API_URL, {
    method: "GET",
  });
  return data.businesses;
}

export async function createBusiness(payload: Record<string, string>) {
  return apiFetch<{ data: BusinessType; message: string }>(API_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
export async function getSingleBusiness(bsuinessId: string) {
  return apiFetch<{ data: BusinessType; message: string }>(
    `${API_URL}/${bsuinessId}`,
    {
      method: "GET",
    },
  );
}

export const joinBusiness = (code: string) =>
  apiFetch<{ message?: string }>(`${API_URL}/join`, {
    method: "POST",
    body: JSON.stringify({ code }),
  });

export const selectBusiness = (businessId: string) =>
  apiFetch<{ message?: string }>(`${API_URL}/select`, {
    method: "POST",
    body: JSON.stringify({ businessId }),
  });

export const acceptInvitation = (id: string) =>
  apiFetch<{ message?: string }>(`${BASE_URL}/invitations/${id}/accept`, {
    method: "POST",
  });

export const declineInvitation = (id: string) =>
  apiFetch<{ message?: string }>(`${BASE_URL}/invitations/${id}/decline`, {
    method: "POST",
  });
