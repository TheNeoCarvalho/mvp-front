"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  Package,
  ShoppingCart,
} from "lucide-react"

const links = [
  {
    nome: "Painel",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    nome: "Filiais",
    href: "/filiais",
    icon: Building2,
  },
  {
    nome: "Fornecedores",
    href: "/fornecedores",
    icon: Package,
  },
  {
    nome: "Pedidos",
    href: "/pedidos",
    icon: ShoppingCart,
  },
]

export default function Aside() {
  const pathname = usePathname()

  return (
    <aside className="w-65 min-h-screen bg-[#000814] border-r border-[#111827]">
      <div className="h-20 flex items-center px-8 border-b border-[#111827]">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Gestora
        </h1>
      </div>

      <nav className="flex flex-col gap-2 p-4">
        {links.map((link) => {
          const Icon = link.icon

          const ativo =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href)

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                group flex items-center gap-4
                rounded-xl px-4 py-3
                transition-all duration-200
                font-medium
                ${
                  ativo
                    ? "bg-[#2563EB] text-white shadow-lg shadow-blue-500/20"
                    : "text-[#CBD5E1] hover:bg-[#0F172A] hover:text-white"
                }
              `}
            >
              <Icon
                size={20}
                className={`
                  transition-colors
                  ${
                    ativo
                      ? "text-white"
                      : "text-[#94A3B8] group-hover:text-white"
                  }
                `}
              />

              <span className="text-[15px]">
                {link.nome}
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}