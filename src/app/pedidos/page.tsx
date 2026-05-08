"use client";

import { useState, useEffect } from "react";
import { ClipboardList, Search, Truck, Package, CheckCircle, X } from "lucide-react";
import { api, Pedido } from "@/lib/api";

const statusCores: Record<string, string> = {
  APROVADO: "bg-blue-500/20 text-blue-400",
  ENVIADO_FORNECEDOR: "bg-purple-500/20 text-purple-400",
  EM_SEPARACAO: "bg-orange-500/20 text-orange-400",
  EM_TRANSPORTE: "bg-indigo-500/20 text-indigo-400",
  ENTREGUE: "bg-green-500/20 text-green-400",
  CANCELADO: "bg-gray-500/20 text-gray-400",
};

const statusOpcoes = ["APROVADO", "ENVIADO_FORNECEDOR", "EM_SEPARACAO", "EM_TRANSPORTE", "ENTREGUE", "CANCELADO"];

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  const [modalStatus, setModalStatus] = useState(false);
  const [novoStatus, setNovoStatus] = useState("");

  useEffect(() => { carregarPedidos(); }, []);

  async function carregarPedidos() {
    try {
      const response = await api.pedidos.getAll({ limit: 100 });
      setPedidos(Array.isArray(response) ? response : response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const pedidosFiltrados = pedidos.filter(p => {
    const matchBusca = String(p.id).includes(busca) || p.filial?.nome?.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus ? p.status === filtroStatus : true;
    return matchBusca && matchStatus;
  });

  async function handleAtualizarStatus() {
    if (!pedidoSelecionado || !novoStatus) return;
    try {
      await api.pedidos.updateStatus(pedidoSelecionado.id, novoStatus);
      if (novoStatus === "ENTREGUE") {
        await api.pedidos.registrarConsumo(pedidoSelecionado.id);
      }
      setModalStatus(false);
      setPedidoSelecionado(null);
      setNovoStatus("");
      carregarPedidos();
    } catch (err) {
      console.error("Erro ao atualizar:", err);
    }
  }

  function formatarData(data: string) {
    return new Date(data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  function formatarMoeda(valor: number) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor || 0);
  }

  const stats = {
    aprovados: pedidos.filter(p => p.status === "APROVADO").length,
    emTransporte: pedidos.filter(p => p.status === "EM_TRANSPORTE").length,
    entregues: pedidos.filter(p => p.status === "ENTREGUE").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Pedidos</h1>
          <p className="text-[#94A3B8] mt-1">Acompanhe os pedidos operacionais</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm">Aprovados</p>
              <h2 className="text-2xl font-bold text-white">{stats.aprovados}</h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <ClipboardList className="text-blue-400" size={22} />
            </div>
          </div>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm">Em Transporte</p>
              <h2 className="text-2xl font-bold text-white">{stats.emTransporte}</h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Truck className="text-indigo-400" size={22} />
            </div>
          </div>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm">Entregues</p>
              <h2 className="text-2xl font-bold text-white">{stats.entregues}</h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="text-green-400" size={22} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 bg-[#0F172A] border border-[#334155] rounded-xl px-4 h-11 flex items-center gap-3">
            <Search className="text-[#64748B]" size={18} />
            <input type="text" placeholder="Buscar pedido..." className="bg-transparent outline-none text-white" value={busca} onChange={(e) => setBusca(e.target.value)} />
          </div>
          <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} className="h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white">
            <option value="">Todos os status</option>
            {statusOpcoes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#162033]">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">ID</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Filial</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Fornecedor</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Itens</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Valor</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Previsão</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Status</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="px-6 py-5 text-center text-[#64748B]">Carregando...</td></tr>
              ) : pedidosFiltrados.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-5 text-center text-[#64748B]">Nenhum pedido encontrado</td></tr>
              ) : (
                pedidosFiltrados.map((pedido) => (
                  <tr key={pedido.id} className="border-t border-[#334155] hover:bg-[#162033]">
                    <td className="px-6 py-5 text-white">#{pedido.id}</td>
                    <td className="px-6 py-5 text-[#CBD5E1]">{pedido.filial?.nome || `Filial ${pedido.filialId}`}</td>
                    <td className="px-6 py-5 text-[#CBD5E1]">{pedido.fornecedor?.nome || `Fornecedor ${pedido.fornecedorId}`}</td>
                    <td className="px-6 py-5 text-[#CBD5E1]">{pedido.itens?.length || 0} itens</td>
                    <td className="px-6 py-5 text-green-400">{formatarMoeda(pedido.valorTotal || 0)}</td>
                    <td className="px-6 py-5 text-[#CBD5E1]">{pedido.dataEntregaPrevista ? formatarData(pedido.dataEntregaPrevista) : "-"}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-sm ${statusCores[pedido.status] || "bg-gray-500/20 text-gray-400"}`}>
                        {pedido.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <button onClick={() => { setPedidoSelecionado(pedido); setNovoStatus(pedido.status); setModalStatus(true); }} className="h-8 px-3 rounded-lg bg-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/30">
                        Atualizar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalStatus && pedidoSelecionado && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-full max-w-md bg-[#1E293B] border border-[#334155] rounded-3xl p-7">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Atualizar Status</h2>
                <p className="text-[#94A3B8]">Pedido #{pedidoSelecionado.id}</p>
              </div>
              <button onClick={() => setModalStatus(false)} className="text-[#CBD5E1] hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div>
              <label className="text-sm text-[#CBD5E1] block mb-2">Novo Status</label>
              <select value={novoStatus} onChange={(e) => setNovoStatus(e.target.value)} className="w-full h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white">
                {statusOpcoes.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {novoStatus === "ENTREGUE" && (
              <div className="mt-4 p-3 bg-green-500/20 rounded-xl">
                <p className="text-green-400 text-sm">Ao marcar como entregue, o consumo será registrado automaticamente para a filial.</p>
              </div>
            )}

            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setModalStatus(false)} className="h-11 px-5 rounded-xl bg-[#0F172A] border border-[#334155] text-[#CBD5E1]">Cancelar</button>
              <button onClick={handleAtualizarStatus} className="h-11 px-6 rounded-xl bg-[#2563EB] text-white font-medium">Atualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}