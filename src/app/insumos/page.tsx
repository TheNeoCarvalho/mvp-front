"use client";

import { useState, useEffect } from "react";
import { Package, Plus, Search, Pencil, Trash2, X } from "lucide-react";
import { api, Insumo } from "@/lib/api";

const unidadesMedida = ["unidade", "caixa", "pacote", "kg", "litro", "metro", "lata", "saco", "banner", "rollo"];

export default function InsumosPage() {
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [insumoEditando, setInsumoEditando] = useState<Insumo | null>(null);
  const [modalExcluir, setModalExcluir] = useState<Insumo | null>(null);

  useEffect(() => { carregarInsumos(); }, []);

  async function carregarInsumos() {
    try {
      const response = await api.insumos.getAll({ limit: 100 });
      setInsumos(Array.isArray(response) ? response : response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const insumosFiltrados = insumos.filter(i =>
    i.nome.toLowerCase().includes(busca.toLowerCase()) ||
    i.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const dados = {
      nome: form.get("nome") as string,
      categoria: form.get("categoria") as string,
      unidadeMedida: form.get("unidadeMedida") as string,
      estoqueMinimo: Number(form.get("estoqueMinimo")) || undefined,
      descricao: form.get("descricao") as string,
    };
    try {
      if (insumoEditando) {
        await api.insumos.update(insumoEditando.id, dados);
      } else {
        await api.insumos.create(dados);
      }
      setModalAberto(false);
      setInsumoEditando(null);
      carregarInsumos();
    } catch (err) {
      console.error("Erro ao salvar:", err);
    }
  }

  async function handleExcluir() {
    if (!modalExcluir) return;
    try {
      await api.insumos.delete(modalExcluir.id);
      setModalExcluir(null);
      carregarInsumos();
    } catch (err) {
      console.error("Erro ao excluir:", err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Insumos</h1>
          <p className="text-[#94A3B8] mt-1">Gerencie os insumos do sistema</p>
        </div>
        <button onClick={() => { setInsumoEditando(null); setModalAberto(true); }} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-3 rounded-xl flex items-center gap-2 font-medium">
          <Plus size={20} /> Novo Insumo
        </button>
      </div>

      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 bg-[#0F172A] border border-[#334155] rounded-xl px-4 h-11 flex items-center gap-3">
            <Search className="text-[#64748B]" size={18} />
            <input type="text" placeholder="Buscar insumo..." className="bg-transparent outline-none text-white" value={busca} onChange={(e) => setBusca(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#162033]">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Nome</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Categoria</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Unidade</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Estoque Mín.</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Status</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-5 text-center text-[#64748B]">Carregando...</td></tr>
              ) : insumosFiltrados.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-5 text-center text-[#64748B]">Nenhum insumo encontrado</td></tr>
              ) : (
                insumosFiltrados.map((insumo) => (
                  <tr key={insumo.id} className="border-t border-[#334155] hover:bg-[#162033]">
                    <td className="px-6 py-5 text-white">{insumo.nome}</td>
                    <td className="px-6 py-5 text-[#CBD5E1]">{insumo.categoria}</td>
                    <td className="px-6 py-5 text-[#CBD5E1]">{insumo.unidadeMedida}</td>
                    <td className="px-6 py-5 text-[#CBD5E1]">{insumo.estoqueMinimo || "-"}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-sm ${insumo.status === "ATIVO" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                        {insumo.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-2">
                        <button onClick={() => { setInsumoEditando(insumo); setModalAberto(true); }} className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center text-[#94A3B8] hover:text-blue-400">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => setModalExcluir(insumo)} className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center text-[#94A3B8] hover:text-red-400">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-full max-w-lg bg-[#1E293B] border border-[#334155] rounded-3xl p-7">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{insumoEditando ? "Editar" : "Novo"} Insumo</h2>
              </div>
              <button onClick={() => { setModalAberto(false); setInsumoEditando(null); }} className="text-[#CBD5E1] hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-[#CBD5E1] block mb-2">Nome</label>
                <input name="nome" defaultValue={insumoEditando?.nome} required className="w-full h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white" placeholder="Nome do insumo" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#CBD5E1] block mb-2">Categoria</label>
                  <input name="categoria" defaultValue={insumoEditando?.categoria} required className="w-full h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white" placeholder="Ex: Alimentício" />
                </div>
                <div>
                  <label className="text-sm text-[#CBD5E1] block mb-2">Unidade</label>
                  <select name="unidadeMedida" defaultValue={insumoEditando?.unidadeMedida} required className="w-full h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white">
                    {unidadesMedida.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-[#CBD5E1] block mb-2">Estoque Mínimo</label>
                <input name="estoqueMinimo" type="number" defaultValue={insumoEditando?.estoqueMinimo} className="w-full h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white" placeholder="Quantidade mínima" />
              </div>
              <div>
                <label className="text-sm text-[#CBD5E1] block mb-2">Descrição</label>
                <textarea name="descricao" defaultValue={insumoEditando?.descricao} className="w-full h-24 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white p-3 resize-none" placeholder="Descrição opcional" />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => { setModalAberto(false); setInsumoEditando(null); }} className="h-11 px-5 rounded-xl bg-[#0F172A] border border-[#334155] text-[#CBD5E1]">Cancelar</button>
                <button type="submit" className="h-11 px-6 rounded-xl bg-[#2563EB] text-white font-medium">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalExcluir && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-full max-w-md bg-[#1E293B] border border-[#334155] rounded-3xl p-7 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="text-red-400" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Excluir Insumo</h2>
            <p className="text-[#94A3B8] mb-6">Tem certeza que deseja excluir "{modalExcluir.nome}"?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setModalExcluir(null)} className="h-12 px-6 rounded-xl bg-[#0F172A] border border-[#334155] text-[#CBD5E1]">Cancelar</button>
              <button onClick={handleExcluir} className="h-12 px-6 rounded-xl bg-red-500 text-white font-medium">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}