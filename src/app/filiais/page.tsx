"use client";

import { useState, useEffect } from "react";
import { Building2, Plus, Search, Pencil, Trash2, X } from "lucide-react";
import { api, Filial } from "@/lib/api";

export default function FiliaisPage() {
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [filialEditando, setFilialEditando] = useState<Filial | null>(null);
  const [modalExcluir, setModalExcluir] = useState<Filial | null>(null);

  useEffect(() => { carregarFiliais(); }, []);

  async function carregarFiliais() {
    try {
      const response = await api.filiais.getAll({ limit: 100 });
      setFiliais(Array.isArray(response) ? response : response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filiaisFiltradas = filiais.filter(f =>
    f.nome.toLowerCase().includes(busca.toLowerCase()) ||
    f.cidade?.toLowerCase().includes(busca.toLowerCase())
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const dados = {
      nome: form.get("nome") as string,
      responsavel: form.get("responsavel") as string,
      telefone: form.get("telefone") as string,
      email: form.get("email") as string,
      endereco: form.get("endereco") as string,
      cidade: form.get("cidade") as string,
      estado: form.get("estado") as string,
      observacoes: form.get("observacoes") as string,
    };
    try {
      if (filialEditando) {
        await api.filiais.update(filialEditando.id, dados);
      } else {
        await api.filiais.create(dados);
      }
      setModalAberto(false);
      setFilialEditando(null);
      carregarFiliais();
    } catch (err) {
      console.error("Erro ao salvar:", err);
    }
  }

  async function handleExcluir() {
    if (!modalExcluir) return;
    try {
      await api.filiais.delete(modalExcluir.id);
      setModalExcluir(null);
      carregarFiliais();
    } catch (err) {
      console.error("Erro ao excluir:", err);
    }
  }

  const estados = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Filiais</h1>
          <p className="text-[#94A3B8] mt-1">Gerencie as filiais da operação</p>
        </div>
        <button onClick={() => { setFilialEditando(null); setModalAberto(true); }} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-3 rounded-xl flex items-center gap-2 font-medium">
          <Plus size={20} /> Nova Filial
        </button>
      </div>

      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 bg-[#0F172A] border border-[#334155] rounded-xl px-4 h-11 flex items-center gap-3">
            <Search className="text-[#64748B]" size={18} />
            <input type="text" placeholder="Buscar filial..." className="bg-transparent outline-none text-white" value={busca} onChange={(e) => setBusca(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#162033]">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Filial</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Responsável</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Cidade/Estado</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Contato</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Status</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-5 text-center text-[#64748B]">Carregando...</td></tr>
              ) : filiaisFiltradas.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-5 text-center text-[#64748B]">Nenhuma filial encontrada</td></tr>
              ) : (
                filiaisFiltradas.map((filial) => (
                  <tr key={filial.id} className="border-t border-[#334155] hover:bg-[#162033]">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                          <Building2 className="text-blue-400" size={20} />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{filial.nome}</h3>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-[#CBD5E1]">{filial.responsavel || "-"}</td>
                    <td className="px-6 py-5 text-[#CBD5E1]">{filial.cidade}{filial.estado ? `/${filial.estado}` : ""}</td>
                    <td className="px-6 py-5 text-[#CBD5E1]">{filial.telefone || "-"}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-sm ${filial.status === "ATIVA" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                        {filial.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-2">
                        <button onClick={() => { setFilialEditando(filial); setModalAberto(true); }} className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center text-[#94A3B8] hover:text-blue-400">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => setModalExcluir(filial)} className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center text-[#94A3B8] hover:text-red-400">
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
          <div className="w-full max-w-2xl bg-[#1E293B] border border-[#334155] rounded-3xl p-7 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{filialEditando ? "Editar" : "Nova"} Filial</h2>
                <p className="text-[#94A3B8]">{filialEditando ? "Atualize os dados da filial" : "Cadastre uma nova unidade operacional"}</p>
              </div>
              <button onClick={() => { setModalAberto(false); setFilialEditando(null); }} className="text-[#CBD5E1] hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#CBD5E1] block mb-2">Nome da Filial *</label>
                  <input name="nome" defaultValue={filialEditando?.nome} required className="w-full h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white" placeholder="Ex: Unidade Centro" />
                </div>
                <div>
                  <label className="text-sm text-[#CBD5E1] block mb-2">Responsável</label>
                  <input name="responsavel" defaultValue={filialEditando?.responsavel} className="w-full h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white" placeholder="Nome do responsável" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#CBD5E1] block mb-2">Telefone</label>
                  <input name="telefone" defaultValue={filialEditando?.telefone} className="w-full h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white" placeholder="(88) 99999-9999" />
                </div>
                <div>
                  <label className="text-sm text-[#CBD5E1] block mb-2">E-mail</label>
                  <input name="email" type="email" defaultValue={filialEditando?.email} className="w-full h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white" placeholder="filial@email.com" />
                </div>
              </div>
              <div>
                <label className="text-sm text-[#CBD5E1] block mb-2">Endereço *</label>
                <input name="endereco" defaultValue={filialEditando?.endereco} required className="w-full h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white" placeholder="Rua, número, bairro..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#CBD5E1] block mb-2">Cidade *</label>
                  <input name="cidade" defaultValue={filialEditando?.cidade} required className="w-full h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white" placeholder="Cidade" />
                </div>
                <div>
                  <label className="text-sm text-[#CBD5E1] block mb-2">Estado *</label>
                  <select name="estado" defaultValue={filialEditando?.estado} required className="w-full h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white">
                    <option value="">Selecione</option>
                    {estados.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-[#CBD5E1] block mb-2">Observações</label>
                <textarea name="observacoes" defaultValue={filialEditando?.observacoes} className="w-full h-24 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white p-3 resize-none" placeholder="Observações opcionais" />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => { setModalAberto(false); setFilialEditando(null); }} className="h-11 px-5 rounded-xl bg-[#0F172A] border border-[#334155] text-[#CBD5E1]">Cancelar</button>
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
            <h2 className="text-2xl font-bold text-white mb-2">Excluir Filial</h2>
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