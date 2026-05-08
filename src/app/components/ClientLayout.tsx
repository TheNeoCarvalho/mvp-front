"use client";

import { usePathname } from "next/navigation";
import RouteGuard from "@/components/RouteGuard";
import Sidebar from "./Sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <RouteGuard>
      {isLoginPage ? (
        children
      ) : (
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-64 p-6">
            {children}
          </main>
        </div>
      )}
    </RouteGuard>
  );
}