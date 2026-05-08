"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Search, X, Package, Truck } from "lucide-react";
import { api, Solicitacao, Fornecedor } from "@/lib/api";

const statusCores: Record<string, string> = {
  PENDENTE: "bg-yellow-500/20 text-yellow-400",
  EM_ANALISE: "bg-blue-500/20 text-blue-400",
  APROVADA: "bg-green-500/20 text-green-400",
  REPROVADA: "bg-red-500/20 text-red-400",
  AJUSTE_SOLICITADO: "bg-orange-500/20 text-orange-400",
  AUTORIZADA: "bg-emerald-500/20 text-emerald-400",
  PENDENTE_APROVACAO: "bg-yellow-500/20 text-yellow-400",
};

export default function AprovacoesPage() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("");
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<Solicitacao | null>(null);
  const [modalAprovar, setModalAprovar] = useState(false);
  const [modalReprovar, setModalReprovar] = useState(false);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<string>("");
  const [valorAprovado, setValorAprovado] = useState("");
  const [observacaoAprovacao, setObservacaoAprovacao] = useState("");
  const [observacaoReprovacao, setObservacaoReprovacao] = useState("");

  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    try {
      const [solicitacoesRes, fornecedoresRes] = await Promise.all([
        api.solicitacoes.getAll({ limit: 100 }),
        api.fornecedores.getAtivos(),
      ]);
      setSolicitacoes(Array.isArray(solicitacoesRes) ? solicitacoesRes : solicitacoesRes.data || []);
      setFornecedores(fornecedoresRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const solicitacoesPendentes = solicitacoes.filter(s => 
    filtroStatus ? s.status === filtroStatus : s.status === "PENDENTE" || s.status === "PENDENTE_APROVACAO" || s.status === "EM_ANALISE"
  );

  async function handleAprovar() {
    if (!solicitacaoSelecionada || !fornecedorSelecionado || !valorAprovado) return;
    try {
      await api.solicitacoes.aprobar(solicitacaoSelecionada.id, {
        fornecedorId: Number(fornecedorSelecionado),
        valorAprovado: Number(valorAprovado),
        observacao: observacaoAprovacao || undefined,
      });
      setModalAprovar(false);
      setSolicitacaoSelecionada(null);
      setFornecedorSelecionado("");
      setValorAprovado("");
      setObservacaoAprovacao("");
      carregarDados();
    } catch (err) {
      console.error("Erro ao aprovar:", err);
    }
  }

  async function handleReprovar() {
    if (!solicitacaoSelecionada || !observacaoReprovacao) return;
    try {
      await api.solicitacoes.reprovar(solicitacaoSelecionada.id, observacaoReprovacao);
      setModalReprovar(false);
      setSolicitacaoSelecionada(null);
      setObservacaoReprovacao("");
      carregarDados();
    } catch (err) {
      console.error("Erro ao reprovar:", err);
    }
  }

  function formatarData(data: string) {
    return new Date(data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Aprovações</h1>
          <p className="text-[#94A3B8] mt-1">Analise e aprove as solicitações das filiais</p>
        </div>
        <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} className="h-11 bg-[#1E293B] border border-[#334155] rounded-xl px-4 text-white">
          <option value="">Pendentes e em Análise</option>
          <option value="PENDENTE">Pendente</option>
          <option value="PENDENTE_APROVACAO">Pendente Aprovação</option>
          <option value="EM_ANALISE">Em Análise</option>
          <option value="APROVADA">Aprovada</option>
          <option value="AUTORIZADA">Autorizada</option>
          <option value="REPROVADA">Reprovada</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm">Pendentes</p>
              <h2 className="text-2xl font-bold text-white">{solicitacoes.filter(s => s.status === "PENDENTE" || s.status === "PENDENTE_APROVACAO").length}</h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Search className="text-yellow-400" size={22} />
            </div>
          </div>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm">Aprovadas</p>
              <h2 className="text-2xl font-bold text-white">{solicitacoes.filter(s => s.status === "APROVADA" || s.status === "AUTORIZADA").length}</h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="text-green-400" size={22} />
            </div>
          </div>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm">Reprovadas</p>
              <h2 className="text-2xl font-bold text-white">{solicitacoes.filter(s => s.status === "REPROVADA").length}</h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <XCircle className="text-red-400" size={22} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#162033]">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">ID</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Filial</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Itens</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Urgência</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Justificativa</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Status</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Data</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="px-6 py-5 text-center text-[#64748B]">Carregando...</td></tr>
              ) : solicitacoesPendentes.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-5 text-center text-[#64748B]">Nenhuma solicitação para aprovar</td></tr>
              ) : (
                solicitacoesPendentes.map((s) => (
                  <tr key={s.id} className="border-t border-[#334155] hover:bg-[#162033]">
                    <td className="px-6 py-5 text-white">#{s.id}</td>
                    <td className="px-6 py-5 text-[#CBD5E1]">{s.filial?.nome || `Filial ${s.filialId}`}</td>
                    <td className="px-6 py-5 text-[#CBD5E1]">{s.itens?.length || 0} itens</td>
                    <td className="px-6 py-5">
                      <span className={`text-sm ${s.urgencia === "ALTA" ? "text-red-400" : s.urgencia === "MEDIA" ? "text-yellow-400" : "text-green-400"}`}>
                        {s.urgencia}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-[#CBD5E1] max-w-xs truncate">{s.justificativa}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-sm ${statusCores[s.status] || "bg-gray-500/20 text-gray-400"}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-[#94A3B8] text-sm">{formatarData(s.createdAt)}</td>
                    <td className="px-6 py-5">
                      {(s.status === "PENDENTE" || s.status === "PENDENTE_APROVACAO") && (
                        <div className="flex gap-2">
                          <button onClick={() => { setSolicitacaoSelecionada(s); setModalAprovar(true); }} className="h-8 px-3 rounded-lg bg-green-500/20 text-green-400 text-sm hover:bg-green-500/30">
                            Aprovar
                          </button>
                          <button onClick={() => { setSolicitacaoSelecionada(s); setModalReprovar(true); }} className="h-8 px-3 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30">
                            Reprovar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalAprovar && solicitacaoSelecionada && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-full max-w-2xl bg-[#1E293B] border border-[#334155] rounded-3xl p-7 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Aprovar Solicitação</h2>
                <p className="text-[#94A3B8]">#{solicitacaoSelecionada.id} - {solicitacaoSelecionada.filial?.nome}</p>
              </div>
              <button onClick={() => setModalAprovar(false)} className="text-[#CBD5E1] hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-[#0F172A] rounded-xl">
                <h3 className="text-white font-medium mb-2">Itens Solicitados</h3>
                {solicitacaoSelecionada.itens?.map((item, i) => (
                  <div key={i} className="flex justify-between text-[#CBD5E1] py-1">
                    <span>{item.insumo?.nome}</span>
                    <span>{item.quantidade} {item.insumo?.unidadeMedida}</span>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-sm text-[#CBD5E1] block mb-2">Fornecedor *</label>
                <select value={fornecedorSelecionado} onChange={(e) => setFornecedorSelecionado(e.target.value)} className="w-full h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white">
                  <option value="">Selecione o fornecedor</option>
                  {fornecedores.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm text-[#CBD5E1] block mb-2">Valor Aprovado (R$) *</label>
                <input type="number" step="0.01" value={valorAprovado} onChange={(e) => setValorAprovado(e.target.value)} className="w-full h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white" placeholder="0,00" />
              </div>

              <div>
                <label className="text-sm text-[#CBD5E1] block mb-2">Observação da Matriz</label>
                <textarea value={observacaoAprovacao} onChange={(e) => setObservacaoAprovacao(e.target.value)} className="w-full h-24 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white p-3 resize-none" placeholder="Observações opcionais" />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button onClick={() => setModalAprovar(false)} className="h-11 px-5 rounded-xl bg-[#0F172A] border border-[#334155] text-[#CBD5E1]">Cancelar</button>
              <button onClick={handleAprovar} disabled={!fornecedorSelecionado || !valorAprovado} className="h-11 px-6 rounded-xl bg-green-500 text-white font-medium disabled:opacity-50">Aprovar</button>
            </div>
          </div>
        </div>
      )}

      {modalReprovar && solicitacaoSelecionada && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-full max-w-md bg-[#1E293B] border border-[#334155] rounded-3xl p-7">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Reprovar Solicitação</h2>
                <p className="text-[#94A3B8]">#{solicitacaoSelecionada.id}</p>
              </div>
              <button onClick={() => setModalReprovar(false)} className="text-[#CBD5E1] hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div>
              <label className="text-sm text-[#CBD5E1] block mb-2">Motivo da Reprovação *</label>
              <textarea value={observacaoReprovacao} onChange={(e) => setObservacaoReprovacao(e.target.value)} required className="w-full h-32 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white p-3 resize-none" placeholder="Explique o motivo da reprovação..." />
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setModalReprovar(false)} className="h-11 px-5 rounded-xl bg-[#0F172A] border border-[#334155] text-[#CBD5E1]">Cancelar</button>
              <button onClick={handleReprovar} disabled={!observacaoReprovacao} className="h-11 px-6 rounded-xl bg-red-500 text-white font-medium disabled:opacity-50">Reprovar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}