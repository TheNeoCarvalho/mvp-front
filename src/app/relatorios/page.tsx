"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { api } from "@/lib/api";

export default function RelatoriosPage() {
  const [rankingFiliais, setRankingFiliais] = useState<any[]>([]);
  const [rankingFornecedores, setRankingFornecedores] = useState<any[]>([]);
  const [rankingInsumos, setRankingInsumos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    try {
      const [filiais, fornecedores, insumos] = await Promise.all([
        api.consumo.rankingFiliais(10),
        api.consumo.rankingFornecedores(10),
        api.consumo.rankingInsumos(10),
      ]);
      setRankingFiliais(filiais);
      setRankingFornecedores(fornecedores);
      setRankingInsumos(insumos);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function formatarMoeda(valor: number) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-[#64748B]">Carregando relatórios...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Relatórios</h1>
        <p className="text-[#94A3B8] mt-1">Análise de consumo e gastos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <TrendingUp className="text-blue-400" size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">Filiais com Maior Gasto</h3>
          </div>
          {rankingFiliais.length === 0 ? (
            <p className="text-[#64748B]">Nenhum dado disponível</p>
          ) : (
            <div className="space-y-3">
              {rankingFiliais.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#0F172A] rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${index < 3 ? "bg-yellow-500/20 text-yellow-400" : "bg-[#1E293B] text-[#64748B]"}`}>
                      {index + 1}
                    </span>
                    <span className="text-white">{item.filial?.nome || "Filial"}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-green-400 font-medium">{formatarMoeda(item.gastoTotal)}</span>
                    <p className="text-[#64748B] text-sm">{item.pedidos} pedidos</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <TrendingDown className="text-purple-400" size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">Fornecedores Mais Utilizados</h3>
          </div>
          {rankingFornecedores.length === 0 ? (
            <p className="text-[#64748B]">Nenhum dado disponível</p>
          ) : (
            <div className="space-y-3">
              {rankingFornecedores.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#0F172A] rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${index < 3 ? "bg-yellow-500/20 text-yellow-400" : "bg-[#1E293B] text-[#64748B]"}`}>
                      {index + 1}
                    </span>
                    <span className="text-white">{item.fornecedor?.nome || "Fornecedor"}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-green-400 font-medium">{formatarMoeda(item.gastoTotal)}</span>
                    <p className="text-[#64748B] text-sm">{item.pedidos} pedidos</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <BarChart3 className="text-orange-400" size={20} />
          </div>
          <h3 className="text-xl font-bold text-white">Insumos Mais Consumidos</h3>
        </div>
        {rankingInsumos.length === 0 ? (
          <p className="text-[#64748B]">Nenhum dado disponível</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#162033]">
                <tr>
                  <th className="px-4 py-3 text-left text-sm text-[#94A3B8]">#</th>
                  <th className="px-4 py-3 text-left text-sm text-[#94A3B8]">Insumo</th>
                  <th className="px-4 py-3 text-left text-sm text-[#94A3B8]">Categoria</th>
                  <th className="px-4 py-3 text-left text-sm text-[#94A3B8]">Quantidade</th>
                  <th className="px-4 py-3 text-left text-sm text-[#94A3B8]">Gasto Total</th>
                  <th className="px-4 py-3 text-left text-sm text-[#94A3B8]">Pedidos</th>
                </tr>
              </thead>
              <tbody>
                {rankingInsumos.map((item, index) => (
                  <tr key={index} className="border-t border-[#334155]">
                    <td className="px-4 py-3">
                      <span className={`w-6 h-6 rounded-lg inline-flex items-center justify-center text-xs font-bold ${index < 3 ? "bg-yellow-500/20 text-yellow-400" : "bg-[#1E293B] text-[#64748B]"}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white">{item.insumo?.nome || "Insumo"}</td>
                    <td className="px-4 py-3 text-[#CBD5E1]">{item.insumo?.categoria || "-"}</td>
                    <td className="px-4 py-3 text-[#CBD5E1]">{item.consumoTotal}</td>
                    <td className="px-4 py-3 text-green-400">{formatarMoeda(item.gastoTotal)}</td>
                    <td className="px-4 py-3 text-[#CBD5E1]">{item.pedidos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}