"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao fazer login");
      }

      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data.data));
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#071226] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#2563EB] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white">Grupo Tereza</h1>
          <p className="text-[#94A3B8] mt-2">Gestão de Filiais</p>
        </div>

        <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Entrar</h2>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-[#CBD5E1] block mb-2">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 bg-[#0F172A] border border-[#334155] rounded-xl pl-12 pr-4 text-white placeholder:text-[#64748B] outline-none focus:border-blue-500"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-[#CBD5E1] block mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 bg-[#0F172A] border border-[#334155] rounded-xl pl-12 pr-4 text-white placeholder:text-[#64748B] outline-none focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-[#0F172A] rounded-xl">
            <p className="text-[#94A3B8] text-sm text-center mb-2">Credenciais de teste:</p>
            <p className="text-[#64748B] text-xs text-center">Matriz: admin@grupotereza.com</p>
            <p className="text-[#64748B] text-xs text-center">Filial: centro@grupotereza.com</p>
            <p className="text-[#64748B] text-xs text-center">Senha: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}