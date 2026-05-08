"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Truck,
  Package,
  FileText,
  CheckSquare,
  ClipboardList,
  BarChart3,
  Bell,
  LogOut,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

const menuItemsMatriz = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/filiais", label: "Filiais", icon: Building2 },
  { href: "/fornecedores", label: "Fornecedores", icon: Truck },
  { href: "/insumos", label: "Insumos", icon: Package },
  { href: "/solicitacoes", label: "Solicitações", icon: FileText },
  { href: "/aprovacoes", label: "Aprovações", icon: CheckSquare },
  { href: "/pedidos", label: "Pedidos", icon: ClipboardList },
  { href: "/consumo", label: "Consumo", icon: BarChart3 },
  { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { href: "/alertas", label: "Alertas", icon: Bell },
];

const menuItemsFilial = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/solicitacoes", label: "Minhas Solicitações", icon: FileText },
  { href: "/pedidos", label: "Meus Pedidos", icon: ClipboardList },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("user");
    router.push("/login");
  }

  const menuItems = user?.tipo === "MATRIZ" ? menuItemsMatriz : menuItemsFilial;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0F172A] border-r border-[#334155] flex flex-col">
      <div className="p-6 border-b border-[#334155]">
        <h1 className="text-xl font-bold text-white">Grupo Tereza</h1>
        <p className="text-sm text-[#64748B]">Gestão de Filiais</p>
      </div>

      {user && (
        <div className="px-4 py-3 border-b border-[#334155]">
          <div className="flex items-center gap-3 p-3 bg-[#1E293B] rounded-xl">
            <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center">
              <User className="text-white" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user.nome}</p>
              <p className="text-[#64748B] text-xs">{user.tipo === "MATRIZ" ? "Matriz" : "Filial"}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? "bg-[#2563EB] text-white"
                      : "text-[#94A3B8] hover:bg-[#1E293B] hover:text-white"
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-[#334155]">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-[#94A3B8] hover:bg-[#1E293B] hover:text-white transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
}