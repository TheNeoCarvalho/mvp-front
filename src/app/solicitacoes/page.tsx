"use client";

import { useState, useEffect } from "react";
import { FileText, Plus, Search, X, Package } from "lucide-react";
import { api, Solicitacao, Filial, Insumo } from "@/lib/api";

const statusCores: Record<string, string> = {
  PENDENTE: "bg-yellow-500/20 text-yellow-400",
  EM_ANALISE: "bg-blue-500/20 text-blue-400",
  APROVADA: "bg-green-500/20 text-green-400",
  REPROVADA: "bg-red-500/20 text-red-400",
  AJUSTE_SOLICITADO: "bg-orange-500/20 text-orange-400",
  AUTORIZADA: "bg-emerald-500/20 text-emerald-400",
  PENDENTE_APROVACAO: "bg-yellow-500/20 text-yellow-400",
  ENVIADA_FORNECEDOR: "bg-purple-500/20 text-purple-400",
  EM_TRANSPORTE: "bg-indigo-500/20 text-indigo-400",
  ENTREGUE: "bg-green-600/20 text-green-600",
  CANCELADA: "bg-gray-500/20 text-gray-400",
};

const urgenciaCores: Record<string, string> = {
  BAIXA: "text-green-400",
  MEDIA: "text-yellow-400",
  ALTA: "text-red-400",
};

