"use client";

import { useState, useEffect } from "react";
import { BarChart3, Search, Package, Truck, Building2 } from "lucide-react";
import { api, Consumo } from "@/lib/api";

export default function ConsumoPage() {
  const [consumos, setConsumos] = useState<Consumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroFilial, setFiltroFilial] = useState("");
  const [filtroInsumo, setFiltroInsumo] = useState("");

  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    try {
      const response = await api.consumo.getAll({ limit: 100 });
      setConsumos(Array.isArray(response) ? response : response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const consumosFiltrados = consumos.filter(c => 
    filtroFilial ? String(c.filialId) === filtroFilial : true &&
    filtroInsumo ? String(c.insumoId) === filtroInsumo : true
  );

  function formatarData(data: string) {
    return new Date(data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  function formatarMoeda(valor: number) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
  }

  const gastoTotal = consumosFiltrados.reduce((acc, c) => acc + c.valor, 0);
  const totalItens = consumosFiltrados.reduce((acc, c) => acc + c.quantidade, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Consumo</h1>
          <p className="text-[#94A3B8] mt-1">Registros de consumo por filial</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm">Total de Registros</p>
              <h2 className="text-2xl font-bold text-white">{consumosFiltrados.length}</h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <BarChart3 className="text-blue-400" size={22} />
            </div>
          </div>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm">Itens Consumidos</p>
              <h2 className="text-2xl font-bold text-white">{totalItens}</h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Package className="text-orange-400" size={22} />
            </div>
          </div>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm">Gasto Total</p>
              <h2 className="text-2xl font-bold text-white">{formatarMoeda(gastoTotal)}</h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Truck className="text-green-400" size={22} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#162033]">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Data</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Filial</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Insumo</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Quantidade</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Fornecedor</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Valor</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-5 text-center text-[#64748B]">Carregando...</td></tr>
              ) : consumosFiltrados.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-5 text-center text-[#64748B]">Nenhum registro de consumo</td></tr>
              ) : (
                consumosFiltrados.map((c) => (
                  <tr key={c.id} className="border-t border-[#334155] hover:bg-[#162033]">
                    <td className="px-6 py-5 text-[#CBD5E1]">{formatarData(c.data)}</td>
                    <td className="px-6 py-5 text-white">{c.filial?.nome || `Filial ${c.filialId}`}</td>
                    <td className="px-6 py-5 text-[#CBD5E1]">{c.insumo?.nome || `Insumo ${c.insumoId}`}</td>
                    <td className="px-6 py-5 text-[#CBD5E1]">{c.quantidade}</td>
                    <td className="px-6 py-5 text-[#CBD5E1]">{c.fornecedor?.nome || `Fornecedor ${c.fornecedorId}`}</td>
                    <td className="px-6 py-5 text-green-400">{formatarMoeda(c.valor)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}