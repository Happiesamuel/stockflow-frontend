import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import QueryProvider from "@/QueryProvider";
import DashboardLayout from "@/components/userLayout/userLayout";
import AuthLayout from "@/components/auth/AuthLayout";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "StockFlow ",
  description: "Manage your stock, sales and operations with ease.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} dark`}>
      <body className="antialiased">
        <QueryProvider>
          <AuthLayout bg="/onboarding.png">{children}</AuthLayout>
          {/* <DashboardLayout>{children}</DashboardLayout> */}
        </QueryProvider>
      </body>
    </html>
  );
}
