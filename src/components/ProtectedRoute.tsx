"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredType?: "MATRIZ" | "FILIAL";
}

export default function ProtectedRoute({ children, requiredType }: ProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    
    if (!userStr) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userStr);

    if (requiredType && user.tipo !== requiredType) {
      router.push("/");
      return;
    }

    setLoading(false);
  }, [router, requiredType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071226] flex items-center justify-center">
        <div className="text-[#64748B]">Carregando...</div>
      </div>
    );
  }

  return <>{children}</>;
}