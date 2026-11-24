export interface BusinessType {
  id: string;
  name: string;
  industry: string;
  country: string;
  currency: string;
  phone: string;
  email: string;
  address: string;
  slug: string;
  role: string; // "Admin" | "Member" ...
  membersCount: number;
  status: "active" | "suspended";
  suspendedAt?: string; // ISO date
}
