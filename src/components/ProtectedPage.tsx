"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedPage({ children, requiredMatriz = false }: { children: React.ReactNode; requiredMatriz?: boolean }) {
  const router = useRouter();
  const [verificado, setVerificado] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userStr);
    if (requiredMatriz && user.tipo !== "MATRIZ") {
      router.push("/");
      return;
    }

    setVerificado(true);
  }, [router, requiredMatriz]);

  if (!verificado) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-[#64748B]">Verificando acesso...</div>
      </div>
    );
  }

  return <>{children}</>;
}