"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname === "/login") {
      setLoading(false);
      return;
    }

    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userStr);
    const isMatriz = user.tipo === "MATRIZ";
    
    const rotasPermitidasFilial = ["/", "/solicitacoes", "/pedidos"];
    const podeAcessarRotaFilial = (path: string) => {
      if (isMatriz) return true;
      return rotasPermitidasFilial.some(rota => path === rota || path.startsWith(rota + "/"));
    };

    if (!podeAcessarRotaFilial(pathname)) {
      router.push("/");
    }
    
    setLoading(false);
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071226] flex items-center justify-center">
        <div className="text-[#64748B]">Carregando...</div>
      </div>
    );
  }

  return <>{children}</>;
}