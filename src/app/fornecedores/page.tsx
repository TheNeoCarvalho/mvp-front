"use client";

import { useState, useEffect } from "react";
import { Truck, Plus, Search, Pencil, Trash2, X } from "lucide-react";
import { api, Fornecedor } from "@/lib/api";

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [fornecedorEditando, setFornecedorEditando] = useState<Fornecedor | null>(null);
  const [modalExcluir, setModalExcluir] = useState<Fornecedor | null>(null);

  useEffect(() => { carregarFornecedores(); }, []);

  async function carregarFornecedores() {
    try {
      const response = await api.fornecedores.getAll({ limit: 100 });
      setFornecedores(Array.isArray(response) ? response : response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const fornecedoresFiltrados = fornecedores.filter(f =>
    f.nome.toLowerCase().includes(busca.toLowerCase()) ||
    f.cnpj?.includes(busca)
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const dados = {
      nome: form.get("nome") as string,
      cnpj: form.get("cnpj") as string,
      responsavel: form.get("responsavel") as string,
      telefone: form.get("telefone") as string,
      email: form.get("email") as string,
      endereco: form.get("endereco") as string,
      cidade: form.get("cidade") as string,
      estado: form.get("estado") as string,
      prazoMedioEntrega: Number(form.get("prazoMedioEntrega")) || undefined,
      custoMedioEntrega: Number(form.get("custoMedioEntrega")) || undefined,
      observacoes: form.get("observacoes") as string,
    };
    try {
      if (fornecedorEditando) {
        await api.fornecedores.update(fornecedorEditando.id, dados);
      } else {
        await api.fornecedores.create(dados);
      }
      setModalAberto(false);
      setFornecedorEditando(null);
      carregarFornecedores();
    } catch (err) {
      console.error("Erro ao salvar:", err);
    }
  }

  async function handleExcluir() {
    if (!modalExcluir) return;
    try {
      await api.fornecedores.delete(modalExcluir.id);
      setModalExcluir(null);
      carregarFornecedores();
    } catch (err) {
      console.error("Erro ao excluir:", err);
    }
  }

  const estados = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Fornecedores</h1>
          <p className="text-[#94A3B8] mt-1">Gerencie os fornecedores cadastrados</p>
        </div>
        <button onClick={() => { setFornecedorEditando(null); setModalAberto(true); }} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-3 rounded-xl flex items-center gap-2 font-medium">
          <Plus size={20} /> Novo Fornecedor
        </button>
      </div>

      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 bg-[#0F172A] border border-[#334155] rounded-xl px-4 h-11 flex items-center gap-3">
            <Search className="text-[#64748B]" size={18} />
            <input type="text" placeholder="Buscar fornecedor..." className="bg-transparent outline-none text-white" value={busca} onChange={(e) => setBusca(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#162033]">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Fornecedor</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">CNPJ</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Cidade/Estado</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Prazo Entrega</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Status</th>
                <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-5 text-center text-[#64748B]">Carregando...</td></tr>
              ) : fornecedoresFiltrados.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-5 text-center text-[#64748B]">Nenhum fornecedor encontrado</td></tr>
              ) : (
                fornecedoresFiltrados.map((fornecedor) => (
                  <tr key={fornecedor.id} className="border-t border-[#334155] hover:bg-[#162033]">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                          <Truck className="text-purple-400" size={20} />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{fornecedor.nome}</h3>
                          <p className="text-[#64748B] text-sm">{fornecedor.responsavel || "-"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-[#CBD5E1]">{fornecedor.cnpj || "-"}</td>
                    <td className="px-6 py-5 text-[#CBD5E1]">{fornecedor.cidade}{fornecedor.estado ? `/${fornecedor.estado}` : ""}</td>
                    <td className="px-6 py-5 text-[#CBD5E1]">{fornecedor.prazoMedioEntrega ? `${fornecedor.prazoMedioEntrega} dias` : "-"}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-sm ${fornecedor.status === "ATIVO" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                        {fornecedor.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-2">
                        <button onClick={() => { setFornecedorEditando(fornecedor); setModalAberto(true); }} className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center text-[#94A3B8] hover:text-blue-400">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => setModalExcluir(fornecedor)} className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center text-[#94A3B8] hover:text-red-400">
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
                <h2 className="text-2xl font-bold text-white">{fornecedorEditando ? "Editar" : "Novo"} Fornecedor</h2>
                <p className="text-[#94A3B8]">{fornecedorEditando ? "Atualize os dados do fornecedor" : "Cadastre um novo parceiro comercial"}</p>
              </div>
              <button onClick={() => { setModalAberto(false); setFornecedorEditando(null); }} className="text-[#CBD5E1] hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#CBD5E1] block mb-2">Nome *</label>
                  <input name="nome" defaultValue={fornecedorEditando?.nome} required className="w-full h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white" placeholder="Nome da empresa" />
                </div>
                <div>
                  <label className="text-sm text-[#CBD5E1] block mb-2">CNPJ</label>
                  <input name="cnpj" defaultValue={fornecedorEditando?.cnpj} className="w-full h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white" placeholder="00.000.000/0001-00" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#CBD5E1] block mb-2">Responsável</label>
                  <input name="responsavel" defaultValue={fornecedorEditando?.responsavel} className="w-full h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white" placeholder="Nome do contato" />
                </div>
                <div>
                  <label className="text-sm text-[#CBD5E1] block mb-2">Telefone</label>
                  <input name="telefone" defaultValue={fornecedorEditando?.telefone} className="w-full h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white" placeholder="(88) 99999-9999" />
                </div>
              </div>
              <div>
                <label className="text-sm text-[#CBD5E1] block mb-2">E-mail</label>
                <input name="email" type="email" defaultValue={fornecedorEditando?.email} className="w-full h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white" placeholder="contato@empresa.com" />
              </div>
              <div>
                <label className="text-sm text-[#CBD5E1] block mb-2">Endereço</label>
                <input name="endereco" defaultValue={fornecedorEditando?.endereco} className="w-full h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white" placeholder="Endereço completo" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#CBD5E1] block mb-2">Cidade</label>
                  <input name="cidade" defaultValue={fornecedorEditando?.cidade} className="w-full h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white" placeholder="Cidade" />
                </div>
                <div>
                  <label className="text-sm text-[#CBD5E1] block mb-2">Estado</label>
                  <select name="estado" defaultValue={fornecedorEditando?.estado} className="w-full h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white">
                    <option value="">Selecione</option>
                    {estados.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#CBD5E1] block mb-2">Prazo Médio de Entrega (dias)</label>
                  <input name="prazoMedioEntrega" type="number" defaultValue={fornecedorEditando?.prazoMedioEntrega} className="w-full h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white" placeholder="Ex: 3" />
                </div>
                <div>
                  <label className="text-sm text-[#CBD5E1] block mb-2">Custo Médio de Entrega (R$)</label>
                  <input name="custoMedioEntrega" type="number" step="0.01" defaultValue={fornecedorEditando?.custoMedioEntrega} className="w-full h-11 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white" placeholder="Ex: 50.00" />
                </div>
              </div>
              <div>
                <label className="text-sm text-[#CBD5E1] block mb-2">Observações</label>
                <textarea name="observacoes" defaultValue={fornecedorEditando?.observacoes} className="w-full h-24 bg-[#0F172A] border border-[#334155] rounded-xl px-4 text-white p-3 resize-none" placeholder="Observações opcionais" />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => { setModalAberto(false); setFornecedorEditando(null); }} className="h-11 px-5 rounded-xl bg-[#0F172A] border border-[#334155] text-[#CBD5E1]">Cancelar</button>
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
            <h2 className="text-2xl font-bold text-white mb-2">Excluir Fornecedor</h2>
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