export default function SolicitacoesPage() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [itens, setItens] = useState<{ insumoId: number; quantidade: number }[]>([]);

  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    try {
      const [solicitacoesRes, filiaisRes, insumosRes] = await Promise.all([
        api.solicitacoes.getAll({ limit: 100 }),
        api.filiais.getAtivas(),
        api.insumos.getAll({ status: "ATIVO", limit: 100 }),
      ]);
      setSolicitacoes(Array.isArray(solicitacoesRes) ? solicitacoesRes : solicitacoesRes.data || []);
      setFiliais(filiaisRes);
      setInsumos(Array.isArray(insumosRes) ? insumosRes : insumosRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const solicitacoesFiltradas = solicitacoes.filter(s =>
    String(s.id).includes(busca) ||
    s.filial?.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (itens.length === 0) {
      alert("Adicione pelo menos um item");
      return;
    }
    const dados = {
      filialId: Number(form.get("filialId")),
      urgencia: form.get("urgencia") as string,
      justificativa: form.get("justificativa") as string,
      observacao: form.get("observacao") as string || undefined,
      itens,
    };
    try {
      await api.solicitacoes.create(dados);
      setModalAberto(false);
      setItens([]);
      carregarDados();
    } catch (err) {
      console.error("Erro ao criar:", err);
    }
  }

  function adicionarItem(insumoId: number, quantidade: number) {
    if (quantidade <= 0) return;
    setItens([...itens, { insumoId, quantidade }]);
  }

  function removerItem(index: number) {
    setItens(itens.filter((_, i) => i !== index));
  }

  function formatarData(data: string) {
    return new Date(data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Solicitações</h1>
          <p className="text-[#94A3B8] mt-1">Gerencie as solicitações de insumos das filiais</p>
        </div>
        <button onClick={() => setModalAberto(true)} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-3 rounded-xl flex items-center gap-2 font-medium">
          <Plus size={20} /> Nova Solicitação
        </button>
      </div>

      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 bg-[#0F172A] border border-[#334155] rounded-xl px-4 h-11 flex items-center gap-3">
            <Search className="text-[#64748B]" size={18} />
            <input type="text" placeholder="Buscar solicitação..." className="bg-transparent outline-none text-white" value={busca} onChange={(e) => setBusca(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#162033]">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">ID</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Filial</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Urgência</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Itens</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Status</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Data</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-5 text-center text-[#64748B]">Carregando...</td></tr>
              ) : solicitacoesFiltradas.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-5 text-center text-[#64748B]">Nenhuma solicitação encontrada</td></tr>
              ) : (
                solicitacoesFiltradas.map((s) => (
                  <tr key={s.id} className="border-t border-[#334155] hover:bg-[#162033]">
                    <td className="px-6 py-5 text-white">#{s.id}</td>
                    <td className="px-6 py-5 text-[#CBD5E1]">{s.filial?.nome || `Filial ${s.filialId}`}</td>
                    <td className="px-6 py-5">
                      <span className={`font-medium ${urgenciaCores[s.urgencia]}`}>{s.urgencia}</span>
                    </td>
                    <td className="px-6 py-5 text-[#CBD5E1]">{s.itens?.length || 0} itens</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-sm ${statusCores[s.status] || "bg-gray-500/20 text-gray-400"}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-[#94A3B8] text-sm">{formatarData(s.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-full max-w-2xl bg-[#1E293B] border border-[#334155] rounded-3xl p-7 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Nova Solicitação</h2>
                <p className="text-[#94A3B8]">Crie uma nova demanda de insumos</p>
              </div>
              <button onClick={() => { setModalAberto(false); setItens([]); }} className="text-[#CBD5E1] hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#CBD5E1] block mb-2">Filial *</label>
                  <select name="filialId" required className="w-full h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white">
                    <option value="">Selecione a filial</option>
                    {filiais.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-[#CBD5E1] block mb-2">Urgência *</label>
                  <select name="urgencia" required className="w-full h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white">
                    <option value="BAIXA">Baixa</option>
                    <option value="MEDIA">Média</option>
                    <option value="ALTA">Alta</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-[#CBD5E1] block mb-2">Justificativa *</label>
                <textarea name="justificativa" required className="w-full h-24 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white p-3 resize-none" placeholder="Explique a necessidade dos insumos..." />
              </div>
              <div>
                <label className="text-sm text-[#CBD5E1] block mb-2">Observação</label>
                <textarea name="observacao" className="w-full h-20 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white p-3 resize-none" placeholder="Informações adicionais (opcional)" />
              </div>
              
              <div className="border-t border-[#334155] pt-4">
                <h3 className="text-white font-medium mb-3">Itens da Solicitação</h3>
                <div className="flex gap-2 mb-3">
                  <select id="insumoSelect" className="flex-1 h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white">
                    <option value="">Selecione o insumo</option>
                    {insumos.map(i => <option key={i.id} value={i.id}>{i.nome} ({i.unidadeMedida})</option>)}
                  </select>
                  <input id="qtdInput" type="number" min="1" placeholder="Qtd" className="w-20 h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white text-center" />
                  <button type="button" onClick={() => {
                    const select = document.getElementById("insumoSelect") as HTMLSelectElement;
                    const input = document.getElementById("qtdInput") as HTMLInputElement;
                    if (select.value && input.value) {
                      adicionarItem(Number(select.value), Number(input.value));
                      select.value = "";
                      input.value = "";
                    }
                  }} className="h-11 px-4 bg-[#2563EB] rounded-xl text-white">+</button>
                </div>
                {itens.length > 0 && (
                  <div className="space-y-2">
                    {itens.map((item, index) => {
                      const insumo = insumos.find(i => i.id === item.insumoId);
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-[#0F172A] rounded-xl">
                          <div className="flex items-center gap-2">
                            <Package className="text-blue-400" size={16} />
                            <span className="text-white">{insumo?.nome}</span>
                            <span className="text-[#64748B]">- {item.quantidade} {insumo?.unidadeMedida}</span>
                          </div>
                          <button type="button" onClick={() => removerItem(index)} className="text-red-400 hover:text-red-300">
                            <X size={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => { setModalAberto(false); setItens([]); }} className="h-11 px-5 rounded-xl bg-[#0F172A] border border-[#334155] text-[#CBD5E1]">Cancelar</button>
                <button type="submit" className="h-11 px-6 rounded-xl bg-[#2563EB] text-white font-medium">Enviar Solicitação</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}